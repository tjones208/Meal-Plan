/*
 * Meal-plan suggestion engine.
 *
 * Given a set of preferences (dietary filters, max calories, and which slots
 * to fill), this builds a full week's plan by picking recipes that match each
 * slot while avoiding repeating the same recipe too often in a row.
 */

// Return recipes valid for a given slot, honouring the active diet filters and
// calorie ceiling.
function candidatesForSlot(slot, prefs) {
  return getAllRecipes().filter((recipe) => {
    if (isHidden(recipe.id)) return false;
    if (!recipe.mealTypes.includes(slot)) return false;
    if (prefs.maxCalories && recipe.calories > prefs.maxCalories) return false;
    for (const diet of prefs.diets) {
      if (!recipe.tags.includes(diet)) return false;
    }
    return true;
  });
}

// Every meal available for a slot (custom first, then alphabetical), used by
// the picker so you can browse the full set rather than a small sample.
function mealsForSlot(slot, prefs) {
  const c = candidatesForSlot(slot, prefs || { diets: [], maxCalories: 0 });
  const byName = (a, b) => a.name.localeCompare(b.name);
  return c.filter((r) => r.custom).sort(byName).concat(c.filter((r) => !r.custom).sort(byName));
}

// Deterministic-ish shuffle seeded by an index so repeated calls vary without
// needing Math.random (kept simple and dependency-free).
function rotate(arr, seed) {
  if (arr.length === 0) return arr;
  const offset = seed % arr.length;
  return arr.slice(offset).concat(arr.slice(0, offset));
}

/*
 * Build a full week plan.
 *
 * prefs = {
 *   diets: string[],        // e.g. ['vegetarian']
 *   maxCalories: number|0,  // 0 = no limit
 *   slots: string[],        // which of SLOTS to fill
 * }
 *
 * Returns { plan, warnings } where warnings lists any slot that had no match.
 */
function generateWeekPlan(prefs) {
  const plan = emptyPlan();
  const warnings = [];
  let seed = 0;

  for (const slot of SLOTS) {
    if (!prefs.slots.includes(slot)) continue;

    const candidates = candidatesForSlot(slot, prefs);
    if (candidates.length === 0) {
      warnings.push(slot);
      continue;
    }

    // Walk the days, cycling through the shuffled candidates and avoiding an
    // immediate repeat of the previous day's pick where possible.
    let pool = rotate(candidates, seed++);
    let poolIndex = 0;
    let prevId = null;

    for (const day of DAYS) {
      let pick = pool[poolIndex % pool.length];
      if (pool.length > 1 && pick.id === prevId) {
        poolIndex++;
        pick = pool[poolIndex % pool.length];
      }
      plan[day][slot] = pick.id;
      prevId = pick.id;
      poolIndex++;
    }
  }

  return { plan, warnings };
}

// Suggest a handful of individual recipes for a single slot — used by the
// "surprise me" picker when a user clicks an empty cell.
function suggestForSlot(slot, prefs, limit = 6) {
  const candidates = candidatesForSlot(slot, prefs || { diets: [], maxCalories: 0 });
  // Surface the user's own custom meals first so they are easy to find, then
  // a rotating selection of built-in recipes.
  const custom = candidates.filter((r) => r.custom);
  const builtIn = rotate(candidates.filter((r) => !r.custom), slot.length);
  return custom.concat(builtIn).slice(0, limit);
}
