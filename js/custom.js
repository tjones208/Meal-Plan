/*
 * Custom meals: create your own recipes and (best-effort) import them from a
 * link such as a Pinterest pin or a recipe blog.
 *
 * Everything here produces a recipe object in the same shape as the built-in
 * database (see js/recipes.js), so custom meals flow through the planner,
 * suggestions, shopping list and cooking instructions unchanged. Custom
 * recipes carry two extra fields:
 *   - custom: true        -> shown with a "Custom" badge, and can be deleted
 *   - sourceUrl: string   -> optional link back to where it came from
 *
 * NOTE ON LINK IMPORT: this is a backend-free app running in the browser, so
 * it cannot reliably scrape arbitrary sites — most (including Pinterest) block
 * cross-origin requests. importRecipeFromUrl() therefore makes a best-effort
 * attempt to read a page's recipe metadata and always falls back to letting
 * you finish the details by hand, with the original link saved either way.
 */

// Keyword -> aisle heuristics so parsed/imported ingredients still land in a
// sensible grocery aisle for the shopping list.
const AISLE_KEYWORDS = [
  ['Meat & Seafood', ['chicken', 'beef', 'pork', 'turkey', 'bacon', 'sausage', 'salmon', 'shrimp', 'prawn', 'tuna', 'cod', 'fish', 'steak', 'lamb', 'ham', 'mince', 'ground ']],
  ['Dairy & Eggs', ['milk', 'cheese', 'butter', 'yogurt', 'yoghurt', 'cream', 'egg', 'mozzarella', 'parmesan', 'feta', 'ricotta', 'tofu']],
  ['Produce', ['lettuce', 'tomato', 'onion', 'garlic', 'pepper', 'spinach', 'carrot', 'celery', 'potato', 'broccoli', 'cucumber', 'avocado', 'lemon', 'lime', 'banana', 'apple', 'berry', 'berries', 'mushroom', 'zucchini', 'cilantro', 'parsley', 'basil', 'ginger', 'kale', 'cabbage', 'corn', 'peas', 'bean sprout', 'scallion', 'shallot', 'herb']],
  ['Bakery', ['bread', 'tortilla', 'bagel', 'bun', 'roll', 'pita', 'naan', 'croissant', 'muffin']],
  ['Grains & Pasta', ['rice', 'pasta', 'spaghetti', 'noodle', 'oats', 'quinoa', 'flour', 'couscous', 'barley', 'cereal', 'granola', 'breadcrumb', 'tortellini', 'linguine', 'penne']],
  ['Canned Goods', ['can ', 'canned', 'broth', 'stock', 'beans', 'chickpea', 'lentil', 'coconut milk', 'tomato sauce', 'marinara', 'corn kernel', 'olives']],
  ['Spices', ['salt', 'pepper', 'cumin', 'paprika', 'cinnamon', 'oregano', 'chili powder', 'curry powder', 'turmeric', 'nutmeg', 'cayenne', 'spice', 'seasoning']],
  ['Condiments & Baking', ['oil', 'vinegar', 'sauce', 'sugar', 'honey', 'syrup', 'ketchup', 'mustard', 'mayo', 'soy sauce', 'baking powder', 'baking soda', 'vanilla', 'peanut butter', 'jam', 'dressing', 'hummus', 'salsa', 'stock cube']],
];

function guessAisle(itemName) {
  const s = (' ' + itemName + ' ').toLowerCase();
  for (const [aisle, words] of AISLE_KEYWORDS) {
    for (const w of words) {
      if (s.includes(w)) return aisle;
    }
  }
  return 'Other';
}

// Map free-text unit words to the app's canonical units.
const UNIT_WORDS = {
  cup: 'cup', cups: 'cup',
  tbsp: 'tbsp', tablespoon: 'tbsp', tablespoons: 'tbsp',
  tsp: 'tsp', teaspoon: 'tsp', teaspoons: 'tsp',
  g: 'g', gram: 'g', grams: 'g',
  kg: 'g', // approximate; kept in grams family
  oz: 'oz', ounce: 'oz', ounces: 'oz',
  lb: 'lb', lbs: 'lb', pound: 'lb', pounds: 'lb',
  can: 'can', cans: 'can',
  clove: 'clove', cloves: 'clove',
  block: 'block',
  slice: 'slice', slices: 'slice',
  ml: 'ml',
  pinch: 'pinch',
};

