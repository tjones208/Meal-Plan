/*
 * Food-log tracker: data model, persistence, goal maths and sync merging.
 *
 * The tracker is household-aware: it holds one "person" per eater, each with
 * their own profile, goals, food log, weight history and water. Which person
 * this device logs for is a per-device choice (not synced), so two phones
 * sharing a plan can each track their own eating.
 *
 * Shape (localStorage TRACKER_KEY, and synced inside the share snapshot):
 * {
 *   people: {
 *     [personId]: {
 *       profile: { name, sex, age, heightCm, weightKg, activity, goal, rateLbPerWeek,
 *                  units, custom: { calories, protein, carbs, fat } | null, updatedAt },
 *       log: { 'YYYY-MM-DD': [entry, ...] },
 *       weights: { 'YYYY-MM-DD': { kg, updatedAt } },
 *       water: { 'YYYY-MM-DD': { cups, updatedAt } },
 *     }
 *   },
 *   deleted: { [entryId | 'person:<id>']: deletedAtMs },  // tombstones so deletes survive a merge
 * }
 *
 * entry = { id, meal, name, source, time, createdAt, updatedAt, healthScore?, notes?,
 *           tip?, thumb?, items: [{ name, portion, grams, qty, confidence?, nutrients }] }
 * Item nutrients are for the portion as estimated; `qty` scales them (1 = as estimated).
 */

const TRACKER_KEY = 'mealplan.tracker.v1';
const ACTIVE_PERSON_KEY = 'mealplan.activePerson';
const MEALS = ['breakfast', 'lunch', 'dinner', 'snack'];

// Full nutrient panel. `dv` = FDA Daily Value used for micronutrients and
// limits; macros use personalised targets from the profile instead.
const PANEL = [
  { key: 'calories', label: 'Calories', unit: 'kcal', dv: 2000 },
  { key: 'protein', label: 'Protein', unit: 'g', dv: 50 },
  { key: 'carbs', label: 'Carbs', unit: 'g', dv: 275 },
  { key: 'fat', label: 'Fat', unit: 'g', dv: 78, limit: true },
  { key: 'saturatedFat', label: 'Saturated fat', unit: 'g', dv: 20, limit: true },
  { key: 'fiber', label: 'Fiber', unit: 'g', dv: 28 },
  { key: 'sugar', label: 'Sugar', unit: 'g', dv: 50, limit: true },
  { key: 'sodium', label: 'Sodium', unit: 'mg', dv: 2300, limit: true },
  { key: 'cholesterol', label: 'Cholesterol', unit: 'mg', dv: 300, limit: true },
  { key: 'potassium', label: 'Potassium', unit: 'mg', dv: 4700 },
  { key: 'calcium', label: 'Calcium', unit: 'mg', dv: 1300 },
  { key: 'iron', label: 'Iron', unit: 'mg', dv: 18 },
  { key: 'vitaminC', label: 'Vitamin C', unit: 'mg', dv: 90 },
  { key: 'vitaminD', label: 'Vitamin D', unit: 'mcg', dv: 20 },
];
const PANEL_KEYS = PANEL.map((n) => n.key);

const ACTIVITY_LEVELS = [
  { key: 'sedentary', label: 'Sedentary (desk job, little exercise)', factor: 1.2 },
  { key: 'light', label: 'Light (exercise 1-3 days/week)', factor: 1.375 },
  { key: 'moderate', label: 'Moderate (exercise 3-5 days/week)', factor: 1.55 },
  { key: 'active', label: 'Active (exercise 6-7 days/week)', factor: 1.725 },
  { key: 'athlete', label: 'Very active (hard training or physical job)', factor: 1.9 },
];

const GOALS = [
  { key: 'lose', label: 'Lose weight' },
  { key: 'maintain', label: 'Maintain weight' },
  { key: 'gain', label: 'Build muscle / gain' },
];

function zeroPanel() {
  const o = {};
  for (const k of PANEL_KEYS) o[k] = 0;
  return o;
}

