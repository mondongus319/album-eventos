// ==========================================
// PANEL DEL ANFITRIÓN: /anfitrion/?s=<slug>&t=<token>
// Todo pasa por RPC que validan el token en la base de datos.
// ==========================================

const $ = (id) => document.getElementById(id);
const slug = parametros.get("s");
const token = parametros.get("t");
const visor = crearVisor();
const POR_PAGINA = 60;
const POR_ZIP = 200;

let ev = null;
const fotos = [];
const vistos = new Set();
let offset = 0, finGaleria = false, cargando = false;


async function iniciar() {
    $("zonaSinRed").hidden = true;
    const { data, error } = slug && token
        ? await sb.rpc("anfitrion_evento", { p_slug: slug, p_token: token })
        : { data: null };
    if (error) {
        // Falla de red: no decirle al cliente que su enlace es inválido.
        $("titulo").textContent = "Sin conexión";
        $("zonaSinRed").hidden = false;
        return;
    }
    if (!data) {
        $("titulo").textContent = "Álbum no disponible";
        $("zonaError").hidden = false;
        return;
    }
    ev = data;
    aplicarPlantilla(ev);
    document.title = `Panel · ${ev.nombre}`;
    $("titulo").textContent = ev.nombre;
    $("fecha").textContent = fechaLarga(ev.fecha_evento);
    $("fechaLimite").textContent = fechaHora(ev.expira_en);
    $("estadoSubidas").textContent = ev.estado === "activo" && Date.now() < Date.parse(ev.subidas_hasta)
        ? `Los invitados pueden subir fotos hasta el ${fechaHora(ev.subidas_hasta)}`.replace(/\.?$/, ".") // "a. m." ya trae punto
        : "Las subidas de los invitados ya están cerradas.";

    const enlaces = enlacesEvento(slug);
    $("verAlbum").href = enlaces.invitado;
    if (ev.pantalla_vivo) {
        $("verPantalla").href = enlaces.pantalla;
        $("verPantalla").hidden = false;
    }

    pintarConteos();
    $("panel").hidden = false;
    cuentaRegresiva();
    reloj = setInterval(cuentaRegresiva, 1000);
    alLlegarAlFinal($("centinela"), cargarMas);
}

$("reintentarCarga").addEventListener("click", iniciar);

let reloj = null;

function pintarConteos() {
    $("total").textContent = ev.total;
    $("tTotal").textContent = ev.total === 1 ? "archivo" : "archivos";
    $("ocultas").textContent = ev.ocultas;
    $("tOcultas").textContent = ev.ocultas === 1 ? "oculto" : "ocultos";
    $("peso").textContent = (ev.bytes / 1048576).toFixed(1);
}

function cuentaRegresiva() {
    const s = Math.max(0, Math.floor((Date.parse(ev.expira_en) - Date.now()) / 1000));
    if (s === 0) {
        clearInterval(reloj);
        $("cuenta").hidden = true;
        $("plazoVencido").hidden = false;
        return;
    }
    $("cDias").textContent = Math.floor(s / 86400);
    $("cHoras").textContent = Math.floor((s % 86400) / 3600);
    $("cMin").textContent = Math.floor((s % 3600) / 60);
    $("cSeg").textContent = s % 60;
}


// Mensajes cortos que se leen en pantalla y en lectores de pantalla.
let avisoTimer = null;
function avisar(texto) {
    clearTimeout(avisoTimer);
    $("avisoGaleria").textContent = texto;
    $("avisoGaleria").hidden = false;
    avisoTimer = setTimeout(() => ($("avisoGaleria").hidden = true), 5000);
}

// ==========================================
// GALERÍA CON OCULTAR / MOSTRAR
// ==========================================

function celda(f) {
    const caja = document.createElement("div");
    caja.className = "celda-anfitrion" + (f.oculta ? " oculta" : "");
    const boton = document.createElement("button");
    boton.className = "alternar";
    const rotular = () => {
        boton.innerHTML = icono(f.oculta ? "eye" : "eye-off") + (f.oculta ? " Mostrar" : " Ocultar");
        boton.setAttribute("aria-label", `${f.oculta ? "Mostrar" : "Ocultar"} foto de ${f.nombre_invitado || "un invitado"}`);
    };
    rotular();

    boton.addEventListener("click", async () => {
        boton.disabled = true;
        const nueva = !f.oculta;
        const { data, error } = await sb.rpc("anfitrion_ocultar", { p_slug: slug, p_token: token, p_foto: f.id, p_oculta: nueva });
        boton.disabled = false;
        if (error || !data) {
            avisar(error ? "No se pudo cambiar: revisa tu conexión e intenta de nuevo." : "Esa foto ya no está disponible.");
            return;
        }
        f.oculta = nueva;
        ev.ocultas += nueva ? 1 : -1;
        caja.classList.toggle("oculta", nueva);
        rotular();
        avisar(nueva ? "Foto oculta: los invitados ya no la ven." : "Foto visible otra vez.");
        pintarConteos();
    });

    caja.append(crearMiniatura(f, () => visor.abrir(fotos, fotos.indexOf(f))), boton);
    return caja;
}

