// ==========================================
// PANEL DE ADMINISTRACIÓN: /admin/
// La seguridad real está en RLS (tabla admins); esta página solo es la interfaz.
// ==========================================

const $ = (id) => document.getElementById(id);
const el = (tag, props = {}, ...hijos) => {
    const e = Object.assign(document.createElement(tag), props);
    e.append(...hijos.filter((h) => h != null));
    return e;
};
const DIA = 86400000;
let paquetes = [];


// ==========================================
// SESIÓN
// ==========================================

async function iniciar() {
    const { data } = await sb.auth.getSession();
    if (data.session) entrar(data.session);
    else $("login").hidden = false;
}

$("formLogin").addEventListener("submit", async (e) => {
    e.preventDefault();
    $("errorLogin").textContent = "";
    const { data, error } = await sb.auth.signInWithPassword({ email: $("correo").value, password: $("clave").value });
    if (error) return ($("errorLogin").textContent = "Correo o contraseña incorrectos.");
    entrar(data.session);
});

async function entrar(sesion) {
    const { data: esAdmin } = await sb.from("admins").select("user_id").eq("user_id", sesion.user.id).maybeSingle();
    if (!esAdmin) {
        await sb.auth.signOut();
        $("login").hidden = false;
        $("errorLogin").textContent = "Este usuario no es administrador (LEEME, paso 6).";
        return;
    }
    $("login").hidden = true;
    $("panel").hidden = false;
    $("usuario").textContent = sesion.user.email;

    paquetes = (await sb.from("paquetes").select("*").order("precio")).data || [];
    $("paquete").replaceChildren(...paquetes.map((p) =>
        el("option", { value: p.id, textContent: `${p.nombre} · $${p.precio.toLocaleString("es-CO")}` })));
    $("tipo").replaceChildren(...Object.entries(TIPOS).map(([v, t]) => el("option", { value: v, textContent: t })));
    $("plantilla").replaceChildren(...Object.entries(PLANTILLAS).map(([v, p]) => el("option", { value: v, textContent: p.nombre })));
    $("plantilla").value = "boda-elegante";
    ponerColoresDePlantilla();

    cargarEventos();
    cargarLog();
}

$("salir").addEventListener("click", async () => {
    await sb.auth.signOut();
    location.reload();
});


// ==========================================
// CREAR EVENTO
// ==========================================

// Lee los colores por defecto de la plantilla desde styles.css (una sola fuente de verdad).
function ponerColoresDePlantilla() {
    const muestra = el("div");
    muestra.dataset.plantilla = $("plantilla").value;
    document.body.append(muestra);
    const estilo = getComputedStyle(muestra);
    $("colorPrimario").value = estilo.getPropertyValue("--primario").trim();
    $("colorSecundario").value = estilo.getPropertyValue("--secundario").trim();
    muestra.remove();
}
$("plantilla").addEventListener("change", ponerColoresDePlantilla);

function crearSlug(nombre) {
    const base = nombre.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
        .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40).replace(/-+$/, "");
    return `${base || "evento"}-${Math.random().toString(36).slice(2, 6)}`;
}

$("formEvento").addEventListener("submit", async (e) => {
    e.preventDefault();
    const datos = Object.fromEntries(new FormData(e.target));
    for (const k in datos) if (typeof datos[k] === "string") datos[k] = datos[k].trim() || null;
    datos.slug = crearSlug(datos.nombre);

    $("crear").disabled = true;
    try {
        const portada = $("portada").files[0];
        if (portada) {
            $("estadoCrear").textContent = "Subiendo portada…";
            datos.portada_url = (await subirACloudinary(await comprimirImagen(portada), datos.slug)).secure_url;
        }
        $("estadoCrear").textContent = "Creando…";
        const { data, error } = await sb.from("eventos").insert(datos).select().single();
        if (error) throw error;

        e.target.reset();
        $("plantilla").value = "boda-elegante";
        ponerColoresDePlantilla();
        $("estadoCrear").textContent = "";
        mostrarEnlaces(data);
        cargarEventos();
    } catch (err) {
        $("estadoCrear").textContent = "No se pudo crear: " + err.message;
    } finally {
        $("crear").disabled = false;
    }
});


// ==========================================
// ENLACES, QR Y TARJETAS PDF
// ==========================================

function filaEnlace(titulo, url) {
    const campo = el("input", { value: url, readOnly: true });
    const copiar = el("button", { type: "button", className: "boton boton-chico", textContent: "Copiar" });
    copiar.onclick = async () => {
        await navigator.clipboard.writeText(url);
        copiar.textContent = "¡Copiado!";
        setTimeout(() => (copiar.textContent = "Copiar"), 1500);
    };
    return el("div", {}, el("strong", { textContent: titulo }),
        el("div", { className: "enlace-copiar" }, campo, copiar,
            el("a", { href: url, target: "_blank", className: "boton boton-sec boton-chico", textContent: "Abrir" })));
}

