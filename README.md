# 🍽️ Meal Plan

A self-contained web app for planning your week of meals. It creates meal
plans, suggests plans automatically, builds a consolidated shopping list, and
gives step-by-step cooking instructions — all in the browser, with no server,
build step, or dependencies.

## Features

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

Your plan and checked-off shopping items are saved in the browser's
`localStorage`, so they survive a page refresh.

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
js/app.js           UI controller wiring the four features together
```

## Adding recipes

Add an object to the `RECIPES` array in `js/recipes.js`. Each recipe needs an
`id`, `name`, `mealTypes`, `tags`, `servings`, `calories`, `prepTime`,
`cookTime`, an `ingredients` list (each with `item`, `qty`, `unit`, and `aisle`),
and an ordered `steps` list. Keeping ingredient `unit`s consistent lets the
shopping list sum quantities across recipes.
