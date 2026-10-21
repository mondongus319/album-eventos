---
name: pynex
description: Álbumes QR para fiestas. Todas las fotos de los invitados, reunidas en un solo álbum.
colors:
  papel: "#fdfbf9"
  papel-2: "#f7efe9"
  tinta: "#171717"
  cacao: "#2b1a07"
  suave: "#6b5a4c"
  marcador: "#ff6f1e"
  siena: "#ce500a"
  siena-oscuro: "#b84508"
  foto-borde: "#ffffff"
  sticker-azul: "#3b82f6"
  sticker-rosa: "#ff66cf"
  sticker-verde: "#22c55e"
typography:
  display:
    fontFamily: "Corben, Cooper Black, Georgia, serif"
    fontSize: "clamp(30px, 9.6vw, 96px)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "normal"
  headline:
    fontFamily: "Corben, Cooper Black, Georgia, serif"
    fontSize: "clamp(36px, 5.2vw, 60px)"
    fontWeight: 700
    lineHeight: 1.08
  title:
    fontFamily: "Corben, Cooper Black, Georgia, serif"
    fontSize: "25px"
    fontWeight: 700
    lineHeight: 1.2
  body:
    fontFamily: "Geist, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Geist, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "17px"
    fontWeight: 500
    lineHeight: 1.2
  mano:
    fontFamily: "Gochi Hand, Comic Sans MS, cursive"
    fontSize: "24px"
    fontWeight: 400
    lineHeight: 1.15
  etiqueta:
    fontFamily: "Gochi Hand, Comic Sans MS, cursive"
    fontSize: "21px"
    fontWeight: 400
    lineHeight: 1
rounded:
  impresion: "4px"
  etiqueta: "8px"
  tarjeta: "12px"
  pildora: "999px"
  franja: "56px"
spacing:
  margen: "clamp(16px, 4vw, 48px)"
  ancho: "1200px"
  entre-secciones: "clamp(80px, 11vw, 136px)"
  hueco: "12px"
components:
  button-pildora:
    backgroundColor: "{colors.papel}"
    textColor: "{colors.tinta}"
    typography: "{typography.label}"
    rounded: "{rounded.pildora}"
    padding: "10px 26px"
    height: "50px"
  button-pildora-chica:
    backgroundColor: "{colors.papel}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.pildora}"
    padding: "8px 18px"
    height: "44px"
  card-paquete:
    backgroundColor: "{colors.papel}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.tarjeta}"
    padding: "28px 24px 24px"
  foto-impresion:
    backgroundColor: "{colors.foto-borde}"
    rounded: "{rounded.impresion}"
    padding: "7px 7px 30px"
  etiqueta-subida:
    backgroundColor: "{colors.foto-borde}"
    textColor: "{colors.cacao}"
    typography: "{typography.etiqueta}"
    rounded: "{rounded.etiqueta}"
    padding: "5px 12px 7px"
  nota-mano:
    textColor: "{colors.siena}"
    typography: "{typography.mano}"
  tarjeta-qr:
    backgroundColor: "{colors.foto-borde}"
    textColor: "{colors.cacao}"
    rounded: "{rounded.tarjeta}"
    padding: "18px 18px 16px"
    width: "196px"
  franja-cierre:
    backgroundColor: "{colors.marcador}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.franja}"
---

# Design System: pynex

## Overview

**Creative North Star: "El álbum de la fiesta"**

pynex se ve como la mesa donde, al día siguiente de la fiesta, se juntan las fotos de todos los invitados: papel crema, impresiones con borde blanco sujetas con cinta, una etiqueta escrita a mano con el nombre de quien la subió y un marcador naranja que subraya lo importante. La identidad viene de `referencias/estilo1.md` (un cuaderno escolar) llevada del pupitre al álbum de recuerdos. Es cálida, táctil y un poco desordenada a propósito, pero el texto y los controles siguen limpios: el desorden vive en las fotos y en las notas a mano, nunca en la lectura.

La densidad es baja. Los titulares son enormes, en Corben y en minúscula; el texto corrido va en Geist; la voz de los invitados va en Gochi Hand. Hay un solo acento, el naranja marcador, y casi todo lo demás es tinta sobre papel. Las sombras apenas se notan: la profundidad la dan el giro de las fotos, la cinta y el borde blanco de impresión.

