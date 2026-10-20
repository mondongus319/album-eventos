// ==========================================
// CREAR CLIENTE DE SUPABASE
// ==========================================

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// ==========================================
// ELEMENTOS
// ==========================================

const fotoInput =
    document.getElementById("foto");

const previewContainer =
    document.getElementById("preview-container");

const preview =
    document.getElementById("preview");

const subirFoto =
    document.getElementById("subirFoto");

const resultado =
    document.getElementById("resultado");

const galeria =
    document.getElementById("galeria");

const contador =
    document.getElementById("contador");

const visor =
    document.getElementById("visor");

const imagenVisor =
    document.getElementById("imagenVisor");

const cerrarVisor =
    document.getElementById("cerrarVisor");
    const fotoAnterior =
    document.getElementById("fotoAnterior");

const fotoSiguiente =
    document.getElementById("fotoSiguiente");


// ==========================================
// SELECCIONAR FOTO
// ==========================================

fotoInput.addEventListener(
    "change",
    () => {

        const archivo =
            fotoInput.files[0];

        if (!archivo) {

            previewContainer
                .classList
                .remove("visible");

            return;
        }


        // Crear vista previa

        const url =
            URL.createObjectURL(archivo);

        preview.src = url;


        previewContainer
            .classList
            .add("visible");


        resultado.textContent =
            "Foto lista para compartir.";
    }
);


// ==========================================
// SUBIR FOTO
// ==========================================

subirFoto.addEventListener(
    "click",
    async () => {

        const archivo =
            fotoInput.files[0];


        if (!archivo) {

            resultado.textContent =
                "Primero selecciona una foto.";

            return;
        }


        // Desactivar botón

        subirFoto.disabled = true;

        resultado.textContent =
            "Compartiendo foto...";


        // Nombre único

        const nombreArchivo =
            `${Date.now()}-${archivo.name}`;


        try {

            const {
                data,
                error
            } = await supabaseClient
                .storage
                .from("fotos")
                .upload(
                    nombreArchivo,
                    archivo
                );


            if (error) {

                console.error(
                    "Error de Supabase:",
                    error
                );

                resultado.textContent =
                    "No se pudo subir la foto.";

                subirFoto.disabled = false;

                return;
            }


            console.log(
                "Foto subida:",
                data
            );


            resultado.textContent =
                "¡Foto compartida! ❤️";


            // Limpiar

            fotoInput.value = "";

            preview.src = "";

            previewContainer
                .classList
                .remove("visible");


            // Actualizar galería

            cargarGaleria();


        } catch (error) {

            console.error(
                "Error:",
                error
            );

            resultado.textContent =
                "Ocurrió un error al compartir la foto.";

        }


        subirFoto.disabled = false;

    }
);
// ==========================================
// NAVEGACIÓN DEL VISOR
// ==========================================

let fotosGaleria = [];

let fotoActual = 0;


function mostrarFoto(indice) {

    if (
        indice < 0 ||
        indice >= fotosGaleria.length
    ) {
        return;
    }

    fotoActual = indice;

    imagenVisor.src =
        fotosGaleria[fotoActual];

}


// FOTO ANTERIOR

fotoAnterior.addEventListener(
    "click",
    (evento) => {

        evento.stopPropagation();

        if (fotoActual > 0) {

            mostrarFoto(
                fotoActual - 1
            );

        }

    }
);


// FOTO SIGUIENTE

fotoSiguiente.addEventListener(
    "click",
    (evento) => {

        evento.stopPropagation();

        if (
            fotoActual <
            fotosGaleria.length - 1
        ) {

            mostrarFoto(
                fotoActual + 1
            );

        }

    }
);

// ==========================================
// CARGAR GALERÍA
// ==========================================

async function cargarGaleria() {

    galeria.innerHTML =
        fotosGaleria = [];
        "Cargando fotos...";


    try {

        const {
            data,
            error
        } = await supabaseClient
            .storage
            .from("fotos")
            .list(
                "",
                {
                    limit: 100,

                    sortBy: {
                        column: "created_at",
                        order: "desc"
                    }
                }
            );


        if (error) {

            console.error(
                "Error al cargar fotos:",
                error
            );

            galeria.innerHTML =
                "No se pudieron cargar las fotos.";

            return;
        }


        // Sin fotos

        if (
            !data ||
            data.length === 0
        ) {

            galeria.innerHTML =
                "Todavía no hay fotos.";

            contador.textContent =
                "";

            return;
        }


        // Contador

        contador.textContent =
            `${data.length} foto${data.length !== 1 ? "s" : ""}`;


        // Limpiar galería

        galeria.innerHTML = "";


        // Crear imágenes

       data.forEach(
    (archivo) => {

        const {
            data: urlData
        } =
            supabaseClient
                .storage
                .from("fotos")
                .getPublicUrl(
                    archivo.name
                );


        const imagen =
            document.createElement("img");


        imagen.src =
            urlData.publicUrl;
            const indice =
            fotosGaleria.length;

fotosGaleria.push(
    urlData.publicUrl
);


        imagen.alt =
            "Foto del álbum";


        imagen.classList.add(
            "foto-album"
        );


        // Abrir foto en pantalla completa

            imagen.addEventListener(
             "click",
             () => {

                mostrarFoto(indice);

                 visor.classList.add(
                "visible"
                 );

             }
        );


        galeria.appendChild(
            imagen
        );

    }
);


    } catch (error) {

        console.error(
            "Error:",
            error
        );

        galeria.innerHTML =
            "Ocurrió un error al cargar la galería.";
    }
}


// ==========================================
// CARGAR AL ABRIR
// ==========================================

cargarGaleria();
// ==========================================
// CERRAR VISOR
// ==========================================

cerrarVisor.addEventListener(
    "click",
    () => {

        visor.classList.remove(
            "visible"
        );

        imagenVisor.src = "";

    }
);


// Cerrar tocando fuera de la imagen

visor.addEventListener(
    "click",
    (evento) => {

        if (
            evento.target === visor
        ) {

            visor.classList.remove(
                "visible"
            );

            imagenVisor.src = "";

        }

    }
);


// Cerrar con tecla ESC

document.addEventListener(
    "keydown",
    (evento) => {

        if (
            evento.key === "Escape"
        ) {

            visor.classList.remove(
                "visible"
            );

            imagenVisor.src = "";

        }

    }
);