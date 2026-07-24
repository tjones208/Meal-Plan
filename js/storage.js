/*
 * Persistence layer.
 *
 * The whole app state (the current week's meal plan and the checked-off items
 * on the shopping list) is stored in localStorage so a plan survives a page
 * refresh. Everything is namespaced under a single key.
 */

const STORAGE_KEY = 'mealplan.state.v1';

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
