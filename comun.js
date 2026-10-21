// ==========================================
// UTILIDADES COMPARTIDAS (todas las páginas)
// ==========================================

const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const parametros = new URLSearchParams(location.search);

document.querySelectorAll(".marca").forEach((el) => (el.textContent = NOMBRE_MARCA));


// ==========================================
// ÍCONOS (Lucide, licencia ISC): dibujados, nunca emojis
// ==========================================

const ICONOS = {
    "x": '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    "chevron-left": '<path d="m15 18-6-6 6-6"/>',
    "chevron-right": '<path d="m9 18 6-6-6-6"/>',
    "eye": '<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>',
    "eye-off": '<path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/>',
    "check": '<path d="M20 6 9 17l-5-5"/>',
    "triangle-alert": '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
    "rotate-ccw": '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
    "heart": '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
    "crown": '<path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"/><path d="M5 21h14"/>',
    "party-popper": '<path d="M5.8 11.3 2 22l10.7-3.79"/><path d="M4 3h.01"/><path d="M22 8h.01"/><path d="M15 2h.01"/><path d="M22 20h.01"/><path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10"/><path d="m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11c-.11.7-.72 1.22-1.43 1.22H17"/><path d="m11 2 .33.82c.34.86-.2 1.82-1.11 1.98C9.52 4.9 9 5.52 9 6.23V7"/><path d="M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z"/>',
    "building-2": '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>',
    "wifi-off": '<path d="M12 20h.01"/><path d="M8.5 16.429a5 5 0 0 1 7 0"/><path d="M5 12.859a10 10 0 0 1 5.17-2.69"/><path d="M19 12.859a10 10 0 0 0-2.007-1.523"/><path d="M2 8.82a15 15 0 0 1 4.177-2.643"/><path d="M22 8.82a15 15 0 0 0-11.288-3.764"/><path d="m2 2 20 20"/>',
    "image-off": '<line x1="2" x2="22" y1="2" y2="22"/><path d="M10.41 10.41a2 2 0 1 1-2.83-2.83"/><line x1="13.5" x2="6" y1="13.5" y2="21"/><line x1="18" x2="21" y1="12" y2="15"/><path d="M3.59 3.59A1.99 1.99 0 0 0 3 5v14a2 2 0 0 0 2 2h14c.55 0 1.052-.22 1.41-.59"/><path d="M21 15V5a2 2 0 0 0-2-2H9"/>',
    "camera": '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>',
    "download": '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',
    "tv": '<rect width="20" height="15" x="2" y="7" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/>',
    "play": '<polygon points="6 3 20 12 6 21 6 3"/>',
    "images": '<path d="M18 22H4a2 2 0 0 1-2-2V6"/><path d="m22 13-1.296-1.296a2.41 2.41 0 0 0-3.408 0L11 18"/><circle cx="12" cy="8" r="2"/><rect width="16" height="16" x="6" y="2" rx="2"/>'
};

const icono = (nombre) =>
    `<svg class="icono" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICONOS[nombre] || ""}</svg>`;

// En el HTML: <span data-icono="camera"></span> se convierte en el ícono.
document.querySelectorAll("[data-icono]").forEach((el) => el.insertAdjacentHTML("afterbegin", icono(el.dataset.icono)));


// ==========================================
// ALMACENAMIENTO LOCAL A PRUEBA DE FALLOS
// En modo privado o con cookies bloqueadas localStorage lanza error: la página sigue con memoria.
// ==========================================

const guardado = (() => {
    const memoria = {};
    return {
        leer(k) { try { return localStorage.getItem(k) ?? memoria[k] ?? null; } catch { return memoria[k] ?? null; } },
        escribir(k, v) { memoria[k] = v; try { localStorage.setItem(k, v); } catch {} },
        borrar(k) { delete memoria[k]; try { localStorage.removeItem(k); } catch {} },
    };
})();


// ==========================================
// PLANTILLAS (los colores y tamaños viven en styles.css)
// ==========================================

