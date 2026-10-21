-- =====================================================================
-- ÁLBUM QR MULTI-EVENTO — schema.sql
-- Pegar COMPLETO en Supabase > SQL Editor > New query > Run.
-- Se puede volver a correr sin perder datos.
-- =====================================================================

create extension if not exists pg_cron;
create extension if not exists pg_net with schema extensions;


-- =====================================================================
-- 1. TABLAS
-- =====================================================================

create table if not exists paquetes (
    id             text primary key,
    nombre         text    not null,
    precio         integer not null check (precio >= 0),           -- COP
    dias_subida    integer not null check (dias_subida >= 0),      -- días tras el evento
    dias_descarga  integer not null check (dias_descarga > 0),     -- días tras cerrar subidas
    max_video_seg  integer not null default 60,
    max_videos     integer,                                         -- null = sin límite
    pantalla_vivo  boolean not null default false
);

create table if not exists eventos (
    id                  uuid primary key default gen_random_uuid(),
    slug                text not null unique
                        check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and length(slug) <= 60),
    nombre              text not null check (length(nombre) between 1 and 120),
    tipo                text not null check (tipo in ('boda','quince','cumpleanos','grado','empresa','otro')),
    fecha_evento        date not null,
    paquete_id          text not null references paquetes(id),
    plantilla           text not null default 'minimalista'
                        check (plantilla in ('boda-elegante','quince-anos','infantil','corporativa','minimalista')),
    color_primario      text check (color_primario ~ '^#[0-9a-fA-F]{6}$'),
    color_secundario    text check (color_secundario ~ '^#[0-9a-fA-F]{6}$'),
    portada_url         text check (portada_url ~ '^https://'),
    mensaje_bienvenida  text check (length(mensaje_bienvenida) <= 500),
    estado              text not null default 'activo' check (estado in ('activo','descarga','vencido')),
    subidas_hasta       timestamptz,   -- lo calcula el trigger
    expira_en           timestamptz,   -- lo calcula el trigger
    -- gen_random_uuid() es criptográficamente aleatorio: 2 uuid = 64 caracteres hex
    token_anfitrion     text not null default (replace(gen_random_uuid()::text, '-', '') || replace(gen_random_uuid()::text, '-', '')),
    contacto_nombre     text,
    contacto_whatsapp   text,
    contacto_email      text,
    creado_en           timestamptz not null default now()
);

create table if not exists fotos (
    id                    uuid primary key default gen_random_uuid(),
    evento_id             uuid not null references eventos(id) on delete cascade,
    cloudinary_public_id  text not null unique,
    url                   text not null,
    tipo                  text not null check (tipo in ('imagen','video')),
    ancho                 integer,
    alto                  integer,
    bytes                 bigint,
    nombre_invitado       text check (length(nombre_invitado) <= 60),
    oculta                boolean not null default false,
    creado_en             timestamptz not null default now()
);
create index if not exists fotos_evento_idx on fotos (evento_id, creado_en desc);

-- Fila de contabilidad que sobrevive al borrado del evento (sin datos personales).
create table if not exists registro_eventos (
    id            bigint generated always as identity primary key,
    evento_slug   text not null,
    nombre        text not null,
    tipo          text not null,
    fecha_evento  date not null,
    paquete       text not null,
    precio        integer not null,
    borrado_en    timestamptz not null default now()
);

create table if not exists log_limpieza (
    id            bigint generated always as identity primary key,
    ejecutado_en  timestamptz not null default now(),
    evento_slug   text,
    accion        text not null,      -- 'borrado' | 'error' | 'resumen'
    detalle       jsonb,
    error         text
);

create table if not exists admins (
    user_id  uuid primary key references auth.users(id) on delete cascade
);


-- =====================================================================
-- 2. PLAZOS AUTOMÁTICOS
-- Las subidas cierran a la medianoche (hora Colombia) al terminar el día
-- fecha_evento + dias_subida. La descarga dura dias_descarga más.
-- =====================================================================

create or replace function calcular_plazos() returns trigger
language plpgsql set search_path = public as $$
declare
    p paquetes;
begin
    select * into p from paquetes where id = new.paquete_id;
    new.subidas_hasta := ((new.fecha_evento + p.dias_subida + 1)::timestamp) at time zone 'America/Bogota';
    new.expira_en     := new.subidas_hasta + make_interval(days => p.dias_descarga);
    return new;
end $$;

drop trigger if exists eventos_plazos on eventos;
create trigger eventos_plazos
    before insert or update of fecha_evento, paquete_id on eventos
    for each row execute function calcular_plazos();


-- =====================================================================
-- 3. FUNCIONES AUXILIARES (security definer: leen eventos sin exponer el token)
-- =====================================================================

create or replace function es_admin() returns boolean
language sql stable security definer set search_path = public as $$
    select exists (select 1 from admins where user_id = auth.uid());
$$;

