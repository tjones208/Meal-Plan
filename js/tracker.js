/*
 * Food tracker UI: the Today, Coach and Progress tabs plus the add-food,
 * review/edit and profile modals.
 *
 * Data lives in js/tracker-store.js; AI calls and barcode lookup in js/ai.js;
 * charts in js/charts.js. Relies on the DOM helpers `el` / `$` and the shared
 * `state` from js/app.js (called only after DOMContentLoaded).
 */

let tracker = loadTracker();
let activePid = getActivePersonId(tracker);
let viewDay = dateKey();
let draft = null; // { entry, day, isNew } while the review modal is open
let progressRange = 7;
let coachBusy = false;

const MEAL_ICONS = { breakfast: '🍳', lunch: '🥗', dinner: '🍽️', snack: '🍎' };
const SOURCE_ICONS = { photo: '📸', text: '✍️', barcode: '🔍', recipe: '📖', manual: '✏️' };

function person() {
  return tracker.people[activePid];
}

function targets() {
  return computeTargets(person().profile, state.fatPercent);
}

function r0(v) {
  return Math.round(v || 0);
}

function commitTracker() {
  saveTracker(tracker);
  renderToday();
  if (isTabActive('progress')) renderProgress();
}

function isTabActive(id) {
  const p = document.getElementById(id);
  return p && p.classList.contains('active');
}

function toast(msg, kind) {
  let t = $('#toast');
  if (!t) {
    t = el('div', { id: 'toast', class: 'toast' });
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.className = 'toast show' + (kind === 'error' ? ' error' : '');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => (t.className = 'toast'), 3500);
}

function showBusy(text) {
  $('#busy-text').textContent = text || 'Working…';
  $('#busy').hidden = false;
}

function hideBusy() {
  $('#busy').hidden = true;
}

function openModal(id) {
  document.getElementById(id).classList.add('open');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
  if (id === 'add-modal') BarcodeScanner.stop();
}

function macroLine(n) {
  return `P ${r0(n.protein)}g · C ${r0(n.carbs)}g · F ${r0(n.fat)}g`;
}

/* ------------------------------------------------------------------ *
 * Today tab
 * ------------------------------------------------------------------ */
function renderToday() {
  renderPersonSwitch();
  renderSetupCard();
  $('#day-label').textContent = friendlyDate(viewDay);
  $('#day-next').disabled = viewDay >= dateKey();
  renderDaySummary();
  renderPlannedToday();
  renderMealLog();
  renderPanel();
}

function renderPersonSwitch() {
  const box = $('#person-switch');
  box.innerHTML = '';
  const ids = Object.keys(tracker.people);
  if (ids.length < 2) {
    box.appendChild(el('span', { class: 'person-name', text: `👋 Hi, ${person().profile.name || 'there'}` }));
    return;
  }
  for (const id of ids) {
    box.appendChild(
      el('button', {
        type: 'button',
        class: 'person-chip' + (id === activePid ? ' active' : ''),
        text: tracker.people[id].profile.name || 'Unnamed',
        onclick: () => switchPerson(id),
      })
    );
  }
}

function switchPerson(id) {
  activePid = id;
  setActivePersonId(id);
  renderToday();
  if (isTabActive('progress')) renderProgress();
  if (isTabActive('coach')) renderCoach();
}

function renderSetupCard() {
  const box = $('#setup-card');
  box.innerHTML = '';
  if (person().profile.setup) return;
  box.appendChild(
    el('div', { class: 'card setup' }, [
      el('h2', { text: '🎯 Set your goals' }),
      el('p', { class: 'muted', text: 'Tell us a little about you and we will calculate personalised calorie and macro targets (Mifflin-St Jeor + your activity level and goal).' }),
      el('div', { class: 'btn-row' }, [el('button', { class: 'btn primary', text: 'Set up my profile', onclick: openProfileModal })]),
    ])
  );
}

function ringSvg(value, target) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const pct = target > 0 ? Math.min(value / target, 1) : 0;
  const over = target > 0 && value > target * 1.05;
  const svg = svgEl('svg', { viewBox: '0 0 128 128', class: 'ring', 'aria-hidden': 'true' });
  svg.appendChild(svgEl('circle', { cx: 64, cy: 64, r, class: 'ring-bg' }));
  svg.appendChild(
    svgEl('circle', {
      cx: 64, cy: 64, r,
      class: 'ring-fg' + (over ? ' over' : ''),
      'stroke-dasharray': `${(c * pct).toFixed(1)} ${c.toFixed(1)}`,
      transform: 'rotate(-90 64 64)',
    })
  );
  return svg;
}

// Progress bar vs a target. Only "limit" nutrients (fat, sodium, sugar…) turn
// red when exceeded; beating a goal like protein or fiber is good.
function barRow(label, value, target, unit, isLimit) {
  const pct = target > 0 ? Math.min((value / target) * 100, 100) : 0;
  const over = isLimit && target > 0 && value > target;
  return el('div', { class: 'nutri-row' }, [
    el('div', { class: 'nutri-top' }, [
      el('span', { class: 'nutri-label', text: label }),
      el('span', { class: 'nutri-val' + (over ? ' over' : ''), text: `${r0(value).toLocaleString()} / ${r0(target).toLocaleString()} ${unit}` }),
    ]),
    el('div', { class: 'meter' }, [el('div', { class: 'meter-fill' + (over ? ' over' : ''), style: `width:${pct}%` })]),
  ]);
}

function renderDaySummary() {
  const box = $('#day-summary');
  box.innerHTML = '';
  const p = person();
  const tg = targets();
  const tot = dayTotals(p, viewDay);
  const left = tg.calories - tot.calories;

  const ringWrap = el('div', { class: 'ring-wrap' }, [
    ringSvg(tot.calories, tg.calories),
    el('div', { class: 'ring-center' }, [
      el('strong', { text: Math.abs(r0(left)).toLocaleString() }),
      el('span', { text: left >= 0 ? 'kcal left' : 'kcal over' }),
    ]),
  ]);

  const entries = p.log[viewDay] || [];
  const scored = entries.filter((e) => e.healthScore);
  const avgScore = scored.length ? scored.reduce((s, e) => s + e.healthScore, 0) / scored.length : 0;
  const streak = loggingStreak(p);

  const side = el('div', { class: 'summary-side' }, [
    el('div', { class: 'summary-kcal' }, [
      el('div', {}, [el('span', { class: 'muted', text: 'Eaten' }), el('strong', { text: r0(tot.calories).toLocaleString() })]),
      el('div', {}, [el('span', { class: 'muted', text: 'Target' }), el('strong', { text: r0(tg.calories).toLocaleString() })]),
    ]),
    el('div', { class: 'badges' }, [
      streak ? el('span', { class: 'badge', text: `🔥 ${streak}-day streak` }) : null,
      avgScore ? el('span', { class: 'badge', text: `💚 Meal score ${avgScore.toFixed(1)}/10` }) : null,
    ]),
  ]);

  box.appendChild(el('div', { class: 'summary-top' }, [ringWrap, side]));
  box.appendChild(
    el('div', { class: 'nutri-rows macro-rows' }, [
      barRow('Protein', tot.protein, tg.protein, 'g'),
      barRow('Carbs', tot.carbs, tg.carbs, 'g'),
      barRow('Fat', tot.fat, tg.fat, 'g', true),
      barRow('Fiber', tot.fiber, tg.fiber, 'g'),
    ])
  );
  box.appendChild(renderWater());
}

