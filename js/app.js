/*
 * Main application controller.
 *
 * Wires the four features together over the shared `state`:
 *   1. Meal plan    -> the weekly planner grid (Plan tab)
 *   2. Suggestions  -> auto-generate a week + per-slot recipe picker
 *   3. Shopping     -> aggregated, checkable grocery list (Shopping tab)
 *   4. Cooking      -> step-by-step instructions in a recipe modal
 */

const state = loadState();

// Preferences used by the suggestion engine. Not persisted — they're a
// transient control surface for generating plans.
const prefs = {
  diets: [],
  maxCalories: 0,
  slots: [...SLOTS],
};

// Tracks which cell a recipe-picker is currently targeting.
let pickerTarget = null; // { day, slot }

/* ------------------------------------------------------------------ *
 * Small DOM helpers
 * ------------------------------------------------------------------ */
function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') node.className = v;
    else if (k === 'text') node.textContent = v;
    else if (k.startsWith('on') && typeof v === 'function') {
      node.addEventListener(k.slice(2), v);
    } else if (v !== null && v !== undefined) {
      node.setAttribute(k, v);
    }
  }
  for (const child of [].concat(children)) {
    if (child == null) continue;
    node.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
  }
  return node;
}

function $(sel) {
  return document.querySelector(sel);
}

function titleCase(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/* ------------------------------------------------------------------ *
 * Tabs
 * ------------------------------------------------------------------ */
function initTabs() {
  const buttons = document.querySelectorAll('.tab-btn');
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      buttons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.tab-panel').forEach((p) => p.classList.remove('active'));
      const panel = document.getElementById(btn.dataset.tab);
      panel.classList.add('active');
      if (btn.dataset.tab === 'shopping') renderShopping();
      if (btn.dataset.tab === 'nutrition') renderNutrition();
    });
  });
}

/* ------------------------------------------------------------------ *
 * Feature 1: Meal plan grid
 * ------------------------------------------------------------------ */
function renderPlanner() {
  const grid = $('#planner-grid');
  grid.innerHTML = '';

  // Header row: blank corner + slot names.
  grid.appendChild(el('div', { class: 'grid-corner', text: '' }));
  for (const slot of SLOTS) {
    grid.appendChild(el('div', { class: 'grid-head', text: titleCase(slot) }));
  }

  let weekCalories = 0;

  for (const day of DAYS) {
    grid.appendChild(el('div', { class: 'grid-day', text: day }));
    for (const slot of SLOTS) {
      const recipeId = state.plan[day][slot];
      const recipe = recipeId ? getRecipeById(recipeId) : null;
      if (recipe) weekCalories += recipe.calories;

      const cell = el('div', { class: 'cell' + (recipe ? ' filled' : '') });

      if (recipe) {
        cell.appendChild(el('div', { class: 'cell-name', text: recipe.name }));
        cell.appendChild(
          el('div', { class: 'cell-meta', text: `${recipe.calories} kcal · ${recipe.prepTime + recipe.cookTime} min` })
        );
        const actions = el('div', { class: 'cell-actions' });
        actions.appendChild(
          el('button', {
            class: 'link-btn',
            text: 'View',
            title: 'Cooking instructions',
            onclick: (e) => {
              e.stopPropagation();
              openRecipeModal(recipe.id);
            },
          })
        );
        actions.appendChild(
          el('button', {
            class: 'link-btn danger',
            text: 'Remove',
            onclick: (e) => {
              e.stopPropagation();
              state.plan[day][slot] = null;
              saveState(state);
              renderPlanner();
            },
          })
        );
        cell.appendChild(actions);
        cell.addEventListener('click', () => openPicker(day, slot));
      } else {
        cell.appendChild(el('div', { class: 'cell-empty', text: '+ Add meal' }));
        cell.addEventListener('click', () => openPicker(day, slot));
      }

      grid.appendChild(cell);
    }
  }

  $('#week-calories').textContent = weekCalories.toLocaleString();
  const filled = countFilled();
  $('#week-filled').textContent = `${filled} meal${filled === 1 ? '' : 's'} planned`;
}

function countFilled() {
  let n = 0;
  for (const day of DAYS) {
    for (const slot of SLOTS) {
      if (state.plan[day][slot]) n++;
    }
  }
  return n;
}

/* ------------------------------------------------------------------ *
 * Feature 2: Suggestions — recipe picker + auto-generate
 * ------------------------------------------------------------------ */
function openPicker(day, slot) {
  pickerTarget = { day, slot };
  $('#picker-title').textContent = `Choose a ${slot} for ${day}`;
  $('#picker-search').value = '';
  renderPickerList('');
  $('#picker-modal').classList.add('open');
  $('#picker-search').focus();
}