create or replace function evento_visible(p_evento uuid) returns boolean
language sql stable security definer set search_path = public as $$
    select exists (select 1 from eventos where id = p_evento and estado in ('activo','descarga'));
$$;

-- Valida TODO lo que un invitado puede registrar. Se usa en la política de insert.
create or replace function puede_subir(p_evento uuid, p_public_id text, p_url text, p_tipo text) returns boolean
language sql stable security definer set search_path = public as $$
    select exists (
        select 1
        from eventos e join paquetes p on p.id = e.paquete_id
        where e.id = p_evento
          and e.estado = 'activo'
          and now() < e.subidas_hasta
          and p_public_id like 'eventos/' || e.slug || '/%'        -- slug solo tiene [a-z0-9-]
          and p_url like 'https://res.cloudinary.com/%/' || p_public_id || '%'
          and (p_tipo = 'imagen'
               or p.max_videos is null
               or (select count(*) from fotos f where f.evento_id = e.id and f.tipo = 'video') < p.max_videos)
    );
$$;


-- =====================================================================
-- 4. RLS
-- =====================================================================

alter table paquetes          enable row level security;
alter table eventos           enable row level security;
alter table fotos             enable row level security;
alter table registro_eventos  enable row level security;
alter table log_limpieza      enable row level security;
alter table admins            enable row level security;

-- paquetes: todos leen (página de ventas), solo admin edita
drop policy if exists paquetes_leer  on paquetes;
drop policy if exists paquetes_admin on paquetes;
create policy paquetes_leer  on paquetes for select to anon, authenticated using (true);
create policy paquetes_admin on paquetes for all to authenticated using (es_admin()) with check (es_admin());

-- eventos: SOLO admin toca la tabla. El público usa evento_publico() (sin token ni contactos).
drop policy if exists eventos_admin on eventos;
create policy eventos_admin on eventos for all to authenticated using (es_admin()) with check (es_admin());

-- fotos
drop policy if exists fotos_leer_publico on fotos;
drop policy if exists fotos_subir        on fotos;
drop policy if exists fotos_admin        on fotos;
create policy fotos_leer_publico on fotos for select to anon, authenticated
    using (oculta = false and evento_visible(evento_id));
create policy fotos_subir on fotos for insert to anon, authenticated
    with check (oculta = false and puede_subir(evento_id, cloudinary_public_id, url, tipo));
create policy fotos_admin on fotos for all to authenticated using (es_admin()) with check (es_admin());

-- contabilidad y log: solo admin lee (la Edge Function usa service_role, que salta RLS)
drop policy if exists registro_admin on registro_eventos;
drop policy if exists log_admin      on log_limpieza;
create policy registro_admin on registro_eventos for select to authenticated using (es_admin());
create policy log_admin      on log_limpieza     for select to authenticated using (es_admin());

-- admins: cada quien puede ver si él mismo es admin
drop policy if exists admins_yo on admins;
create policy admins_yo on admins for select to authenticated using (user_id = auth.uid());


-- =====================================================================
-- 5. RPC PÚBLICAS
-- =====================================================================

-- Datos del evento para invitado y pantalla. Lista explícita de columnas:
-- nunca devuelve token_anfitrion ni contactos.
create or replace function evento_publico(p_slug text) returns json
language sql stable security definer set search_path = public as $$
    select json_build_object(
        'id', e.id, 'slug', e.slug, 'nombre', e.nombre, 'tipo', e.tipo,
        'fecha_evento', e.fecha_evento, 'plantilla', e.plantilla,
        'color_primario', e.color_primario, 'color_secundario', e.color_secundario,
        'portada_url', e.portada_url, 'mensaje_bienvenida', e.mensaje_bienvenida,
        'estado', e.estado, 'subidas_hasta', e.subidas_hasta, 'expira_en', e.expira_en,
        'subidas_abiertas', (e.estado = 'activo' and now() < e.subidas_hasta),
        'max_video_seg', p.max_video_seg, 'max_videos', p.max_videos,
        'pantalla_vivo', p.pantalla_vivo,
        'videos_subidos', (select count(*) from fotos f where f.evento_id = e.id and f.tipo = 'video')
    )
    from eventos e join paquetes p on p.id = e.paquete_id
    where e.slug = p_slug and e.estado in ('activo','descarga');
$$;


-- =====================================================================
-- 6. RPC DEL ANFITRIÓN (validan token_anfitrion)
-- =====================================================================

