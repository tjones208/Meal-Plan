/*
 * Cross-device sync.
 *
 * Everything the app stores (the plan, shopping check-offs, weekly limits,
 * fat-% target, removed meals and custom recipes) can be shared between
 * devices through a small Supabase table. Both people enter the same short
 * "share code" and then every change is pushed up and pulled down, so a plan
 * edited on one phone shows up on the other.
 *
 * The app still works fully offline — sync is optional and layered on top of
 * the local (localStorage) storage. Conflicts resolve last-write-wins, which
 * is fine for a household sharing one plan.
 *
 * SECURITY NOTE: the Supabase publishable/anon key below is public by design
 * (it only grants access allowed by row-level security). Access to a plan is
 * gated by the random share code, which acts as the shared secret. Meal-plan
 * data is non-sensitive; do not store anything private here.
 */

const SUPABASE_URL = 'https://xmwozksnvzhxczczhzjd.supabase.co';
const SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhtd296a3NudnpoeGN6Y3poempkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5Mzg2NjgsImV4cCI6MjEwMDUxNDY2OH0.sLsBmUFFm-yM2pF1CX-c7MuHZrn7GnMvpRLsltHwokM';
const SHARE_TABLE = 'meal_plan_shares';
const SHARE_CODE_KEY = 'mealplan.sharecode';

let shareCode = null;
let syncSuppress = false; // true while applying a remote snapshot (don't echo back)
let pushTimer = null;
let pollTimer = null;
let lastAppliedAt = 0; // updatedAt of the snapshot we last pushed or applied

function isSyncing() {
  return !!shareCode;
}

function restBase() {
  return `${SUPABASE_URL}/rest/v1/${SHARE_TABLE}`;
}