const PLANTILLAS = {
    "boda-elegante": { nombre: "Boda elegante", icono: "heart", fuentes: "family=Allura&family=DM+Sans:wght@400;500;700" },
    "quince-anos":   { nombre: "Quince años",   icono: "crown", fuentes: "family=Great+Vibes&family=Poppins:wght@400;500;600" },
    "infantil":      { nombre: "Infantil",      icono: "party-popper", fuentes: "family=Fredoka:wght@400;500;600;700" },
    "corporativa":   { nombre: "Corporativa",   icono: "building-2", fuentes: "family=Montserrat:wght@600;800&family=Inter:wght@400;500;600" },
    "minimalista":   { nombre: "Minimalista",   icono: "camera", fuentes: "family=Jost:wght@300;400;500;600" },
};

const TIPOS = {
    boda: "Boda", quince: "15 años", cumpleanos: "Cumpleaños",
    grado: "Grado", empresa: "Evento de empresa", otro: "Otro",
};

function aplicarPlantilla(ev) {
    const id = PLANTILLAS[ev.plantilla] ? ev.plantilla : "minimalista";
    const raiz = document.documentElement;
    raiz.dataset.plantilla = id;
    if (ev.color_primario) raiz.style.setProperty("--primario", ev.color_primario);
    if (ev.color_secundario) raiz.style.setProperty("--secundario", ev.color_secundario);
    ajustarContraste();

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?${PLANTILLAS[id].fuentes}&display=swap`;
    document.head.append(link);
    return PLANTILLAS[id];
}


// El cliente puede elegir cualquier color. Calculamos:
// --sobre-primario: blanco o casi negro, lo que más contraste dé sobre el color (botones).
// --primario-texto: el color oscurecido hasta leerse (4,5:1) sobre el fondo y las tarjetas.
// shortcut: asume plantillas de fondo claro; si llega una plantilla oscura, aclarar en vez de oscurecer.
const rgb = (texto) => {
    const m = /^#([0-9a-f]{6})$/i.exec((texto || "").trim());
    return m && [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16));
};
const luz = (c) => {
    const [r, g, b] = c.map((v) => (v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
function contraste(a, b) {
    const [claro, oscuro] = [luz(a), luz(b)].sort((x, y) => y - x);
    return (claro + 0.05) / (oscuro + 0.05);
}
const aHex = (c) => "#" + c.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");

function ajustarContraste() {
    const raiz = document.documentElement, estilo = getComputedStyle(raiz);
    const primario = rgb(estilo.getPropertyValue("--primario"));
    if (!primario) return;
    const fondos = ["--fondo", "--tarjeta"].map((v) => rgb(estilo.getPropertyValue(v))).filter(Boolean);
    const blanco = [255, 255, 255], tinta = [26, 26, 26];
    raiz.style.setProperty("--sobre-primario", contraste(primario, blanco) >= contraste(primario, tinta) ? "#ffffff" : "#1a1a1a");
    let texto = primario;
    for (let i = 0; i < 25 && fondos.some((f) => contraste(texto, f) < 4.5); i++) texto = texto.map((v) => v * 0.9);
    raiz.style.setProperty("--primario-texto", aHex(texto));
}


// ==========================================
// CLOUDINARY: miniaturas y versiones livianas
// La original solo se descarga en el ZIP.
// ==========================================

const transformar = (url, t) => url.replace("/upload/", `/upload/${t}/`);

function miniatura(f) {
    return f.tipo === "video"
        ? transformar(f.url, "so_0,c_fill,w_400,h_400,q_auto").replace(/\.\w+$/, ".jpg")
        : transformar(f.url, "c_fill,w_400,h_400,q_auto,f_auto");
}

function imagenGrande(f) {
    return f.tipo === "video"
        ? transformar(f.url, "so_0,c_limit,w_1600,q_auto").replace(/\.\w+$/, ".jpg")
        : transformar(f.url, "c_limit,w_1600,q_auto,f_auto");
}

const videoWeb = (f) => transformar(f.url, "c_limit,w_720,q_auto").replace(/\.\w+$/, ".mp4");


// Sube un archivo directo a Cloudinary (preset unsigned) con progreso.
// Rechaza con error.reintentable = true si fue la red o el servidor.
function subirACloudinary(archivo, slug, alProgreso) {
    return new Promise((resolver, rechazar) => {
        const falla = (mensaje, reintentable) => rechazar(Object.assign(new Error(mensaje), { reintentable }));
        const datos = new FormData();
        datos.append("file", archivo);
        datos.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
        // Cuenta con carpetas dinámicas: la carpeta no cambia el public_id, así que lo fijamos aquí
        // (la limpieza borra por el prefijo eventos/<slug>/). asset_folder solo ordena la Media Library.
        // getRandomValues funciona también en http:// (pruebas en la red local); randomUUID no.
        const aleatorio = [...crypto.getRandomValues(new Uint8Array(16))].map((b) => b.toString(16).padStart(2, "0")).join("");
        datos.append("public_id", `eventos/${slug}/${aleatorio}`);
        datos.append("asset_folder", `eventos/${slug}`);

        const xhr = new XMLHttpRequest();
        xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`);
        xhr.timeout = 10 * 60 * 1000;
        xhr.upload.onprogress = (e) => e.lengthComputable && alProgreso?.(e.loaded / e.total);
        xhr.onerror = xhr.ontimeout = () => falla("Sin conexión", true);
        xhr.onload = () => {
            let r = null;
            try { r = JSON.parse(xhr.responseText); } catch {}
            if (xhr.status !== 200 || !r?.public_id) {
                return falla(mensajeCloudinary(r?.error?.message, xhr.status), xhr.status >= 500 || xhr.status === 429);
            }
            // Nunca registrar algo que quedó fuera de la carpeta del evento (se borra por prefijo).
            if (!r.public_id.startsWith(`eventos/${slug}/`)) {
                return falla("El archivo quedó fuera de la carpeta del evento. Revisa el upload preset (LEEME, paso 3).", false);
            }
            resolver(r);
        };
        xhr.send(datos);
    });
}