function renderWater() {
  const p = person();
  const cups = (p.water[viewDay] && p.water[viewDay].cups) || 0;
  const goal = 8;
  const row = el('div', { class: 'water-row' }, [el('span', { class: 'water-label', text: `💧 Water ${cups}/${goal} cups` })]);
  const icons = el('div', { class: 'water-cups' });
  for (let i = 0; i < Math.max(goal, cups + 1); i++) {
    icons.appendChild(
      el('button', {
        type: 'button',
        class: 'cup' + (i < cups ? ' full' : ''),
        'aria-label': `${i + 1} cups`,
        text: i < cups ? '💧' : '○',
        onclick: () => {
          const next = i + 1 === cups ? i : i + 1; // tapping the last full cup undoes it
          p.water[viewDay] = { cups: next, updatedAt: Date.now() };
          commitTracker();
        },
      })
    );
  }
  row.appendChild(icons);
  return row;
}

function plannedFor(day) {
  const d = parseDateKey(day);
  const dayName = DAYS[(d.getDay() + 6) % 7];
  return SLOTS.map((slot) => ({ slot, recipe: state.plan[dayName] && state.plan[dayName][slot] ? getRecipeById(state.plan[dayName][slot]) : null }))
    .filter((x) => x.recipe);
}

function renderPlannedToday() {
  const box = $('#planned-today');
  box.innerHTML = '';
  const planned = plannedFor(viewDay);
  if (!planned.length) return;
  const logged = new Set((person().log[viewDay] || []).map((e) => `${e.meal}:${e.recipeId}`));
  const list = el('div', { class: 'planned-list' });
  for (const { slot, recipe } of planned) {
    const done = logged.has(`${slot}:${recipe.id}`);
    list.appendChild(
      el('div', { class: 'planned-row' }, [
        el('div', { class: 'planned-main' }, [
          el('span', { class: 'planned-slot', text: `${MEAL_ICONS[slot]} ${titleCase(slot)}` }),
          el('span', { class: 'planned-name', text: recipe.name }),
          el('span', { class: 'muted small', text: `${recipe.calories} kcal · ${macroLine(recipeNutrition(recipe))}` }),
        ]),
        done
          ? el('span', { class: 'done-pill', text: '✓ Logged' })
          : el('button', {
              class: 'btn ghost small',
              text: '✓ I ate this',
              onclick: () => {
                upsertEntry(tracker, activePid, viewDay, entryFromRecipe(recipe, slot));
                commitTracker();
                toast(`Logged ${recipe.name}`);
              },
            }),
      ])
    );
  }
  box.appendChild(el('div', { class: 'card' }, [el('h2', { text: 'From your meal plan' }), list]));
}

function renderMealLog() {
  const box = $('#meal-log');
  box.innerHTML = '';
  const p = person();
  const entries = dayEntries(p, viewDay);
  if (!entries.length) {
    box.appendChild(
      el('div', { class: 'card empty-log' }, [
        el('div', { class: 'empty-ico', text: '🍽️' }),
        el('p', { text: viewDay === dateKey() ? 'Nothing logged yet today. Snap your first meal!' : 'Nothing logged on this day.' }),
      ])
    );
    return;
  }
  for (const meal of MEALS) {
    const list = entries.filter((e) => e.meal === meal);
    if (!list.length) continue;
    const sub = list.reduce((s, e) => s + entryTotals(e).calories, 0);
    const card = el('div', { class: 'card meal-card' }, [
      el('div', { class: 'meal-head' }, [
        el('h2', { text: `${MEAL_ICONS[meal]} ${titleCase(meal)}` }),
        el('span', { class: 'meal-kcal', text: `${r0(sub).toLocaleString()} kcal` }),
      ]),
    ]);
    for (const e of list) {
      const n = entryTotals(e);
      card.appendChild(
        el('button', { type: 'button', class: 'entry-row', onclick: () => openEntryModal(JSON.parse(JSON.stringify(e)), viewDay, false) }, [
          e.thumb ? el('img', { class: 'entry-thumb', src: e.thumb, alt: '' }) : el('span', { class: 'entry-thumb ico', text: SOURCE_ICONS[e.source] || '🍴' }),
          el('span', { class: 'entry-main' }, [
            el('span', { class: 'entry-name', text: e.name }),
            el('span', { class: 'muted small', text: macroLine(n) }),
          ]),
          el('span', { class: 'entry-kcal', text: `${r0(n.calories)}` }),
        ])
      );
    }
    box.appendChild(card);
  }
}

function renderPanel() {
  const box = $('#panel-rows');
  box.innerHTML = '';
  const tot = dayTotals(person(), viewDay);
  const tg = targets();
  for (const n of PANEL) {
    box.appendChild(barRow(n.label, tot[n.key], targetFor(n.key, tg), n.unit, n.limit));
  }
}

/* ------------------------------------------------------------------ *
 * Add food flows
 * ------------------------------------------------------------------ */
function openAddModal(title, bodyNodes) {
  BarcodeScanner.stop();
  $('#add-title').textContent = title;
  const body = $('#add-body');
  body.innerHTML = '';
  for (const n of [].concat(bodyNodes)) if (n) body.appendChild(n);
  openModal('add-modal');
}

async function onPhotoChosen(file) {
  if (!file) return;
  let img;
  try {
    img = await prepareImage(file);
  } catch (e) {
    toast(e.message, 'error');
    return;
  }
  const note = el('textarea', { class: 'area-input', rows: 2, placeholder: 'Optional details: "no dressing", "large bowl", "cooked in butter"…' });
  const err = el('p', { class: 'note warn' });
  openAddModal('Analyse photo', [
    el('img', { class: 'photo-preview', src: img.previewUrl, alt: 'Your meal' }),
    el('label', { class: 'control-label', text: 'Anything the photo does not show? (optional)' }),
    note,
    err,
    el('div', { class: 'btn-row' }, [
      el('button', {
        class: 'btn primary',
        text: '✨ Analyse nutrition',
        onclick: () =>
          runAnalysis(err, 'Analysing your meal…', () =>
            callNutritionAI({ action: 'analyze_photo', image: img.base64, mediaType: img.mediaType, note: note.value.trim() })
          , 'photo', img.thumb),
      }),
    ]),
  ]);
}

async function runAnalysis(errEl, busyText, request, source, thumb) {
  errEl.textContent = '';
  showBusy(busyText);
  try {
    const result = await request();
    const entry = entryFromAI(result, source, thumb);
    closeModal('add-modal');
    openEntryModal(entry, viewDay, true);
  } catch (e) {
    errEl.textContent = e.message;
  } finally {
    hideBusy();
  }
}