function restHeaders(extra) {
  return Object.assign(
    { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json' },
    extra || {}
  );
}

// A short, unambiguous share code (no easily-confused characters).
function newShareCode() {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let code = '';
  let rand = null;
  try {
    rand = new Uint32Array(8);
    crypto.getRandomValues(rand);
  } catch (e) {
    rand = null;
  }
  for (let i = 0; i < 8; i++) {
    const n = rand ? rand[i] : Math.floor(Math.random() * 1e9);
    code += chars[n % chars.length];
  }
  return code;
}

// Snapshot of everything we sync.
function buildSnapshot() {
  return {
    state: {
      plan: state.plan,
      checkedItems: state.checkedItems,
      limits: state.limits,
      fatPercent: state.fatPercent,
      hidden: state.hidden,
    },
    custom: loadCustomRecipes(),
    updatedAt: nowMs(),
  };
}

function nowMs() {
  return new Date().getTime();
}

// Drop plan entries whose recipe no longer resolves (custom recipes are set first).
function normalizePlan(plan) {
  const out = emptyPlan();
  for (const day of DAYS) {
    if (!plan[day]) continue;
    for (const slot of SLOTS) {
      const id = plan[day][slot];
      if (id && getRecipeById(id)) out[day][slot] = id;
    }
  }
  return out;
}

// Apply a snapshot pulled from the server into local state + UI.
function applySnapshot(snap) {
  if (!snap || !snap.state) return;
  syncSuppress = true;
  try {
    // Custom recipes first, so the plan can reference them.
    saveCustomRecipes(Array.isArray(snap.custom) ? snap.custom : []);
    setCustomRecipes(loadCustomRecipes());

    const s = snap.state;
    state.hidden = Array.isArray(s.hidden) ? s.hidden : [];
    setHiddenIds(state.hidden);
    state.plan = normalizePlan(s.plan || {});
    state.checkedItems = s.checkedItems && typeof s.checkedItems === 'object' ? s.checkedItems : {};
    if (s.limits) state.limits = { calories: s.limits.calories || null, fat: s.limits.fat || null };
    if (s.fatPercent) state.fatPercent = s.fatPercent;

    saveState(state); // suppressed → writes locally only
    rerenderAll();
  } finally {
    syncSuppress = false;
  }
}

function rerenderAll() {
  renderPlanner();
  renderCustomList();
  renderHiddenList();
  const cal = $('#limit-calories');
  const fat = $('#limit-fat');
  const fp = $('#fat-percent');
  if (cal) cal.value = state.limits.calories || '';
  if (fat) fat.value = state.limits.fat || '';
  if (fp) fp.value = state.fatPercent || '';
  const nut = document.getElementById('nutrition');
  if (nut && nut.classList.contains('active')) renderNutrition();
  const shop = document.getElementById('shopping');
  if (shop && shop.classList.contains('active')) renderShopping();
}

// Called by storage.js after every local write. Debounced push.
function syncOnWrite() {
  if (!isSyncing() || syncSuppress) return;
  clearTimeout(pushTimer);
  pushTimer = setTimeout(pushNow, 800);
}

async function pushNow() {
  if (!isSyncing()) return;
  const snap = buildSnapshot();
  try {
    const res = await fetch(`${restBase()}?on_conflict=code`, {
      method: 'POST',
      headers: restHeaders({ Prefer: 'resolution=merge-duplicates,return=minimal' }),
      body: JSON.stringify({ code: shareCode, data: snap, updated_at: new Date(snap.updatedAt).toISOString() }),
    });
    if (res.ok) {
      lastAppliedAt = snap.updatedAt;
      setSyncStatus('Synced');
    } else {
      setSyncStatus(`Sync error (${res.status})`);
    }
  } catch (e) {
    setSyncStatus('Offline — will retry when back online');
  }
}

async function pullNow() {
  if (!isSyncing()) return;
  try {
    const res = await fetch(`${restBase()}?code=eq.${encodeURIComponent(shareCode)}&select=data`, {
      headers: restHeaders(),
    });
    if (!res.ok) {
      setSyncStatus(`Sync error (${res.status})`);
      return false;
    }
    const rows = await res.json();
    if (!rows.length) {
      setSyncStatus('Shared plan is empty — your device will seed it');
      return false;
    }
    const snap = rows[0].data;
    if (snap && snap.updatedAt && snap.updatedAt > lastAppliedAt) {
      lastAppliedAt = snap.updatedAt;
      applySnapshot(snap);
      setSyncStatus('Updated from shared plan');
    } else {
      setSyncStatus('Synced');
    }
    return true;
  } catch (e) {
    setSyncStatus('Offline');
    return false;
  }
}

function startPolling() {
  stopPolling();
  pollTimer = setInterval(() => {
    if (document.visibilityState === 'visible') pullNow();
  }, 15000);
}

function stopPolling() {
  if (pollTimer) clearInterval(pollTimer);
  pollTimer = null;
}

// Begin syncing. adopt=true → take the shared plan (joining); otherwise push
// this device's plan up as the shared baseline (creating).
async function startSync(code, adopt) {
  shareCode = code;
  lastAppliedAt = 0;
  localStorage.setItem(SHARE_CODE_KEY, code);
  renderSyncCard();
  if (adopt) {
    const got = await pullNow();
    if (!got) await pushNow(); // nothing there yet → seed it
  } else {
    await pushNow();
  }
  startPolling();
}

function stopSync() {
  shareCode = null;
  localStorage.removeItem(SHARE_CODE_KEY);
  stopPolling();
  renderSyncCard();
}

/* ---- UI ---- */
function setSyncStatus(text) {
  const el2 = $('#sync-status');
  if (el2) el2.textContent = text;
}

function renderSyncCard() {
  const body = $('#sync-body');
  if (!body) return;
  body.innerHTML = '';

  if (isSyncing()) {
    body.appendChild(el('p', { class: 'muted', text: 'This device is syncing. Enter this code on another phone (Join a shared plan) to mirror the same meals, shopping list and settings.' }));
    body.appendChild(
      el('div', { class: 'share-code-row' }, [
        el('span', { class: 'share-code', text: shareCode }),
        el('button', { class: 'btn ghost small', text: 'Copy code', onclick: () => copyShareCode() }),
      ])
    );
    body.appendChild(
      el('div', { class: 'btn-row' }, [
        el('button', { class: 'btn ghost small', text: '↻ Refresh now', onclick: () => pullNow() }),
        el('button', { class: 'btn ghost small danger-btn', text: 'Stop syncing this device', onclick: () => stopSync() }),
      ])
    );
    body.appendChild(el('p', { id: 'sync-status', class: 'note ok', text: 'Synced' }));
  } else {
    body.appendChild(el('p', { class: 'muted', text: 'Share one plan across phones. Create a shared plan here, then enter the code on the other device.' }));
    body.appendChild(
      el('div', { class: 'btn-row' }, [
        el('button', { class: 'btn primary', text: '＋ Create shared plan', onclick: () => startSync(newShareCode(), false) }),
      ])
    );
    const input = el('input', { type: 'text', id: 'join-code', class: 'text-input', placeholder: 'Enter share code' });
    body.appendChild(
      el('div', { class: 'join-row' }, [
        input,
        el('button', {
          class: 'btn ghost',
          text: 'Join a shared plan',
          onclick: () => {
            const code = (input.value || '').trim().toUpperCase();
            if (code) startSync(code, true);
          },
        }),
      ])
    );
    body.appendChild(el('p', { id: 'sync-status', class: 'note', text: '' }));
  }
}

function copyShareCode() {
  const done = () => setSyncStatus('Code copied — send it to the other device');
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(shareCode).then(done).catch(() => {});
  }
}

function initSync() {
  shareCode = localStorage.getItem(SHARE_CODE_KEY) || null;
  renderSyncCard();
  if (isSyncing()) {
    pullNow();
    startPolling();
  }
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') pullNow();
  });
}
