/*
 * Shopping list builder.
 *
 * Aggregates every ingredient from every recipe in the current plan, summing
 * quantities of the same item + unit and grouping the result by grocery aisle
 * so the list reads in the order you'd walk a store.
 */

// A readable label for a summed quantity, e.g. "1.5 cup" or "3 unit" -> "x3".
function formatQuantity(qty, unit) {
  // Round to at most 2 decimals and strip trailing zeros.
  const rounded = Math.round(qty * 100) / 100;
  if (unit === 'unit') {
    return `x${rounded}`;
  }
  return `${rounded} ${unit}`;
}

/*
 * Build the shopping list from a plan.
 *
 * Returns an array of aisle groups:
 *   [{ aisle, items: [{ key, item, qty, unit, label, recipes: [names] }] }]
 */
function buildShoppingList(plan) {
  // Map keyed by "item|unit" so we only sum compatible quantities.
  const map = new Map();

  for (const day of DAYS) {
    for (const slot of SLOTS) {
      const recipeId = plan[day][slot];
      if (!recipeId) continue;
      const recipe = getRecipeById(recipeId);
      if (!recipe) continue;

      for (const ing of recipe.ingredients) {
        const key = `${ing.item}|${ing.unit}`;
        if (!map.has(key)) {
          map.set(key, {
            key,
            item: ing.item,
            unit: ing.unit,
            aisle: ing.aisle || 'Other',
            qty: 0,
            recipes: new Set(),
          });
        }
        const entry = map.get(key);
        entry.qty += ing.qty;
        entry.recipes.add(recipe.name);
      }
    }
  }

  // Group by aisle.
  const byAisle = new Map();
  for (const entry of map.values()) {
    if (!byAisle.has(entry.aisle)) byAisle.set(entry.aisle, []);
    byAisle.get(entry.aisle).push({
      key: entry.key,
      item: entry.item,
      qty: entry.qty,
      unit: entry.unit,
      label: formatQuantity(entry.qty, entry.unit),
      recipes: Array.from(entry.recipes).sort(),
    });
  }

  // Emit aisles in the canonical order, each with items sorted alphabetically.
  const groups = [];
  for (const aisle of AISLE_ORDER) {
    if (!byAisle.has(aisle)) continue;
    const items = byAisle.get(aisle).sort((a, b) => a.item.localeCompare(b.item));
    groups.push({ aisle, items });
  }
  return groups;
}

// Flatten a shopping list to plain text for copy/export.
function shoppingListToText(groups, checkedItems) {
  const lines = ['Shopping List', '============='];
  for (const group of groups) {
    lines.push('');
    lines.push(group.aisle.toUpperCase());
    for (const item of group.items) {
      const done = checkedItems[item.key] ? '[x]' : '[ ]';
      lines.push(`${done} ${item.item} — ${item.label}`);
    }
  }
  return lines.join('\n');
}

// Total distinct items, and how many are checked — used for the summary line.
function shoppingListStats(groups, checkedItems) {
  let total = 0;
  let checked = 0;
  for (const group of groups) {
    for (const item of group.items) {
      total++;
      if (checkedItems[item.key]) checked++;
    }
  }
  return { total, checked };
}