function entryFromAI(result, source, thumb) {
  if (!result || !result.isFood || !Array.isArray(result.items) || !result.items.length) {
    throw new Error((result && result.notes) || "Couldn't find any food there. Try another photo or describe it.");
  }
  return {
    id: newId(),
    meal: mealForTime(),
    name: result.mealName || 'Meal',
    source,
    createdAt: Date.now(),
    healthScore: Math.min(10, Math.max(1, r0(result.healthScore))) || null,
    notes: result.notes || '',
    tip: result.tip || '',
    thumb: thumb || null,
    items: result.items.map(aiItem),
  };
}

function aiItem(i) {
  return {
    name: i.name,
    portion: i.portion || '',
    grams: Number(i.grams) || 0,
    qty: 1,
    confidence: i.confidence || 'medium',
    nutrients: cleanNutrients(i.nutrients),
  };
}

function openDescribe() {
  const ta = el('textarea', { class: 'area-input', rows: 3, placeholder: 'e.g. 2 scrambled eggs with cheese, 1 slice sourdough toast with butter, black coffee' });
  const err = el('p', { class: 'note warn' });
  const examples = ['Chipotle chicken burrito bowl', 'Grande oat milk latte', 'Big Mac and medium fries', 'Greek yogurt with berries and granola'];
  openAddModal('Describe what you ate', [
    el('p', { class: 'muted', text: 'Be as specific as you like: brands, restaurants, portion sizes and cooking methods all improve accuracy.' }),
    ta,
    el('div', { class: 'chip-row' }, examples.map((x) => el('button', { type: 'button', class: 'chip', text: x, onclick: () => (ta.value = x) }))),
    err,
    el('div', { class: 'btn-row' }, [
      el('button', {
        class: 'btn primary',
        text: '✨ Calculate nutrition',
        onclick: () => {
          const text = ta.value.trim();
          if (!text) return (err.textContent = 'Describe your meal first.');
          runAnalysis(err, 'Calculating nutrition…', () => callNutritionAI({ action: 'analyze_text', text }), 'text');
        },
      }),
    ]),
  ]);
  setTimeout(() => ta.focus(), 50);
}

function openBarcode() {
  const input = el('input', { type: 'text', inputmode: 'numeric', class: 'text-input', placeholder: 'Barcode number (UPC / EAN)' });
  const err = el('p', { class: 'note warn' });
  const lookup = async (code) => {
    err.textContent = '';
    showBusy('Looking up product…');
    try {
      const prod = await lookupBarcode(code);
      const entry = {
        id: newId(),
        meal: mealForTime(),
        name: prod.name,
        source: 'barcode',
        createdAt: Date.now(),
        barcode: String(code),
        items: [{ name: prod.name, portion: prod.portion, grams: prod.grams, qty: 1, confidence: 'high', nutrients: prod.nutrients }],
      };
      closeModal('add-modal');
      openEntryModal(entry, viewDay, true);
    } catch (e) {
      err.textContent = e.message;
    } finally {
      hideBusy();
    }
  };
  const nodes = [];
  if (BarcodeScanner.supported()) {
    const video = el('video', { class: 'scan-video', playsinline: '', muted: '' });
    nodes.push(video, el('p', { class: 'muted', text: 'Point your camera at the barcode…' }));
    setTimeout(() => {
      BarcodeScanner.start(video, (code) => {
        input.value = code;
        lookup(code);
      }).catch(() => {
        video.remove();
        err.textContent = 'Camera unavailable. Type the number instead.';
      });
    }, 50);
  } else {
    nodes.push(el('p', { class: 'muted', text: 'Type the number under the barcode. Tip: for anything with a nutrition label you can also just snap a photo of the label.' }));
  }
  nodes.push(
    el('div', { class: 'join-row' }, [input, el('button', { class: 'btn primary', type: 'button', text: 'Look up', onclick: () => lookup(input.value) })]),
    err,
    el('p', { class: 'muted small', text: 'Product data from Open Food Facts.' })
  );
  openAddModal('Scan a barcode', nodes);
}

function recentFoods(limit) {
  const p = person();
  const seen = new Map();
  const days = Object.keys(p.log).sort().reverse();
  for (const d of days) {
    for (const e of p.log[d]) {
      const key = e.name.toLowerCase();
      if (!seen.has(key)) seen.set(key, e);
    }
    if (seen.size >= limit) break;
  }
  return [...seen.values()].slice(0, limit);
}

function openRecipes() {
  const search = el('input', { type: 'search', class: 'text-input', placeholder: 'Search recent foods and recipes…' });
  const list = el('div', { class: 'pick-list' });
  const render = () => {
    const q = search.value.trim().toLowerCase();
    list.innerHTML = '';
    const recent = recentFoods(25).filter((e) => !q || e.name.toLowerCase().includes(q));
    if (recent.length) {
      list.appendChild(el('h3', { text: 'Recent' }));
      for (const e of recent.slice(0, 12)) {
        const n = entryTotals(e);
        list.appendChild(
          el('button', {
            type: 'button',
            class: 'pick-row',
            onclick: () => {
              const copy = JSON.parse(JSON.stringify(e));
              Object.assign(copy, { id: newId(), meal: mealForTime(), createdAt: Date.now() });
              closeModal('add-modal');
              openEntryModal(copy, viewDay, true);
            },
          }, [el('span', { class: 'pick-name', text: e.name }), el('span', { class: 'muted small', text: `${r0(n.calories)} kcal · ${macroLine(n)}` })])
        );
      }
    }
    const recipes = getAllRecipes().filter((r) => !q || r.name.toLowerCase().includes(q)).slice(0, 40);
    if (recipes.length) list.appendChild(el('h3', { text: 'Recipes' }));
    for (const r of recipes) {
      list.appendChild(
        el('button', {
          type: 'button',
          class: 'pick-row',
          onclick: () => {
            closeModal('add-modal');
            openEntryModal(entryFromRecipe(r, mealForTime()), viewDay, true);
          },
        }, [el('span', { class: 'pick-name', text: r.name }), el('span', { class: 'muted small', text: `${r.calories} kcal per serving · ${macroLine(recipeNutrition(r))}` })])
      );
    }
    if (!list.children.length) list.appendChild(el('p', { class: 'muted', text: 'No matches.' }));
  };
  search.addEventListener('input', render);
  render();
  openAddModal('Recent foods & recipes', [search, list]);
}

function openManual() {
  openEntryModal(
    {
      id: newId(),
      meal: mealForTime(),
      name: '',
      source: 'manual',
      createdAt: Date.now(),
      items: [{ name: '', portion: '1 serving', grams: 0, qty: 1, nutrients: zeroPanel(), editing: true }],
    },
    viewDay,
    true
  );
}

/* ------------------------------------------------------------------ *
 * Review / edit entry modal
 * ------------------------------------------------------------------ */
