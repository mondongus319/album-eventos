// =====================================================================
// Edge Function "limpiar-eventos" (Deno)
//
// 1. Pasa a 'descarga' los eventos activos cuyo plazo de subida terminó.
// 2. Para cada evento vencido (now() > expira_en):
//      borra TODO en Cloudinary bajo eventos/<slug>/ (imágenes, videos, raw),
//      confirma que no quedó nada, borra la carpeta y, SOLO si todo salió bien,
//      guarda la fila contable y borra el evento con sus fotos (archivar_evento).
//    Si Cloudinary falla, el evento se queda para reintentar en la próxima corrida.
// 3. Deja todo registrado en log_limpieza.
//
// Quién puede llamarla:
//   - pg_cron, con el header x-cron-secret = secret CRON_SECRET
//   - un administrador logueado (botón del panel /admin/)
//
// Secrets: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CRON_SECRET.
// SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY los pone Supabase automáticamente.
// =====================================================================

import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const CLOUD = Deno.env.get("CLOUDINARY_CLOUD_NAME")!;
const AUTH_CLOUDINARY = "Basic " + btoa(`${Deno.env.get("CLOUDINARY_API_KEY")}:${Deno.env.get("CLOUDINARY_API_SECRET")}`);
const API = `https://api.cloudinary.com/v1_1/${CLOUD}`;
const TIEMPO_MAXIMO_MS = 120_000; // el plan gratis corta a los 150 s; lo que falte sigue mañana

const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
    auth: { persistSession: false },
});

const CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const responder = (cuerpo: unknown, status = 200) =>
    new Response(JSON.stringify(cuerpo), { status, headers: { ...CORS, "Content-Type": "application/json" } });


// ---------------------------------------------------------------------
// Autorización
// ---------------------------------------------------------------------

async function autorizado(req: Request): Promise<boolean> {
    const secreto = Deno.env.get("CRON_SECRET");
    if (secreto && req.headers.get("x-cron-secret") === secreto) return true;

    const jwt = req.headers.get("Authorization")?.replace(/^Bearer\s+/i, "");
    if (!jwt) return false;
    const { data } = await db.auth.getUser(jwt);
    if (!data?.user) return false;
    const { data: admin } = await db.from("admins").select("user_id").eq("user_id", data.user.id).maybeSingle();
    return !!admin;
}


// ---------------------------------------------------------------------
// Cloudinary (Admin API)
// ---------------------------------------------------------------------

async function cloudinary(metodo: string, ruta: string) {
    const r = await fetch(API + ruta, { method: metodo, headers: { Authorization: AUTH_CLOUDINARY } });
    const cuerpo = await r.json().catch(() => ({}));
    return { status: r.status, cuerpo };
}

async function borrarEnCloudinary(slug: string): Promise<number> {
    const prefijo = `eventos/${slug}/`;
    const p = encodeURIComponent(prefijo);
    let borrados = 0;

    for (const tipo of ["image", "video", "raw"]) {
        // Borra de a 1000 por llamada; si quedan más, Cloudinary devuelve next_cursor.
        let cursor = "";
        for (let vuelta = 0; vuelta < 100; vuelta++) {
            const r = await cloudinary("DELETE",
                `/resources/${tipo}/upload?prefix=${p}&invalidate=true${cursor ? `&next_cursor=${cursor}` : ""}`);
            if (r.status !== 200) throw new Error(`Cloudinary borrar ${tipo} → ${r.status} ${JSON.stringify(r.cuerpo).slice(0, 300)}`);
            borrados += Object.values(r.cuerpo.deleted ?? {}).filter((v) => v === "deleted").length;
            if (!r.cuerpo.next_cursor) break;
            cursor = encodeURIComponent(r.cuerpo.next_cursor);
        }

        // Confirmar que de verdad no quedó nada.
        const q = await cloudinary("GET", `/resources/${tipo}/upload?prefix=${p}&max_results=1`);
        if (q.status !== 200) throw new Error(`Cloudinary listar ${tipo} → ${q.status} ${JSON.stringify(q.cuerpo).slice(0, 300)}`);
        if (q.cuerpo.resources?.length) throw new Error(`Cloudinary: todavía quedan archivos ${tipo} en ${prefijo}`);
    }

    // Borrar la carpeta vacía (404 = no existía, también está bien).
    const c = await cloudinary("DELETE", `/folders/eventos/${slug}`);
    if (c.status !== 200 && c.status !== 404) {
        throw new Error(`Cloudinary borrar carpeta → ${c.status} ${JSON.stringify(c.cuerpo).slice(0, 300)}`);
    }
    return borrados;
}


// ---------------------------------------------------------------------
// Limpieza
// ---------------------------------------------------------------------

async function limpiar() {
    const inicio = Date.now();
    const ahora = new Date().toISOString();
    const log = (fila: Record<string, unknown>) => db.from("log_limpieza").insert(fila);

    // 1. Cerrar subidas vencidas.
    const { data: cerrados, error: e1 } = await db.from("eventos")
        .update({ estado: "descarga" })
        .eq("estado", "activo")
        .lt("subidas_hasta", ahora)
        .select("slug");
    if (e1) throw e1;

    // 2. Eventos vencidos: se marcan 'vencido' (dejan de verse) y se borran.
    const { data: vencidos, error: e2 } = await db.from("eventos")
        .update({ estado: "vencido" })
        .lt("expira_en", ahora)
        .select("id, slug");
    if (e2) throw e2;

    const resultado = { cerrados: cerrados.length, vencidos: vencidos.length, borrados: 0, errores: 0, pendientes: 0 };

    for (const ev of vencidos) {
        if (Date.now() - inicio > TIEMPO_MAXIMO_MS) { resultado.pendientes++; continue; }
        try {
            const archivos = await borrarEnCloudinary(ev.slug);
            // Solo si Cloudinary quedó vacío: fila contable + borrar evento (fotos en cascada).
            const { error } = await db.rpc("archivar_evento", { p_evento: ev.id });
            if (error) throw new Error("Supabase archivar_evento: " + error.message);
            await log({ evento_slug: ev.slug, accion: "borrado", detalle: { archivos_cloudinary: archivos } });
            resultado.borrados++;
        } catch (e) {
            await log({ evento_slug: ev.slug, accion: "error", error: String((e as Error).message ?? e) });
            resultado.errores++;
        }
    }

    await log({ accion: "resumen", detalle: resultado });
    return resultado;
}

Deno.serve(async (req) => {
    if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
    if (!(await autorizado(req))) return responder({ error: "No autorizado" }, 401);
    try {
        return responder(await limpiar());
    } catch (e) {
        await db.from("log_limpieza").insert({ accion: "error", error: String((e as Error).message ?? e) });
        return responder({ error: String((e as Error).message ?? e) }, 500);
    }
});
