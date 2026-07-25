/*
 * Persistence layer.
 *
 * The whole app state (the current week's meal plan and the checked-off items
 * on the shopping list) is stored in localStorage so a plan survives a page
 * refresh. Everything is namespaced under a single key.
 */

const STORAGE_KEY = 'mealplan.state.v1';

// Custom (user-created) recipes are persisted separately so they survive
// clearing a meal plan and can grow independently of the weekly state.
const CUSTOM_KEY = 'mealplan.custom.v1';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// Slots we schedule per day. Keep in sync with the planner grid in app.js.
const SLOTS = ['breakfast', 'lunch', 'dinner'];

function emptyPlan() {
  // plan[day][slot] = recipeId | null
  const plan = {};
  for (const day of DAYS) {
    plan[day] = {};
    for (const slot of SLOTS) {
      plan[day][slot] = null;
    }
  }
  return plan;
}

function defaultState() {
  return {
    plan: emptyPlan(),
    // Items the user has ticked off the shopping list, keyed by item name.
    checkedItems: {},
    // Weekly nutrition budgets. null = no limit set.
    limits: { calories: null, fat: null },
    // Recipe ids the user removed; excluded from suggestions & auto-generate.
    hidden: [],
    // Target share of calories from fat (%). Default is the mid/upper of the
    // recommended 20-35% AMDR range (see js/nutrition.js).
    fatPercent: 30,
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    // Merge onto defaults so older/partial saved state still loads cleanly.
    const state = defaultState();
    if (parsed.plan) {
      for (const day of DAYS) {
        if (parsed.plan[day]) {
          for (const slot of SLOTS) {
            if (parsed.plan[day][slot] && getRecipeById(parsed.plan[day][slot])) {
              state.plan[day][slot] = parsed.plan[day][slot];
            }
          }
        }
      }
    }
    if (parsed.checkedItems && typeof parsed.checkedItems === 'object') {
      state.checkedItems = parsed.checkedItems;
    }
    if (parsed.limits && typeof parsed.limits === 'object') {
      const c = Number(parsed.limits.calories);
      const f = Number(parsed.limits.fat);
      state.limits = {
        calories: Number.isFinite(c) && c > 0 ? c : null,
        fat: Number.isFinite(f) && f > 0 ? f : null,
      };
    }
    if (Array.isArray(parsed.hidden)) {
      state.hidden = parsed.hidden.filter((id) => typeof id === 'string');
    }
    const fp = Number(parsed.fatPercent);
    if (Number.isFinite(fp) && fp > 0 && fp <= 100) state.fatPercent = fp;
    return state;
  } catch (err) {
    console.warn('Could not load saved plan, starting fresh.', err);
    return defaultState();
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn('Could not save plan.', err);
  }
}

/* ------------------------------------------------------------------ *
 * Custom recipe persistence
 * ------------------------------------------------------------------ */

// Load the user's custom recipes, tolerating missing/corrupt data.
function loadCustomRecipes() {
  try {
    const raw = localStorage.getItem(CUSTOM_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((r) => r && r.id && r.name) : [];
  } catch (err) {
    console.warn('Could not load custom recipes.', err);
    return [];
  }
}

function saveCustomRecipes(list) {
  try {
    localStorage.setItem(CUSTOM_KEY, JSON.stringify(list || []));
  } catch (err) {
    console.warn('Could not save custom recipes.', err);
  }
}
