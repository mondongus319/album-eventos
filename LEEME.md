# Álbum QR para eventos — guía de instalación

Plataforma para vender álbumes QR temporales (bodas, 15 años, cumpleaños, grados, empresas).
Todo corre en planes gratis: **Supabase** (base de datos, login, tiempo real, tareas programadas),
**Cloudinary** (fotos y videos) y **Cloudflare Pages** (la página web).

## Qué hay en esta carpeta

| Ruta | Qué es |
|---|---|
| `index.html` | Página de ventas |
| `e/` | Página del invitado: `/e/?s=<slug>` |
| `pantalla/` | Pantalla en vivo para TV: `/pantalla/?s=<slug>` |
| `anfitrion/` | Panel privado del cliente: `/anfitrion/?s=<slug>&t=<token>` |
| `admin/` | Tu panel: `/admin/` |
| `terminos.html` | Términos y tratamiento de datos (Ley 1581 de 2012) |
| `config.js` | Los únicos valores de configuración del sitio (todos públicos) |
| `comun.js`, `styles.css` | Código y estilos compartidos (las 5 plantillas están en `styles.css`) |
| `schema.sql` | Tablas, reglas de seguridad (RLS), funciones y tarea diaria |
| `seed.sql` | Los 4 paquetes y 4 eventos de demostración |
| `supabase/functions/limpiar-eventos/index.ts` | Borrado automático de eventos vencidos |
| `PRUEBAS.md` | Lista de pruebas manuales de punta a punta |

> **Regla de oro:** en el navegador solo van la *anon key* de Supabase, el *cloud name* y el nombre del *preset*.
> El **API Secret de Cloudinary** y la **service_role de Supabase** solo se guardan como *secrets* de la Edge Function (paso 7). Nunca en `config.js` ni en GitHub.

---

## 1. Crear las cuentas

1. **GitHub**: https://github.com/signup
2. **Supabase**: https://supabase.com → *Start your project* → entra con GitHub → *New project*.
   Elige región *South America (São Paulo)* y guarda la contraseña de la base de datos.
3. **Cloudinary**: https://cloudinary.com/users/register_free
4. **Cloudflare**: https://dash.cloudflare.com/sign-up

Ninguna pide tarjeta.

## 2. Llenar `config.js`

Abre `config.js` y revisa cada valor:

| Valor | Dónde se encuentra |
|---|---|
| `SUPABASE_URL` | Supabase → *Project Settings* → *Data API* → *Project URL* |
| `SUPABASE_ANON_KEY` | Supabase → *Project Settings* → *API Keys* → *anon public* (pestaña *Legacy API keys*) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary → *Dashboard* → *Cloud name* |
| `CLOUDINARY_UPLOAD_PRESET` | Déjalo en `eventos` (lo creas en el paso 3) |
| `WHATSAPP_NEGOCIO` | Tu número con indicativo, sin `+` ni espacios. Ej: `573001234567` |
| `NOMBRE_MARCA` | El nombre de tu negocio. Sale en el pie de página, la pantalla y las tarjetas QR |

`SUPABASE_URL`, `SUPABASE_ANON_KEY` y `CLOUDINARY_CLOUD_NAME` ya quedaron llenos con tu proyecto.
Completa también los `[completar]` de `terminos.html` (NIT o cédula, ciudad, correo).

## 3. Crear el upload preset de Cloudinary

1. Cloudinary → ícono ⚙️ *Settings* → *Upload* → *Upload presets* → **Add upload preset**.
2. **Upload preset name**: `eventos`
3. **Signing mode**: `Unsigned`
4. **Asset folder**: déjalo **vacío** (la página manda `eventos/<slug>` en cada subida).
5. **Disallow public ID**: **apagado** (obligatorio: la página define el Public ID `eventos/<slug>/<aleatorio>`
   y la limpieza borra por ese prefijo).
