// ==========================================
// PÁGINA DEL INVITADO: /e/?s=<slug>
// ==========================================

const $ = (id) => document.getElementById(id);
const slug = parametros.get("s");
const visor = crearVisor();
const POR_PAGINA = 60;
const SUBIDAS_SIMULTANEAS = 3;

let ev = null;
const fotos = [];          // en el mismo orden que la galería (para el visor)
const vistos = new Set();
let cursor = null, finGaleria = false, cargando = false;


// ==========================================
// INICIO
// ==========================================

async function iniciar() {
    const { data, error } = slug ? await sb.rpc("evento_publico", { p_slug: slug }) : { data: null };
    if (error || !data) {
        $("titulo").textContent = "Álbum no encontrado";
        $("zonaError").hidden = false;
        return;
    }
    ev = data;

    const plantilla = aplicarPlantilla(ev);
    document.title = ev.nombre;
    $("titulo").textContent = ev.nombre;
    $("icono").textContent = plantilla.icono;
    $("fecha").textContent = fechaLarga(ev.fecha_evento);
    $("mensaje").textContent = ev.mensaje_bienvenida || "";
    if (ev.portada_url) {
        $("portadaImg").src = transformar(ev.portada_url, "c_fill,w_1600,h_1000,q_auto,f_auto");
        $("portadaImg").hidden = false;
        $("portada").classList.add("con-imagen");
    }

    if (ev.subidas_abiertas) mostrarZonaSubida();
    else $("zonaCerrada").hidden = false;

    $("zonaGaleria").hidden = false;
    actualizarContador();
    alLlegarAlFinal($("centinela"), cargarMas);
}


// ==========================================
// NOMBRE DEL INVITADO (se pide una sola vez)
// ==========================================

function mostrarZonaSubida() {
    const nombre = localStorage.getItem("nombreInvitado");
    $("zonaNombre").hidden = !!nombre;
    $("zonaSubir").hidden = !nombre;
    $("nombreVisible").textContent = nombre || "";
    $("notaVideos").textContent = ev.max_videos
        ? `Videos de máximo ${ev.max_video_seg} s · quedan ${Math.max(0, ev.max_videos - ev.videos_subidos)} de ${ev.max_videos}.`
        : `También puedes subir videos de máximo ${ev.max_video_seg} segundos.`;
}

$("formNombre").addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = $("inputNombre").value.trim().slice(0, 60);
    if (!nombre) return;
    localStorage.setItem("nombreInvitado", nombre);
    mostrarZonaSubida();
});

$("cambiarNombre").addEventListener("click", () => {
    $("inputNombre").value = localStorage.getItem("nombreInvitado") || "";
    localStorage.removeItem("nombreInvitado");
    mostrarZonaSubida();
    $("inputNombre").focus();
});


// ==========================================
// GALERÍA (60 por página, carga infinita)
// ==========================================

async function actualizarContador() {
    const { count } = await sb.from("fotos").select("id", { count: "exact", head: true }).eq("evento_id", ev.id);
    $("contador").textContent = count ? `${count} recuerdo${count === 1 ? "" : "s"}` : "";
}

function agregar(f, alInicio) {
    if (vistos.has(f.id)) return;
    vistos.add(f.id);
    $("galeria").querySelector(".galeria-vacia")?.remove();
    const el = crearMiniatura(f, () => visor.abrir(fotos, fotos.indexOf(f)));
    if (alInicio) { fotos.unshift(f); $("galeria").prepend(el); }
    else { fotos.push(f); $("galeria").append(el); }
}

// Devuelve true si puede haber más páginas.
async function cargarMas() {
    if (cargando || finGaleria || !ev) return false;
    cargando = true;
    let consulta = sb.from("fotos")
        .select("id,url,tipo,nombre_invitado,creado_en")
        .eq("evento_id", ev.id)
        .order("creado_en", { ascending: false })
        .limit(POR_PAGINA);
    if (cursor) consulta = consulta.lt("creado_en", cursor);
    const { data, error } = await consulta;
    cargando = false;
    if (error) return false;

    data.forEach((f) => agregar(f, false));
    if (data.length) cursor = data[data.length - 1].creado_en;
    finGaleria = data.length < POR_PAGINA;
    if (!fotos.length) $("galeria").innerHTML = '<p class="galeria-vacia">Todavía no hay fotos. ¡Sé el primero en compartir!</p>';
    return !finGaleria;
}


// ==========================================
// SUBIDA: cola con compresión, progreso y reintentos
// ==========================================

const cola = [];   // { archivo, esVideo, estado: espera|subiendo|listo|error, progreso, mensaje, final }
let activos = 0;

const videosPendientes = () => cola.filter((i) => i.esVideo && (i.estado === "espera" || i.estado === "subiendo")).length;

function rechazar(item, mensaje) {
    Object.assign(item, { estado: "error", mensaje, final: true });
}

