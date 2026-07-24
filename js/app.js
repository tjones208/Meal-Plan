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
  const modal = $('#picker-modal');
  $('#picker-title').textContent = `Choose a ${slot} for ${day}`;

  const list = $('#picker-list');
  list.innerHTML = '';

  const suggestions = suggestForSlot(slot, prefs, 12);
  if (suggestions.length === 0) {
    list.appendChild(el('p', { class: 'muted', text: 'No recipes match your current filters.' }));
  }

  for (const recipe of suggestions) {
    const card = el('button', { class: 'picker-card', onclick: () => choosePickerRecipe(recipe.id) }, [
      el('div', { class: 'picker-card-name', text: recipe.name }),
      el('div', { class: 'picker-card-meta', text: `${recipe.calories} kcal · ${recipe.prepTime + recipe.cookTime} min · serves ${recipe.servings}` }),
      el('div', { class: 'tag-row' }, recipe.tags.slice(0, 3).map((t) => el('span', { class: 'tag', text: t }))),
    ]);
    list.appendChild(card);
  }

  modal.classList.add('open');
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
  saveState(state);
  renderPlanner();

  const note = $('#generate-note');
  if (warnings.length) {
    note.textContent = `No recipes matched for: ${warnings.map(titleCase).join(', ')}. Try loosening your filters.`;
    note.className = 'note warn';
  } else {
    note.textContent = 'Fresh weekly plan generated! Review it below or tweak any meal.';
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

function init() {
  setCustomRecipes(loadCustomRecipes());
  initTabs();
  initControls();
  initCustomControls();
  renderPlanner();
  renderCustomList();
}

document.addEventListener('DOMContentLoaded', init);
