// ==========================================
// PÁGINA DE VENTAS
// ==========================================

const wa = (texto) => `https://wa.me/${WHATSAPP_NEGOCIO}?text=${encodeURIComponent(texto)}`;
const icono = (id) => `<svg class="icono" aria-hidden="true"><use href="#i-${id}"/></svg>`;
const pesos = (n) => "$" + n.toLocaleString("es-CO");

document.querySelectorAll(".whatsapp").forEach((a) => (a.href = wa("Hola, quiero información del álbum QR para mi evento.")));


// QR de verdad: escanearlo abre el álbum de ejemplo
const enlaceDemo = enlacesEvento("demo-boda").invitado;
for (const id of ["qrDemo", "qrTv"]) {
    const img = new Image();
    img.src = qrCanvas(enlaceDemo, 330).toDataURL();
    img.alt = "";
    document.getElementById(id).append(img);
}


// Paquetes: precios y plazos vienen de la tabla `paquetes`
sb.from("paquetes").select("*").order("precio").then(({ data, error }) => {
    const lista = document.getElementById("paquetes");
    if (error || !data?.length) {
        lista.innerHTML = `<p class="cargando">Escríbenos por WhatsApp y te contamos los precios.</p>`;
        return;
    }

    document.getElementById("desde").textContent =
        `Pago único desde ${pesos(data[0].precio)} por evento, sin mensualidades.`;

    lista.replaceChildren(...data.map((p) => {
        const dias = (n) => `${n} día${n === 1 ? "" : "s"}`;
        const items = [
            ["calendar-clock", `Tus invitados suben fotos hasta ${dias(p.dias_subida)} después del evento`],
            ["download", `${dias(p.dias_descarga)} para descargar todo`],
            ["video", `Videos de hasta ${p.max_video_seg} s` + (p.max_videos ? ` (máx. ${p.max_videos})` : "")],
            ["tv", p.pantalla_vivo ? "Pantalla en vivo para TV o proyector" : "Sin pantalla en vivo", !p.pantalla_vivo],
            ["printer", "Tarjetas QR listas para imprimir"],
            ["folder-archive", "Descarga en ZIP, calidad original"],
        ];

        const tarjeta = document.createElement("article");
        tarjeta.className = "paquete";
        tarjeta.innerHTML = `
            <h3></h3>
            <p class="precio">${pesos(p.precio)}<span>pago único</span></p>
            <ul>${items.map(([i, texto, no]) => `<li${no ? ' class="no"' : ""}>${icono(i)}<span></span></li>`).join("")}</ul>
            <a class="pildora" target="_blank" rel="noopener">lo quiero ${icono("arrow-right")}</a>`;
        tarjeta.querySelector("h3").textContent = p.nombre.toLowerCase();
        tarjeta.querySelectorAll("li span").forEach((s, i) => (s.textContent = items[i][1]));
        tarjeta.querySelector("a").href = wa(`Hola, me interesa el paquete ${p.nombre} para mi evento.`);
        return tarjeta;
    }));
});
