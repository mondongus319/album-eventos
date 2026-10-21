# Pruebas manuales de punta a punta

Haz estas pruebas después de terminar `LEEME.md`. Marca cada casilla.
`<slug>` es el slug del evento de prueba (aparece en el admin, ej. `prueba-ana-k3x9`).

## 0. Página de ventas
- [ ] Abre `https://album-eventos.pages.dev/`: se ven los 4 paquetes con precios (vienen de la tabla `paquetes`).
- [ ] Los botones de WhatsApp abren un chat con tu número y un mensaje escrito.
- [ ] Las 4 demos abren y muestran fotos. `/terminos.html` abre.

## 1. Crear evento
- [ ] Entra a `/admin/` con tu usuario. Un usuario que no está en `admins` debe ver *“Este usuario no es administrador”*.
- [ ] Crea un evento: nombre `Prueba`, fecha **hoy**, paquete **Esencial**, plantilla cualquiera, una portada y tu WhatsApp.
- [ ] Aparecen los 3 enlaces (invitado, pantalla, anfitrión), el QR y el botón **WhatsApp** con el mensaje listo.
- [ ] **Descargar tarjetas QR** baja un PDF con 6 tarjetas; imprime una y escanéala con el celular: abre la página del invitado.

## 2. Subir 20 fotos desde el celular
- [ ] Escanea el QR. Se ven la portada, colores y letra de la plantilla.
- [ ] Pide el nombre una sola vez (recarga la página: ya no lo pide).
- [ ] **Subir fotos** → elige 20 fotos a la vez. La barra de abajo muestra el avance y puedes seguir bajando por la galería.
- [ ] Al terminar dice *“✓ 20 archivos compartidos”* y las fotos aparecen arriba en la galería.
- [ ] En Cloudinary → *Media Library* → carpeta `eventos/<slug>`: están las 20 fotos, cada una de ~1 MB o menos,
      y su *Public ID* empieza por `eventos/<slug>/`.
- [ ] **Red inestable:** activa modo avión a mitad de una subida y desactívalo: la subida continúa sola.
- [ ] **Videos (Esencial):** un video de más de 30 s se rechaza con un mensaje claro; uno corto sube.
- [ ] Toca una foto: se abre en grande; desliza para pasar a la siguiente.
- [ ] Con más de 60 fotos, al bajar se cargan más solas.

## 3. Pantalla en vivo
- [ ] Con un evento **Celebración / Boda / Empresarial**, abre el enlace de pantalla en un computador o TV y toca para pantalla completa.
- [ ] Rota las fotos con transición suave; abajo a la derecha se ven el QR y *“Hecho con <marca>”*.
- [ ] Sube una foto desde el celular: aparece en la pantalla en menos de ~10 s, sin recargar.
- [ ] Con un evento **Esencial**, la pantalla dice que no está incluida en el paquete.

## 4. Ocultar una foto
- [ ] Abre el enlace del anfitrión. Se ve la fecha límite, la cuenta regresiva y *“Después de esta fecha tus fotos se borran para siempre”*.
- [ ] Toca **Ocultar** en una foto. Recarga la página del invitado: esa foto ya no aparece. En la pantalla en vivo desaparece en máximo 1 minuto.
- [ ] Toca **Mostrar**: vuelve a aparecer.
- [ ] Cambia una letra del token en la URL del anfitrión: debe decir *“Enlace no válido”*.

## 5. Descargar el ZIP
- [ ] En el panel del anfitrión: **Preparar descarga** → **Descargar** en la parte 1.
- [ ] El ZIP trae las fotos en calidad original con nombres como `0001-Ana.jpg`. Ábrelo en el celular y en el computador.
- [ ] (Opcional) Con más de 200 archivos aparecen varias partes de 200.

## 6. Cierre de subidas
- [ ] En el SQL Editor:
  ```sql
  update eventos set subidas_hasta = now() - interval '1 minute' where slug = '<slug>';
  ```
- [ ] Recarga la página del invitado: dice *“Las subidas están cerradas”* y la galería sigue visible.
- [ ] **Correr limpieza ahora** en el admin: el evento pasa a estado `descarga`.

## 7. Vencimiento y borrado total
1. Anota cuántas fotos hay: en Cloudinary, carpeta `eventos/<slug>`.
2. Fuerza el vencimiento (o usa el botón **Borrar ahora** del admin, que hace lo mismo):
   ```sql
   update eventos set expira_en = now() - interval '1 day' where slug = '<slug>';
   ```
3. Corre la limpieza a mano: en `/admin/` → **Correr limpieza ahora**. O desde el SQL Editor (igual que pg_cron):
   ```sql
   select net.http_post(
     url := 'https://lodnwrnxrthjnwdvopak.supabase.co/functions/v1/limpiar-eventos',
     headers := jsonb_build_object('Content-Type','application/json',
       'x-cron-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'cron_secret')),
     body := '{}'::jsonb);
   ```
4. Comprueba que **no queda nada**:
   - [ ] Cloudinary → *Media Library*: la carpeta `eventos/<slug>` ya no existe (busca `<slug>`: 0 resultados, también en *Videos*).
   - [ ] Supabase:
     ```sql
     select count(*) from eventos where slug = '<slug>';                         -- 0
     select count(*) from fotos where cloudinary_public_id like 'eventos/<slug>/%'; -- 0
     select * from registro_eventos where evento_slug = '<slug>';                -- 1 fila (contabilidad)
     select * from log_limpieza order by id desc limit 5;                        -- 'borrado' con archivos_cloudinary = los que anotaste
     ```
   - [ ] Los enlaces de invitado y anfitrión ahora dicen *“no disponible”*.

## 8. Si Cloudinary falla, no se borra nada
- [ ] En Supabase → Edge Functions → Secrets, cambia `CLOUDINARY_API_SECRET` por un valor malo.
- [ ] Crea un evento, sube 1 foto, fuérzalo a vencer (paso 7.2) y corre la limpieza.
- [ ] `log_limpieza` muestra un `error` de Cloudinary y el evento **sigue** en `eventos` con estado `vencido` (invisible para invitados).
- [ ] Vuelve a poner el secret correcto y corre la limpieza: ahora sí se borra todo.

## 9. Avisos
- [ ] Pon un evento a vencer en 7 días:
  ```sql
  update eventos set expira_en = now() + interval '7 days' where slug = '<slug>';
  ```
- [ ] En `/admin/` aparece en **Avisar hoy**; el botón abre WhatsApp con el mensaje y el enlace del anfitrión.

## 10. Seguridad rápida
- [ ] Sin el secreto, la función responde 401:
  ```bash
  curl -X POST https://lodnwrnxrthjnwdvopak.supabase.co/functions/v1/limpiar-eventos
  ```
- [ ] En el navegador, en la página del invitado, abre la consola (F12) y corre:
  `await sb.from("eventos").select("*")` → debe devolver `[]` (los invitados no leen la tabla de eventos ni tokens).
- [ ] Busca en GitHub tu API Secret de Cloudinary: no debe aparecer en ningún archivo.