// Render the picker list for the current target, filtered by a search query.
function renderPickerList(query) {
  if (!pickerTarget) return;
  const list = $('#picker-list');
  list.innerHTML = '';

  const all = mealsForSlot(pickerTarget.slot, prefs);
  const q = (query || '').trim().toLowerCase();
  const shown = q ? all.filter((r) => r.name.toLowerCase().includes(q)) : all;

  $('#picker-count').textContent = `${shown.length} meal${shown.length === 1 ? '' : 's'}`;
  if (shown.length === 0) {
    list.appendChild(el('p', { class: 'muted', text: 'No meals match. Try a different search or loosen your dietary filters.' }));
    return;
  }

  for (const recipe of shown) {
    const fatPct = recipeFatPercent(recipe);
    const card = el('div', { class: 'picker-card' }, [
      el('button', { class: 'picker-card-btn', onclick: () => choosePickerRecipe(recipe.id) }, [
        el('div', { class: 'picker-card-name', text: recipe.name + (recipe.custom ? ' ★' : '') }),
        el('div', { class: 'picker-card-meta', text: `${recipe.calories} kcal · ${fatPct}% fat · ${recipe.prepTime + recipe.cookTime} min · serves ${recipe.servings}` }),
        el('div', { class: 'tag-row' }, recipe.tags.slice(0, 3).map((t) => el('span', { class: 'tag', text: t }))),
      ]),
      recipe.custom
        ? null
        : el('button', {
            class: 'picker-hide',
            title: 'Remove from suggestions',
            text: '✕ hide',
            onclick: (e) => {
              e.stopPropagation();
              hideRecipe(recipe.id);
              renderPickerList($('#picker-search').value);
            },
          }),
    ]);
    list.appendChild(card);
  }
}

function choosePickerRecipe(recipeId) {
  if (pickerTarget) {
    state.plan[pickerTarget.day][pickerTarget.slot] = recipeId;
    saveState(state);
    renderPlanner();
  }
  closePicker();
}

function closePicker() {
  $('#picker-modal').classList.remove('open');
  pickerTarget = null;
}

// Read the preference controls into `prefs`.
function readPrefs() {
  prefs.diets = Array.from(document.querySelectorAll('.diet-filter:checked')).map((c) => c.value);
  const cal = parseInt($('#max-calories').value, 10);
  prefs.maxCalories = Number.isFinite(cal) ? cal : 0;
  prefs.slots = Array.from(document.querySelectorAll('.slot-filter:checked')).map((c) => c.value);
  if (prefs.slots.length === 0) prefs.slots = [...SLOTS];
}

function autoGenerate() {
  readPrefs();
  const { plan, warnings } = generateWeekPlan(prefs);
  state.plan = plan;

  // If weekly limits are set, immediately adjust the fresh plan to fit them.
  let limitNote = '';
  if (state.limits.calories || state.limits.fat) {
    const result = adjustPlanToLimits(state.plan, prefs, state.limits);
    state.plan = result.plan;
    limitNote = result.met.calories && result.met.fat
      ? ' Adjusted to fit your weekly limits.'
      : ' Adjusted as close to your weekly limits as the recipes allow.';
  }

  saveState(state);
  renderPlanner();

  const note = $('#generate-note');
  if (warnings.length) {
    note.textContent = `No recipes matched for: ${warnings.map(titleCase).join(', ')}. Try loosening your filters.`;
    note.className = 'note warn';
  } else {
    note.textContent = 'Fresh weekly plan generated! Review it below or tweak any meal.' + limitNote;
    note.className = 'note ok';
  }
}

function clearPlan() {
  state.plan = emptyPlan();
  state.checkedItems = {};
  saveState(state);
  renderPlanner();
  $('#generate-note').textContent = '';
}

/* ------------------------------------------------------------------ *
 * Feature 3: Shopping list
 * ------------------------------------------------------------------ */
