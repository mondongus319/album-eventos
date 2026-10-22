---
name: PYNEX
description: Álbumes QR para fiestas. Todas las fotos de los invitados, reunidas en un solo álbum.
colors:
  papel: "#fdfbf9"
  papel-2: "#f7efe9"
  tinta: "#171717"
  cacao: "#2b1a07"
  suave: "#6b5a4c"
  lila: "#9b7fd9"
  lila-claro: "#c9b6f2"
  lila-niebla: "#f3eefb"
  lila-texto: "#6a48b0"
  dorado: "#d4af37"
  dorado-texto: "#8a6a0e"
  foto-borde: "#ffffff"
  cinta: "rgba(236, 222, 176, 0.78)"
  seleccion: "#e6dcfa"
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
  logo:
    fontFamily: "Corben, Cooper Black, Georgia, serif"
    fontSize: "28px"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.04em"
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
  banda: "40px"
  franja: "56px"
  pildora: "999px"
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
    textColor: "{colors.lila-texto}"
    typography: "{typography.mano}"
  tarjeta-qr:
    backgroundColor: "{colors.foto-borde}"
    textColor: "{colors.cacao}"
    rounded: "{rounded.tarjeta}"
    padding: "18px 18px 16px"
    width: "196px"
  banda-facil:
    backgroundColor: "{colors.lila-niebla}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.banda}"
    padding: "clamp(48px, 6vw, 84px) clamp(20px, 5vw, 64px) clamp(40px, 5vw, 64px)"
  num-paso:
    backgroundColor: "{colors.papel}"
    textColor: "{colors.lila-texto}"
    rounded: "{rounded.pildora}"
    size: "38px"
  franja-cierre:
    backgroundColor: "{colors.lila-claro}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.franja}"
---

# Design System: PYNEX

## Overview

**Creative North Star: "El álbum de la fiesta"**

PYNEX se ve como la mesa donde, al día siguiente de la fiesta, se juntan las fotos de todos los invitados: papel crema, impresiones con borde blanco sujetas con cinta, una etiqueta escrita a mano con el nombre de quien la subió, un trazo dorado que subraya lo importante y la voz lila de los invitados. La identidad viene de `referencias/estilo1.md` (un cuaderno escolar) llevada del pupitre al álbum de recuerdos. Es cálida, táctil y un poco desordenada a propósito, pero el texto y los controles siguen limpios: el desorden vive en las fotos y en las notas a mano, nunca en la lectura.

La densidad es baja. Los titulares son enormes, en Corben y en mayúscula inicial; el texto corrido va en Geist; la voz de los invitados va en Gochi Hand. El acento es una pareja: lila para la voz y los trazos, dorado para los brillos y las líneas; casi todo lo demás es tinta sobre papel. Las sombras apenas se notan: la profundidad la dan el giro de las fotos, la cinta y el borde blanco de impresión.

