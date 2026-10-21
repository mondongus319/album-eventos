// ==========================================
// PANTALLA EN VIVO: /pantalla/?s=<slug>
// Muestra primero las fotos nuevas (Supabase Realtime) y luego rota todas.
// ==========================================

const $ = (id) => document.getElementById(id);
const slug = parametros.get("s");
const SEGUNDOS_POR_FOTO = 7;

let ev = null;
let lista = [];      // fotos visibles, de la más nueva a la más vieja
let nuevas = [];     // llegaron por tiempo real y aún no se han mostrado
let indice = 0;
let capaVisible = $("capaA"), capaOculta = $("capaB");


async function iniciar() {
    const { data } = slug ? await sb.rpc("evento_publico", { p_slug: slug }) : { data: null };
    if (!data) return aviso("Álbum no encontrado", "Revisa el enlace.");
    ev = data;
    aplicarPlantilla(ev);
    document.title = `${ev.nombre} · en vivo`;
    if (!ev.pantalla_vivo) return aviso(ev.nombre, "La pantalla en vivo no está incluida en el paquete de este evento.");

    const qr = qrCanvas(enlacesEvento(slug).invitado, 400).toDataURL();
    $("qr").src = $("qrGrande").src = qr;
    $("titulo").textContent = $("tituloVacia").textContent = ev.nombre;

    await recargarLista();

    sb.channel(`fotos-${ev.id}`)
        .on("postgres_changes",
            { event: "INSERT", schema: "public", table: "fotos", filter: `evento_id=eq.${ev.id}` },
            ({ new: f }) => { if (f.tipo === "imagen" && !f.oculta) nuevas.push(f); })
        .subscribe();

    setInterval(recargarLista, 60000); // también quita las que el anfitrión ocultó
    siguiente();
    setInterval(siguiente, SEGUNDOS_POR_FOTO * 1000);
}

function aviso(titulo, texto) {
    $("tituloVacia").textContent = titulo;
    $("textoVacia").textContent = texto;
    $("qrGrande").hidden = true;
    $("vacia").hidden = false;
    $("inicio").hidden = true;
}

async function recargarLista() {
    const { data } = await sb.from("fotos")
        .select("id,url,tipo,nombre_invitado")
        .eq("evento_id", ev.id)
        .eq("tipo", "imagen")
        .order("creado_en", { ascending: false })
        .limit(300);
    if (!data) return;
    lista = data;
    const visibles = new Set(data.map((f) => f.id));
    nuevas = nuevas.filter((f) => visibles.has(f.id));
    if (!lista.length && !nuevas.length) $("vacia").hidden = false;
}

function siguiente() {
    const f = nuevas.shift() || lista[indice++ % lista.length];
    if (!f) return;
    const img = new Image();
    img.onload = () => {
        capaOculta.src = img.src;
        capaOculta.classList.add("visible");
        capaVisible.classList.remove("visible");
        [capaVisible, capaOculta] = [capaOculta, capaVisible];
        $("autor").textContent = f.nombre_invitado ? `📷 ${f.nombre_invitado}` : "";
        $("vacia").hidden = true;
        $("info").hidden = $("qrEsquina").hidden = false;
    };
    img.src = imagenGrande(f);
}


// Pantalla completa y evitar que el televisor/portátil se apague.
async function mantenerEncendida() {
    try { await navigator.wakeLock?.request("screen"); } catch {}
}

$("inicio").addEventListener("click", () => {
    document.documentElement.requestFullscreen?.().catch(() => {});
    mantenerEncendida();
    $("inicio").hidden = true;
});
document.addEventListener("visibilitychange", () => document.visibilityState === "visible" && mantenerEncendida());

iniciar();