function renderShopping() {
  const container = $('#shopping-list');
  container.innerHTML = '';

  const groups = buildShoppingList(state.plan);
  const stats = shoppingListStats(groups, state.checkedItems);

  if (stats.total === 0) {
    container.appendChild(
      el('p', { class: 'muted', text: 'Your shopping list is empty. Plan some meals first, then come back here.' })
    );
    $('#shopping-summary').textContent = '';
    return;
  }

  $('#shopping-summary').textContent = `${stats.checked} of ${stats.total} items checked off`;

  for (const group of groups) {
    const section = el('div', { class: 'aisle' });
    section.appendChild(el('h3', { class: 'aisle-title', text: group.aisle }));

    const ul = el('ul', { class: 'shop-items' });
    for (const item of group.items) {
      const checked = !!state.checkedItems[item.key];
      const li = el('li', { class: 'shop-item' + (checked ? ' checked' : '') });

      const label = el('label', { class: 'shop-label' });
      const box = el('input', { type: 'checkbox' });
      box.checked = checked;
      box.addEventListener('change', () => {
        if (box.checked) state.checkedItems[item.key] = true;
        else delete state.checkedItems[item.key];
        saveState(state);
        renderShopping();
      });
      label.appendChild(box);
      label.appendChild(el('span', { class: 'shop-name', text: item.item }));
      label.appendChild(el('span', { class: 'shop-qty', text: item.label }));
      li.appendChild(label);

      li.appendChild(
        el('div', { class: 'shop-used', text: `for ${item.recipes.join(', ')}` })
      );
      ul.appendChild(li);
    }
    section.appendChild(ul);
    container.appendChild(section);
  }
}

function copyShoppingList() {
  const groups = buildShoppingList(state.plan);
  const text = shoppingListToText(groups, state.checkedItems);
  const note = $('#shopping-copy-note');

  const done = () => {
    note.textContent = 'Copied to clipboard!';
    setTimeout(() => (note.textContent = ''), 2500);
  };

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
  } else {
    fallbackCopy(text, done);
  }
}

function fallbackCopy(text, done) {
  const ta = el('textarea');
  ta.value = text;
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand('copy');
    done();
  } catch (e) {
    /* no-op */
  }
  document.body.removeChild(ta);
}

/* ------------------------------------------------------------------ *
 * Feature 4: Cooking instructions
 * ------------------------------------------------------------------ */
function openRecipeModal(recipeId) {
  const recipe = getRecipeById(recipeId);
  if (!recipe) return;

  $('#recipe-title').textContent = recipe.name;
  $('#recipe-meta').textContent =
    `Serves ${recipe.servings} · ${recipe.calories} kcal · Prep ${recipe.prepTime} min · Cook ${recipe.cookTime} min`;

  const tags = $('#recipe-tags');
  tags.innerHTML = '';
  if (recipe.custom) tags.appendChild(el('span', { class: 'tag tag-custom', text: '★ custom' }));
  for (const t of recipe.tags) tags.appendChild(el('span', { class: 'tag', text: t }));

  // Per-serving nutrition line.
  const nut = recipeNutrition(recipe);
  $('#recipe-nutrition').textContent =
    `Per serving — Protein ${nut.protein}g · Carbs ${nut.carbs}g · Fat ${nut.fat}g · Sugar ${nut.sugar}g · Fiber ${nut.fiber}g · Sodium ${nut.sodium}mg`;

  const ingList = $('#recipe-ingredients');
  ingList.innerHTML = '';
  for (const ing of recipe.ingredients) {
    ingList.appendChild(
      el('li', {}, [
        el('span', { class: 'ing-qty', text: formatQuantity(ing.qty, ing.unit) }),
        el('span', { class: 'ing-name', text: ing.item }),
      ])
    );
  }

  const steps = $('#recipe-steps');
  steps.innerHTML = '';
  recipe.steps.forEach((step) => {
    steps.appendChild(el('li', { text: step }));
  });

  // Actions: link back to the source, and (for custom meals) edit/delete.
  const actions = $('#recipe-actions');
  actions.innerHTML = '';
  if (recipe.sourceUrl) {
    actions.appendChild(
      el('a', { class: 'source-link', href: recipe.sourceUrl, target: '_blank', rel: 'noopener noreferrer', text: '🔗 View original recipe' })
    );
  }
  if (recipe.custom) {
    actions.appendChild(
      el('button', {
        class: 'btn ghost small',
        text: 'Edit',
        onclick: () => { closeRecipeModal(); openCustomModal(recipe); },
      })
    );
    actions.appendChild(
      el('button', {
        class: 'btn ghost small danger-btn',
        text: 'Delete meal',
        onclick: () => {
          deleteCustomRecipeById(recipe.id);
          closeRecipeModal();
        },
      })
    );
  } else if (isHidden(recipe.id)) {
    actions.appendChild(
      el('button', {
        class: 'btn ghost small',
        text: '↩ Restore to suggestions',
        onclick: () => { restoreRecipe(recipe.id); closeRecipeModal(); },
      })
    );
  } else {
    actions.appendChild(
      el('button', {
        class: 'btn ghost small danger-btn',
        text: '🚫 Remove from suggestions',
        onclick: () => { hideRecipe(recipe.id); closeRecipeModal(); },
      })
    );
  }

  $('#recipe-modal').classList.add('open');
}