function openEntryModal(entry, day, isNew) {
  draft = { entry, day, isNew };
  renderEntryModal();
  openModal('entry-modal');
}

function renderEntryModal() {
  const { entry, day, isNew } = draft;
  const body = $('#entry-body');
  body.innerHTML = '';

  body.appendChild(el('h2', { text: isNew ? 'Review & save' : 'Edit meal' }));
  if (entry.thumb) body.appendChild(el('img', { class: 'entry-photo', src: entry.thumb, alt: '' }));

  const nameInput = el('input', { type: 'text', class: 'text-input', value: entry.name, placeholder: 'Meal name' });
  nameInput.addEventListener('input', () => (entry.name = nameInput.value));
  const mealSel = el('select', { class: 'text-input' }, MEALS.map((m) => el('option', { value: m, text: `${MEAL_ICONS[m]} ${titleCase(m)}` })));
  mealSel.value = entry.meal;
  mealSel.addEventListener('change', () => (entry.meal = mealSel.value));
  const dateInput = el('input', { type: 'date', class: 'text-input', value: day, max: dateKey() });
  dateInput.addEventListener('change', () => dateInput.value && (draft.day = dateInput.value));

  body.appendChild(el('div', { class: 'control-group' }, [el('label', { class: 'control-label', text: 'Name' }), nameInput]));
  body.appendChild(
    el('div', { class: 'two-col' }, [
      el('div', { class: 'control-group' }, [el('label', { class: 'control-label', text: 'Meal' }), mealSel]),
      el('div', { class: 'control-group' }, [el('label', { class: 'control-label', text: 'Date' }), dateInput]),
    ])
  );

  if (entry.healthScore || entry.notes || entry.tip) {
    const insight = el('div', { class: 'insight' });
    if (entry.healthScore) insight.appendChild(el('div', { class: 'score', text: `💚 ${entry.healthScore}/10 meal score` }));
    if (entry.notes) insight.appendChild(el('p', { class: 'muted small', text: `Assumptions: ${entry.notes}` }));
    if (entry.tip) insight.appendChild(el('p', { class: 'tip', text: `💡 ${entry.tip}` }));
    body.appendChild(insight);
  }

  body.appendChild(buildEntryTotals(entry));

  // Items
  body.appendChild(el('h3', { text: 'Items' }));
  entry.items.forEach((it, idx) => body.appendChild(renderItem(it, idx)));

  // Add item
  const addInput = el('input', { type: 'text', class: 'text-input', placeholder: 'Add an item, e.g. "a can of Coke"' });
  const addErr = el('p', { class: 'note warn' });
  const addBtn = el('button', {
    class: 'btn ghost',
    type: 'button',
    text: '✨ Add',
    onclick: async () => {
      const text = addInput.value.trim();
      if (!text) return;
      addBtn.disabled = true;
      addBtn.textContent = 'Adding…';
      try {
        const res = await callNutritionAI({ action: 'analyze_text', text });
        if (!res.isFood || !res.items.length) throw new Error(res.notes || "Couldn't recognise that food.");
        entry.items.push(...res.items.map(aiItem));
        renderEntryModal();
      } catch (e) {
        addErr.textContent = e.message;
        addBtn.disabled = false;
        addBtn.textContent = '✨ Add';
      }
    },
  });
  body.appendChild(el('div', { class: 'join-row add-item-row' }, [addInput, addBtn]));
  body.appendChild(addErr);
  body.appendChild(
    el('button', {
      type: 'button',
      class: 'link-btn',
      text: '+ Add an item manually',
      onclick: () => {
        entry.items.push({ name: '', portion: '1 serving', grams: 0, qty: 1, nutrients: zeroPanel(), editing: true });
        renderEntryModal();
      },
    })
  );

  const err = el('p', { class: 'note warn' });
  body.appendChild(err);
  body.appendChild(
    el('div', { class: 'btn-row' }, [
      el('button', {
        class: 'btn primary',
        text: isNew ? 'Save to log' : 'Save changes',
        onclick: () => {
          entry.items = entry.items.filter((i) => i.name.trim() || entryTotals({ items: [i] }).calories > 0);
          if (!entry.items.length) return (err.textContent = 'Add at least one item.');
          entry.items.forEach((i) => delete i.editing);
          if (!entry.name.trim()) entry.name = entry.items.map((i) => i.name).filter(Boolean).join(', ') || 'Meal';
          upsertEntry(tracker, activePid, draft.day, entry);
          viewDay = draft.day;
          closeModal('entry-modal');
          draft = null;
          commitTracker();
          toast(isNew ? 'Logged! ✅' : 'Saved');
        },
      }),
      !isNew
        ? el('button', {
            class: 'btn ghost danger-btn',
            text: 'Delete',
            onclick: () => {
              if (!confirm(`Delete "${entry.name}" from your log?`)) return;
              deleteEntry(tracker, activePid, entry.id);
              closeModal('entry-modal');
              draft = null;
              commitTracker();
            },
          })
        : null,
      el('button', { class: 'btn ghost', text: 'Cancel', onclick: () => closeModal('entry-modal') }),
    ])
  );
}

function buildEntryTotals(entry) {
  const tot = entryTotals(entry);
  return el('div', { class: 'entry-totals', id: 'entry-totals' }, [
    el('div', { class: 'big-kcal' }, [el('strong', { text: r0(tot.calories).toLocaleString() }), el('span', { text: ' kcal' })]),
    el('div', { class: 'macro-pills' }, [
      el('span', { class: 'pill protein', text: `Protein ${r0(tot.protein)}g` }),
      el('span', { class: 'pill carbs', text: `Carbs ${r0(tot.carbs)}g` }),
      el('span', { class: 'pill fat', text: `Fat ${r0(tot.fat)}g` }),
    ]),
    el('p', { class: 'muted small', text: `Fiber ${r0(tot.fiber)}g · Sugar ${r0(tot.sugar)}g · Sat fat ${r0(tot.saturatedFat)}g · Sodium ${r0(tot.sodium)}mg` }),
  ]);
}

// Refresh totals without rebuilding the modal (keeps focus and pending taps).
function refreshEntryTotals() {
  const cur = document.getElementById('entry-totals');
  if (cur && draft) cur.replaceWith(buildEntryTotals(draft.entry));
}

