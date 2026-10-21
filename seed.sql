-- =====================================================================
-- seed.sql — paquetes y 4 eventos de demostración.
-- Correr DESPUÉS de schema.sql. Se puede volver a correr.
-- =====================================================================

insert into paquetes (id, nombre, precio, dias_subida, dias_descarga, max_video_seg, max_videos, pantalla_vivo) values
    ('esencial',    'Esencial',     89000, 1, 15, 30, 10,   false),
    ('celebracion', 'Celebración', 159000, 2, 30, 60, null, true),
    ('boda',        'Boda',        249000, 3, 45, 60, null, true),
    ('empresarial', 'Empresarial', 450000, 3, 30, 60, null, true)
on conflict (id) do update set
    nombre = excluded.nombre, precio = excluded.precio,
    dias_subida = excluded.dias_subida, dias_descarga = excluded.dias_descarga,
    max_video_seg = excluded.max_video_seg, max_videos = excluded.max_videos,
    pantalla_vivo = excluded.pantalla_vivo;


-- Eventos demo: subidas abiertas hasta 2035 para que los clientes prueben.
-- Para cerrarlos: update eventos set subidas_hasta = now() where slug like 'demo-%';
insert into eventos (slug, nombre, tipo, fecha_evento, paquete_id, plantilla, color_primario, color_secundario, mensaje_bienvenida) values
    ('demo-boda',    'Ana & Luis',          'boda',       current_date, 'boda',        'boda-elegante', '#687052', '#c9a29a', 'Gracias por acompañarnos. Comparte aquí tus fotos de la noche.'),
    ('demo-quince',  'Los 15 de Valentina', 'quince',     current_date, 'celebracion', 'quince-anos',   '#c2185b', '#d4af37', '¡Una noche mágica! Sube tus fotos y videos.'),
    ('demo-cumple',  'Tomás cumple 6',      'cumpleanos', current_date, 'esencial',    'infantil',      '#ff6b35', '#2ec4b6', '¡Sube las fotos de la fiesta!'),
    ('demo-empresa', 'Fiesta de fin de año Acme', 'empresa', current_date, 'empresarial', 'corporativa', '#1d3557', '#e63946', 'Comparte los mejores momentos del equipo.')
on conflict (slug) do nothing;

update eventos
set subidas_hasta = '2035-01-01 00:00-05', expira_en = '2035-12-31 00:00-05', estado = 'activo'
where slug like 'demo-%';


-- Fotos de muestra (imágenes públicas de la cuenta "demo" de Cloudinary).
insert into fotos (evento_id, cloudinary_public_id, url, tipo, ancho, alto, bytes, nombre_invitado)
select e.id, 'eventos/' || e.slug || '/muestra-' || f.n, 'https://res.cloudinary.com/demo/image/upload/' || f.archivo,
       'imagen', 1200, 800, 250000, f.invitado
from eventos e
join (values
    ('demo-boda',    1, 'couple.jpg',                         'Camila'),
    ('demo-boda',    2, 'samples/people/jazz.jpg',            'Andrés'),
    ('demo-boda',    3, 'flowers.jpg',                        'Laura'),
    ('demo-boda',    4, 'samples/dessert-on-a-plate.jpg',     'Tía Marta'),
    ('demo-boda',    5, 'lady.jpg',                           'Sofía'),
    ('demo-boda',    6, 'samples/landscapes/beach-boat.jpg',  'Julián'),
    ('demo-quince',  1, 'samples/smile.jpg',                  'Mariana'),
    ('demo-quince',  2, 'balloons.jpg',                       'Daniela'),
    ('demo-quince',  3, 'samples/outdoor-woman.jpg',          'Isabela'),
    ('demo-quince',  4, 'samples/food/dessert.jpg',           'Abuela'),
    ('demo-cumple',  1, 'samples/balloons.jpg',               'Mamá de Juan'),
    ('demo-cumple',  2, 'kitten.jpg',                         'Pedro'),
    ('demo-cumple',  3, 'dog.jpg',                            'Lucía'),
    ('demo-cumple',  4, 'samples/animals/kitten-playing.jpg', 'Tomás'),
    ('demo-empresa', 1, 'samples/people/kitchen-bar.jpg',     'Equipo Ventas'),
    ('demo-empresa', 2, 'samples/coffee.jpg',                 'Recursos Humanos'),
    ('demo-empresa', 3, 'samples/people/smiling-man.jpg',     'Carlos'),
    ('demo-empresa', 4, 'samples/man-on-a-street.jpg',        'Diana')
) as f(slug, n, archivo, invitado) on f.slug = e.slug
on conflict (cloudinary_public_id) do nothing;