function closeRecipeModal() {
  $('#recipe-modal').classList.remove('open');
}

/* ------------------------------------------------------------------ *
 * Wiring
 * ------------------------------------------------------------------ */
function initControls() {
  // Diet filter checkboxes.
  const filterRow = $('#diet-filters');
  for (const diet of DIET_FILTERS) {
    const id = `diet-${diet}`;
    const label = el('label', { class: 'chk' }, [
      Object.assign(el('input', { type: 'checkbox', class: 'diet-filter', value: diet, id }), {}),
      el('span', { text: diet }),
    ]);
    filterRow.appendChild(label);
  }

  // Slot filter checkboxes (which meals to auto-fill).
  const slotRow = $('#slot-filters');
  for (const slot of SLOTS) {
    const label = el('label', { class: 'chk' });
    const box = el('input', { type: 'checkbox', class: 'slot-filter', value: slot });
    box.checked = true;
    label.appendChild(box);
    label.appendChild(el('span', { text: titleCase(slot) }));
    slotRow.appendChild(label);
  }

  $('#btn-generate').addEventListener('click', autoGenerate);
  $('#btn-clear').addEventListener('click', clearPlan);
  $('#btn-copy-shopping').addEventListener('click', copyShoppingList);
  $('#picker-search').addEventListener('input', (e) => renderPickerList(e.target.value));

  // Modal close handlers.
  document.querySelectorAll('[data-close]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.close;
      if (target === 'recipe') closeRecipeModal();
      if (target === 'picker') closePicker();
      if (target === 'custom') closeCustomModal();
    });
  });

  // Close modals on backdrop click / Escape.
  document.querySelectorAll('.modal').forEach((m) => {
    m.addEventListener('click', (e) => {
      if (e.target === m) m.classList.remove('open');
    });
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeRecipeModal();
      closePicker();
      closeCustomModal();
    }
  });
}

/* ------------------------------------------------------------------ *
 * Feature 5: Custom meals (create your own + import from a link)
 * ------------------------------------------------------------------ */

// Build the meal-type and dietary-tag checkboxes in the custom form, and wire
// the buttons. Called once at startup.
function initCustomControls() {
  const mt = $('#cf-mealtypes');
  for (const m of MEAL_TYPES) {
    const label = el('label', { class: 'chk' });
    const box = el('input', { type: 'checkbox', class: 'cf-mealtype', value: m });
    label.appendChild(box);
    label.appendChild(el('span', { text: titleCase(m) }));
    mt.appendChild(label);
  }

  const tg = $('#cf-tags');
  for (const t of DIET_FILTERS) {
    const label = el('label', { class: 'chk' });
    const box = el('input', { type: 'checkbox', class: 'cf-tag', value: t });
    label.appendChild(box);
    label.appendChild(el('span', { text: t }));
    tg.appendChild(label);
  }

  $('#btn-add-custom').addEventListener('click', () => openCustomModal(null));
  $('#btn-import-link').addEventListener('click', () => openCustomModal(null, { focusImport: true }));
  $('#btn-do-import').addEventListener('click', runImport);
  $('#custom-form').addEventListener('submit', (e) => {
    e.preventDefault();
    saveCustomFromForm();
  });
}

// Open the form. If `recipe` is provided we are editing it; otherwise a blank
// form for a new meal. opts.focusImport highlights the import field.
function openCustomModal(recipe, opts = {}) {
  $('#custom-title').textContent = recipe ? 'Edit meal' : 'Add a custom meal';
  $('#custom-error').textContent = '';
  $('#import-note').textContent = '';
  $('#import-url').value = '';

  $('#cf-name').value = recipe ? recipe.name : '';
  $('#cf-servings').value = recipe ? recipe.servings : 2;
  $('#cf-calories').value = recipe && recipe.calories ? recipe.calories : '';
  $('#cf-prep').value = recipe ? recipe.prepTime : 0;
  $('#cf-cook').value = recipe ? recipe.cookTime : 0;
  $('#cf-source').value = recipe && recipe.sourceUrl ? recipe.sourceUrl : '';
  $('#cf-id').value = recipe ? recipe.id : '';
  $('#cf-ingredients').value = recipe
    ? recipe.ingredients.map((i) => `${i.qty} ${i.unit} ${i.item}`.replace(' unit ', ' ')).join('\n')
    : '';
  $('#cf-steps').value = recipe ? recipe.steps.join('\n') : '';

  const n = (recipe && recipe.nutrition) || {};
  $('#cf-protein').value = n.protein || '';
  $('#cf-carbs').value = n.carbs || '';
  $('#cf-fat').value = n.fat || '';
  $('#cf-sugar').value = n.sugar || '';
  $('#cf-fiber').value = n.fiber || '';
  $('#cf-sodium').value = n.sodium || '';

  const mealTypes = recipe ? recipe.mealTypes : [];
  document.querySelectorAll('.cf-mealtype').forEach((c) => { c.checked = mealTypes.includes(c.value); });
  const tags = recipe ? recipe.tags : [];
  document.querySelectorAll('.cf-tag').forEach((c) => { c.checked = tags.includes(c.value); });

  $('#custom-modal').classList.add('open');
  if (opts.focusImport) $('#import-url').focus();
  else $('#cf-name').focus();
}