create or replace function anfitrion_evento(p_slug text, p_token text) returns json
language sql stable security definer set search_path = public as $$
    select json_build_object(
        'id', e.id, 'slug', e.slug, 'nombre', e.nombre, 'tipo', e.tipo,
        'fecha_evento', e.fecha_evento, 'plantilla', e.plantilla,
        'color_primario', e.color_primario, 'color_secundario', e.color_secundario,
        'portada_url', e.portada_url, 'estado', e.estado,
        'subidas_hasta', e.subidas_hasta, 'expira_en', e.expira_en,
        'paquete', p.nombre, 'pantalla_vivo', p.pantalla_vivo,
        'total',   (select count(*) from fotos f where f.evento_id = e.id),
        'ocultas', (select count(*) from fotos f where f.evento_id = e.id and f.oculta),
        'bytes',   (select coalesce(sum(bytes), 0) from fotos f where f.evento_id = e.id)
    )
    from eventos e join paquetes p on p.id = e.paquete_id
    where e.slug = p_slug and e.token_anfitrion = p_token and e.estado <> 'vencido';
$$;

create or replace function anfitrion_fotos(p_slug text, p_token text, p_offset integer default 0, p_limite integer default 60)
returns setof fotos
language sql stable security definer set search_path = public as $$
    select f.*
    from fotos f join eventos e on e.id = f.evento_id
    where e.slug = p_slug and e.token_anfitrion = p_token and e.estado <> 'vencido'
    order by f.creado_en desc, f.id
    offset greatest(p_offset, 0)
    limit least(greatest(p_limite, 1), 500);
$$;

create or replace function anfitrion_ocultar(p_slug text, p_token text, p_foto uuid, p_oculta boolean) returns boolean
language plpgsql security definer set search_path = public as $$
begin
    update fotos f set oculta = p_oculta
    from eventos e
    where f.id = p_foto and f.evento_id = e.id
      and e.slug = p_slug and e.token_anfitrion = p_token and e.estado <> 'vencido';
    return found;
end $$;


-- =====================================================================
-- 7. RPC DE ADMIN
-- =====================================================================

create or replace function admin_eventos()
returns table (
    id uuid, slug text, nombre text, tipo text, fecha_evento date, paquete_id text,
    plantilla text, estado text, subidas_hasta timestamptz, expira_en timestamptz,
    token_anfitrion text, contacto_nombre text, contacto_whatsapp text, contacto_email text,
    creado_en timestamptz, fotos bigint, bytes bigint
)
language sql stable security definer set search_path = public as $$
    select e.id, e.slug, e.nombre, e.tipo, e.fecha_evento, e.paquete_id,
           e.plantilla, e.estado, e.subidas_hasta, e.expira_en,
           e.token_anfitrion, e.contacto_nombre, e.contacto_whatsapp, e.contacto_email,
           e.creado_en, count(f.id), coalesce(sum(f.bytes), 0)::bigint
    from eventos e left join fotos f on f.evento_id = e.id
    where es_admin()
    group by e.id
    order by e.expira_en;
$$;

-- Usada SOLO por la Edge Function (service_role): guarda la fila contable y borra el evento
-- (las fotos caen por on delete cascade) en una sola transacción.
create or replace function archivar_evento(p_evento uuid) returns void
language plpgsql security definer set search_path = public as $$
begin
    insert into registro_eventos (evento_slug, nombre, tipo, fecha_evento, paquete, precio)
    select e.slug, e.nombre, e.tipo, e.fecha_evento, p.nombre, p.precio
    from eventos e join paquetes p on p.id = e.paquete_id
    where e.id = p_evento;

    if not found then
        raise exception 'Evento % no existe', p_evento;
    end if;

    delete from eventos where id = p_evento;
end $$;

revoke execute on function archivar_evento(uuid) from public, anon, authenticated;


-- =====================================================================
-- 8. TIEMPO REAL (pantalla en vivo)
-- =====================================================================

do $$ begin
    alter publication supabase_realtime add table fotos;
exception when duplicate_object or undefined_object then null;
end $$;


-- =====================================================================
-- 9. TAREA PROGRAMADA: limpieza diaria 3:00 a. m. Colombia = 8:00 UTC
-- Guarda un secreto aleatorio en Vault; la Edge Function lo exige en el
-- header x-cron-secret. Si tu proyecto NO es lodnwrnxrthjnwdvopak, cambia la URL.
-- =====================================================================

do $$ begin
    if not exists (select 1 from vault.secrets where name = 'cron_secret') then
        perform vault.create_secret(
            replace(gen_random_uuid()::text, '-', '') || replace(gen_random_uuid()::text, '-', ''),
            'cron_secret',
            'Clave que pg_cron envía a la Edge Function limpiar-eventos');
    end if;
end $$;

select cron.schedule(
    'limpiar-eventos-diario',
    '0 8 * * *',
    $cron$
    select net.http_post(
        url     := 'https://lodnwrnxrthjnwdvopak.supabase.co/functions/v1/limpiar-eventos',
        headers := jsonb_build_object(
            'Content-Type', 'application/json',
            'x-cron-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'cron_secret')),
        body    := '{}'::jsonb,
        timeout_milliseconds := 150000
    );
    $cron$
);

-- Copia este valor al secret CRON_SECRET de la Edge Function (ver LEEME.md, paso 7).
select decrypted_secret as cron_secret_para_copiar
from vault.decrypted_secrets where name = 'cron_secret';