function cleanNutrients(n) {
  const o = {};
  for (const k of PANEL_KEYS) {
    const v = Number(n && n[k]);
    o[k] = Number.isFinite(v) && v > 0 ? v : 0;
  }
  return o;
}

function newId() {
  try {
    if (crypto.randomUUID) return crypto.randomUUID();
  } catch (e) {
    /* fall through */
  }
  return 'id-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}

/* ---- Dates (local time) ---- */
function dateKey(d) {
  const x = d || new Date();
  const m = String(x.getMonth() + 1).padStart(2, '0');
  const day = String(x.getDate()).padStart(2, '0');
  return `${x.getFullYear()}-${m}-${day}`;
}

function parseDateKey(key) {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function shiftDateKey(key, days) {
  const d = parseDateKey(key);
  d.setDate(d.getDate() + days);
  return dateKey(d);
}

function friendlyDate(key) {
  const today = dateKey();
  if (key === today) return 'Today';
  if (key === shiftDateKey(today, -1)) return 'Yesterday';
  return parseDateKey(key).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

function mealForTime(d) {
  const h = (d || new Date()).getHours();
  if (h < 10.5) return 'breakfast';
  if (h < 15) return 'lunch';
  if (h >= 17 && h < 21.5) return 'dinner';
  return 'snack';
}

/* ---- Persistence ---- */
function defaultProfile(name) {
  return {
    name: name || 'Me',
    sex: 'female',
    age: 35,
    heightCm: 168,
    weightKg: 70,
    activity: 'light',
    goal: 'maintain',
    rateLbPerWeek: 1,
    units: 'imperial',
    custom: null,
    setup: false, // true once the person has saved their profile
    updatedAt: 0,
  };
}

function newPerson(name) {
  return { profile: defaultProfile(name), log: {}, weights: {}, water: {} };
}

function defaultTracker() {
  return { people: { me: newPerson('Me') }, deleted: {} };
}

function normalizeTracker(t) {
  const out = { people: {}, deleted: {} };
  if (t && t.people && typeof t.people === 'object') {
    for (const [pid, p] of Object.entries(t.people)) {
      if (!p) continue;
      out.people[pid] = {
        profile: Object.assign(defaultProfile(), p.profile || {}),
        log: p.log && typeof p.log === 'object' ? p.log : {},
        weights: p.weights && typeof p.weights === 'object' ? p.weights : {},
        water: p.water && typeof p.water === 'object' ? p.water : {},
      };
    }
  }
  if (t && t.deleted && typeof t.deleted === 'object') out.deleted = t.deleted;
  if (!Object.keys(out.people).length) out.people.me = newPerson('Me');
  return out;
}

function loadTracker() {
  try {
    const raw = localStorage.getItem(TRACKER_KEY);
    return raw ? normalizeTracker(JSON.parse(raw)) : defaultTracker();
  } catch (err) {
    console.warn('Could not load food log.', err);
    return defaultTracker();
  }
}

function saveTracker(t, opts) {
  try {
    localStorage.setItem(TRACKER_KEY, JSON.stringify(t));
  } catch (err) {
    // Most likely quota: drop photo thumbnails from older entries and retry.
    pruneThumbs(t, 14);
    try {
      localStorage.setItem(TRACKER_KEY, JSON.stringify(t));
    } catch (err2) {
      console.warn('Could not save food log.', err2);
    }
  }
  if (!(opts && opts.silent) && typeof syncOnWrite === 'function') syncOnWrite();
}

function pruneThumbs(t, keepDays) {
  const cutoff = shiftDateKey(dateKey(), -keepDays);
  for (const p of Object.values(t.people)) {
    for (const [day, entries] of Object.entries(p.log)) {
      if (day < cutoff) for (const e of entries) delete e.thumb;
    }
  }
}

function getActivePersonId(t) {
  let id = null;
  try {
    id = localStorage.getItem(ACTIVE_PERSON_KEY);
  } catch (e) {
    /* ignore */
  }
  if (id && t.people[id]) return id;
  return Object.keys(t.people)[0];
}

function setActivePersonId(id) {
  try {
    localStorage.setItem(ACTIVE_PERSON_KEY, id);
  } catch (e) {
    /* ignore */
  }
}

/* ---- Entries & totals ---- */
function itemTotals(item) {
  const q = Number(item.qty) > 0 ? Number(item.qty) : 1;
  const n = cleanNutrients(item.nutrients);
  for (const k in n) n[k] *= q;
  return n;
}

function entryTotals(entry) {
  const t = zeroPanel();
  for (const it of entry.items || []) {
    const n = itemTotals(it);
    for (const k in t) t[k] += n[k];
  }
  return t;
}

function dayEntries(person, day) {
  return (person.log[day] || []).slice().sort((a, b) => MEALS.indexOf(a.meal) - MEALS.indexOf(b.meal) || a.createdAt - b.createdAt);
}

function dayTotals(person, day) {
  const t = zeroPanel();
  for (const e of person.log[day] || []) {
    const n = entryTotals(e);
    for (const k in t) t[k] += n[k];
  }
  return t;
}

function upsertEntry(t, pid, day, entry) {
  const p = t.people[pid];
  // Remove from any other day first (editing can move an entry).
  for (const d of Object.keys(p.log)) {
    p.log[d] = p.log[d].filter((e) => e.id !== entry.id);
    if (!p.log[d].length) delete p.log[d];
  }
  entry.updatedAt = Date.now();
  (p.log[day] = p.log[day] || []).push(entry);
}

function deleteEntry(t, pid, entryId) {
  const p = t.people[pid];
  for (const d of Object.keys(p.log)) {
    p.log[d] = p.log[d].filter((e) => e.id !== entryId);
    if (!p.log[d].length) delete p.log[d];
  }
  t.deleted[entryId] = Date.now();
}

// Build a log entry from a recipe (planned meal or recipe library).
function entryFromRecipe(recipe, meal) {
  const n = recipeNutrition(recipe);
  return {
    id: newId(),
    meal: meal || mealForTime(),
    name: recipe.name,
    source: 'recipe',
    recipeId: recipe.id,
    createdAt: Date.now(),
    items: [{ name: recipe.name, portion: '1 serving', grams: 0, qty: 1, confidence: 'high', nutrients: cleanNutrients(n) }],
  };
}

/* ---- Goals ---- */
const KG_PER_LB = 0.45359237;
const CM_PER_IN = 2.54;

// Mifflin-St Jeor BMR x activity factor, then a goal adjustment of about
// 500 kcal/day per lb/week (3500 kcal per lb). Protein is set per kg of body
// weight by goal; fat uses the app's fat-% target; carbs fill the remainder.
function computeTargets(profile, fatPercent) {
  const p = profile;
  const w = Number(p.weightKg) || 70;
  const h = Number(p.heightCm) || 168;
  const a = Number(p.age) || 35;
  const bmr = 10 * w + 6.25 * h - 5 * a + (p.sex === 'male' ? 5 : -161);
  const act = ACTIVITY_LEVELS.find((x) => x.key === p.activity) || ACTIVITY_LEVELS[1];
  const tdee = bmr * act.factor;
  const rate = Math.min(Math.max(Number(p.rateLbPerWeek) || 0, 0), 2);
  let calories = tdee;
  if (p.goal === 'lose') calories = tdee - rate * 500;
  if (p.goal === 'gain') calories = tdee + Math.min(rate, 1) * 500;
  const floor = p.sex === 'male' ? 1500 : 1200;
  const floored = calories < floor;
  calories = Math.round(Math.max(calories, floor) / 10) * 10;

  // Higher protein when cutting (preserves muscle) or building.
  const proteinPerKg = p.goal === 'maintain' ? 1.4 : 1.8;
  const protein = Math.round(w * proteinPerKg);
  const fp = Number(fatPercent) > 0 ? Number(fatPercent) : 30;
  const fat = Math.round((calories * fp) / 100 / 9);
  const carbs = Math.max(0, Math.round((calories - protein * 4 - fat * 9) / 4));

  const fiber = Math.round((calories / 1000) * 14); // 14 g per 1000 kcal (Dietary Guidelines)
  const auto = { calories, protein, carbs, fat, fiber, bmr: Math.round(bmr), tdee: Math.round(tdee), floored };

  if (p.custom) {
    for (const k of ['calories', 'protein', 'carbs', 'fat']) {
      const v = Number(p.custom[k]);
      if (Number.isFinite(v) && v > 0) auto[k] = Math.round(v);
    }
  }
  return auto;
}

// Target for any panel nutrient: personalised macros, DV for the rest.
function targetFor(key, targets) {
  if (targets && targets[key]) return targets[key];
  const n = PANEL.find((x) => x.key === key);
  return n ? n.dv : 0;
}

/* ---- Units ---- */
function kgToDisplay(kg, units) {
  return units === 'metric' ? `${Math.round(kg * 10) / 10} kg` : `${Math.round((kg / KG_PER_LB) * 10) / 10} lb`;
}

/* ---- Streak ---- */
function loggingStreak(person) {
  let day = dateKey();
  if (!(person.log[day] && person.log[day].length)) day = shiftDateKey(day, -1); // today not logged yet doesn't break it
  let n = 0;
  while (person.log[day] && person.log[day].length) {
    n++;
    day = shiftDateKey(day, -1);
  }
  return n;
}

/* ---- Sync merge ---- */
// Merge a remote tracker into a local one without losing either side's
// entries: union of entries by id (newest updatedAt wins), tombstones win
// over entries, newest profile/weight/water wins. Thumbnails stay local.
function mergeTrackers(local, remote) {
  const L = normalizeTracker(local);
  const R = normalizeTracker(remote);
  const out = { people: {}, deleted: Object.assign({}, R.deleted, L.deleted) };
  const ids = new Set([...Object.keys(L.people), ...Object.keys(R.people)]);
  for (const pid of ids) {
    if (out.deleted[`person:${pid}`]) continue;
    const a = L.people[pid];
    const b = R.people[pid];
    if (!a || !b) {
      out.people[pid] = JSON.parse(JSON.stringify(a || b));
      continue;
    }
    const person = {
      profile: (b.profile.updatedAt || 0) > (a.profile.updatedAt || 0) ? b.profile : a.profile,
      log: {},
      weights: mergeStamped(a.weights, b.weights),
      water: mergeStamped(a.water, b.water),
    };
    const byId = new Map();
    const place = (entries, day, isLocal) => {
      for (const e of entries || []) {
        const cur = byId.get(e.id);
        if (!cur || (e.updatedAt || 0) > (cur.e.updatedAt || 0)) {
          const keepThumb = cur && cur.e.thumb && !e.thumb ? cur.e.thumb : null;
          const copy = Object.assign({}, e);
          if (keepThumb) copy.thumb = keepThumb;
          byId.set(e.id, { e: copy, day });
        } else if (isLocal && e.thumb && !cur.e.thumb) {
          cur.e.thumb = e.thumb;
        }
      }
    };
    for (const [day, entries] of Object.entries(b.log)) place(entries, day, false);
    for (const [day, entries] of Object.entries(a.log)) place(entries, day, true);
    for (const { e, day } of byId.values()) {
      if (out.deleted[e.id]) continue;
      (person.log[day] = person.log[day] || []).push(e);
    }
    out.people[pid] = person;
  }
  // Keep tombstones for 60 days only.
  const cutoff = Date.now() - 60 * 864e5;
  for (const [id, ts] of Object.entries(out.deleted)) if (ts < cutoff) delete out.deleted[id];
  return out;
}

function mergeStamped(a, b) {
  const out = Object.assign({}, a);
  for (const [k, v] of Object.entries(b || {})) {
    if (!out[k] || (v.updatedAt || 0) > (out[k].updatedAt || 0)) out[k] = v;
  }
  return out;
}

// Copy for syncing: strip photo thumbnails to keep the shared row small.
function trackerForSync(t) {
  const copy = JSON.parse(JSON.stringify(t));
  for (const p of Object.values(copy.people)) {
    for (const entries of Object.values(p.log)) for (const e of entries) delete e.thumb;
  }
  return copy;
}