6. *Generated public ID* y *Generated display name*: deja lo que venga; no se usan porque la página siempre manda el Public ID.
7. En la sección de control de subida (*Upload Control* / *Advanced*):
   - **Allowed formats**: `jpg,jpeg,png,heic,webp,mp4,mov`
   - **Max file size**: `104857600` (100 MB; el plan gratis permite imágenes de hasta 10 MB y videos de hasta 100 MB)
8. **Save**.

**Cómo comprobarlo:** en la prueba 2 de `PRUEBAS.md`, en *Media Library*, el *Public ID* de la foto debe empezar por
`eventos/<slug>/`. Si no, la página del invitado muestra el error *“El archivo quedó fuera de la carpeta del evento”*
y no registra la foto (así nunca queda una foto que la limpieza no pueda borrar). Revisa el punto 5.

## 4. Crear la base de datos

1. Supabase → **Database** → **Extensions**: busca y activa **pg_cron** y **pg_net**.
2. Supabase → **SQL Editor** → **New query** → pega TODO `schema.sql` → **Run**.
   - Si tu proyecto **no** es `lodnwrnxrthjnwdvopak`, antes cambia esa URL al final del archivo (sección 9).
3. Abajo aparece una tabla con **`cron_secret_para_copiar`**. **Copia ese valor**: lo usas en el paso 7.
   (Si lo pierdes: `select decrypted_secret from vault.decrypted_secrets where name = 'cron_secret';`)
4. **New query** → pega TODO `seed.sql` → **Run**. Esto crea los 4 paquetes y los 4 eventos de demostración.
5. Comprueba: **Database** → **Publications** → `supabase_realtime` debe incluir la tabla `fotos` (lo hace el schema).

Puedes volver a correr `schema.sql` y `seed.sql` cuando quieras: no borran datos.
Para cambiar precios o plazos edita la tabla `paquetes` en **Table Editor**.

## 5. Configurar el login

1. Supabase → **Authentication** → **Sign In / Providers** → *Email* activado.
2. En la misma pantalla **desactiva *Allow new users to sign up*** (solo tú creas usuarios).
3. **Authentication** → **URL Configuration** → *Site URL*: `https://album-eventos.pages.dev`

## 6. Crear el primer administrador

1. **Authentication** → **Users** → **Add user** → **Create new user**: tu correo y una contraseña fuerte, con *Auto Confirm User* marcado.
2. Haz clic en el usuario y copia su **User UID**.
3. **SQL Editor** → corre (cambiando el UID):
   ```sql
   insert into admins (user_id) values ('PEGA-AQUI-EL-USER-UID');
   ```

## 7. Desplegar la Edge Function de limpieza

1. Supabase → **Edge Functions** → **Deploy a new function** → **Via Editor**.
2. Nombre: `limpiar-eventos` (exactamente así).
3. Borra el código de ejemplo, pega TODO `supabase/functions/limpiar-eventos/index.ts` → **Deploy function**.
4. Entra a la función → **Details** (o *Settings*) → desactiva **Verify JWT with legacy secret / Enforce JWT verification** → **Save**.
   (La función hace su propio control: solo acepta el `CRON_SECRET` o a un administrador logueado.)
5. **Edge Functions** → **Secrets** → agrega uno por uno:

   | Name | Value |
   |---|---|
   | `CLOUDINARY_CLOUD_NAME` | tu cloud name |
   | `CLOUDINARY_API_KEY` | Cloudinary → ⚙️ → *API Keys* → *API Key* |
   | `CLOUDINARY_API_SECRET` | Cloudinary → ⚙️ → *API Keys* → *API Secret* |
   | `CRON_SECRET` | el valor que copiaste en el paso 4.3 |

   `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` los pone Supabase solo; no los agregues.

<details><summary>Alternativa con la terminal (opcional)</summary>

