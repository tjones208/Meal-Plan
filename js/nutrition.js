/*
 * Daily nutrition tracking.
 *
 * Sums calories and macronutrients across the meals planned for each day so
 * you can see whether a day is well balanced. Totals are compared against
 * general reference daily targets (based on an average ~2000 kcal adult diet).
 * These are guideline reference values, not personalised medical advice.
 *
 * A planned meal contributes one serving, matching how the planner already
 * counts calories.
 */

// Reference daily values. calories/protein/carbs/fat/sugar/fiber in grams
// (calories in kcal); sodium in mg. Sugar and sodium are upper-limit guides.
const DAILY_TARGETS = {
  calories: 2000,
  protein: 50,
  carbs: 275,
  fat: 70,
  sugar: 50,
  fiber: 28,
  sodium: 2300,
};

// Display metadata for each tracked nutrient. `limit: true` means "stay under"
// (going over is flagged), otherwise the target is a "goal to reach".
const NUTRIENTS = [
  { key: 'calories', label: 'Calories', unit: 'kcal', limit: false },
  { key: 'protein', label: 'Protein', unit: 'g', limit: false },
  { key: 'carbs', label: 'Carbs', unit: 'g', limit: false },
  { key: 'fat', label: 'Fat', unit: 'g', limit: true },
  { key: 'sugar', label: 'Sugar', unit: 'g', limit: true },
  { key: 'fiber', label: 'Fiber', unit: 'g', limit: false },
  { key: 'sodium', label: 'Sodium', unit: 'mg', limit: true },
];

// Normalise a recipe's nutrition into a full totals object, defaulting any
// missing field to 0 (older custom recipes may predate the nutrition fields).
function recipeNutrition(recipe) {
  const n = (recipe && recipe.nutrition) || {};
  return {
    calories: recipe && typeof recipe.calories === 'number' ? recipe.calories : 0,
    protein: Number(n.protein) || 0,
    carbs: Number(n.carbs) || 0,
    fat: Number(n.fat) || 0,
    sugar: Number(n.sugar) || 0,
    fiber: Number(n.fiber) || 0,
    sodium: Number(n.sodium) || 0,
  };
}

function emptyTotals() {
  return { calories: 0, protein: 0, carbs: 0, fat: 0, sugar: 0, fiber: 0, sodium: 0 };
}

function addTotals(a, b) {
  const out = {};
  for (const k in a) out[k] = a[k] + b[k];
  return out;
}

// Totals for a single day of the plan.
function dayNutrition(plan, day) {
  let totals = emptyTotals();
  for (const slot of SLOTS) {
    const id = plan[day] && plan[day][slot];
    if (!id) continue;
    const recipe = getRecipeById(id);
    if (!recipe) continue;
    totals = addTotals(totals, recipeNutrition(recipe));
  }
  return totals;
}

// Per-slot breakdown plus totals for a day.
function dayBreakdown(plan, day) {
  const meals = [];
  for (const slot of SLOTS) {
    const id = plan[day] && plan[day][slot];
    const recipe = id ? getRecipeById(id) : null;
    meals.push({ slot, recipe, nutrition: recipe ? recipeNutrition(recipe) : null });
  }
  return { totals: dayNutrition(plan, day), meals, hasMeals: meals.some((m) => m.recipe) };
}

// Whole-week totals: per day, plus an average over the days that have meals.
function weekNutrition(plan) {
  const perDay = {};
  let sum = emptyTotals();
  let daysWithMeals = 0;
  for (const day of DAYS) {
    const totals = dayNutrition(plan, day);
    perDay[day] = totals;
    if (SLOTS.some((s) => plan[day] && plan[day][s])) {
      daysWithMeals++;
      sum = addTotals(sum, totals);
    }
  }
  const average = emptyTotals();
  if (daysWithMeals) for (const k in average) average[k] = Math.round(sum[k] / daysWithMeals);
  return { perDay, average, daysWithMeals };
}

// Summed totals across the whole week (all planned meals).
function weekTotals(plan) {
  let totals = emptyTotals();
  for (const day of DAYS) totals = addTotals(totals, dayNutrition(plan, day));
  return totals;
}

/*
 * Adjust a plan so its weekly calorie and/or fat totals fit under the given
 * limits, by swapping planned meals for lower-calorie / lower-fat options.
 *
 * Greedy and safe: on each pass it makes the single swap that most reduces a
 * limit currently being exceeded, and never chooses a swap that would worsen
 * an exceeded limit — so the exceeded totals strictly decrease and the loop
 * always terminates. Swaps respect the active dietary filters and only draw
 * from recipes valid for that slot. Returns best effort if a limit cannot be
 * met with the available recipes.
 *
 * budget = { calories: number|null, fat: number|null, fatPercent: number|null }
 *   - calories:   weekly calorie ceiling (kcal)
 *   - fat:        weekly fat ceiling (grams)
 *   - fatPercent: target share of calories from fat (%), applied to the week
 * Any subset may be set; the adjuster honours all that are present. The two
 * fat constraints (gram ceiling and % target) both drive "reduce fat".
 *
 * Returns { plan, totals, met: { calories, fat, fatPercent }, swaps }
 */