// Los mensajes de Cloudinary llegan en inglés: los traducimos a algo que un invitado entienda.
function mensajeCloudinary(mensaje = "", status) {
    if (/size|too large/i.test(mensaje)) return "el archivo es demasiado grande";
    if (/format|not allowed|invalid image|unsupported/i.test(mensaje)) return "ese tipo de archivo no se puede subir";
    if (status === 429) return "hay muchas subidas al mismo tiempo; se reintentará";
    if (status >= 500) return "el servidor de fotos no respondió";
    return "no se pudo subir";
}

// Reduce la foto a máx. 2048 px y ~1 MB. Si el navegador no puede leerla (p. ej. HEIC en Android) sube la original.
async function comprimirImagen(archivo) {
    const LIMITE = 1024 * 1024;
    const url = URL.createObjectURL(archivo);
    try {
        const img = new Image();
        img.src = url;
        await img.decode(); // <img> respeta la orientación EXIF en navegadores actuales
        const k = Math.min(1, 2048 / Math.max(img.naturalWidth, img.naturalHeight));
        if (k === 1 && archivo.size <= LIMITE) return archivo;

        const lienzo = document.createElement("canvas");
        lienzo.width = Math.round(img.naturalWidth * k);
        lienzo.height = Math.round(img.naturalHeight * k);
        lienzo.getContext("2d").drawImage(img, 0, 0, lienzo.width, lienzo.height);

        let blob = null;
        for (const calidad of [0.85, 0.75, 0.65]) {
            blob = await new Promise((r) => lienzo.toBlob(r, "image/jpeg", calidad));
            if (blob && blob.size <= LIMITE) break;
        }
        return blob && (k < 1 || blob.size < archivo.size) ? blob : archivo;
    } catch {
        return archivo;
    } finally {
        URL.revokeObjectURL(url);
    }
}