function mostrarEnlaces(ev) {
    const enlaces = enlacesEvento(ev.slug, ev.token_anfitrion);
    const pdf = el("button", { className: "boton", textContent: "🖨️ Descargar tarjetas QR" });
    pdf.onclick = () => tarjetasQR(ev);
    const qr = el("img", { className: "qr-vista", alt: "QR del evento", src: qrCanvas(enlaces.invitado, 320).toDataURL() });

    $("resultado").replaceChildren(
        el("h2", { textContent: `✓ ${ev.nombre}` }),
        el("p", { className: "nota", textContent: `Plazo de descarga hasta el ${fechaLarga(ev.expira_en)}.` }),
        filaEnlace("Invitados (este va en el QR)", enlaces.invitado),
        filaEnlace("Pantalla en vivo", enlaces.pantalla),
        filaEnlace("Anfitrión (privado: solo para el cliente)", enlaces.anfitrion),
        qr,
        el("div", { className: "acciones" }, pdf, botonWhatsApp(ev, mensajeBienvenidaCliente(ev, enlaces))),
    );
    $("resultado").hidden = false;
    $("resultado").scrollIntoView({ behavior: "smooth" });
}

function tarjetasQR(ev) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: "mm", format: "letter", compress: true });
    const qr = qrCanvas(enlacesEvento(ev.slug).invitado, 400).toDataURL("image/png");
    const M = 10, W = (215.9 - 2 * M) / 2, H = (279.4 - 2 * M) / 3, Q = 52;

    doc.setLineDashPattern([2, 2], 0);
    doc.setDrawColor(170);
    for (let i = 0; i < 6; i++) {
        const x = M + (i % 2) * W, y = M + Math.floor(i / 2) * H, centro = x + W / 2;
        doc.rect(x, y, W, H);
        doc.setFont("helvetica", "bold").setFontSize(15).setTextColor(30);
        doc.text(doc.splitTextToSize(ev.nombre, W - 14).slice(0, 2), centro, y + 11, { align: "center" });
        doc.addImage(qr, "PNG", centro - Q / 2, y + 19, Q, Q, "qr"); // alias: la imagen se guarda una sola vez
        doc.setFont("helvetica", "normal").setFontSize(12);
        doc.text("Escanea y comparte tus fotos", centro, y + 78, { align: "center" });
        doc.setFontSize(8).setTextColor(130);
        doc.text(NOMBRE_MARCA, centro, y + 83, { align: "center" });
    }
    doc.save(`tarjetas-qr-${ev.slug}.pdf`);
}


// ==========================================
// WHATSAPP AL CLIENTE
// ==========================================

function numeroWhatsApp(texto) {
    const n = (texto || "").replace(/\D/g, "");
    return n.length === 10 && n.startsWith("3") ? "57" + n : n; // celular colombiano sin indicativo
}

function botonWhatsApp(ev, mensaje) {
    const numero = numeroWhatsApp(ev.contacto_whatsapp);
    if (!numero) return el("span", { className: "nota", textContent: "Sin WhatsApp del cliente" });
    return el("a", {
        className: "boton boton-chico", target: "_blank", textContent: "WhatsApp",
        style: "background:#25d366",
        href: `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`,
    });
}

const saludo = (ev) => `Hola${ev.contacto_nombre ? " " + ev.contacto_nombre : ""}. Te escribimos de ${NOMBRE_MARCA}.`;

function mensajeBienvenidaCliente(ev, enlaces) {
    return `${saludo(ev)} Tu álbum "${ev.nombre}" está listo.\n\n` +
        `- Enlace para invitados: ${enlaces.invitado}\n` +
        `- Tu panel privado (no lo compartas): ${enlaces.anfitrion}\n\n` +
        `Recuerda descargar tus fotos antes del ${fechaLarga(ev.expira_en)}; después se borran para siempre.`;
}

function mensajeRecordatorio(ev, dias) {
    return `${saludo(ev)} Las fotos de "${ev.nombre}" se borrarán para siempre el ${fechaLarga(ev.expira_en)} ` +
        `(en ${dias} días). Descárgalas aquí: ${enlacesEvento(ev.slug, ev.token_anfitrion).anfitrion}`;
}


// ==========================================
// LISTA DE EVENTOS
// ==========================================