function adjustPlanToLimits(plan, prefs, budget) {
  const p = JSON.parse(JSON.stringify(plan));
  const hasCal = budget && budget.calories > 0;
  const hasFatGram = budget && budget.fat > 0;
  const hasFatPct = budget && budget.fatPercent > 0;
  if (!hasCal && !hasFatGram && !hasFatPct) {
    return { plan: p, totals: weekTotals(p), met: { calories: true, fat: true, fatPercent: true }, swaps: 0 };
  }

  // Candidate pool per slot: diet-matching recipes for that slot (ignore the
  // per-meal calorie cap so we can reach the lowest-fat / lowest-calorie options).
  const poolPrefs = { diets: (prefs && prefs.diets) || [], maxCalories: 0, slots: SLOTS };
  const pools = {};
  for (const slot of SLOTS) pools[slot] = candidatesForSlot(slot, poolPrefs);

  let swaps = 0;
  const MAX_ITERS = 400;
  for (let iter = 0; iter < MAX_ITERS; iter++) {
    const totals = weekTotals(p);
    const curFatPct = fatCaloriePercent(totals);
    const overCal = hasCal && totals.calories > budget.calories;
    const overFatGram = hasFatGram && totals.fat > budget.fat;
    const overFatPct = hasFatPct && curFatPct > budget.fatPercent;
    if (!overCal && !overFatGram && !overFatPct) break;

    let best = null; // { day, slot, id, gain }
    for (const day of DAYS) {
      for (const slot of SLOTS) {
        const id = p[day][slot];
        if (!id) continue;
        const cur = getRecipeById(id);
        if (!cur) continue;
        const curN = recipeNutrition(cur);
        for (const cand of pools[slot]) {
          if (cand.id === id) continue;
          const cN = recipeNutrition(cand);
          // Resulting weekly totals if we made this swap.
          const newCal = totals.calories - curN.calories + cN.calories;
          const newFat = totals.fat - curN.fat + cN.fat;
          const newFatPct = newCal > 0 ? ((newFat * 9) / newCal) * 100 : 0;

          // Never worsen a constraint that is currently exceeded.
          if (overCal && newCal > totals.calories) continue;
          if (overFatGram && newFat > totals.fat) continue;
          if (overFatPct && newFatPct > curFatPct + 1e-9) continue;

          // Reward reductions in the exceeded constraint(s), scaled to be
          // comparable in magnitude (grams of fat as the base unit).
          let gain = 0;
          if (overCal) gain += (totals.calories - newCal) / 15;
          if (overFatGram) gain += totals.fat - newFat;
          if (overFatPct) gain += (curFatPct - newFatPct) * 3;
          if (gain <= 1e-9) continue;
          if (!best || gain > best.gain) best = { day, slot, id: cand.id, gain };
        }
      }
    }
    if (!best) break; // no further improvement possible
    p[best.day][best.slot] = best.id;
    swaps++;
  }

  const totals = weekTotals(p);
  return {
    plan: p,
    totals,
    met: {
      calories: !hasCal || totals.calories <= budget.calories,
      fat: !hasFatGram || totals.fat <= budget.fat,
      fatPercent: !hasFatPct || fatCaloriePercent(totals) <= budget.fatPercent,
    },
    swaps,
  };
}

// Research-based guidance for the share of calories that should come from fat.
// The Acceptable Macronutrient Distribution Range (AMDR) from the National
// Academies of Sciences (Institute of Medicine) is 20-35% of total calories
// from fat for adults; the WHO advises keeping total fat at or below 30%.
const FAT_PERCENT_REC = {
  min: 20,
  max: 35,
  suggested: 30,
  note: 'Recommended: 20-35% of calories from fat (AMDR, National Academies of Sciences). The WHO advises keeping total fat at or below 30%.',
};

// Percent of a nutrition total's calories that come from fat (9 kcal/g).
function fatCaloriePercent(totals) {
  if (!totals || totals.calories <= 0) return 0;
  return Math.round(((totals.fat * 9) / totals.calories) * 100);
}

// Percent of a single recipe's calories from fat.
function recipeFatPercent(recipe) {
  return fatCaloriePercent(recipeNutrition(recipe));
}

// Macro split as a share of calories (protein/carbs each 4 kcal/g, fat 9).
function macroSplit(totals) {
  const p = totals.protein * 4;
  const c = totals.carbs * 4;
  const f = totals.fat * 9;
  const sum = p + c + f;
  if (sum <= 0) return { protein: 0, carbs: 0, fat: 0 };
  return {
    protein: Math.round((p / sum) * 100),
    carbs: Math.round((c / sum) * 100),
    fat: Math.round((f / sum) * 100),
  };
}