function renderItem(it, idx) {
  const entry = draft.entry;
  const n = itemTotals(it);
  const card = el('div', { class: 'item-card' });

  const name = el('input', { type: 'text', class: 'item-name', value: it.name, placeholder: 'Food name' });
  name.addEventListener('input', () => (it.name = name.value));
  const portion = el('input', { type: 'text', class: 'item-portion', value: it.portion || '', placeholder: 'Portion' });
  portion.addEventListener('input', () => (it.portion = portion.value));

  const kcalSpan = el('span', { class: 'item-kcal', text: `${r0(n.calories)} kcal` });
  const macroSpan = el('span', { class: 'muted small', text: macroLine(n) });
  const setQty = (q) => {
    it.qty = Math.max(0.25, Math.round(q * 4) / 4);
    renderEntryModal();
  };
  card.appendChild(
    el('div', { class: 'item-top' }, [
      el('div', { class: 'item-names' }, [name, portion]),
      el('button', {
        type: 'button',
        class: 'icon-btn remove',
        'aria-label': 'Remove item',
        text: '×',
        onclick: () => {
          entry.items.splice(idx, 1);
          renderEntryModal();
        },
      }),
    ])
  );
  card.appendChild(
    el('div', { class: 'item-bottom' }, [
      el('div', { class: 'qty' }, [
        el('button', { type: 'button', class: 'icon-btn', text: '−', 'aria-label': 'Less', onclick: () => setQty((it.qty || 1) - 0.25) }),
        el('span', { class: 'qty-val', text: `${it.qty || 1}×` }),
        el('button', { type: 'button', class: 'icon-btn', text: '+', 'aria-label': 'More', onclick: () => setQty((it.qty || 1) + 0.25) }),
      ]),
      kcalSpan,
      macroSpan,
      it.confidence ? el('span', { class: `conf ${it.confidence}`, title: 'AI confidence', text: it.confidence }) : null,
      el('button', {
        type: 'button',
        class: 'link-btn',
        text: it.editing ? 'Done' : 'Edit numbers',
        onclick: () => {
          it.editing = !it.editing;
          renderEntryModal();
        },
      }),
    ])
  );

  if (it.editing) {
    const grid = el('div', { class: 'nutrient-grid' });
    for (const p of PANEL) {
      const inp = el('input', { type: 'number', min: '0', step: 'any', class: 'num-input', value: r1(it.nutrients[p.key]) });
      inp.addEventListener('input', () => {
        it.nutrients[p.key] = Math.max(0, Number(inp.value) || 0);
        const t = itemTotals(it);
        kcalSpan.textContent = `${r0(t.calories)} kcal`;
        macroSpan.textContent = macroLine(t);
        refreshEntryTotals();
      });
      grid.appendChild(el('label', { class: 'nutri-field' }, [`${p.label} (${p.unit})`, inp]));
    }
    card.appendChild(el('p', { class: 'muted small', text: 'Values for 1× the portion above.' }));
    card.appendChild(grid);
  }
  return card;
}

function r1(v) {
  return Math.round((v || 0) * 10) / 10;
}

/* ------------------------------------------------------------------ *
 * Profile & goals
 * ------------------------------------------------------------------ */
function openProfileModal() {
  renderProfileForm(Object.assign({}, person().profile));
  openModal('profile-modal');
}

function renderProfileForm(pr) {
  const body = $('#profile-body');
  body.innerHTML = '';
  const imperial = pr.units !== 'metric';
  const f = {};
  const field = (label, node) => el('div', { class: 'control-group' }, [el('label', { class: 'control-label', text: label }), node]);
  const num = (value, attrs) => el('input', Object.assign({ type: 'number', class: 'num-input', value: value }, attrs || {}));

  f.name = el('input', { type: 'text', class: 'text-input', value: pr.name || '' });
  f.units = el('select', { class: 'text-input' }, [el('option', { value: 'imperial', text: 'US (lb, ft/in)' }), el('option', { value: 'metric', text: 'Metric (kg, cm)' })]);
  f.units.value = imperial ? 'imperial' : 'metric';
  f.sex = el('select', { class: 'text-input' }, [el('option', { value: 'female', text: 'Female' }), el('option', { value: 'male', text: 'Male' })]);
  f.sex.value = pr.sex;
  f.age = num(pr.age, { min: 13, max: 100 });
  const totalIn = pr.heightCm / CM_PER_IN;
  if (imperial) {
    f.ft = num(Math.floor(totalIn / 12), { min: 3, max: 8 });
    f.inch = num(Math.round(totalIn % 12), { min: 0, max: 11 });
  } else {
    f.cm = num(Math.round(pr.heightCm), { min: 100, max: 250 });
  }
  f.weight = num(imperial ? r1(pr.weightKg / KG_PER_LB) : r1(pr.weightKg), { step: '0.1' });
  f.activity = el('select', { class: 'text-input' }, ACTIVITY_LEVELS.map((a) => el('option', { value: a.key, text: a.label })));
  f.activity.value = pr.activity;
  f.goal = el('select', { class: 'text-input' }, GOALS.map((g) => el('option', { value: g.key, text: g.label })));
  f.goal.value = pr.goal;
  f.rate = el('select', { class: 'text-input' }, [0.5, 1, 1.5, 2].map((v) => el('option', { value: v, text: imperial ? `${v} lb / week` : `${r1(v * KG_PER_LB)} kg / week` })));
  f.rate.value = String(pr.rateLbPerWeek || 1);
  const custom = pr.custom || {};
  f.cCal = num(custom.calories || '', { placeholder: 'auto' });
  f.cPro = num(custom.protein || '', { placeholder: 'auto' });
  f.cCarb = num(custom.carbs || '', { placeholder: 'auto' });
  f.cFat = num(custom.fat || '', { placeholder: 'auto' });

  const read = () => {
    const out = Object.assign({}, pr);
    out.name = f.name.value.trim() || 'Me';
    out.units = f.units.value;
    out.sex = f.sex.value;
    out.age = Number(f.age.value) || pr.age;
    out.heightCm = imperial ? ((Number(f.ft.value) || 0) * 12 + (Number(f.inch.value) || 0)) * CM_PER_IN || pr.heightCm : Number(f.cm.value) || pr.heightCm;
    const w = Number(f.weight.value);
    out.weightKg = w > 0 ? (imperial ? w * KG_PER_LB : w) : pr.weightKg;
    out.activity = f.activity.value;
    out.goal = f.goal.value;
    out.rateLbPerWeek = Number(f.rate.value) || 1;
    const c = { calories: Number(f.cCal.value) || 0, protein: Number(f.cPro.value) || 0, carbs: Number(f.cCarb.value) || 0, fat: Number(f.cFat.value) || 0 };
    out.custom = c.calories || c.protein || c.carbs || c.fat ? c : null;
    return out;
  };

  const preview = el('div', { class: 'target-preview' });
  const rateGroup = field('Pace', f.rate);
  const update = () => {
    const cur = read();
    rateGroup.style.display = cur.goal === 'maintain' ? 'none' : '';
    const auto = computeTargets(Object.assign({}, cur, { custom: null }), state.fatPercent);
    f.cCal.placeholder = auto.calories;
    f.cPro.placeholder = auto.protein;
    f.cCarb.placeholder = auto.carbs;
    f.cFat.placeholder = auto.fat;
    const t = computeTargets(cur, state.fatPercent);
    preview.innerHTML = '';
    preview.appendChild(
      el('div', { class: 'stat-tiles' }, [
        statTile('Calories', t.calories.toLocaleString(), 'kcal / day'),
        statTile('Protein', t.protein, 'g'),
        statTile('Carbs', t.carbs, 'g'),
        statTile('Fat', t.fat, 'g'),
      ])
    );
    preview.appendChild(
      el('p', {
        class: 'muted small',
        text: `BMR ${auto.bmr.toLocaleString()} kcal · maintenance ≈ ${auto.tdee.toLocaleString()} kcal. Fat is ${state.fatPercent || 30}% of calories (change it on the Weekly tab).` +
          (auto.floored ? ' Calories were raised to the safe minimum; talk to a professional before going lower.' : ''),
      })
    );
  };
  body.addEventListener('input', update);
  body.addEventListener('change', update);
  f.units.addEventListener('change', () => renderProfileForm(read()));

  body.appendChild(field('Name', f.name));
  body.appendChild(el('div', { class: 'two-col' }, [field('Sex (for BMR)', f.sex), field('Age', f.age)]));
  body.appendChild(
    el('div', { class: 'two-col' }, [
      imperial ? field('Height', el('div', { class: 'inline-inputs' }, [f.ft, el('span', { text: 'ft' }), f.inch, el('span', { text: 'in' })])) : field('Height (cm)', f.cm),
      field(imperial ? 'Weight (lb)' : 'Weight (kg)', f.weight),
    ])
  );
  body.appendChild(field('Activity level', f.activity));
  body.appendChild(el('div', { class: 'two-col' }, [field('Goal', f.goal), rateGroup]));
  body.appendChild(field('Units', f.units));
  body.appendChild(el('h3', { text: 'Your daily targets' }));
  body.appendChild(preview);
  body.appendChild(
    el('details', { class: 'custom-targets' }, [
      el('summary', { text: 'Set custom targets (e.g. from your dietitian)' }),
      el('div', { class: 'control-row nutri-inputs' }, [
        el('label', { class: 'nutri-field' }, ['Calories', f.cCal]),
        el('label', { class: 'nutri-field' }, ['Protein (g)', f.cPro]),
        el('label', { class: 'nutri-field' }, ['Carbs (g)', f.cCarb]),
        el('label', { class: 'nutri-field' }, ['Fat (g)', f.cFat]),
      ]),
    ])
  );
  body.appendChild(
    el('div', { class: 'btn-row' }, [
      el('button', {
        class: 'btn primary',
        text: 'Save',
        onclick: () => {
          const next = read();
          const prevKg = person().profile.weightKg;
          next.setup = true;
          next.updatedAt = Date.now();
          person().profile = next;
          if (Math.abs(next.weightKg - prevKg) > 0.05 || !Object.keys(person().weights).length) {
            person().weights[dateKey()] = { kg: next.weightKg, updatedAt: Date.now() };
          }
          closeModal('profile-modal');
          commitTracker();
          toast('Goals saved 🎯');
        },
      }),
      el('button', { class: 'btn ghost', text: 'Cancel', onclick: () => closeModal('profile-modal') }),
    ])
  );
  body.appendChild(renderHousehold());
  update();
}