// Duración de un video en segundos (null si el navegador no la puede leer).
function duracionVideo(archivo) {
    return new Promise((resolver) => {
        const v = document.createElement("video");
        const url = URL.createObjectURL(archivo);
        const fin = (d) => { URL.revokeObjectURL(url); resolver(d); };
        v.preload = "metadata";
        v.onloadedmetadata = () => fin(Number.isFinite(v.duration) ? v.duration : null);
        v.onerror = () => fin(null);
        setTimeout(() => fin(null), 8000);
        v.src = url;
    });
}


// ==========================================
// ENLACES, FECHAS, QR
// ==========================================

function enlacesEvento(slug, token) {
    const base = location.origin;
    return {
        invitado: `${base}/e/?s=${slug}`,
        pantalla: `${base}/pantalla/?s=${slug}`,
        anfitrion: token ? `${base}/anfitrion/?s=${slug}&t=${token}` : null,
    };
}

function fechaLarga(valor) {
    const d = new Date(valor.length === 10 ? valor + "T12:00:00-05:00" : valor);
    return d.toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric", timeZone: "America/Bogota" });
}

function fechaHora(valor) {
    return new Date(valor).toLocaleString("es-CO", {
        day: "numeric", month: "long", year: "numeric", hour: "numeric", minute: "2-digit", timeZone: "America/Bogota",
    });
}

// Días que faltan, contados en calendario de Colombia (hoy = 0).
function diasRestantes(valor) {
    const dia = (d) => new Date(d).toLocaleDateString("en-CA", { timeZone: "America/Bogota" });
    return Math.round((new Date(dia(valor)) - new Date(dia(Date.now()))) / 86400000);
}

// QR dibujado en un canvas (sirve para <img>, pantalla y PDF).
function qrCanvas(texto, tam = 512) {
    const qr = qrcode(0, "M");
    qr.addData(texto);
    qr.make();
    const n = qr.getModuleCount(), margen = 2;
    const celda = Math.max(1, Math.floor(tam / (n + margen * 2)));
    const lienzo = document.createElement("canvas");
    lienzo.width = lienzo.height = celda * (n + margen * 2);
    const ctx = lienzo.getContext("2d");
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, lienzo.width, lienzo.height);
    ctx.fillStyle = "#000";
    for (let f = 0; f < n; f++)
        for (let c = 0; c < n; c++)
            if (qr.isDark(f, c)) ctx.fillRect((c + margen) * celda, (f + margen) * celda, celda, celda);
    return lienzo;
}


// ==========================================
// GALERÍA: miniatura, carga infinita y visor
// ==========================================

// Agrega .cargada cuando la imagen termina de bajar, para que entre con un fundido.
function alCargar(img) {
    const listo = () => img.classList.add("cargada");
    if (img.complete) listo();
    else { img.addEventListener("load", listo, { once: true }); img.addEventListener("error", listo, { once: true }); }
}

function crearMiniatura(f, alClic) {
    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "miniatura" + (f.tipo === "video" ? " es-video" : "");
    const img = document.createElement("img");
    img.src = miniatura(f);
    img.loading = "lazy";
    img.decoding = "async";
    img.alt = f.nombre_invitado ? `Foto de ${f.nombre_invitado}` : "Foto del evento";
    img.addEventListener("error", () => boton.classList.add("rota"), { once: true });
    alCargar(img);
    boton.append(img);
    if (f.tipo === "video") boton.insertAdjacentHTML("beforeend", `<span class="marca-video">${icono("play")}</span>`);
    boton.addEventListener("click", alClic);
    return boton;
}

// cargar() devuelve true si puede haber más; se repite mientras el final siga a la vista.
function alLlegarAlFinal(elemento, cargar) {
    const revisar = async () => {
        if (elemento.getBoundingClientRect().top < innerHeight + 800 && (await cargar())) revisar();
    };
    new IntersectionObserver((e) => e[0].isIntersecting && revisar(), { rootMargin: "800px" }).observe(elemento);
    cargar().then((hayMas) => hayMas && revisar()); // la primera página siempre
}