function closeCustomModal() {
  $('#custom-modal').classList.remove('open');
}

// Read the form controls into a plain fields object.
function readCustomForm() {
  return {
    id: $('#cf-id').value || '',
    name: $('#cf-name').value,
    mealTypes: Array.from(document.querySelectorAll('.cf-mealtype:checked')).map((c) => c.value),
    tags: Array.from(document.querySelectorAll('.cf-tag:checked')).map((c) => c.value),
    servings: $('#cf-servings').value,
    calories: $('#cf-calories').value,
    prepTime: $('#cf-prep').value,
    cookTime: $('#cf-cook').value,
    ingredientsText: $('#cf-ingredients').value,
    stepsText: $('#cf-steps').value,
    sourceUrl: $('#cf-source').value,
    protein: $('#cf-protein').value,
    carbs: $('#cf-carbs').value,
    fat: $('#cf-fat').value,
    sugar: $('#cf-sugar').value,
    fiber: $('#cf-fiber').value,
    sodium: $('#cf-sodium').value,
  };
}

function saveCustomFromForm() {
  const { recipe, error } = buildRecipeFromForm(readCustomForm());
  if (error) {
    $('#custom-error').textContent = error;
    return;
  }
  const list = loadCustomRecipes();
  const idx = list.findIndex((r) => r.id === recipe.id);
  if (idx >= 0) list[idx] = recipe;
  else list.push(recipe);
  saveCustomRecipes(list);
  setCustomRecipes(list);
  renderCustomList();
  renderPlanner();
  closeCustomModal();
}

function deleteCustomRecipeById(id) {
  const list = loadCustomRecipes().filter((r) => r.id !== id);
  saveCustomRecipes(list);
  setCustomRecipes(list);
  // Remove the deleted meal from any planner slots that referenced it.
  for (const day of DAYS) {
    for (const slot of SLOTS) {
      if (state.plan[day][slot] === id) state.plan[day][slot] = null;
    }
  }
  saveState(state);
  renderCustomList();
  renderPlanner();
}

async function runImport() {
  const url = $('#import-url').value;
  const note = $('#import-note');
  note.className = 'note';
  note.textContent = 'Reading link…';
  const data = await importRecipeFromUrl(url);
  if (data.name) $('#cf-name').value = data.name;
  if (data.ingredientsText) $('#cf-ingredients').value = data.ingredientsText;
  if (data.stepsText) $('#cf-steps').value = data.stepsText;
  if (data.servings) $('#cf-servings').value = data.servings;
  if (data.calories) $('#cf-calories').value = data.calories;
  $('#cf-source').value = data.sourceUrl || url;
  note.className = data.imported ? 'note ok' : 'note warn';
  note.textContent = data.message;
}

// The "My meals" list of custom recipes with quick delete.
function renderCustomList() {
  const container = $('#custom-list');
  container.innerHTML = '';
  const list = loadCustomRecipes();
  $('#custom-count').textContent = list.length
    ? `${list.length} custom meal${list.length === 1 ? '' : 's'}`
    : '';

  if (list.length === 0) {
    container.appendChild(el('p', { class: 'muted', text: 'No custom meals yet. Add one above and it joins your recipe database.' }));
    return;
  }

  for (const recipe of list) {
    const row = el('div', { class: 'custom-row' }, [
      el('div', { class: 'custom-row-main' }, [
        el('button', {
          class: 'link-btn',
          text: recipe.name,
          title: 'View recipe',
          onclick: () => openRecipeModal(recipe.id),
        }),
        el('div', {
          class: 'custom-row-meta',
          text: `${recipe.mealTypes.map(titleCase).join(', ')} · ${recipe.calories || '—'} kcal${recipe.sourceUrl ? ' · linked' : ''}`,
        }),
      ]),
      el('button', {
        class: 'link-btn danger',
        text: 'Delete',
        onclick: () => deleteCustomRecipeById(recipe.id),
      }),
    ]);
    container.appendChild(row);
  }
}