```bash
npx supabase login
npx supabase link --project-ref lodnwrnxrthjnwdvopak
npx supabase functions deploy limpiar-eventos --no-verify-jwt
npx supabase secrets set CLOUDINARY_CLOUD_NAME=... CLOUDINARY_API_KEY=... CLOUDINARY_API_SECRET=... CRON_SECRET=...
```
</details>

## 8. Comprobar la tarea diaria (pg_cron)

`schema.sql` ya la programó: todos los días a las **3:00 a. m. hora Colombia (8:00 UTC)**. En el SQL Editor:

```sql
select jobname, schedule, active from cron.job;                                       -- debe salir limpiar-eventos-diario
select status, start_time from cron.job_run_details order by start_time desc limit 5;  -- ejecuciones
select status_code, content from net._http_response order by created desc limit 5;     -- respuesta de la función (200 = bien)
select * from log_limpieza order by id desc limit 20;                                  -- qué borró y errores
```

En `/admin/`, la sección **Limpieza automática** muestra el mismo registro y tiene el botón **Correr limpieza ahora**.

## 9. Publicar en Cloudflare Pages

1. En GitHub crea un repositorio **privado** (por ejemplo `album-eventos`) y sube todos los archivos de esta carpeta
   (*Add file* → *Upload files* → arrastra todo → *Commit changes*).
2. Cloudflare → **Workers & Pages** → **Create** → pestaña **Pages** → **Connect to Git** → elige el repositorio.
3. Configuración de build:
   - *Framework preset*: **None**
   - *Build command*: **vacío**
   - *Build output directory*: **/**
4. **Save and Deploy**. Cada cambio que subas a GitHub se publica solo.

Si ya tienes `album-eventos.pages.dev` creado subiendo archivos a mano (sin GitHub), entra al proyecto →
**Create deployment** → arrastra esta carpeta.

No hace falta `_redirects`: Cloudflare sirve `/e/`, `/admin/`, etc. desde sus `index.html`.

## 10. Probar todo de punta a punta

Sigue `PRUEBAS.md`.

---

## Cómo vender un evento (rutina diaria)

1. Entra a `/admin/` → **Nuevo evento** → llena el formulario → **Crear evento**.
2. Copia los enlaces o usa el botón **WhatsApp** para mandárselos al cliente. El de **anfitrión** es privado.
3. **Descargar tarjetas QR** → imprime el PDF (6 tarjetas por hoja carta) y córtalas.
4. Cada día revisa **Avisar hoy**: eventos que vencen en 7 o en 2 días, con el mensaje de WhatsApp listo.
5. Si un cliente necesita más tiempo: **Extender plazo**. Si pide borrar ya: **Borrar ahora**.

## Límites de los planes gratis (para tenerlos en cuenta)

- **Cloudinary**: 25 créditos al mes (1 crédito ≈ 1 GB guardado, o 1 GB descargado, o 1.000 transformaciones).
  Las fotos se comprimen a ~1 MB antes de subir y las galerías usan miniaturas, pero un ZIP grande gasta ancho de banda.
- **Supabase**: un proyecto gratis **se pausa tras 7 días sin uso**. Si se pausa, la limpieza no corre.
  Entra al panel al menos una vez por semana o pasa al plan pago cuando tengas ventas constantes.
- **Edge Functions**: cada corrida tiene ~150 s. La función procesa los eventos que alcance y deja el resto para el día siguiente.

## Seguridad, en resumen

- Los invitados no ven el token del anfitrión ni los contactos: leen el evento con la función `evento_publico`.
- Las fotos solo se pueden registrar si el evento está activo, dentro del plazo, con un `public_id` que empieza por
  `eventos/<slug>/` y una URL de `res.cloudinary.com` (lo valida la base de datos, no el navegador).
- El anfitrión actúa con funciones que comprueban su token; el admin, con login y la tabla `admins`.
- `/admin/` y `/anfitrion/` llevan `noindex` para que Google no los muestre.