$("archivos").addEventListener("change", async () => {
    const nuevos = [...$("archivos").files];
    $("archivos").value = "";

    for (const archivo of nuevos) {
        const esVideo = archivo.type.startsWith("video/") || /\.(mp4|mov)$/i.test(archivo.name);
        const item = { archivo, esVideo, estado: "espera", progreso: 0 };
        cola.push(item);
        if (!esVideo) continue;

        if (archivo.size > 100 * 1024 * 1024) { rechazar(item, "el video pesa más de 100 MB"); continue; }
        if (ev.max_videos && ev.videos_subidos + videosPendientes() > ev.max_videos) {
            rechazar(item, `este evento permite máximo ${ev.max_videos} videos`);
            continue;
        }
        const duracion = await duracionVideo(archivo);
        if (duracion && duracion > ev.max_video_seg + 0.5) {
            rechazar(item, `dura ${Math.round(duracion)} s y el máximo es ${ev.max_video_seg} s`);
        }
    }
    pintarBarra();
    bombear();
});

function bombear() {
    while (activos < SUBIDAS_SIMULTANEAS) {
        const item = cola.find((i) => i.estado === "espera");
        if (!item) break;
        procesar(item);
    }
}

async function conReintentos(fn) {
    for (let intento = 1; ; intento++) {
        try {
            return await fn();
        } catch (e) {
            if (!e.reintentable || intento >= 5) throw e;
            if (!navigator.onLine) await new Promise((r) => addEventListener("online", r, { once: true }));
            else await new Promise((r) => setTimeout(r, 2000 * 2 ** intento));
        }
    }
}

async function procesar(item) {
    activos++;
    item.estado = "subiendo";
    pintarBarra();
    try {
        item.listo ??= item.esVideo ? item.archivo : await comprimirImagen(item.archivo);
        item.respuesta ??= await conReintentos(() =>
            subirACloudinary(item.listo, ev.slug, (p) => { item.progreso = p; pintarBarra(); }));
        const r = item.respuesta;

        if (r.resource_type === "video" && r.duration > ev.max_video_seg + 1) {
            throw Object.assign(new Error(`dura ${Math.round(r.duration)} s y el máximo es ${ev.max_video_seg} s`), { final: true });
        }

        const fila = {
            evento_id: ev.id,
            cloudinary_public_id: r.public_id,
            url: r.secure_url,
            tipo: r.resource_type === "video" ? "video" : "imagen",
            ancho: r.width,
            alto: r.height,
            bytes: r.bytes,
            nombre_invitado: localStorage.getItem("nombreInvitado"),
        };
        await conReintentos(async () => {
            const { error } = await sb.from("fotos").insert(fila);
            if (!error || error.code === "23505") return; // 23505 = ya estaba registrada (reintento)
            const mensaje = error.code === "42501" ? "las subidas se cerraron o se llegó al límite de videos" : error.message;
            throw Object.assign(new Error(mensaje), { reintentable: !error.code, final: !!error.code });
        });

        item.estado = "listo";
        item.progreso = 1;
        if (fila.tipo === "video") { ev.videos_subidos++; mostrarZonaSubida(); }
        agregar({ id: r.public_id, url: fila.url, tipo: fila.tipo, nombre_invitado: fila.nombre_invitado }, true);
        actualizarContador();
    } catch (e) {
        Object.assign(item, { estado: "error", mensaje: e.message, final: !!e.final });
    } finally {
        activos--;
        pintarBarra();
        bombear();
    }
}

$("reintentar").addEventListener("click", () => {
    cola.filter((i) => i.estado === "error" && !i.final).forEach((i) => Object.assign(i, { estado: "espera", progreso: 0 }));
    pintarBarra();
    bombear();
});

let ocultarBarra = null;

function pintarBarra() {
    if (!cola.length) return;
    clearTimeout(ocultarBarra);
    const listos = cola.filter((i) => i.estado === "listo").length;
    const errores = cola.filter((i) => i.estado === "error");
    const validos = cola.length - errores.length;
    const pendientes = validos - listos;
    const avance = validos ? cola.reduce((s, i) => s + (i.estado === "error" ? 0 : i.progreso), 0) / validos : 1;

    $("barraSubida").hidden = false;
    $("progreso").style.width = `${Math.round(avance * 100)}%`;
    $("textoSubida").textContent = pendientes
        ? `Subiendo… ${listos} de ${validos} · puedes seguir mirando`
        : `✓ ${listos} archivo${listos === 1 ? "" : "s"} compartido${listos === 1 ? "" : "s"}` + (errores.length ? ` · ${errores.length} con error` : "");
    $("reintentar").hidden = pendientes > 0 || !errores.some((i) => !i.final);
    $("erroresSubida").replaceChildren(...errores.map((i) => {
        const li = document.createElement("li");
        li.textContent = `${i.archivo.name}: ${i.mensaje}`;
        return li;
    }));

    if (!pendientes && !errores.length) {
        ocultarBarra = setTimeout(() => { $("barraSubida").hidden = true; cola.length = 0; }, 4000);
    }
}

addEventListener("beforeunload", (e) => {
    if (cola.some((i) => i.estado === "espera" || i.estado === "subiendo")) e.preventDefault();
});

iniciar();