// Remove a meal from suggestions/plans (built-in recipes the user dislikes).
function hideRecipe(id) {
  if (!state.hidden.includes(id)) state.hidden.push(id);
  setHiddenIds(state.hidden);
  // Pull it out of any planned slots too.
  for (const day of DAYS) {
    for (const slot of SLOTS) {
      if (state.plan[day][slot] === id) state.plan[day][slot] = null;
    }
  }
  saveState(state);
  renderPlanner();
  renderHiddenList();
}

function restoreRecipe(id) {
  state.hidden = state.hidden.filter((x) => x !== id);
  setHiddenIds(state.hidden);
  saveState(state);
  renderHiddenList();
}

// The "Removed meals" list with restore buttons.
function renderHiddenList() {
  const container = $('#hidden-list');
  container.innerHTML = '';
  const ids = state.hidden.filter((id) => getRecipeById(id));
  $('#hidden-count').textContent = ids.length ? `${ids.length} removed` : '';

  if (ids.length === 0) {
    container.appendChild(el('p', { class: 'muted', text: 'No removed meals. Use “Remove from suggestions” on any meal you dislike.' }));
    return;
  }

  for (const id of ids) {
    const recipe = getRecipeById(id);
    const row = el('div', { class: 'custom-row' }, [
      el('div', { class: 'custom-row-main' }, [
        el('button', { class: 'link-btn', text: recipe.name, title: 'View recipe', onclick: () => openRecipeModal(id) }),
        el('div', { class: 'custom-row-meta', text: recipe.mealTypes.map(titleCase).join(', ') }),
      ]),
      el('button', { class: 'link-btn', text: 'Restore', onclick: () => restoreRecipe(id) }),
    ]);
    container.appendChild(row);
  }
}

/* ------------------------------------------------------------------ *
 * Feature 6: Daily nutrition tracking
 * ------------------------------------------------------------------ */

// Which day the nutrition detail is showing. Chosen on first render.
let nutritionDay = null;

function renderNutrition() {
  const week = weekNutrition(state.plan);

  renderWeeklyProgress();

  // Default the selected day to the first day that has meals.
  if (!nutritionDay || !SLOTS.some((s) => state.plan[nutritionDay][s])) {
    nutritionDay = DAYS.find((d) => SLOTS.some((s) => state.plan[d][s])) || 'Mon';
  }

  $('#nutrition-avg').textContent = week.daysWithMeals
    ? `Daily average: ${week.average.calories.toLocaleString()} kcal over ${week.daysWithMeals} day${week.daysWithMeals === 1 ? '' : 's'}`
    : '';

  // Day selector tabs.
  const days = $('#nutrition-days');
  days.innerHTML = '';
  for (const day of DAYS) {
    const has = SLOTS.some((s) => state.plan[day][s]);
    const btn = el('button', {
      class: 'day-tab' + (day === nutritionDay ? ' active' : '') + (has ? '' : ' empty'),
      text: day,
      onclick: () => { nutritionDay = day; renderNutrition(); },
    });
    days.appendChild(btn);
  }

  renderNutritionDetail(nutritionDay);
  renderNutritionWeek(week);
}

function meter(value, target, isLimit) {
  const pct = target > 0 ? (value / target) * 100 : 0;
  const over = isLimit && value > target;
  const fill = el('div', {
    class: 'meter-fill' + (over ? ' over' : ''),
    style: `width:${Math.max(0, Math.min(pct, 100))}%`,
  });
  return el('div', { class: 'meter' }, [fill]);
}

