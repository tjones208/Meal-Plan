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