async function cargarMas() {
    if (cargando || finGaleria) return false;
    cargando = true;
    const { data, error } = await sb.rpc("anfitrion_fotos", { p_slug: slug, p_token: token, p_offset: offset, p_limite: POR_PAGINA });
    cargando = false;
    if (error) { avisar("No se pudieron cargar más fotos. Baja de nuevo para reintentar."); return false; }

    offset += data.length;
    finGaleria = data.length < POR_PAGINA;
    for (const f of data) {
        if (vistos.has(f.id)) continue;
        vistos.add(f.id);
        fotos.push(f);
        $("galeria").append(celda(f));
    }
    if (!fotos.length) $("galeria").innerHTML = '<p class="galeria-vacia">Todavía no hay fotos.</p>';
    return !finGaleria;
}


// ==========================================
// ZIP: armado en el navegador, por partes de 200
// para no reventar la memoria del celular
// ==========================================

let todas = [];

$("prepararZip").addEventListener("click", async () => {
    const boton = $("prepararZip");
    boton.disabled = true;
    $("estadoZip").textContent = "Buscando archivos…";

    const lista = [];
    for (let o = 0; ; o += 500) {
        const { data, error } = await sb.rpc("anfitrion_fotos", { p_slug: slug, p_token: token, p_offset: o, p_limite: 500 });
        if (error) {
            boton.disabled = false;
            return ($("estadoZip").textContent = "No se pudo obtener la lista. Revisa tu conexión e intenta de nuevo.");
        }
        lista.push(...data);
        if (data.length < 500) break;
    }
    todas = [...new Map(lista.reverse().map((f) => [f.id, f])).values()]; // orden cronológico, sin repetidos

    const partes = Math.ceil(todas.length / POR_ZIP);
    $("partes").replaceChildren(...Array.from({ length: partes }, (_, i) => {
        const desde = i * POR_ZIP + 1, hasta = Math.min((i + 1) * POR_ZIP, todas.length);
        const descargar = document.createElement("button");
        descargar.className = "boton boton-chico";
        descargar.textContent = "Descargar";
        descargar.onclick = () => descargarParte(i, descargar);
        const li = document.createElement("li");
        li.append(`Parte ${i + 1} · archivos ${desde} a ${hasta}`, descargar);
        return li;
    }));
    $("estadoZip").textContent = todas.length
        ? `${todas.length} archivos en ${partes} parte${partes === 1 ? "" : "s"}.`
        : "Todavía no hay fotos para descargar.";
    boton.innerHTML = icono("rotate-ccw") + " Actualizar lista";
    boton.disabled = false;
});

function nombreArchivo(f, n) {
    const ext = (f.url.split("/").pop().split("?")[0].split(".")[1] || (f.tipo === "video" ? "mp4" : "jpg")).toLowerCase();
    const quien = (f.nombre_invitado || "invitado").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^\w-]+/g, "_").slice(0, 30);
    return `${String(n).padStart(4, "0")}-${quien}.${ext}`;
}

async function bajar(url) {
    for (let intento = 1; ; intento++) {
        try {
            const r = await fetch(url);
            if (r.ok) return await r.blob();
            throw new Error(r.status);
        } catch (e) {
            if (intento >= 3) throw e;
            await new Promise((ok) => setTimeout(ok, 1500 * intento));
        }
    }
}

async function descargarParte(i, boton) {
    boton.disabled = true;
    const inicio = i * POR_ZIP;
    const pendientes = todas.slice(inicio, inicio + POR_ZIP).map((f, j) => ({ f, nombre: nombreArchivo(f, inicio + j + 1) }));
    const total = pendientes.length;
    const zip = new JSZip();
    const fallidos = [];
    let hechos = 0;

    try {
        // La original de Cloudinary (f.url, sin transformaciones), 4 a la vez.
        const trabajador = async () => {
            for (let t; (t = pendientes.shift()); ) {
                try { zip.file(t.nombre, await bajar(t.f.url)); }
                catch { fallidos.push(t.nombre); }
                boton.textContent = `${++hechos} de ${total}…`;
            }
        };
        await Promise.all([trabajador(), trabajador(), trabajador(), trabajador()]);

        if (fallidos.length === total) {
            boton.textContent = "Reintentar";
            $("estadoZip").textContent = "No se pudo bajar ninguna foto de esta parte. Revisa tu conexión e intenta de nuevo.";
            return;
        }

        boton.textContent = "Armando ZIP…";
        // Sin recomprimir (STORE): las fotos ya vienen comprimidas y así gasta menos memoria y batería.
        const blob = await zip.generateAsync({ type: "blob", streamFiles: true });
        const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: `${slug}-parte-${i + 1}.zip` });
        document.body.append(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(a.href), 60000);

        boton.textContent = fallidos.length ? `Descargada · faltaron ${fallidos.length} (reintentar)` : "Descargada";
        $("estadoZip").textContent = fallidos.length
            ? `Parte ${i + 1} descargada, pero faltaron ${fallidos.length}: ${fallidos.join(", ")}. Toca la parte otra vez para reintentar.`
            : `Parte ${i + 1} descargada.`;
    } catch {
        // Casi siempre es memoria: el celular no alcanza a armar el ZIP.
        boton.textContent = "Reintentar";
        $("estadoZip").textContent = "Tu dispositivo no pudo armar este ZIP (suele ser falta de memoria). Cierra otras apps e intenta de nuevo, o descárgalo desde un computador.";
    } finally {
        boton.disabled = false;
    }
}

iniciar();