function renderHousehold() {
  const box = el('div', { class: 'household' }, [
    el('h3', { text: 'Household' }),
    el('p', { class: 'muted small', text: 'Track several people, each with their own goals and food log. Each device picks who it logs for; shared-plan sync keeps everyone’s logs.' }),
  ]);
  for (const [id, p] of Object.entries(tracker.people)) {
    box.appendChild(
      el('div', { class: 'household-row' }, [
        el('span', { text: (p.profile.name || 'Unnamed') + (id === activePid ? ' (this device)' : '') }),
        id !== activePid ? el('button', { class: 'btn ghost small', text: 'Switch', onclick: () => { switchPerson(id); renderProfileForm(Object.assign({}, person().profile)); } }) : null,
        Object.keys(tracker.people).length > 1
          ? el('button', {
              class: 'btn ghost small danger-btn',
              text: 'Remove',
              onclick: () => {
                if (!confirm(`Remove ${p.profile.name} and their whole food log? This can't be undone.`)) return;
                delete tracker.people[id];
                tracker.deleted[`person:${id}`] = Date.now();
                if (activePid === id) switchPerson(Object.keys(tracker.people)[0]);
                commitTracker();
                renderProfileForm(Object.assign({}, person().profile));
              },
            })
          : null,
      ])
    );
  }
  const input = el('input', { type: 'text', class: 'text-input', placeholder: 'Name' });
  box.appendChild(
    el('div', { class: 'join-row' }, [
      input,
      el('button', {
        class: 'btn ghost',
        type: 'button',
        text: '+ Add person',
        onclick: () => {
          const name = input.value.trim();
          if (!name) return;
          const id = newId();
          tracker.people[id] = newPerson(name);
          tracker.people[id].profile.updatedAt = Date.now();
          saveTracker(tracker);
          switchPerson(id);
          renderProfileForm(Object.assign({}, person().profile));
        },
      }),
    ])
  );
  return box;
}

function statTile(label, value, sub) {
  return el('div', { class: 'stat-tile' }, [
    el('span', { class: 'stat-label', text: label }),
    el('strong', { class: 'stat-value', text: String(value) }),
    sub ? el('span', { class: 'stat-sub', text: sub }) : null,
  ]);
}

/* ------------------------------------------------------------------ *
 * Coach
 * ------------------------------------------------------------------ */
const COACH_PROMPTS = [
  'What should I eat next to hit my goals?',
  'How am I doing today?',
  'Review my last 7 days',
  'High-protein snack ideas',
  'Plan tomorrow from my recipes',
];

function coachKey() {
  return `mealplan.coach.${activePid}`;
}

function loadCoach() {
  try {
    const v = JSON.parse(localStorage.getItem(coachKey()) || '[]');
    return Array.isArray(v) ? v : [];
  } catch (e) {
    return [];
  }
}

function saveCoach(list) {
  try {
    localStorage.setItem(coachKey(), JSON.stringify(list.slice(-40)));
  } catch (e) {
    /* ignore */
  }
}

// Escape, then allow **bold** and "- " bullets only.
function coachHtml(text) {
  const esc = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const lines = esc.split('\n');
  let html = '';
  let inList = false;
  for (const raw of lines) {
    const line = raw.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    const m = line.match(/^\s*[-•*]\s+(.*)$/);
    if (m) {
      if (!inList) html += '<ul>';
      inList = true;
      html += `<li>${m[1]}</li>`;
    } else {
      if (inList) html += '</ul>';
      inList = false;
      if (line.trim()) html += `<p>${line}</p>`;
    }
  }
  if (inList) html += '</ul>';
  return html;
}