// Turn "1 1/2 cups flour" into { item:'flour', qty:1.5, unit:'cup', aisle:... }.
function parseIngredientLine(line) {
  const raw = (line || '').trim().replace(/\s+/g, ' ');
  if (!raw) return null;

  let rest = raw;
  let qty = 1;
  let unit = 'unit';

  // Leading quantity: mixed number "1 1/2", fraction "1/2", or decimal "0.5".
  const qtyMatch = rest.match(/^(\d+\s+\d+\/\d+|\d+\/\d+|\d*\.?\d+)\s*(.*)$/);
  if (qtyMatch) {
    qty = parseQuantity(qtyMatch[1]);
    rest = qtyMatch[2];
  }

  // Optional unit word.
  const unitMatch = rest.match(/^([a-zA-Z]+)\.?\s+(.*)$/);
  if (unitMatch) {
    const cand = unitMatch[1].toLowerCase();
    if (UNIT_WORDS[cand]) {
      unit = UNIT_WORDS[cand];
      rest = unitMatch[2];
    }
  }

  const item = rest.trim().replace(/^of\s+/i, '') || raw;
  return { item: item.toLowerCase(), qty: qty || 1, unit, aisle: guessAisle(item) };
}

function parseQuantity(str) {
  str = str.trim();
  if (str.includes(' ')) {
    const [whole, frac] = str.split(' ');
    return Number(whole) + parseQuantity(frac);
  }
  if (str.includes('/')) {
    const [a, b] = str.split('/').map(Number);
    return b ? a / b : a;
  }
  const n = Number(str);
  return Number.isFinite(n) ? n : 1;
}

function slugify(text) {
  return (text || 'meal')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40) || 'meal';
}

// Build a unique custom-recipe id that will not collide with existing recipes.
function makeCustomId(name) {
  const base = 'custom-' + slugify(name);
  let id = base;
  let n = 2;
  while (getRecipeById(id)) {
    id = `${base}-${n++}`;
  }
  return id;
}

/*
 * Assemble a recipe object from raw form fields.
 * fields = {
 *   name, mealTypes:[], tags:[], servings, calories, prepTime, cookTime,
 *   ingredientsText (one per line), stepsText (one per line), sourceUrl
 * }
 * Returns { recipe } or { error } for validation problems.
 */
function buildRecipeFromForm(fields) {
  const name = (fields.name || '').trim();
  if (!name) return { error: 'Please give your meal a name.' };

  const mealTypes = (fields.mealTypes || []).filter((m) => MEAL_TYPES.includes(m));
  if (mealTypes.length === 0) return { error: 'Pick at least one meal type (breakfast, lunch, dinner or snack).' };

  const ingredients = (fields.ingredientsText || '')
    .split('\n')
    .map(parseIngredientLine)
    .filter(Boolean);
  if (ingredients.length === 0) return { error: 'Add at least one ingredient (one per line).' };

  const steps = (fields.stepsText || '')
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
  if (steps.length === 0) return { error: 'Add at least one cooking step (one per line).' };

  const num = (v, d) => {
    const n = parseInt(v, 10);
    return Number.isFinite(n) && n >= 0 ? n : d;
  };

  const recipe = {
    id: fields.id || makeCustomId(name),
    name,
    mealTypes,
    tags: (fields.tags || []).slice(),
    servings: num(fields.servings, 2) || 2,
    calories: num(fields.calories, 0),
    prepTime: num(fields.prepTime, 0),
    cookTime: num(fields.cookTime, 0),
    ingredients,
    steps,
    custom: true,
  };
  const url = (fields.sourceUrl || '').trim();
  if (url) recipe.sourceUrl = url;
  return { recipe };
}

/*
 * Best-effort import of recipe details from a URL.
 *
 * Returns a Promise that resolves to a prefill object:
 *   { name, ingredientsText, stepsText, servings, calories, sourceUrl, imported, message }
 * `imported` is true only if we actually read structured data from the page.
 * On any failure (CORS, network, no recipe data) it still returns a usable
 * prefill (name guessed from the URL) so the user can finish by hand.
 */