function crearVisor() {
    const visor = document.createElement("div");
    visor.className = "visor";
    visor.hidden = true;
    visor.setAttribute("role", "dialog");
    visor.setAttribute("aria-modal", "true");
    visor.setAttribute("aria-label", "Foto ampliada");
    visor.innerHTML = `
        <button type="button" class="visor-cerrar" aria-label="Cerrar">${icono("x")}</button>
        <button type="button" class="visor-nav anterior" aria-label="Foto anterior">${icono("chevron-left")}</button>
        <div class="visor-medio"></div>
        <button type="button" class="visor-nav siguiente" aria-label="Foto siguiente">${icono("chevron-right")}</button>
        <p class="visor-pie" aria-live="polite"></p>`;
    document.body.append(visor);

    const medio = visor.querySelector(".visor-medio");
    const pie = visor.querySelector(".visor-pie");
    const btnCerrar = visor.querySelector(".visor-cerrar");
    const btnAnterior = visor.querySelector(".anterior");
    const btnSiguiente = visor.querySelector(".siguiente");
    let lista = [], actual = 0, volverA = null;

    function mostrar(i) {
        if (i < 0 || i >= lista.length) return;
        actual = i;
        const f = lista[i];
        const quien = f.nombre_invitado ? `subida por ${f.nombre_invitado}` : "";
        let el;
        if (f.tipo === "video") {
            el = document.createElement("video");
            el.src = videoWeb(f);
            el.poster = imagenGrande(f);
            el.controls = el.playsInline = el.autoplay = true;
            el.setAttribute("aria-label", `Video ${i + 1} de ${lista.length}`);
        } else {
            el = document.createElement("img");
            el.src = imagenGrande(f);
            el.alt = `Foto ${i + 1} de ${lista.length}` + (quien ? `, ${quien}` : "");
            el.addEventListener("error", () => medio.replaceChildren(Object.assign(document.createElement("p"),
                { className: "visor-error", textContent: "Esta foto no se pudo cargar. Revisa tu conexión." })), { once: true });
            alCargar(el);
        }
        medio.replaceChildren(el);
        pie.textContent = `${i + 1} de ${lista.length}` + (quien ? ` · ${quien}` : "");
        btnAnterior.disabled = i === 0;
        btnSiguiente.disabled = i === lista.length - 1;
    }

    function cerrar() {
        visor.hidden = true;
        medio.replaceChildren(); // detiene un video que estuviera sonando
        document.body.style.overflow = "";
        volverA?.focus();
    }

    btnCerrar.onclick = cerrar;
    btnAnterior.onclick = () => mostrar(actual - 1);
    btnSiguiente.onclick = () => mostrar(actual + 1);
    visor.addEventListener("click", (e) => (e.target === visor || e.target === medio) && cerrar());
    document.addEventListener("keydown", (e) => {
        if (visor.hidden) return;
        if (e.key === "Escape") cerrar();
        if (e.key === "ArrowLeft") mostrar(actual - 1);
        if (e.key === "ArrowRight") mostrar(actual + 1);
        if (e.key === "Tab") { // el foco no se escapa del visor mientras está abierto
            const enfocables = [...visor.querySelectorAll("button:not(:disabled), video")];
            const primero = enfocables[0], ultimo = enfocables[enfocables.length - 1];
            if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
            else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
        }
    });
    let x0 = null;
    visor.addEventListener("touchstart", (e) => (x0 = e.touches.length === 1 ? e.touches[0].clientX : null), { passive: true });
    visor.addEventListener("touchend", (e) => {
        if (x0 === null) return; // dos dedos (zoom): no es un deslizamiento
        const dx = e.changedTouches[0].clientX - x0;
        x0 = null;
        if (Math.abs(dx) > 50) mostrar(actual + (dx < 0 ? 1 : -1));
    });
    visor.addEventListener("touchcancel", () => (x0 = null));

    return {
        abrir(l, i) {
            lista = l;
            volverA = document.activeElement;
            visor.hidden = false;
            document.body.style.overflow = "hidden";
            mostrar(i);
            btnCerrar.focus();
        },
    };
}