async function cargarEventos() {
    const { data, error } = await sb.rpc("admin_eventos");
    if (error) return ($("lista").textContent = "Error: " + error.message);
    if (!data.length) return ($("lista").innerHTML = '<p class="nota">Todavía no hay eventos.</p>');

    $("lista").replaceChildren(...data.map(filaEvento));

    const avisar = data.filter((ev) => ev.estado !== "vencido" && [7, 2].includes(diasRestantes(ev.expira_en)));
    $("zonaAvisos").hidden = !avisar.length;
    $("avisos").replaceChildren(...avisar.map((ev) => {
        const dias = diasRestantes(ev.expira_en);
        return el("div", { className: "fila-evento" },
            el("strong", { textContent: `${ev.nombre} · vence en ${dias} días` }),
            el("div", { className: "datos" }, el("span", { textContent: ev.contacto_nombre || "Sin nombre de contacto" })),
            el("div", {}, botonWhatsApp(ev, mensajeRecordatorio(ev, dias))));
    }));
}

function filaEvento(ev) {
    const dias = diasRestantes(ev.expira_en);
    const paquete = paquetes.find((p) => p.id === ev.paquete_id);
    const boton = (texto, accion, clase = "boton-sec") => {
        const b = el("button", { className: `boton boton-chico ${clase}`, textContent: texto });
        b.onclick = () => accion(b);
        return b;
    };

    return el("div", { className: "fila-evento" },
        el("div", {}, el("strong", { textContent: ev.nombre + " " }),
            el("span", { className: `etiqueta ${ev.estado}`, textContent: ev.estado })),
        el("div", { className: "datos" },
            el("span", { textContent: `${TIPOS[ev.tipo] || ev.tipo} · ${paquete?.nombre || ev.paquete_id}` }),
            el("span", { textContent: `📅 ${fechaLarga(ev.fecha_evento)}` }),
            el("span", { textContent: `🖼️ ${ev.fotos} fotos · ${(ev.bytes / 1048576).toFixed(1)} MB` }),
            el("span", { textContent: dias > 0 ? `⏳ se borra en ${dias} días` : dias === 0 ? "⏳ se borra hoy" : "⏳ pendiente de borrar" }),
            el("span", { textContent: ev.slug })),
        el("div", { className: "acciones", style: "justify-content:flex-start; margin-top:6px" },
            boton("Enlaces", () => mostrarEnlaces(ev)),
            boton("Tarjetas QR", () => tarjetasQR(ev)),
            boton("Extender plazo", () => extender(ev)),
            boton("Borrar ahora", (b) => borrarAhora(ev, b), "boton-peligro")));
}

async function extender(ev) {
    const dias = parseInt(prompt(`¿Cuántos días extender la descarga de "${ev.nombre}"?`, "7"), 10);
    if (!(dias > 0)) return;
    const cambios = { expira_en: new Date(Math.max(Date.parse(ev.expira_en), Date.now()) + dias * DIA).toISOString() };
    if (ev.estado === "vencido") cambios.estado = "descarga";
    const { error } = await sb.from("eventos").update(cambios).eq("id", ev.id);
    if (error) alert("No se pudo extender: " + error.message);
    cargarEventos();
}

async function borrarAhora(ev, boton) {
    const ok = confirm(`¿Borrar "${ev.nombre}" AHORA?\n\nSe eliminan para siempre sus ${ev.fotos} fotos y videos de Cloudinary y de la base de datos. No se puede deshacer.`);
    if (!ok) return;
    boton.disabled = true;
    boton.textContent = "Borrando…";
    const { error } = await sb.from("eventos").update({ expira_en: new Date().toISOString(), estado: "vencido" }).eq("id", ev.id);
    if (error) { alert("No se pudo marcar el evento: " + error.message); return cargarEventos(); }
    await correrLimpieza();
}


// ==========================================
// LIMPIEZA (Edge Function) Y SU REGISTRO
// ==========================================

async function correrLimpieza() {
    $("estadoLimpieza").textContent = "Limpiando…";
    const { data, error } = await sb.functions.invoke("limpiar-eventos", { body: {} });
    $("estadoLimpieza").textContent = error
        ? "Error: " + error.message
        : `Listo: ${data.borrados} borrados, ${data.errores} con error, ${data.cerrados} pasaron a descarga.`;
    cargarEventos();
    cargarLog();
}
$("limpiarAhora").addEventListener("click", correrLimpieza);

async function cargarLog() {
    const { data } = await sb.from("log_limpieza").select("*").order("id", { ascending: false }).limit(15);
    $("log").replaceChildren(...(data || []).map((f) => el("li", {
        textContent: `${fechaHora(f.ejecutado_en)} · ${f.accion}` +
            (f.evento_slug ? ` · ${f.evento_slug}` : "") +
            (f.error ? ` · ❌ ${f.error}` : f.detalle ? ` · ${JSON.stringify(f.detalle)}` : ""),
    })));
}

iniciar();