Este sistema cubre la marca del producto pynex: la página de ventas y lo que se construya después con esta identidad. **No** cubre las cinco plantillas de evento de `styles.css` (boda-elegante, quince-anos, infantil, corporativa, minimalista), que visten las páginas del invitado, la pantalla y el anfitrión; son mundos propios de cada evento y están pendientes de rediseño, una por una, en rondas aparte. Tampoco aplica la identidad de PYNEX como estudio de desarrollo (verde neón #00FF88 sobre negro).

**Key Characteristics:**
- Papel crema y tinta carbón; un solo naranja de marcador.
- Titulares Corben en minúscula; texto en Geist; notas de invitado en Gochi Hand.
- Fotos como impresiones: borde blanco, cinta, giro leve y etiqueta "subida por …".
- Botones píldora con borde de tinta, sin relleno de color.
- Stickers de fiesta escasos y solo decorativos.
- Las fotos caen una vez al cargar y se enderezan al tocarlas.

## Colors

Papel cálido, tinta casi negra y un naranja de marcador que se usa como trazo, no como texto.

### Primary
- **Naranja marcador** (#ff6f1e): subrayado a mano del titular, barra de progreso, franja final de cierre y trazos decorativos. Contraste 2,7:1 sobre papel: nunca es color de texto.
- **Siena de nota** (#ce500a): notas escritas a mano en Gochi Hand de 24px o más (4,3:1), anillo de foco, cursor de texto y barra de desplazamiento.
- **Siena oscuro** (#b84508): texto naranja pequeño, enlaces dentro de texto e íconos de lista (5,2:1).

### Tertiary
- **Azul sticker** (#3b82f6), **Rosa sticker** (#ff66cf), **Verde sticker** (#22c55e): solo dentro de los stickers decorativos (destello, corazón, puntos de la copa), siempre con contorno de tinta de 2.5px. Nunca en texto, botones, fondos ni estados.

### Neutral
- **Papel crema** (#fdfbf9): fondo de página, relleno de las píldoras y de las tarjetas de paquete.
- **Papel de capa** (#f7efe9): bloques destacados (pantalla en vivo) y fondo de las fotos mientras cargan.
- **Tinta carbón** (#171717): texto corrido, bordes de botones, tarjetas, etiquetas y separadores; marco de la TV y del celular.
- **Cacao** (#2b1a07): titulares, logo, etiquetas "subida por …" y nombres en Corben.
- **Café suave** (#6b5a4c): texto secundario, precios "pago único", respuestas de preguntas (6,4:1 sobre papel).
- **Blanco de impresión** (#ffffff): solo el borde de las fotos, las etiquetas y la tarjeta QR; es lo que separa lo "impreso" del papel.

### Named Rules
**The Marcador No Escribe Rule.** El naranja #ff6f1e nunca va como texto (2,7:1). Las notas a mano usan #ce500a y solo a 24px o más (4,3:1); cualquier texto naranja más pequeño usa #b84508 (5,2:1).

**The Un Solo Acento Rule.** El naranja es el único color de marca. Azul, rosa y verde existen solo dentro de los stickers.

**The No Es El Estudio Rule.** El verde neón #00FF88 sobre negro es la identidad de PYNEX como estudio de desarrollo y no aparece en el producto. El nombre del producto se escribe "pynex", en minúscula y en Corben.

## Typography

**Display Font:** Corben (con Cooper Black, Georgia)
**Body Font:** Geist (con system-ui)
**Label/Mono Font:** Gochi Hand para la voz de los invitados (con Comic Sans MS, cursive)

**Character:** Corben pone el tono de fiesta, redondo y pesado; Geist mantiene todo legible y serio donde importa (precios, condiciones, botones); Gochi Hand es lo que escribiría un invitado con marcador.

### Hierarchy
- **Display** (700, clamp(30px, 9.6vw, 96px), 1.2; 1.32 a ≤720px): titular de portada, en minúscula, con la frase clave subrayada a mano en naranja.
- **Headline** (700, clamp(36px, 5.2vw, 60px), 1.08): títulos de sección en minúscula. El cierre sube a clamp(46px, 7.6vw, 96px) con 1.02.
- **Title** (700, 25–27px, 1.1–1.2): pasos, nombres de paquete, tarjeta QR (21px). El precio usa Corben 700 a 38px.
- **Body** (400, 18px, 1.5; 17px a ≤720px): texto corrido, máximo 34–36em; respuestas a 62ch. Secundario a 15–17px en café suave.
- **Label** (500, 17px, 1.2): texto de botones (16px en la píldora chica, 14px en chips), preguntas a 19px.
- **Mano** (Gochi Hand 400, 24px, 1.15): notas de invitado en siena. **Etiqueta** (Gochi Hand 400, 21px, 1; 18px a ≤720px): el nombre en "subida por …", con "subida por" en Geist 500 12px café suave.

### Named Rules
**The Corben En Minúscula Rule.** Corben solo va en minúscula y solo para display: titulares, logo, nombres y precios. Nunca en párrafos ni botones.

**The Tilde Alta Rule.** La tilde de Corben es muy alta y toca la línea de arriba si se aprieta el interlineado: el titular de portada usa 1.2, y 1.32 a ≤720px. No bajar de ahí en titulares de varias líneas con acentos.

**The Sin Pregunta Abierta Rule.** Corben no tiene el glifo «¿». No escribir preguntas abiertas en Corben; las preguntas van en Geist (como en la lista de preguntas) o se reformulan.

## Layout

Una sola columna de contenido de 1200px de ancho máximo con margen lateral fluido (clamp(16px, 4vw, 48px)), y secciones separadas por mucho aire (clamp(80px, 11vw, 136px)). Dentro de esa disciplina, las fotos rompen la cuadrícula: la mesa de portada (hasta 1320px) las coloca de forma absoluta, giradas y solapadas, con posiciones propias para celular. Los pasos van en tres columnas escalonadas en altura (0, 56px, 20px); paquetes y demos en cuatro columnas, dos a ≤1080px y una a ≤520px (paquetes). A ≤860px los pasos pasan a una columna y a ≤720px los botones de acción ocupan todo el ancho. Los huecos entre elementos van de 12px (acciones, listas) a 16px (paquetes) y 48px (separación de bloques).

## Elevation & Depth

Casi plano. Las sombras son difusas y bajas, y sirven para que una impresión se despegue del papel, no para construir capas de interfaz. La profundidad real viene del giro, la cinta, el solapamiento de las fotos y el borde blanco. Con hover o foco una foto se levanta (sombra más amplia); en reposo todo descansa sobre la mesa.

### Shadow Vocabulary
- **Tarjeta** (`box-shadow: 0 2px 20px rgba(0,0,0,0.06)`): tarjeta QR y objetos de papel.
- **Botón** (`box-shadow: 0 1px 2px rgba(0,0,0,0.25)`): píldoras y chips; con hover se suma `0 3px 10px rgba(0,0,0,0.14)`.
- **Foto** (`box-shadow: 0 2px 20px rgba(0,0,0,0.09), 0 1px 2px rgba(0,0,0,0.18)`): impresiones en reposo.
- **Foto levantada** (`box-shadow: 0 10px 34px rgba(0,0,0,0.14), 0 1px 2px rgba(0,0,0,0.18)`): impresión con hover, foco o toque.

### Named Rules
**The Sombra Casi Invisible Rule.** Ninguna sombra es dura ni desplazada. Si una sombra se nota antes que el objeto, sobra.

## Shapes

Tres familias de forma. Lo que se toca es píldora (999px). Lo que es papel de interfaz tiene esquinas suaves de 12px (paquetes, tarjeta QR, bloque de pantalla en vivo) y borde de tinta de 1.5px. Lo impreso es casi recto (4px en la impresión, 2px en la imagen) y lleva borde blanco. Las etiquetas "subida por …" tienen 8px y borde de tinta de 1px. La franja final de cierre redondea solo arriba (56px, 36px a ≤720px). La cinta adhesiva es un rectángulo crema translúcido (rgba(247,225,205,0.82)) sin esquinas, levemente girado, centrado arriba de la foto o la tarjeta.

## Components

### Buttons
Tactiles y sobrios: un óvalo dibujado con tinta sobre el papel.
- **Shape:** píldora completa (999px), borde de tinta de 1.5px.
- **Primary:** fondo papel, texto tinta, Geist 500 17px, alto mínimo 50px, relleno 10px 26px, ícono a la izquierda con 10px de separación. Las dos acciones principales (ver un ejemplo, cotizar por WhatsApp) tienen el mismo peso; no hay botón relleno de color.
- **Hover / Focus:** con puntero fino, la sombra crece suavemente; al presionar, scale(0.97) en 160ms con la curva ease-out. Foco: contorno siena de 2px separado 3px.
- **Chica:** 44px de alto, 8px 18px, 16px (cabecera). Sobre la franja naranja la píldora conserva su fondo papel.

### Chips
- **Style:** píldora blanca con borde de tinta de 1.5px, Geist 500 14px, ícono a la izquierda, sombra de botón. Se usa para nombrar un objeto ("fotos.zip"), no como filtro.

### Cards / Containers
- **Corner Style:** 12px.
- **Background:** papel (paquetes) o blanco (tarjeta QR); el bloque destacado usa papel de capa sin borde.
- **Shadow Strategy:** paquetes sin sombra; tarjeta QR con sombra de tarjeta (ver Elevation & Depth).
- **Border:** tinta 1.5px.
- **Internal Padding:** 28px 24px 24px en paquetes; la píldora de acción va al fondo, a ancho completo. Las listas de características llevan ícono siena oscuro de 20px; lo que no incluye va en café suave con el ícono al 60%.

### Navigation
- **Style:** cabecera sin barra ni fondo: logo "pynex" en Corben 700 30px cacao (26px a ≤720px) a la izquierda y una píldora chica de WhatsApp a la derecha. Sin menú.

### Foto impresión (signature)
La pieza que define el sistema. Impresión blanca con relleno 7px 7px 30px, imagen 4:3 (o 3:4 vertical), giro propio, cinta arriba y etiqueta "subida por *nombre*" que sobresale del borde inferior: caja blanca con borde de tinta 1px y radio 8px, "subida por" en Geist 12px café suave y el nombre en Gochi Hand 21px cacao. En las tarjetas de demo la etiqueta va dentro del margen inferior (46px).
- **Movimiento:** al cargar, cada foto cae una sola vez (760ms, desde −36px con giro doble y scale 1.06), escalonada cada 80ms desde 120ms. Con hover, foco o toque se endereza, sube 8px y crece a 1.04 en 320ms. La curva de todo el sistema es ease-out `cubic-bezier(0.23, 1, 0.32, 1)`.
- **Reduced motion:** sin caídas ni giros: la foto solo aparece con un fundido y no se endereza.

### Nota a mano
Texto Gochi Hand siena de 24px, levemente girado, a veces con una flecha dibujada (trazo de 2px, currentColor) hacia lo que señala. Es la voz de un invitado y aparece con un fundido de 500ms. Se esconde en celular cuando no hay espacio.

### Íconos
Lucide (ISC) en un sprite SVG inline al inicio del documento, trazo de 1.75, puntas y uniones redondeadas, 1.15em por defecto, color heredado. El logo de WhatsApp es de Simple Icons (CC0) y va con relleno. Nunca emojis.

### Stickers
Corazón rosa, destello azul y copa de papel con puntos verde y azul; contorno de tinta de 2.5px, girados, decorativos (`aria-hidden`, sin eventos de puntero). Máximo dos o tres por pantalla y se esconden cuando el espacio aprieta.

### Imágenes
Fotos de ejemplo de Unsplash enlazadas desde images.unsplash.com con recorte y calidad en la URL, acreditadas en el pie ("Fotos de ejemplo: Unsplash"). Son provisionales: se reemplazan por fotos reales de eventos.

## Do's and Don'ts

### Do:
- **Do** escribir titulares, logo y nombres en Corben 700 y en minúscula, con interlineado 1.2 en el titular de portada (1.32 a ≤720px).
- **Do** usar el naranja #ff6f1e solo como trazo, sticker, barra o franja; las notas a mano en #ce500a a 24px o más; el texto naranja pequeño en #b84508.
- **Do** presentar toda foto como impresión: borde blanco, cinta y etiqueta "subida por …" con el nombre en Gochi Hand.
- **Do** hacer los botones como píldoras de borde de tinta 1.5px con fondo papel, y dar el mismo peso a las dos acciones principales.
- **Do** usar íconos Lucide del sprite inline con trazo 1.75 y el logo de WhatsApp de Simple Icons con relleno.
- **Do** animar con la curva cubic-bezier(0.23, 1, 0.32, 1): caída escalonada una vez al cargar, enderezar con hover, foco o toque; con reduced-motion dejar solo los fundidos.
- **Do** acreditar las fotos de Unsplash en el pie mientras sean de ejemplo.

### Don't:
- **Don't** poner el naranja #ff6f1e como color de texto (2,7:1).
- **Don't** rellenar botones con color de marca ni usar botones sólidos naranjas.
- **Don't** escribir preguntas abiertas («¿») en Corben: la fuente no tiene ese glifo.
- **Don't** usar azul, rosa o verde fuera de los stickers decorativos.
- **Don't** usar emojis como íconos ni como decoración.
- **Don't** usar el verde neón #00FF88 ni el fondo negro del estudio PYNEX en el producto.
- **Don't** tomar las plantillas de evento de `styles.css` como referencia de este sistema; están fuera de alcance y pendientes de rediseño.
- **Don't** usar sombras duras o desplazadas; toda sombra es difusa y baja.