function renderNutritionDetail(day) {
  const box = $('#nutrition-detail');
  box.innerHTML = '';
  const bd = dayBreakdown(state.plan, day);

  if (!bd.hasMeals) {
    box.appendChild(el('p', { class: 'muted', text: `No meals planned for ${day}. Add some in the Plan tab to see its nutrition.` }));
    return;
  }

  // Macro calorie split bar.
  const split = macroSplit(bd.totals);
  const splitBar = el('div', { class: 'split-bar' }, [
    el('div', { class: 'split protein', style: `width:${split.protein}%`, title: `Protein ${split.protein}%` }),
    el('div', { class: 'split carbs', style: `width:${split.carbs}%`, title: `Carbs ${split.carbs}%` }),
    el('div', { class: 'split fat', style: `width:${split.fat}%`, title: `Fat ${split.fat}%` }),
  ]);
  box.appendChild(el('div', { class: 'split-wrap' }, [
    el('div', { class: 'split-legend', text: `Calorie split — Protein ${split.protein}% · Carbs ${split.carbs}% · Fat ${split.fat}%` }),
    splitBar,
  ]));

  // Fat as a percentage of calories vs. the user's target and the AMDR range.
  const fatPct = fatCaloriePercent(bd.totals);
  const target = state.fatPercent || FAT_PERCENT_REC.suggested;
  const withinRange = fatPct >= FAT_PERCENT_REC.min && fatPct <= FAT_PERCENT_REC.max;
  const overTarget = fatPct > target;
  const status = overTarget
    ? `over your ${target}% target`
    : withinRange
    ? `within target (recommended ${FAT_PERCENT_REC.min}-${FAT_PERCENT_REC.max}%)`
    : `below your ${target}% target`;
  box.appendChild(
    el('div', { class: 'fat-pct-status' + (overTarget ? ' over' : ' ok') }, [
      el('span', { class: 'fat-pct-big', text: `${fatPct}%` }),
      el('span', { text: ` of calories from fat — ${status}` }),
    ])
  );

  // Nutrient rows with progress toward the daily reference.
  const rows = el('div', { class: 'nutri-rows' });
  for (const n of NUTRIENTS) {
    const value = bd.totals[n.key];
    const target = DAILY_TARGETS[n.key];
    const pct = Math.round((value / target) * 100);
    const over = n.limit && value > target;
    rows.appendChild(
      el('div', { class: 'nutri-row', title: `${pct}% of the ${target}${n.unit} reference` }, [
        el('div', { class: 'nutri-top' }, [
          el('span', { class: 'nutri-label', text: n.label }),
          el('span', { class: 'nutri-val' + (over ? ' over' : ''), text: `${Math.round(value).toLocaleString()} / ${target.toLocaleString()} ${n.unit}` }),
        ]),
        meter(value, target, n.limit),
      ])
    );
  }
  box.appendChild(rows);

  // Meals that make up the day.
  const meals = el('div', { class: 'day-meals' });
  meals.appendChild(el('h3', { class: 'day-meals-title', text: `${day} meals` }));
  const mealFatTarget = state.fatPercent || FAT_PERCENT_REC.suggested;
  for (const m of bd.meals) {
    const fatPct = m.recipe ? recipeFatPercent(m.recipe) : null;
    meals.appendChild(
      el('div', { class: 'day-meal' }, [
        el('span', { class: 'day-meal-slot', text: titleCase(m.slot) }),
        m.recipe
          ? el('button', { class: 'link-btn', text: m.recipe.name, onclick: () => openRecipeModal(m.recipe.id) })
          : el('span', { class: 'muted', text: 'not planned' }),
        fatPct !== null
          ? el('span', { class: 'day-meal-fat' + (fatPct > mealFatTarget ? ' over' : ''), text: `${fatPct}% fat` })
          : el('span', {}),
        el('span', { class: 'day-meal-cal', text: m.nutrition ? `${m.nutrition.calories} kcal` : '' }),
      ])
    );
  }
  box.appendChild(meals);
}

function renderNutritionWeek(week) {
  const box = $('#nutrition-week');
  box.innerHTML = '';

  const table = el('table', { class: 'nutri-table' });
  const head = el('tr', {}, [el('th', { text: 'Day' })].concat(
    NUTRIENTS.map((n) => el('th', { text: n.label }))
  ));
  table.appendChild(el('thead', {}, [head]));

  const body = el('tbody');
  for (const day of DAYS) {
    const t = week.perDay[day];
    const has = SLOTS.some((s) => state.plan[day][s]);
    const cells = [el('td', { class: 'day-cell', text: day })].concat(
      NUTRIENTS.map((n) => el('td', { class: has ? '' : 'muted', text: has ? Math.round(t[n.key]).toLocaleString() : '—' }))
    );
    body.appendChild(el('tr', {}, cells));
  }
  // Average row.
  if (week.daysWithMeals) {
    const avgCells = [el('td', { class: 'day-cell', text: 'Average' })].concat(
      NUTRIENTS.map((n) => el('td', { class: 'avg', text: Math.round(week.average[n.key]).toLocaleString() }))
    );
    body.appendChild(el('tr', { class: 'avg-row' }, avgCells));
  }
  table.appendChild(body);

  const scroller = el('div', { class: 'table-scroll' }, [table]);
  box.appendChild(scroller);
}

/* ------------------------------------------------------------------ *
 * Feature 7: Weekly limits + adjust-to-fit
 * ------------------------------------------------------------------ */
