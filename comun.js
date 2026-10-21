// ==========================================
// UTILIDADES COMPARTIDAS (todas las páginas)
// ==========================================

const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const parametros = new URLSearchParams(location.search);

document.querySelectorAll(".marca").forEach((el) => (el.textContent = NOMBRE_MARCA));


// ==========================================
// PLANTILLAS (los colores y tamaños viven en styles.css)
// ==========================================

const PLANTILLAS = {
    "boda-elegante": { nombre: "Boda elegante", icono: "💍", fuentes: "family=Allura&family=DM+Sans:wght@400;500;700" },
    "quince-anos":   { nombre: "Quince años",   icono: "👑", fuentes: "family=Great+Vibes&family=Poppins:wght@400;500;600" },
    "infantil":      { nombre: "Infantil",      icono: "🎈", fuentes: "family=Fredoka:wght@400;500;600;700" },
    "corporativa":   { nombre: "Corporativa",   icono: "🏢", fuentes: "family=Montserrat:wght@600;800&family=Inter:wght@400;500;600" },
    "minimalista":   { nombre: "Minimalista",   icono: "📸", fuentes: "family=Jost:wght@300;400;500;600" },
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

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?${PLANTILLAS[id].fuentes}&display=swap`;
    document.head.append(link);
    return PLANTILLAS[id];
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
                return falla(r?.error?.message || `Error ${xhr.status}`, xhr.status >= 500 || xhr.status === 429);
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
    alCargar(img);
    boton.append(img);
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
    visor.innerHTML = `
        <button class="visor-cerrar" aria-label="Cerrar">✕</button>
        <button class="visor-nav anterior" aria-label="Anterior">‹</button>
        <div class="visor-medio"></div>
        <button class="visor-nav siguiente" aria-label="Siguiente">›</button>
        <p class="visor-pie"></p>`;
    document.body.append(visor);

    const medio = visor.querySelector(".visor-medio");
    const pie = visor.querySelector(".visor-pie");
    let lista = [], actual = 0;

    function mostrar(i) {
        if (i < 0 || i >= lista.length) return;
        actual = i;
        const f = lista[i];
        let el;
        if (f.tipo === "video") {
            el = document.createElement("video");
            el.src = videoWeb(f);
            el.poster = imagenGrande(f);
            el.controls = el.playsInline = el.autoplay = true;
        } else {
            el = document.createElement("img");
            el.src = imagenGrande(f);
            el.alt = "Foto ampliada";
            alCargar(el);
        }
        medio.replaceChildren(el);
        pie.textContent = f.nombre_invitado ? `📷 ${f.nombre_invitado}` : "";
    }

    const cerrar = () => { visor.hidden = true; medio.replaceChildren(); };
    visor.querySelector(".visor-cerrar").onclick = cerrar;
    visor.querySelector(".anterior").onclick = () => mostrar(actual - 1);
    visor.querySelector(".siguiente").onclick = () => mostrar(actual + 1);
    visor.addEventListener("click", (e) => (e.target === visor || e.target === medio) && cerrar());
    document.addEventListener("keydown", (e) => {
        if (visor.hidden) return;
        if (e.key === "Escape") cerrar();
        if (e.key === "ArrowLeft") mostrar(actual - 1);
        if (e.key === "ArrowRight") mostrar(actual + 1);
    });
    let x0 = null;
    visor.addEventListener("touchstart", (e) => (x0 = e.touches[0].clientX), { passive: true });
    visor.addEventListener("touchend", (e) => {
        const dx = e.changedTouches[0].clientX - x0;
        if (Math.abs(dx) > 50) mostrar(actual + (dx < 0 ? 1 : -1));
    });

    return { abrir(l, i) { lista = l; visor.hidden = false; mostrar(i); } };
}