Este sistema cubre la marca del producto PYNEX: la página de ventas y lo que se construya después con esta identidad. Las cinco plantillas de evento de `styles.css` (boda-elegante, quince-anos, infantil, corporativa, minimalista), que visten las páginas del invitado, la pantalla y el anfitrión, son mundos propios de cada evento y no siguen esta marca; se documentan aparte en "Plantillas de evento". La de boda ("La hora loca") ya está rediseñada; las otras cuatro siguen pendientes, una por una, en rondas aparte. Tampoco aplica la identidad de PYNEX como estudio de desarrollo (verde neón #00FF88 sobre negro).

**Key Characteristics:**
- Papel crema y tinta carbón; acento en pareja: lila para la voz, dorado para el brillo.
- Titulares Corben en mayúscula inicial; nombre PYNEX en mayúsculas; texto en Geist; notas de invitado en Gochi Hand.
- Fotos como impresiones: borde blanco, cinta, giro leve y etiqueta "Subida por …".
- Botones píldora con borde de tinta, sin relleno de color.
- Banda lila "Así de fácil" con pasos numerados a mano y flechas doradas punteadas.
- Stickers de fiesta escasos y solo decorativos.
- Las fotos caen una vez al cargar y se enderezan al tocarlas.

## Colors

Papel cálido y tinta casi negra, con un lila que habla y un dorado que brilla; ninguno de los dos tonos vivos se usa como texto.

### Primary
- **Lila de trazo** (#9b7fd9): trazos, stickers (corazón, puntos de la copa) y la barra de progreso del celular. Contraste 3,2:1 sobre papel: nunca es color de texto.
- **Lila de voz** (#6a48b0): notas escritas a mano, enlaces, anillo de foco, cursor de texto, barra de desplazamiento, número y borde de los pasos. 6,4:1 sobre papel y 5,8:1 sobre la banda lila.
- **Lila claro** (#c9b6f2): fondo de la franja final de cierre, con tinta encima a 9,8:1.
- **Niebla lila** (#f3eefb): fondo de la banda "Así de fácil".
- **Selección** (#e6dcfa): fondo del texto seleccionado, con cacao encima.

### Secondary
- **Dorado de brillo** (#d4af37): subrayado a mano del titular, destellos, punto de la copa y la línea punteada del aviso de plazo. 2:1 sobre papel: nunca es color de texto. Las flechas punteadas entre pasos usan hoy un dorado más hondo (#b8952a) incrustado en el SVG.
- **Dorado de ícono** (#8a6a0e): íconos de los pasos y de las listas de paquetes, y cualquier texto dorado pequeño (4,9:1).

### Neutral
- **Papel crema** (#fdfbf9): fondo de página, relleno de las píldoras, de las tarjetas de paquete y del círculo de los pasos.
- **Papel de capa** (#f7efe9): bloque destacado (pantalla en vivo) y fondo de las fotos mientras cargan.
- **Tinta carbón** (#171717): texto corrido, bordes de botones, tarjetas, etiquetas y separadores; contorno de los stickers; marco de la TV y del celular; titular del cierre.
- **Cacao** (#2b1a07): titulares, logo, etiquetas "Subida por …" y nombres en Corben.
- **Café suave** (#6b5a4c): texto secundario, precios "pago único", respuestas de preguntas (6,4:1 sobre papel).
- **Blanco de impresión** (#ffffff): solo el borde de las fotos, las etiquetas y la tarjeta QR; es lo que separa lo "impreso" del papel.
- **Cinta** (rgba(236, 222, 176, 0.78)): la cinta adhesiva crema dorada que sujeta fotos y tarjeta QR.

### Named Rules
**The Lila Y Dorado No Escriben Rule.** El lila #9b7fd9 (3,2:1) y el dorado #d4af37 (2:1) nunca van como texto. El texto lila usa #6a48b0; el texto o ícono dorado pequeño usa #8a6a0e.

**The Pareja De Acento Rule.** Hay dos acentos y cada uno tiene su oficio: lila para la voz y los trazos (notas, enlaces, foco, pasos, superficies de banda y cierre), dorado para los brillos y las líneas (subrayado, destellos, flechas, línea de plazo, íconos). No se intercambian ni se suma un tercer color.

**The No Es El Estudio Rule.** El verde neón #00FF88 sobre negro es la identidad de PYNEX como estudio de desarrollo y no aparece en el producto.

## Typography

**Display Font:** Corben (con Cooper Black, Georgia)
**Body Font:** Geist (con system-ui)
**Label/Mono Font:** Gochi Hand para la voz de los invitados (con Comic Sans MS, cursive)

**Character:** Corben pone el tono de fiesta, redondo y pesado; Geist mantiene todo legible y serio donde importa (precios, condiciones, botones); Gochi Hand es lo que escribiría un invitado con un plumón.

### Hierarchy
- **Display** (700, clamp(30px, 9.6vw, 96px), 1.2; 1.32 a ≤720px): titular de portada en mayúscula inicial, con la frase clave subrayada a mano en dorado.
- **Headline** (700, clamp(36px, 5.2vw, 60px), 1.08): títulos de sección ("Así de fácil", "Elige tu paquete"). El cierre sube a clamp(46px, 7.6vw, 96px) con 1.02, en tinta.
- **Title** (700, 25–27px, 1.1–1.2): pasos, nombres de paquete, tarjeta QR (21px). El precio usa Corben 700 a 38px.
- **Logo** (Corben 700, 28px, 1, letter-spacing 0.04em; 26px a ≤720px, 24px en el pie): el nombre PYNEX, siempre en mayúsculas.
- **Body** (400, 18px, 1.5; 17px a ≤720px): texto corrido, máximo 34–36em; respuestas a 62ch. Secundario a 15–17px en café suave.
- **Label** (500, 17px, 1.2): texto de botones (16px en la píldora chica, 14px en chips), preguntas a 19px.
- **Mano** (Gochi Hand 400, 24px, 1.15): notas de invitado en lila de voz; los números de paso a 22px. **Etiqueta** (Gochi Hand 400, 21px, 1; 18px a ≤720px): el nombre en "Subida por …", con "Subida por" en Geist 500 12px café suave.

### Named Rules
**The Mayúscula Inicial Rule.** Titulares, botones, notas y nombres se escriben en mayúscula inicial, como una frase ("Todas las fotos de tu fiesta…", "Cotizar por WhatsApp", "Subida por Andrés"). La única palabra en mayúsculas completas es el nombre PYNEX. Corben va solo en display: titulares, logo, nombres y precios; nunca en párrafos ni botones.

**The Tilde Alta Rule.** La tilde de Corben es muy alta y toca la línea de arriba si se aprieta el interlineado: el titular de portada usa 1.2, y 1.32 a ≤720px. No bajar de ahí en titulares de varias líneas con acentos.

**The Sin Pregunta Abierta Rule.** Corben no tiene el glifo «¿». No escribir preguntas abiertas en Corben; las preguntas van en Geist (como en la lista de preguntas) o se reformulan.

## Layout

Una sola columna de contenido de 1200px de ancho máximo con margen lateral fluido (clamp(16px, 4vw, 48px)), y secciones separadas por mucho aire (clamp(80px, 11vw, 136px)). Dentro de esa disciplina, las fotos rompen la cuadrícula: la mesa de portada (hasta 1320px) las coloca de forma absoluta, giradas y solapadas, con posiciones propias para celular. La banda "Así de fácil" es la única sección con fondo: se separa del margen de página y lleva relleno propio (clamp(48px, 6vw, 84px) arriba, clamp(20px, 5vw, 64px) a los lados). Sus pasos van en tres columnas escalonadas en altura (0, 56px, 20px) con huecos de clamp(40px, 4vw, 48px), unidas por flechas solo a ≥861px; a ≤860px pasan a una columna de 520px y a ≤720px pierden el escalón. Paquetes y demos van en cuatro columnas, dos a ≤1080px y una a ≤520px (paquetes). A ≤720px los botones de acción ocupan todo el ancho. Los huecos entre elementos van de 12px (acciones, listas) a 16px (paquetes) y 48px (separación de bloques).

## Elevation & Depth

Casi plano. Las sombras son difusas y bajas, y sirven para que una impresión se despegue del papel, no para construir capas de interfaz. La profundidad real viene del giro, la cinta, el solapamiento de las fotos y el borde blanco. Las superficies lila (banda y franja) son tonales y no llevan sombra. Con hover o foco una foto se levanta (sombra más amplia); en reposo todo descansa sobre la mesa.

### Shadow Vocabulary
- **Tarjeta** (`box-shadow: 0 2px 20px rgba(0,0,0,0.06)`): tarjeta QR y objetos de papel.
- **Botón** (`box-shadow: 0 1px 2px rgba(0,0,0,0.25)`): píldoras y chips; con hover se suma `0 3px 10px rgba(0,0,0,0.14)`.
- **Foto** (`box-shadow: 0 2px 20px rgba(0,0,0,0.09), 0 1px 2px rgba(0,0,0,0.18)`): impresiones en reposo.
- **Foto levantada** (`box-shadow: 0 10px 34px rgba(0,0,0,0.14), 0 1px 2px rgba(0,0,0,0.18)`): impresión con hover, foco o toque.

### Named Rules
**The Sombra Casi Invisible Rule.** Ninguna sombra es dura ni desplazada. Si una sombra se nota antes que el objeto, sobra.

## Shapes

Cuatro familias de forma. Lo que se toca es píldora (999px) y los números de paso son círculos. Lo que es papel de interfaz tiene esquinas suaves de 12px (paquetes, tarjeta QR, bloque de pantalla en vivo) y borde de tinta de 1.5px. Las superficies de color son blandas: la banda "Así de fácil" redondea sus cuatro esquinas a 40px y la franja final redondea solo arriba (56px, 36px a ≤720px). Lo impreso es casi recto (4px en la impresión, 2px en la imagen) y lleva borde blanco. Las etiquetas "Subida por …" tienen 8px y borde de tinta de 1px. La cinta adhesiva es un rectángulo crema dorado translúcido sin esquinas, levemente girado, centrado arriba de la foto o la tarjeta. Las líneas dibujadas en dorado (aviso de plazo, flechas entre pasos) son punteadas.

## Components

### Buttons
Tactiles y sobrios: un óvalo dibujado con tinta sobre el papel.
- **Shape:** píldora completa (999px), borde de tinta de 1.5px.
- **Primary:** fondo papel, texto tinta, Geist 500 17px, alto mínimo 50px, relleno 10px 26px, ícono a la izquierda con 10px de separación, texto en mayúscula inicial ("Ver un álbum de ejemplo", "Cotizar por WhatsApp"). Las dos acciones principales tienen el mismo peso; no hay botón relleno de color.
- **Hover / Focus:** con puntero fino, la sombra crece suavemente; al presionar, scale(0.97) en 160ms con la curva ease-out. Foco: contorno lila de voz de 2px separado 3px.
- **Chica:** 44px de alto, 8px 18px, 16px (cabecera). Sobre la franja lila claro la píldora conserva su fondo papel.

### Chips
- **Style:** píldora blanca con borde de tinta de 1.5px, Geist 500 14px, ícono a la izquierda, sombra de botón. Se usa para nombrar un objeto ("fotos.zip"), no como filtro.

### Cards / Containers
- **Corner Style:** 12px.
- **Background:** papel (paquetes) o blanco (tarjeta QR); el bloque destacado usa papel de capa sin borde.
- **Shadow Strategy:** paquetes sin sombra; tarjeta QR con sombra de tarjeta (ver Elevation & Depth).
- **Border:** tinta 1.5px.
- **Internal Padding:** 28px 24px 24px en paquetes; la píldora de acción va al fondo, a ancho completo. Las listas de características llevan ícono dorado de ícono de 20px; lo que no incluye va en café suave con el ícono al 60%.

### Navigation
- **Style:** cabecera sin barra ni fondo: logo PYNEX en Corben 700 28px cacao con 0.04em de espaciado (26px a ≤720px) a la izquierda y una píldora chica de WhatsApp a la derecha. Sin menú.

### Foto impresión (signature)
La pieza que define el sistema. Impresión blanca con relleno 7px 7px 30px, imagen 4:3 (o 3:4 vertical), giro propio, cinta arriba y etiqueta "Subida por *Nombre*" que sobresale del borde inferior: caja blanca con borde de tinta 1px y radio 8px, "Subida por" en Geist 12px café suave y el nombre en Gochi Hand 21px cacao. En las tarjetas de demo la etiqueta va dentro del margen inferior (46px).
- **Movimiento:** al cargar, cada foto cae una sola vez (760ms, desde −36px con giro doble y scale 1.06), escalonada cada 80ms desde 120ms. Con hover, foco o toque se endereza, sube 8px y crece a 1.04 en 320ms. La curva de todo el sistema es ease-out `cubic-bezier(0.23, 1, 0.32, 1)`.
- **Reduced motion:** sin caídas ni giros: la foto solo aparece con un fundido y no se endereza.

### Banda "Así de fácil"
La explicación del servicio como una hoja lila puesta sobre la mesa.
- **Superficie:** fondo niebla lila, radio de 40px en las cuatro esquinas, sin borde ni sombra.
- **Pasos:** cada título de paso abre con un número escrito a mano dentro de un círculo de 38px: fondo papel, borde lila de voz de 1.5px, Gochi Hand 22px en lila de voz. El ícono del paso va en dorado de ícono a 24px.
- **Flechas:** a ≥861px, una flecha dorada punteada (trazo 2.2px, guiones 5/6) une cada paso con el siguiente; la segunda se invierte en vertical. Por debajo de 861px no hay flechas.
- **Stickers:** un destello dorado que asoma por el borde superior derecho y un corazón lila por el borde inferior izquierdo.
- **Aviso de plazo:** cierra la banda con Geist 19px, separado por una línea superior dorada punteada de 1.5px y 28px de aire; lo importante va en Geist 600 cacao.

### Nota a mano
Texto Gochi Hand en lila de voz de 24px, levemente girado, a veces con una flecha dibujada (trazo de 2px, currentColor) hacia lo que señala, en mayúscula inicial ("Cada foto dice quién la subió"). Es la voz de un invitado y aparece con un fundido de 500ms. Se esconde en celular cuando no hay espacio.

### Íconos
Lucide (ISC) en un sprite SVG inline al inicio del documento, trazo de 1.75, puntas y uniones redondeadas, 1.15em por defecto, color heredado. El logo de WhatsApp es de Simple Icons (CC0) y va con relleno. Nunca emojis.

### Stickers
Corazón lila, destello dorado y copa de papel con un punto lila y uno dorado; contorno de tinta de 2.5px, girados, decorativos (`aria-hidden`, sin eventos de puntero). Máximo dos o tres por pantalla y se esconden cuando el espacio aprieta.

### Imágenes
Fotos de ejemplo de Unsplash enlazadas desde images.unsplash.com con recorte y calidad en la URL, acreditadas en el pie ("Fotos de ejemplo: Unsplash"). Son provisionales: se reemplazan por fotos reales de eventos.

## Do's and Don'ts

### Do:
- **Do** escribir titulares, botones, notas y nombres en mayúscula inicial, y el nombre PYNEX en mayúsculas (Corben 700, 28px, 0.04em).
- **Do** usar Corben 700 solo para display, con interlineado 1.2 en el titular de portada (1.32 a ≤720px).
- **Do** usar el lila #9b7fd9 y el dorado #d4af37 solo como trazo, sticker, barra o línea; el texto lila en #6a48b0 y los íconos o textos dorados pequeños en #8a6a0e.
- **Do** repartir el acento por oficio: lila para la voz, los enlaces, el foco y las superficies; dorado para el subrayado, los destellos, las flechas y las líneas punteadas.
- **Do** presentar toda foto como impresión: borde blanco, cinta y etiqueta "Subida por …" con el nombre en Gochi Hand.
- **Do** hacer los botones como píldoras de borde de tinta 1.5px con fondo papel, y dar el mismo peso a las dos acciones principales.
- **Do** usar íconos Lucide del sprite inline con trazo 1.75 y el logo de WhatsApp de Simple Icons con relleno.
- **Do** animar con la curva cubic-bezier(0.23, 1, 0.32, 1): caída escalonada una vez al cargar, enderezar con hover, foco o toque; con reduced-motion dejar solo los fundidos.
- **Do** acreditar las fotos de Unsplash en el pie mientras sean de ejemplo.

### Don't:
- **Don't** poner el lila #9b7fd9 (3,2:1) ni el dorado #d4af37 (2:1) como color de texto.
- **Don't** escribir titulares, botones o notas sin mayúscula inicial ni todo en mayúsculas; las mayúsculas completas son solo para PYNEX.
- **Don't** rellenar botones con color de marca ni usar botones sólidos lila o dorados.
- **Don't** escribir preguntas abiertas («¿») en Corben: la fuente no tiene ese glifo.
- **Don't** sumar un tercer color de acento ni intercambiar los oficios del lila y el dorado.
- **Don't** usar emojis como íconos ni como decoración.
- **Don't** usar el verde neón #00FF88 ni el fondo negro del estudio PYNEX en el producto.
- **Don't** tomar las plantillas de evento de `styles.css` como referencia de la marca PYNEX, ni aplicar la marca a las plantillas; cada plantilla sigue su propio mundo (ver "Plantillas de evento").
- **Don't** usar sombras duras o desplazadas; toda sombra es difusa y baja.

## Plantillas de evento

Las plantillas visten las páginas del invitado (`/e/`), la pantalla en vivo y el panel del anfitrión. Cada una es un mundo propio del evento y no toma nada de la marca PYNEX: las reglas de las secciones anteriores (pareja lila y dorado, mayúscula inicial, Corben, impresiones con cinta, sombras casi invisibles) no aplican aquí. Una plantilla solo define variables (`--primario`, `--secundario`, `--fondo`, `--tarjeta`, `--texto`, `--suave`, `--f-titulo`, `--f-cuerpo`, `--peso-titulo`, `--tam-titulo`, `--radio`) y las reglas que solo ella dibuja, bajo `[data-plantilla="…"]` en `styles.css`; sus fuentes se cargan desde `PLANTILLAS` en `comun.js`. El administrador elige la plantilla y puede cambiar sus colores, así que ninguna plantilla puede depender de que el color del cliente sea legible.

### Estructura común
La misma para las cinco plantillas; cada plantilla cambia el aspecto, nunca la estructura.
- **Portada compacta:** nombre, fecha y mensaje centrados, con 26vh de alto mínimo (38vh con imagen de portada, que lleva un velo oscuro encima), para que la galería empiece sin hacer scroll.
- **Botón "Subir fotos" fijo en la zona del pulgar:** una barra fija abajo que funde el fondo hacia transparente y respeta el margen seguro del teléfono (`.accion-fija`). El botón es una píldora de 520px de ancho máximo (`.boton-subir`) y el avance de la subida vive dentro: un relleno del color de su texto al 18% que crece de izquierda a derecha (`.relleno-avance`, 250ms lineal).
- **El nombre se pide en un diálogo:** la primera vez que se toca "Subir fotos" aparece un diálogo modal centrado (`.dialogo`: hasta 420px, radio de la plantilla, fondo de tarjeta, velo negro al 45%). Nunca una tarjeta que bloquea la página.
- **Línea de consentimiento tenue:** texto de 13px en el color suave, centrado a 560px (`.linea-subida`). Informa sin competir con el botón.
- **Galería tipo álbum:** filas que respetan la proporción de cada foto. Cada miniatura recibe su ancho/alto en `--a` y crece dentro de la fila desde una base de `--a × 96px` en celular y `--a × 190px` desde 600px, con huecos de 6px; la última fila no se estira. Separadores `.momento` por cada hora de la noche, en hora de Colombia (America/Bogota), a todo el ancho, con una línea que llena el resto de la fila. Cada foto lleva abajo la etiqueta "quién" (el nombre de quien la subió) en 11px blanco sobre un degradado negro al 60%. La foto propia lleva contorno de 3px; la recién subida entra marcada en su lugar.
- **Texto automático legible sobre el color del cliente:** `ajustarContraste` en `comun.js` calcula `--sobre-primario` (blanco o #1a1a1a, el que más contraste dé; es el texto de los botones) y `--primario-texto` (el primario corregido hasta 4,5:1 sobre el fondo y la tarjeta; títulos, enlaces y foco). En fondos claros lo oscurece; en fondos oscuros (luminancia del fondo < 0,2) lo aclara.
- **Movimiento común:** al tocar, scale(0.97) en 160ms ease-out (`cubic-bezier(0.23, 1, 0.32, 1)`); las fotos aparecen con un fundido de 300ms. Con reduced-motion se quitan escalas y desplazamientos y quedan los fundidos.

### La hora loca (boda)
Id interno `boda-elegante`, nombre visible "Boda · La hora loca". El álbum de la boda es la pista a medianoche durante la hora loca: noche morada, nombres en tubo de neón, confeti y fotos que entran como el flash de una cámara desechable. Rechaza el marfil, la cursiva caligráfica y el dorado discreto de toda boda. Es una plantilla oscura (`color-scheme: dark`): color solo en lo vivo (botón, nombres, foto recién llegada) y todo lo demás es noche.

**Colores**
- **Noche morada** (#120a24, `--fondo`): fondo de página, de portada y de los campos de texto.
- **Tarjeta de pista** (#1d1236, `--tarjeta`): tarjetas y diálogo, con borde blanco al 8% y sin sombra. Las miniaturas mientras cargan usan un morado intermedio (#241843).
- **Texto de neón blanco** (#f7f2ff, `--texto`): texto corrido, títulos de sección y enlaces.
- **Lavanda suave** (#b9aed6, `--suave`): texto secundario y línea de consentimiento (más de 9:1 sobre la noche).
- **Dorado LED** (#ffd23f, `--primario`): el botón de subir y su flujo.
- **Fucsia neón** (#ff3ea5, `--secundario`): el halo de los nombres de los novios.
- **Cian** (#3df2e0, `--acento`): separadores de momento, con su línea al 35%.
- **Naranja de hora** (#ff9d3a, `--hora`): la hora impresa en cada foto, los avisos y el texto de la pantalla en vivo.

**Tipografía**
- **Neonderthaw** (400, cursive): solo los nombres de los novios, en portada (clamp(68px, 19vw, 128px), interlineado 1.05) y en la pantalla en vivo. Letra #fff4fb con halo de neón en cuatro capas (`0 0 3px #fff, 0 0 10px, 0 0 24px, 0 0 48px` en fucsia).
- **Tilt Neon** (400): títulos de sección, con 0.02em; el título de la galería a 1.6em.
- **Figtree** (400, 500, 700): texto, campos y botones.
- **Share Tech Mono**: todo lo que es dato de la noche. Fecha de portada (14px, 0.28em, mayúsculas, dorado), separadores de momento (13px, 0.22em, mayúsculas, cian, abiertos con una raya "—"), hora impresa (13px) y texto de la pantalla en vivo (0.08em, naranja).

**Reglas**

**The Fucsia Solo En Los Nombres Rule.** El fucsia #ff3ea5 es el tubo de neón de los nombres de los novios, en portada y en la pantalla en vivo. Fuera de eso solo marca la foto propia del invitado (contorno y brillo `0 0 16px rgba(255, 62, 165, 0.55)`); no va en títulos, botones ni fondos.

**The Dorado Es Para Subir Rule.** El dorado LED #ffd23f es el botón de subir y su flujo: el botón con halo de pulsera LED (`0 0 22px rgba(255, 210, 63, 0.45), 0 6px 18px rgba(0, 0, 0, 0.4)`), los botones del diálogo del nombre y el avance. El build también lo usa en la fecha mono de la portada y en el anillo de foco (vía `--primario-texto`). Nada más es dorado.

**The Enlaces En Texto Rule.** Los enlaces y los botones de texto van en el color del texto (#f7f2ff), subrayados; nunca dorados, para que el dorado siga significando "subir".

**The Aviso En Naranja Rule.** Los avisos usan el naranja de la hora: fondo al 10%, borde de 1px al 45% y texto naranja claro (#ffcf9e).

**The Hora Impresa Rule.** Cada foto lleva su hora (HH:MM, 24 horas, hora de Colombia) abajo a la derecha, a 8px y 6px del borde, en Share Tech Mono 13px naranja, con un halo oscuro neutro (`0 0 2px #000, 0 0 4px #000, 0 1px 2px #000`) que la hace legible sobre cualquier foto. El halo es siempre negro, nunca de color; la etiqueta "quién" reserva 58px a la derecha para no chocar con la hora.

**Confeti.** Tiras y puntos de papel dibujados en SVG inline (rectángulos de esquina apenas redondeada, girados, y círculos) en dorado, cian y fucsia, en dos capas de mosaico (140×150px, y 190×204px desplazada 70px 64px) a opacidad 0.55, solo en la portada: encima de la imagen y debajo del texto, sin eventos de puntero. Una máscara radial (elipse de 58% × 52% centrada en 50% 56%, transparente hasta el 62% y llena desde el 86%) deja libre el centro, donde van los nombres, la fecha y el saludo. Con imagen de portada, el velo es morado (de rgba(18, 10, 36, 0.35) a 0.85), no negro.

**Movimiento.** Una sola gravedad para todo lo que cae, con la curva ease-out del sistema.
- El confeti cae una sola vez al llegar: 1400ms desde −28px con fundido.
- El neón se enciende con un parpadeo único: 1100ms en pasos secos, tras 300ms de espera; no se repite.
- La foto nueva entra como el flash de una cámara: 700ms desde brightness(3.2) y saturate(0) hasta su color.
- Con reduced-motion todo se anula: el confeti solo aparece con un fundido, los nombres no parpadean y la foto nueva no destella.

**Profundidad y forma.** Plana: la profundidad es luz, no sombra. Los halos (nombres, botón LED, foto propia) reemplazan a las sombras; la única sombra oscura es la que despega el botón de subir. Tarjetas y diálogo con radio de 18px; miniaturas con 6px en todos los tamaños.

**Do / Don't de La hora loca**
- **Do** dejar el color para lo vivo: dorado para subir, fucsia para los nombres, cian para los momentos, naranja para la hora y los avisos.
- **Do** usar Share Tech Mono para todo dato de la noche (fecha, momentos, horas).
- **Don't** repetir el confeti fuera de la portada ni taparle el centro al texto.
- **Don't** poner halos de color detrás de la hora impresa ni hacer parpadear el neón más de una vez.

### Plantillas pendientes
Quince años (`quince-anos`), infantil (`infantil`), corporativa (`corporativa`) y minimalista (`minimalista`) siguen pendientes de rediseño, cada una con su propia ronda de dirección, en ese orden y a partir de cosas reales de cada fiesta en Colombia. Sus variables actuales en `styles.css` son provisionales: no son referencia de diseño, y ninguna hereda el mundo de La hora loca.