function initLimits() {
  const cal = $('#limit-calories');
  const fat = $('#limit-fat');
  cal.value = state.limits.calories || '';
  fat.value = state.limits.fat || '';

  const save = () => {
    const c = parseInt(cal.value, 10);
    const f = parseInt(fat.value, 10);
    state.limits.calories = Number.isFinite(c) && c > 0 ? c : null;
    state.limits.fat = Number.isFinite(f) && f > 0 ? f : null;
    saveState(state);
    renderWeeklyProgress();
  };
  cal.addEventListener('input', save);
  fat.addEventListener('input', save);

  // Fat as a percentage of calories, with a research-based recommendation.
  const fp = $('#fat-percent');
  fp.value = state.fatPercent || FAT_PERCENT_REC.suggested;
  $('#fat-rec-note').textContent = FAT_PERCENT_REC.note;
  const saveFatPct = (v) => {
    state.fatPercent = Number.isFinite(v) && v > 0 && v <= 100 ? v : FAT_PERCENT_REC.suggested;
    saveState(state);
    renderNutrition();
  };
  fp.addEventListener('input', () => saveFatPct(parseInt(fp.value, 10)));
  $('#btn-fat-rec').addEventListener('click', () => {
    fp.value = FAT_PERCENT_REC.suggested;
    saveFatPct(FAT_PERCENT_REC.suggested);
  });

  $('#btn-adjust').addEventListener('click', adjustToLimits);
}

// Weekly totals vs. the set limits, with progress meters.
function renderWeeklyProgress() {
  const box = $('#weekly-progress');
  box.innerHTML = '';
  const totals = weekTotals(state.plan);
  const rows = [
    { key: 'calories', label: 'Calories', unit: 'kcal', limit: state.limits.calories },
    { key: 'fat', label: 'Fat', unit: 'g', limit: state.limits.fat },
  ];

  if (!state.limits.calories && !state.limits.fat) {
    box.appendChild(el('p', { class: 'muted', text: 'No weekly limits set yet. Enter one above to track your week against it.' }));
    return;
  }

  for (const r of rows) {
    if (!r.limit) continue;
    const value = Math.round(totals[r.key]);
    const over = value > r.limit;
    const remaining = r.limit - value;
    box.appendChild(
      el('div', { class: 'nutri-row' }, [
        el('div', { class: 'nutri-top' }, [
          el('span', { class: 'nutri-label', text: `Weekly ${r.label.toLowerCase()}` }),
          el('span', { class: 'nutri-val' + (over ? ' over' : ''), text: `${value.toLocaleString()} / ${r.limit.toLocaleString()} ${r.unit}` }),
        ]),
        meter(value, r.limit, true),
        el('div', {
          class: 'limit-hint' + (over ? ' over' : ''),
          text: over
            ? `${Math.abs(remaining).toLocaleString()} ${r.unit} over the limit`
            : `${remaining.toLocaleString()} ${r.unit} remaining`,
        }),
      ])
    );
  }
}

function adjustToLimits() {
  const note = $('#adjust-note');
  if (!state.limits.calories && !state.limits.fat) {
    note.className = 'note warn';
    note.textContent = 'Set a weekly calorie or fat limit first.';
    return;
  }
  const filled = countFilled();
  if (filled === 0) {
    note.className = 'note warn';
    note.textContent = 'Plan some meals first (use Generate week on the Plan tab), then adjust.';
    return;
  }

  readPrefs(); // respect current dietary filters when swapping
  const result = adjustPlanToLimits(state.plan, prefs, state.limits);
  state.plan = result.plan;
  saveState(state);
  renderPlanner();
  renderNutrition();

  const parts = [];
  if (state.limits.calories) parts.push(`${Math.round(result.totals.calories).toLocaleString()} / ${state.limits.calories.toLocaleString()} kcal`);
  if (state.limits.fat) parts.push(`${Math.round(result.totals.fat).toLocaleString()} / ${state.limits.fat.toLocaleString()} g fat`);
  const allMet = result.met.calories && result.met.fat;
  note.className = allMet ? 'note ok' : 'note warn';
  note.textContent = allMet
    ? `Adjusted with ${result.swaps} swap${result.swaps === 1 ? '' : 's'} — week now ${parts.join(' · ')}, within your limits.`
    : `Adjusted with ${result.swaps} swap${result.swaps === 1 ? '' : 's'} to ${parts.join(' · ')}. That is as low as the current recipes and filters allow; loosen a dietary filter or lower the limit target to go further.`;
}

function init() {
  setCustomRecipes(loadCustomRecipes());
  setHiddenIds(state.hidden);
  initTabs();
  initControls();
  initCustomControls();
  initLimits();
  renderPlanner();
  renderCustomList();
  renderHiddenList();
}

document.addEventListener('DOMContentLoaded', init);