async function importRecipeFromUrl(url) {
  const clean = (url || '').trim();
  const fallback = {
    name: guessNameFromUrl(clean),
    ingredientsText: '',
    stepsText: '',
    servings: '',
    calories: '',
    sourceUrl: clean,
    imported: false,
    message:
      'Could not read that page automatically (many sites, including Pinterest, block direct access). ' +
      'Fill in the details below — your link is saved with the meal.',
  };
  if (!/^https?:\/\//i.test(clean)) {
    fallback.message = 'That does not look like a web address. Enter the details below manually.';
    return fallback;
  }

  try {
    const res = await fetch(clean, { headers: { Accept: 'text/html' } });
    if (!res.ok) return fallback;
    const html = await res.text();
    const data = extractRecipeFromHtml(html);
    if (!data) return fallback;
    return {
      name: data.name || fallback.name,
      ingredientsText: (data.ingredients || []).join('\n'),
      stepsText: (data.steps || []).join('\n'),
      servings: data.servings || '',
      calories: data.calories || '',
      sourceUrl: clean,
      imported: true,
      message: 'Imported details from the link. Review and tweak anything below, then save.',
    };
  } catch (err) {
    return fallback;
  }
}

function guessNameFromUrl(url) {
  try {
    const u = new URL(url);
    const seg = u.pathname.split('/').filter(Boolean).pop() || u.hostname;
    return seg
      .replace(/\.[a-z]+$/i, '')
      .replace(/[-_]+/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase())
      .trim() || 'Imported Meal';
  } catch (e) {
    return 'Imported Meal';
  }
}

// Pull recipe fields out of a page's JSON-LD (schema.org Recipe) or, failing
// that, its Open Graph title. Returns null if nothing useful is found.
function extractRecipeFromHtml(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');

  // 1) schema.org Recipe via JSON-LD
  const scripts = doc.querySelectorAll('script[type="application/ld+json"]');
  for (const s of scripts) {
    let json;
    try {
      json = JSON.parse(s.textContent);
    } catch (e) {
      continue;
    }
    const recipe = findRecipeNode(json);
    if (recipe) {
      return {
        name: recipe.name,
        ingredients: toArray(recipe.recipeIngredient),
        steps: normalizeInstructions(recipe.recipeInstructions),
        servings: typeof recipe.recipeYield === 'string' || typeof recipe.recipeYield === 'number'
          ? parseInt(recipe.recipeYield, 10) || ''
          : '',
        calories: recipe.nutrition && recipe.nutrition.calories
          ? parseInt(recipe.nutrition.calories, 10) || ''
          : '',
      };
    }
  }

  // 2) Open Graph title only (no ingredients/steps available)
  const og = doc.querySelector('meta[property="og:title"]');
  if (og && og.getAttribute('content')) {
    return { name: og.getAttribute('content'), ingredients: [], steps: [] };
  }
  return null;
}

// JSON-LD may be a single object, an array, or use @graph.
function findRecipeNode(json) {
  const nodes = [];
  const walk = (n) => {
    if (!n || typeof n !== 'object') return;
    if (Array.isArray(n)) return n.forEach(walk);
    if (n['@graph']) walk(n['@graph']);
    nodes.push(n);
  };
  walk(json);
  return nodes.find((n) => {
    const t = n['@type'];
    return t === 'Recipe' || (Array.isArray(t) && t.includes('Recipe'));
  }) || null;
}

function toArray(v) {
  if (!v) return [];
  return Array.isArray(v) ? v.map(String) : [String(v)];
}

// recipeInstructions can be strings, HowToStep objects, or nested sections.
function normalizeInstructions(instr) {
  if (!instr) return [];
  const out = [];
  const push = (x) => {
    if (!x) return;
    if (typeof x === 'string') out.push(x.trim());
    else if (Array.isArray(x)) x.forEach(push);
    else if (x.text) out.push(String(x.text).trim());
    else if (x.itemListElement) push(x.itemListElement);
  };
  push(instr);
  return out.filter(Boolean);
}
