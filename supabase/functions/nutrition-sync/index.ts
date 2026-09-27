/*
 * nutrition-sync — receives the food tracker's numbers from the app and
 * writes them into the queryable nutrition_* tables (see
 * supabase/migrations/*_nutrition_tables.sql). No photos or chats.
 *
 * The tables are closed to the public anon key; this function writes with
 * the service role after checking the same optional APP_PASSCODE secret the
 * AI function uses.
 *
 * POST JSON:
 *   { action: "mirror", household, people, entries, deletedEntries, deletedPeople, weights, water }
 *   { action: "move", from, to }   re-label rows when a device joins a shared plan
 */

import { createClient } from 'npm:@supabase/supabase-js@2.117.2';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-app-passcode',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });
}

const MAX_BODY = 5_000_000;
const HOUSEHOLD_RE = /^[A-Za-z0-9-]{6,64}$/;

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const passcode = Deno.env.get('APP_PASSCODE');
  if (passcode && req.headers.get('x-app-passcode') !== passcode) {
    return json({ error: 'Wrong or missing app passcode.' }, 401);
  }

  const raw = await req.text();
  if (raw.length > MAX_BODY) return json({ error: 'Payload too large' }, 413);
  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
    auth: { persistSession: false },
  });

  if (body.action === 'mirror') {
    if (!HOUSEHOLD_RE.test(String(body.household || ''))) return json({ error: 'Invalid household' }, 400);
    const { data, error } = await db.rpc('nutrition_mirror', { p: body });
    if (error) {
      console.error(error);
      return json({ error: 'Could not save to the database.' }, 500);
    }
    return json(data);
  }

  if (body.action === 'move') {
    const from = String(body.from || '');
    const to = String(body.to || '');
    if (!HOUSEHOLD_RE.test(from) || !HOUSEHOLD_RE.test(to)) return json({ error: 'Invalid household' }, 400);
    const { error } = await db.rpc('nutrition_move_household', { old_hh: from, new_hh: to });
    if (error) {
      console.error(error);
      return json({ error: 'Could not move household.' }, 500);
    }
    return json({ ok: true });
  }

  return json({ error: 'Unknown action' }, 400);
});