function renderCoach(pendingError) {
  const thread = $('#coach-thread');
  thread.innerHTML = '';
  const history = loadCoach();
  const name = person().profile.name;
  if (!history.length) {
    const bubble = el('div', { class: 'bubble assistant' });
    bubble.innerHTML = coachHtml(
      `Hi${name && name !== 'Me' ? ' ' + name : ''}! I'm your nutrition coach. I can see your goals, what you've logged and your recipes. Ask me what to eat, how your day is going, or how to hit a target.` +
        (person().profile.setup ? '' : '\n\n**Tip:** set up your profile first (Today tab → Profile & goals) so my advice fits you.')
    );
    thread.appendChild(bubble);
  }
  for (const m of history) {
    const b = el('div', { class: `bubble ${m.role}` });
    if (m.role === 'assistant') b.innerHTML = coachHtml(m.content);
    else b.textContent = m.content;
    thread.appendChild(b);
  }
  if (coachBusy) thread.appendChild(el('div', { class: 'bubble assistant typing' }, [el('span'), el('span'), el('span')]));
  if (pendingError) thread.appendChild(el('div', { class: 'bubble error', text: pendingError }));
  thread.scrollTop = thread.scrollHeight;

  const chips = $('#coach-chips');
  chips.innerHTML = '';
  for (const p of COACH_PROMPTS) chips.appendChild(el('button', { type: 'button', class: 'chip', text: p, onclick: () => sendCoach(p) }));
  $('#coach-send').disabled = coachBusy;
}

function buildCoachContext() {
  const p = person();
  const pr = p.profile;
  const tg = targets();
  const today = dateKey();
  const summarize = (n) => ({
    calories: r0(n.calories), protein: r0(n.protein), carbs: r0(n.carbs), fat: r0(n.fat),
    fiber: r0(n.fiber), sugar: r0(n.sugar), sodium: r0(n.sodium), saturatedFat: r0(n.saturatedFat),
  });
  const recentDays = [];
  for (let i = 1; i <= 7; i++) {
    const d = shiftDateKey(today, -i);
    if (p.log[d] && p.log[d].length) recentDays.push({ date: d, ...summarize(dayTotals(p, d)), meals: p.log[d].map((e) => e.name) });
  }
  const weights = Object.entries(p.weights).sort(([a], [b]) => (a < b ? -1 : 1)).slice(-10)
    .map(([d, w]) => ({ date: d, weight: kgToDisplay(w.kg, pr.units) }));
  const recipes = getAllRecipes()
    .filter((r) => !isHidden(r.id))
    .map((r) => {
      const n = recipeNutrition(r);
      return `${r.name} | ${r.mealTypes.join('/')} | ${r.calories} kcal, ${n.protein}/${n.carbs}/${n.fat}`;
    })
    .join('\n');
  return {
    now: new Date().toLocaleString(),
    profile: {
      name: pr.name, sex: pr.sex, age: pr.age,
      height: pr.units === 'metric' ? `${r0(pr.heightCm)} cm` : `${Math.floor(pr.heightCm / CM_PER_IN / 12)} ft ${r0((pr.heightCm / CM_PER_IN) % 12)} in`,
      weight: kgToDisplay(pr.weightKg, pr.units), activity: pr.activity, goal: pr.goal,
      paceLbPerWeek: pr.goal === 'maintain' ? 0 : pr.rateLbPerWeek, profileCompleted: !!pr.setup,
    },
    dailyTargets: { calories: tg.calories, protein: tg.protein, carbs: tg.carbs, fat: tg.fat, fiber: tg.fiber, sodiumMax: 2300, sugarMax: 50 },
    today: {
      date: today,
      totals: summarize(dayTotals(p, today)),
      entries: dayEntries(p, today).map((e) => ({ meal: e.meal, name: e.name, ...summarize(entryTotals(e)) })),
      waterCups: (p.water[today] && p.water[today].cups) || 0,
      plannedMeals: plannedFor(today).map((x) => `${x.slot}: ${x.recipe.name}`),
    },
    previous7Days: recentDays,
    weightHistory: weights,
    recipes,
  };
}

async function sendCoach(text) {
  const msg = (text || '').trim();
  if (!msg || coachBusy) return;
  const history = loadCoach();
  history.push({ role: 'user', content: msg });
  saveCoach(history);
  $('#coach-input').value = '';
  coachBusy = true;
  renderCoach();
  let error = null;
  try {
    const res = await callNutritionAI({ action: 'coach', messages: history, context: buildCoachContext() });
    const h = loadCoach();
    h.push({ role: 'assistant', content: res.reply || '…' });
    saveCoach(h);
  } catch (e) {
    error = e.message;
    // Drop the unanswered question so the thread stays user/assistant alternating.
    const h = loadCoach();
    if (h.length && h[h.length - 1].role === 'user') {
      h.pop();
      saveCoach(h);
      $('#coach-input').value = msg;
    }
  } finally {
    coachBusy = false;
    renderCoach(error);
  }
}

/* ------------------------------------------------------------------ *
 * Progress
 * ------------------------------------------------------------------ */
