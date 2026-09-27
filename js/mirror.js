/*
 * Database mirror: copies the food tracker's numbers (profiles and targets,
 * log entries with every item and nutrient, weigh-ins, water) into the
 * queryable nutrition_* tables in Supabase via the `nutrition-sync` edge
 * function. Photos and coach chats are never sent.
 *
 * Runs a few seconds after any change and sends only what changed since the
 * last successful mirror (the first run backfills everything). Rows are
 * grouped by household: the share code while cross-device sync is on,
 * otherwise a random id for this device. Uses SUPABASE_URL / SUPABASE_KEY
 * from js/sync.js, and the AI passcode from js/ai.js.
 */

const MIRROR_KEY = 'mealplan.mirror.v1';
const MIRROR_FUNCTION = 'nutrition-sync';
const MIRROR_CHUNK = 250; // entries per request

let mirrorTimer = null;
let mirrorRunning = false;
let mirrorAgain = false;

function loadMirrorState() {
  try {
    return JSON.parse(localStorage.getItem(MIRROR_KEY) || '{}') || {};
  } catch (e) {
    return {};
  }
}

function saveMirrorState(s) {
  try {
    localStorage.setItem(MIRROR_KEY, JSON.stringify(s));
  } catch (e) {
    /* ignore */
  }
}

function mirrorHousehold(st) {
  if (typeof isSyncing === 'function' && isSyncing()) return shareCode;
  if (!st.localHousehold) st.localHousehold = newId();
  return st.localHousehold;
}

async function postMirror(body) {
  const headers = { 'Content-Type': 'application/json', apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` };
  const pass = typeof getAiPasscode === 'function' ? getAiPasscode() : '';
  if (pass) headers['x-app-passcode'] = pass;
  const res = await fetch(`${SUPABASE_URL}/functions/v1/${MIRROR_FUNCTION}`, { method: 'POST', headers, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`mirror ${res.status}`);
  return res.json();
}

function round2(v) {
  return Math.round((v || 0) * 100) / 100;
}

function roundPanel(n) {
  const o = {};
  for (const k of PANEL_KEYS) o[k] = round2(n[k]);
  return o;
}

// Everything that changed after `since` (ms). Profiles are always included.
function buildMirrorPayload(t, since) {
  const people = [];
  const entries = [];
  const weights = [];
  const water = [];
  for (const [pid, p] of Object.entries(t.people)) {
    const pr = p.profile;
    const tg = computeTargets(pr, state.fatPercent);
    people.push({
      id: pid, name: pr.name, sex: pr.sex, age: pr.age, heightCm: round2(pr.heightCm), weightKg: round2(pr.weightKg),
      activity: pr.activity, goal: pr.goal, rateLbPerWeek: pr.rateLbPerWeek, units: pr.units, custom: pr.custom || null,
      targets: { calories: tg.calories, protein: tg.protein, carbs: tg.carbs, fat: tg.fat, fiber: tg.fiber },
      updatedAt: pr.updatedAt || 0,
    });
    for (const [day, list] of Object.entries(p.log)) {
      for (const e of list) {
        if ((e.updatedAt || e.createdAt || 0) <= since) continue;
        entries.push({
          id: e.id, personId: pid, date: day, meal: e.meal, name: e.name, source: e.source || null,
          healthScore: e.healthScore || null, notes: e.notes || null, tip: e.tip || null, barcode: e.barcode || null,
          recipeId: e.recipeId || null, createdAt: e.createdAt || Date.now(), updatedAt: e.updatedAt || e.createdAt || 0,
          totals: roundPanel(entryTotals(e)),
          items: (e.items || []).map((it) => ({
            name: it.name, portion: it.portion || null, grams: it.grams || null, qty: Number(it.qty) || 1,
            confidence: it.confidence || null, n: roundPanel(itemTotals(it)),
          })),
        });
      }
    }
    for (const [day, w] of Object.entries(p.weights)) {
      if ((w.updatedAt || 0) > since || since === 0) weights.push({ personId: pid, date: day, kg: round2(w.kg), updatedAt: w.updatedAt || 0 });
    }
    for (const [day, w] of Object.entries(p.water)) {
      if ((w.updatedAt || 0) > since || since === 0) water.push({ personId: pid, date: day, cups: w.cups, updatedAt: w.updatedAt || 0 });
    }
  }
  const deletedEntries = [];
  const deletedPeople = [];
  for (const [id, ts] of Object.entries(t.deleted || {})) {
    if (ts <= since) continue;
    if (id.startsWith('person:')) deletedPeople.push(id.slice(7));
    else deletedEntries.push(id);
  }
  return { people, entries, weights, water, deletedEntries, deletedPeople };
}

async function mirrorNow() {
  if (mirrorRunning) {
    mirrorAgain = true;
    return;
  }
  mirrorRunning = true;
  try {
    const st = loadMirrorState();
    const hh = mirrorHousehold(st);
    let since = st.household === hh ? st.lastAt || 0 : 0;
    // Joining a shared plan: move this device's rows into the shared household.
    if (st.household && st.household !== hh && typeof isSyncing === 'function' && isSyncing()) {
      await postMirror({ action: 'move', from: st.household, to: hh });
    }
    const startedAt = Date.now();
    const p = buildMirrorPayload(tracker, since);
    // Skip the request entirely when nothing changed since the last mirror.
    const peopleSig = JSON.stringify(p.people);
    const idle = !p.entries.length && !p.weights.length && !p.water.length && !p.deletedEntries.length && !p.deletedPeople.length;
    if (since && st.household === hh && idle && st.peopleSig === peopleSig) return;
    const chunks = [];
    for (let i = 0; i < p.entries.length; i += MIRROR_CHUNK) chunks.push(p.entries.slice(i, i + MIRROR_CHUNK));
    if (!chunks.length) chunks.push([]);
    for (let i = 0; i < chunks.length; i++) {
      const first = i === 0;
      await postMirror({
        action: 'mirror',
        household: hh,
        people: first ? p.people : [],
        entries: chunks[i],
        weights: first ? p.weights : [],
        water: first ? p.water : [],
        deletedEntries: first ? p.deletedEntries : [],
        deletedPeople: first ? p.deletedPeople : [],
      });
    }
    st.household = hh;
    st.lastAt = startedAt;
    st.peopleSig = peopleSig;
    saveMirrorState(st);
  } catch (e) {
    // Offline or not deployed yet: try again on the next change / reconnect.
  } finally {
    mirrorRunning = false;
    if (mirrorAgain) {
      mirrorAgain = false;
      scheduleMirror();
    }
  }
}

function scheduleMirror() {
  clearTimeout(mirrorTimer);
  mirrorTimer = setTimeout(mirrorNow, 3000);
}

function initMirror() {
  window.addEventListener('online', scheduleMirror);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') scheduleMirror();
  });
  scheduleMirror();
}
