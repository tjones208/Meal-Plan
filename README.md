# 🍽️ Meal Plan

An AI nutrition tracker and weekly meal planner. Snap a photo of any meal and
get calories, macros and micronutrients in seconds, track against personal
goals, chat with an AI nutrition coach, and plan and shop for your week. It is
a static web app (installable PWA) with no build step; the AI runs in one small
Supabase Edge Function so your API key never reaches the browser.

## Nutrition tracker (Today · Coach · Progress tabs)

- **📸 Photo logging.** Snap or upload a meal photo and add optional details
  ("no dressing"). Claude identifies every item, estimates portions, reads
  nutrition labels when visible, and returns calories, protein, carbs, fat,
  saturated fat, fiber, sugar, sodium, cholesterol, potassium, calcium, iron
  and vitamins C and D. It also gives a meal score (1-10), the assumptions it
  made, and a tip. Everything is editable before saving: rename items, scale
  portions (0.25× steps), remove items, add items by typing, or edit the numbers.
- **✍️ Describe it.** For example "Chipotle chicken burrito bowl" or "2 eggs,
  toast with butter".
- **🔍 Barcode.** Live camera scanning where the browser supports it
  (Chrome/Android), or type the number. Product data comes from Open Food Facts.
- **📖 Recent foods & recipes.** Re-log a recent meal in one tap, or log any
  recipe. Planned meals for today show "✓ I ate this", and any recipe modal has
  "Log this meal".
- **✏️ Manual entry.**
- **🎯 Personal goals.** Calorie target from Mifflin-St Jeor BMR × activity,
  adjusted for your goal (lose, maintain or gain) and pace. Protein is set per
  kg of body weight, fat follows the Weekly tab's fat-% target, and carbs fill
  the rest. You can override any target, for example with numbers from your
  dietitian.
- **Today dashboard.** Calorie ring, macro and fiber bars, water cups, logging
  streak, and a full nutrient panel against FDA Daily Values.
- **💬 AI coach.** Chat that sees your profile, targets, today's log, the last
  7 days, your weight trend and your recipe library, so it can say "you're at
  92 of 150 g protein, try the Salmon Teriyaki Bowl tonight".
- **📈 Progress.** 7/30/90-day stats, a calories-vs-target chart, average
  macros, weight tracking with a trend chart, nutrient gaps, and your most
  logged foods.
- **👨‍👩‍👧 Household.** Several people, each with their own goals and log. Each
  device picks who it logs for. With a shared plan, logs merge entry by entry
  across phones, so nobody's meals get overwritten.

### AI backend setup (one time)

The AI runs in the `nutrition-ai` Supabase Edge Function
(`supabase/functions/nutrition-ai/index.ts`), which calls the Claude API.

1. In the Supabase dashboard for the project in `js/sync.js`, open
   **Edge Functions → Secrets** and add `ANTHROPIC_API_KEY` (from
   console.anthropic.com).
2. Recommended: add an `APP_PASSCODE` secret and enter the same passcode in the
   app under **Coach → AI settings** on each device. The Supabase anon key is
   public, so without a passcode anyone who finds it could use your AI credits.
3. Optional: set `ANTHROPIC_MODEL` to override the default model.
4. To redeploy after changes: `supabase functions deploy nutrition-ai`.

## Meal planning features

1. **Create meal plans** — A weekly planner grid (7 days × breakfast / lunch /
   dinner). Click any slot to add a recipe, view its instructions, or remove
   it. The running total of planned meals and calories updates as you go.

2. **Meal plan suggestions** — Set your preferences (dietary tags, a
   max-calories-per-meal limit, and which meal slots to fill) and hit
   **Generate week** to auto-fill the whole plan with matching recipes. You can
   also click any single slot for a filtered list of suggestions to pick from.

3. **Shopping list** — Every ingredient from every planned meal is combined
   (quantities of the same item are summed) and grouped by grocery aisle in the
   order you'd walk a store. Check items off as you shop, or copy the whole list
   to your clipboard.

4. **Cooking instructions** — Open any recipe to see its ingredients with
   quantities, prep/cook times, servings, and numbered step-by-step
   instructions.

Your plan, shopping check-offs and food log are saved in the browser's
`localStorage`, so they survive a page refresh (and sync across devices if you
turn on sharing).

## Running it

No build step — just open the file:

```bash
# Option 1: open directly
open index.html          # macOS
xdg-open index.html      # Linux

# Option 2: serve locally (any static server works)
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Project structure

```
index.html          Markup and layout
css/styles.css      All styling (responsive, no framework)
js/recipes.js       Recipe database + aisle / diet / meal-type definitions
js/storage.js       localStorage persistence of the plan
js/suggestions.js   Auto-generate a week + per-slot suggestion engine
js/shopping.js      Aggregate ingredients into an aisle-grouped shopping list
js/nutrition.js     Plan nutrition totals + weekly limit adjuster
js/custom.js        Custom meals + import from a link
js/sync.js          Cross-device sync via Supabase share codes
js/tracker-store.js Food-log data model, goal maths, sync merge
js/ai.js            AI edge-function client, photo resizing, barcode lookup
js/charts.js        Small SVG charts for the Progress tab
js/tracker.js       Today / Coach / Progress UI and the food modals
js/app.js           UI controller wiring everything together
supabase/functions/nutrition-ai/   Edge Function: photo/text analysis + coach (Claude API)
```

Note: the AI features need the site served over http(s) (not `file://`) and
the edge function deployed.

## Adding recipes

Add an object to the `RECIPES` array in `js/recipes.js`. Each recipe needs an
`id`, `name`, `mealTypes`, `tags`, `servings`, `calories`, `prepTime`,
`cookTime`, an `ingredients` list (each with `item`, `qty`, `unit`, and `aisle`),
and an ordered `steps` list. Keeping ingredient `unit`s consistent lets the
shopping list sum quantities across recipes.