function renderProgress() {
  const p = person();
  const tg = targets();
  const today = dateKey();
  const days = [];
  for (let i = progressRange - 1; i >= 0; i--) days.push(shiftDateKey(today, -i));
  const logged = days.filter((d) => p.log[d] && p.log[d].length);
  const totalsByDay = Object.fromEntries(days.map((d) => [d, dayTotals(p, d)]));
  const avg = zeroPanel();
  for (const d of logged) for (const k in avg) avg[k] += totalsByDay[d][k] / logged.length;
  const scored = logged.flatMap((d) => p.log[d]).filter((e) => e.healthScore);
  const avgScore = scored.length ? scored.reduce((s, e) => s + e.healthScore, 0) / scored.length : 0;
  const onTarget = logged.filter((d) => Math.abs(totalsByDay[d].calories - tg.calories) <= tg.calories * 0.1).length;

  const stats = $('#progress-stats');
  stats.innerHTML = '';
  stats.appendChild(statTile('Avg calories', logged.length ? r0(avg.calories).toLocaleString() : '—', `target ${tg.calories.toLocaleString()}`));
  stats.appendChild(statTile('Avg protein', logged.length ? `${r0(avg.protein)} g` : '—', `target ${tg.protein} g`));
  stats.appendChild(statTile('Days logged', `${logged.length}/${progressRange}`, `🔥 ${loggingStreak(p)}-day streak`));
  stats.appendChild(statTile('On target', logged.length ? `${onTarget}` : '—', 'days within ±10%'));
  stats.appendChild(statTile('Meal score', avgScore ? avgScore.toFixed(1) : '—', 'average / 10'));

  barChart(
    $('#chart-calories'),
    days.map((d) => ({
      label: progressRange === 7 ? parseDateKey(d).toLocaleDateString(undefined, { weekday: 'short' }) : `${parseDateKey(d).getMonth() + 1}/${parseDateKey(d).getDate()}`,
      sub: friendlyDate(d),
      value: totalsByDay[d].calories,
    })),
    tg.calories
  );

  const macros = $('#progress-macros');
  macros.innerHTML = '';
  if (!logged.length) macros.appendChild(el('p', { class: 'muted', text: 'No meals logged in this period yet.' }));
  else {
    macros.appendChild(barRow('Protein', avg.protein, tg.protein, 'g'));
    macros.appendChild(barRow('Carbs', avg.carbs, tg.carbs, 'g'));
    macros.appendChild(barRow('Fat', avg.fat, tg.fat, 'g', true));
    const split = macroSplit(avg);
    macros.appendChild(el('p', { class: 'muted small', text: `Calorie split: ${split.protein}% protein · ${split.carbs}% carbs · ${split.fat}% fat` }));
  }

  // Weight
  const units = p.profile.units;
  $('#weight-input').placeholder = units === 'metric' ? "Today's weight (kg)" : "Today's weight (lb)";
  const wAll = Object.entries(p.weights).sort(([a], [b]) => (a < b ? -1 : 1));
  const inRange = wAll.filter(([d]) => d >= days[0]);
  const series = (inRange.length >= 2 ? inRange : wAll.slice(-Math.max(2, inRange.length)))
    .map(([d, w]) => ({ x: parseDateKey(d), value: units === 'metric' ? w.kg : w.kg / KG_PER_LB, label: friendlyDate(d) }));
  lineChart($('#chart-weight'), series, { fmt: (v) => `${r1(v)} ${units === 'metric' ? 'kg' : 'lb'}` });
  const change = series.length >= 2 ? series[series.length - 1].value - series[0].value : 0;
  $('#weight-change').textContent = series.length >= 2 ? `${change > 0 ? '+' : ''}${r1(change)} ${units === 'metric' ? 'kg' : 'lb'} since ${series[0].label}` : '';

  // Nutrient gaps
  const gaps = $('#progress-gaps');
  gaps.innerHTML = '';
  if (logged.length) {
    for (const key of ['fiber', 'sodium', 'sugar', 'saturatedFat', 'potassium', 'calcium', 'iron', 'vitaminC', 'vitaminD']) {
      const n = PANEL.find((x) => x.key === key);
      gaps.appendChild(barRow(n.label, avg[key], targetFor(key, tg), n.unit, n.limit));
    }
  } else gaps.appendChild(el('p', { class: 'muted', text: 'Log a few days to spot gaps.' }));

  // Top foods
  const counts = new Map();
  for (const d of logged) {
    for (const e of p.log[d]) {
      const k = e.name;
      const c = counts.get(k) || { n: 0, kcal: 0 };
      c.n++;
      c.kcal += entryTotals(e).calories;
      counts.set(k, c);
    }
  }
  const foods = $('#progress-foods');
  foods.innerHTML = '';
  const top = [...counts.entries()].sort((a, b) => b[1].n - a[1].n).slice(0, 8);
  if (!top.length) foods.appendChild(el('p', { class: 'muted', text: 'Nothing yet.' }));
  for (const [name, c] of top) {
    foods.appendChild(
      el('div', { class: 'food-row' }, [
        el('span', { class: 'pick-name', text: name }),
        el('span', { class: 'muted small', text: `${c.n}× · avg ${r0(c.kcal / c.n)} kcal` }),
      ])
    );
  }
}

/* ------------------------------------------------------------------ *
 * Sync hooks (called from js/sync.js)
 * ------------------------------------------------------------------ */
function trackerSnapshot() {
  return trackerForSync(tracker);
}

// Merge a tracker pulled from the shared plan into ours. Returns true when
// the merged result has something the remote copy lacked (so the caller
// should push it back up).
function mergeRemoteTracker(remote) {
  if (!remote) return false;
  tracker = mergeTrackers(tracker, remote);
  if (!tracker.people[activePid]) activePid = getActivePersonId(tracker);
  saveTracker(tracker, { silent: true });
  return JSON.stringify(trackerForSync(tracker)) !== JSON.stringify(trackerForSync(normalizeTracker(remote)));
}

function renderTrackerAll() {
  renderToday();
  if (isTabActive('progress')) renderProgress();
  if (isTabActive('coach')) renderCoach();
}

/* ------------------------------------------------------------------ *
 * Wiring
 * ------------------------------------------------------------------ */
function initTracker() {
  $('#photo-camera').addEventListener('change', (e) => {
    onPhotoChosen(e.target.files[0]);
    e.target.value = '';
  });
  $('#photo-library').addEventListener('change', (e) => {
    onPhotoChosen(e.target.files[0]);
    e.target.value = '';
  });
  $('#btn-describe').addEventListener('click', openDescribe);
  $('#btn-barcode').addEventListener('click', openBarcode);
  $('#btn-from-recipe').addEventListener('click', openRecipes);
  $('#btn-manual').addEventListener('click', openManual);
  $('#btn-profile').addEventListener('click', openProfileModal);
  $('#day-prev').addEventListener('click', () => {
    viewDay = shiftDateKey(viewDay, -1);
    renderToday();
  });
  $('#day-next').addEventListener('click', () => {
    if (viewDay < dateKey()) viewDay = shiftDateKey(viewDay, 1);
    renderToday();
  });

  document.querySelectorAll('[data-close="add"],[data-close="entry"],[data-close="profile"]').forEach((b) =>
    b.addEventListener('click', () => closeModal(`${b.dataset.close}-modal`))
  );
  $('#add-modal').addEventListener('click', (e) => {
    if (e.target.id === 'add-modal') BarcodeScanner.stop();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') ['add-modal', 'entry-modal', 'profile-modal'].forEach(closeModal);
  });

  // Coach
  $('#coach-form').addEventListener('submit', (e) => {
    e.preventDefault();
    sendCoach($('#coach-input').value);
  });
  $('#coach-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendCoach($('#coach-input').value);
    }
  });
  $('#btn-coach-clear').addEventListener('click', () => {
    saveCoach([]);
    renderCoach();
  });
  $('#ai-passcode').value = getAiPasscode();
  $('#btn-save-passcode').addEventListener('click', () => {
    setAiPasscode($('#ai-passcode').value.trim());
    $('#passcode-note').textContent = 'Saved on this device.';
  });

  // Progress
  document.querySelectorAll('#range-switch button').forEach((b) =>
    b.addEventListener('click', () => {
      document.querySelectorAll('#range-switch button').forEach((x) => x.classList.remove('active'));
      b.classList.add('active');
      progressRange = Number(b.dataset.range);
      renderProgress();
    })
  );
  $('#weight-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const v = Number($('#weight-input').value);
    if (!(v > 0)) return;
    const kg = person().profile.units === 'metric' ? v : v * KG_PER_LB;
    person().weights[dateKey()] = { kg, updatedAt: Date.now() };
    person().profile.weightKg = kg; // keeps calorie targets current
    person().profile.updatedAt = Date.now();
    $('#weight-input').value = '';
    commitTracker();
    renderProgress();
    toast('Weight logged');
  });

  // Re-render the day when the date rolls over while the app stays open.
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'visible') return;
    const today = dateKey();
    if (renderToday._lastToday && renderToday._lastToday !== today && viewDay === renderToday._lastToday) viewDay = today;
    renderToday._lastToday = today;
    renderToday();
  });
  renderToday._lastToday = dateKey();

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => isTabActive('progress') && renderProgress(), 200);
  });

  renderToday();
}
