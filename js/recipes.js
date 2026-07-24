/*
 * Recipe database for the Meal Plan app.
 *
 * Each recipe carries everything the four core features need:
 *   - meal plan creation & suggestions read `tags`, `mealTypes`, `calories`, `servings`
 *   - the shopping list reads `ingredients` (each with quantity + unit + aisle)
 *   - cooking instructions read `steps` and `prepTime` / `cookTime`
 *
 * Ingredient units are kept consistent so quantities can be summed across
 * recipes when building a shopping list (see js/shopping.js).
 *
 * 150 recipes: 50 breakfast, 50 lunch, 50 dinner.
 */

const RECIPES = [
  {
    "id": "bfa-classic-scrambled-eggs",
    "name": "Classic Creamy Scrambled Eggs",
    "mealTypes": [
      "breakfast"
    ],
    "tags": [
      "vegetarian",
      "gluten-free",
      "quick",
      "high-protein"
    ],
    "servings": 2,
    "calories": 320,
    "prepTime": 3,
    "cookTime": 7,
    "ingredients": [
      {
        "item": "eggs",
        "qty": 4,
        "unit": "unit",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "butter",
        "qty": 1,
        "unit": "tbsp",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "whole milk",
        "qty": 2,
        "unit": "tbsp",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "salt",
        "qty": 1,
        "unit": "pinch",
        "aisle": "Spices"
      },
      {
        "item": "black pepper",
        "qty": 1,
        "unit": "pinch",
        "aisle": "Spices"
      },
      {
        "item": "chives",
        "qty": 1,
        "unit": "tbsp",
        "aisle": "Produce"
      }
    ],
    "steps": [
      "Whisk eggs with milk, salt, and pepper until fully combined.",
      "Melt butter in a nonstick pan over low heat.",
      "Pour in eggs and stir slowly with a spatula, folding curds gently.",
      "Remove from heat while still slightly wet and top with chopped chives."
    ]
  },
  {
    "id": "bfa-crispy-fried-eggs",
    "name": "Crispy Edge Fried Eggs",
    "mealTypes": [
      "breakfast"
    ],
    "tags": [
      "vegetarian",
      "gluten-free",
      "quick",
      "high-protein"
    ],
    "servings": 1,
    "calories": 240,
    "prepTime": 2,
    "cookTime": 5,
    "ingredients": [
      {
        "item": "eggs",
        "qty": 2,
        "unit": "unit",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "olive oil",
        "qty": 2,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "flaky sea salt",
        "qty": 1,
        "unit": "pinch",
        "aisle": "Spices"
      },
      {
        "item": "red pepper flakes",
        "qty": 1,
        "unit": "pinch",
        "aisle": "Spices"
      }
    ],
    "steps": [
      "Heat olive oil in a skillet over medium-high until shimmering.",
      "Crack eggs into the hot oil and let the edges bubble and crisp.",
      "Spoon hot oil over the whites until set but yolks stay runny.",
      "Slide onto a plate and finish with sea salt and red pepper flakes."
    ]
  },
  {
    "id": "bfa-classic-poached-eggs",
    "name": "Perfect Poached Eggs On Greens",
    "mealTypes": [
      "breakfast"
    ],
    "tags": [
      "vegetarian",
      "gluten-free",
      "high-protein",
      "low-carb"
    ],
    "servings": 2,
    "calories": 260,
    "prepTime": 5,
    "cookTime": 8,
    "ingredients": [
      {
        "item": "eggs",
        "qty": 4,
        "unit": "unit",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "white vinegar",
        "qty": 1,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "baby spinach",
        "qty": 3,
        "unit": "cup",
        "aisle": "Produce"
      },
      {
        "item": "garlic",
        "qty": 1,
        "unit": "clove",
        "aisle": "Produce"
      },
      {
        "item": "olive oil",
        "qty": 1,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "salt",
        "qty": 1,
        "unit": "pinch",
        "aisle": "Spices"
      }
    ],
    "steps": [
      "Bring a pot of water to a gentle simmer and add vinegar.",
      "Swirl the water and slip in each egg, poaching 3 minutes.",
      "Meanwhile saute garlic and spinach in olive oil until wilted.",
      "Plate the greens and top with drained poached eggs and salt."
    ]
  },
  {
    "id": "bfa-cheese-herb-omelette",
    "name": "Cheese And Herb Omelette",
    "mealTypes": [
      "breakfast"
    ],
    "tags": [
      "vegetarian",
      "gluten-free",
      "quick",
      "high-protein"
    ],
    "servings": 1,
    "calories": 380,
    "prepTime": 4,
    "cookTime": 6,
    "ingredients": [
      {
        "item": "eggs",
        "qty": 3,
        "unit": "unit",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "cheddar cheese",
        "qty": 0.5,
        "unit": "cup",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "butter",
        "qty": 1,
        "unit": "tbsp",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "parsley",
        "qty": 1,
        "unit": "tbsp",
        "aisle": "Produce"
      },
      {
        "item": "salt",
        "qty": 1,
        "unit": "pinch",
        "aisle": "Spices"
      },
      {
        "item": "black pepper",
        "qty": 1,
        "unit": "pinch",
        "aisle": "Spices"
      }
    ],
    "steps": [
      "Beat eggs with salt and pepper until smooth.",
      "Melt butter in a nonstick pan over medium heat.",
      "Pour in eggs and swirl, lifting edges to let liquid flow underneath.",
      "Scatter cheese and parsley over one half, then fold and slide onto a plate."
    ]
  },
  {
    "id": "bfa-western-denver-omelette",
    "name": "Western Denver Omelette",
    "mealTypes": [
      "breakfast"
    ],
    "tags": [
      "gluten-free",
      "high-protein"
    ],
    "servings": 2,
    "calories": 420,
    "prepTime": 8,
    "cookTime": 10,
    "ingredients": [
      {
        "item": "eggs",
        "qty": 5,
        "unit": "unit",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "cooked ham",
        "qty": 4,
        "unit": "oz",
        "aisle": "Meat & Seafood"
      },
      {
        "item": "bell pepper",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "yellow onion",
        "qty": 0.5,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "cheddar cheese",
        "qty": 0.5,
        "unit": "cup",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "butter",
        "qty": 1,
        "unit": "tbsp",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "salt",
        "qty": 1,
        "unit": "pinch",
        "aisle": "Spices"
      }
    ],
    "steps": [
      "Dice ham, pepper, and onion, then saute in butter until softened.",
      "Beat eggs with salt and pour over the vegetables in the pan.",
      "Cook gently, lifting edges until the eggs are nearly set.",
      "Sprinkle cheese over one half, fold, and cook until melted."
    ]
  },
  {
    "id": "bfa-veggie-frittata",
    "name": "Roasted Vegetable Frittata",
    "mealTypes": [
      "breakfast"
    ],
    "tags": [
      "vegetarian",
      "gluten-free",
      "high-protein",
      "batch-cook"
    ],
    "servings": 6,
    "calories": 290,
    "prepTime": 12,
    "cookTime": 22,
    "ingredients": [
      {
        "item": "eggs",
        "qty": 8,
        "unit": "unit",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "zucchini",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "cherry tomatoes",
        "qty": 1,
        "unit": "cup",
        "aisle": "Produce"
      },
      {
        "item": "red onion",
        "qty": 0.5,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "feta cheese",
        "qty": 0.5,
        "unit": "cup",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "olive oil",
        "qty": 2,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "salt",
        "qty": 1,
        "unit": "tsp",
        "aisle": "Spices"
      }
    ],
    "steps": [
      "Heat oven to 190C/375F and warm oil in an ovenproof skillet.",
      "Saute sliced zucchini, tomatoes, and onion until softened.",
      "Whisk eggs with salt, pour over the veg, and scatter feta on top.",
      "Bake 18 minutes until set and golden, then cool and slice into wedges."
    ]
  },
  {
    "id": "bfa-spinach-mushroom-frittata",
    "name": "Spinach And Mushroom Frittata",
    "mealTypes": [
      "breakfast"
    ],
    "tags": [
      "vegetarian",
      "gluten-free",
      "high-protein",
      "low-carb"
    ],
    "servings": 4,
    "calories": 250,
    "prepTime": 10,
    "cookTime": 20,
    "ingredients": [
      {
        "item": "eggs",
        "qty": 6,
        "unit": "unit",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "cremini mushrooms",
        "qty": 8,
        "unit": "oz",
        "aisle": "Produce"
      },
      {
        "item": "baby spinach",
        "qty": 3,
        "unit": "cup",
        "aisle": "Produce"
      },
      {
        "item": "parmesan cheese",
        "qty": 0.33,
        "unit": "cup",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "olive oil",
        "qty": 2,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "garlic",
        "qty": 2,
        "unit": "clove",
        "aisle": "Produce"
      },
      {
        "item": "salt",
        "qty": 1,
        "unit": "tsp",
        "aisle": "Spices"
      }
    ],
    "steps": [
      "Heat oven to 190C/375F and warm oil in an ovenproof skillet.",
      "Cook mushrooms and garlic until browned, then wilt in the spinach.",
      "Whisk eggs with parmesan and salt and pour into the pan.",
      "Cook 2 minutes on the stove, then bake 15 minutes until set."
    ]
  },
  {
    "id": "bfa-eggs-benedict",
    "name": "Classic Eggs Benedict",
    "mealTypes": [
      "breakfast"
    ],
    "tags": [
      "high-protein"
    ],
    "servings": 2,
    "calories": 540,
    "prepTime": 15,
    "cookTime": 12,
    "ingredients": [
      {
        "item": "eggs",
        "qty": 4,
        "unit": "unit",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "english muffins",
        "qty": 2,
        "unit": "unit",
        "aisle": "Bakery"
      },
      {
        "item": "canadian bacon",
        "qty": 4,
        "unit": "slice",
        "aisle": "Meat & Seafood"
      },
      {
        "item": "egg yolks",
        "qty": 3,
        "unit": "unit",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "butter",
        "qty": 0.5,
        "unit": "cup",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "lemon juice",
        "qty": 1,
        "unit": "tbsp",
        "aisle": "Produce"
      },
      {
        "item": "white vinegar",
        "qty": 1,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      }
    ],
    "steps": [
      "Whisk egg yolks with lemon juice over a double boiler, then stream in melted butter to make hollandaise.",
      "Toast the muffin halves and warm the canadian bacon in a pan.",
      "Poach eggs in simmering water with vinegar for 3 minutes.",
      "Layer bacon and poached eggs on the muffins and spoon hollandaise over."
    ]
  },
  {
    "id": "bfa-classic-shakshuka",
    "name": "Classic Tomato Shakshuka",
    "mealTypes": [
      "breakfast"
    ],
    "tags": [
      "vegetarian",
      "gluten-free",
      "high-protein"
    ],
    "servings": 4,
    "calories": 300,
    "prepTime": 10,
    "cookTime": 25,
    "ingredients": [
      {
        "item": "eggs",
        "qty": 6,
        "unit": "unit",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "crushed tomatoes",
        "qty": 1,
        "unit": "can",
        "aisle": "Canned Goods"
      },
      {
        "item": "bell pepper",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "yellow onion",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "garlic",
        "qty": 3,
        "unit": "clove",
        "aisle": "Produce"
      },
      {
        "item": "cumin",
        "qty": 1,
        "unit": "tsp",
        "aisle": "Spices"
      },
      {
        "item": "paprika",
        "qty": 1,
        "unit": "tsp",
        "aisle": "Spices"
      },
      {
        "item": "olive oil",
        "qty": 2,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      }
    ],
    "steps": [
      "Saute onion, pepper, and garlic in olive oil until soft.",
      "Stir in cumin and paprika, then pour in the crushed tomatoes.",
      "Simmer the sauce 10 minutes until thickened.",
      "Make wells, crack in the eggs, cover, and cook until whites set."
    ]
  },
  {
    "id": "bfa-green-shakshuka",
    "name": "Green Herb Shakshuka",
    "mealTypes": [
      "breakfast"
    ],
    "tags": [
      "vegetarian",
      "gluten-free",
      "high-protein",
      "low-carb"
    ],
    "servings": 3,
    "calories": 280,
    "prepTime": 10,
    "cookTime": 18,
    "ingredients": [
      {
        "item": "eggs",
        "qty": 5,
        "unit": "unit",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "baby spinach",
        "qty": 5,
        "unit": "cup",
        "aisle": "Produce"
      },
      {
        "item": "leek",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "garlic",
        "qty": 2,
        "unit": "clove",
        "aisle": "Produce"
      },
      {
        "item": "cilantro",
        "qty": 0.5,
        "unit": "cup",
        "aisle": "Produce"
      },
      {
        "item": "feta cheese",
        "qty": 0.5,
        "unit": "cup",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "olive oil",
        "qty": 2,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      }
    ],
    "steps": [
      "Soften sliced leek and garlic in olive oil over medium heat.",
      "Add spinach and cilantro and cook until fully wilted.",
      "Make wells in the greens and crack in the eggs.",
      "Cover and cook until whites set, then crumble feta over the top."
    ]
  },
  {
    "id": "bfa-fluffy-buttermilk-pancakes",
    "name": "Fluffy Buttermilk Pancakes",
    "mealTypes": [
      "breakfast"
    ],
    "tags": [
      "vegetarian",
      "kid-friendly"
    ],
    "servings": 4,
    "calories": 380,
    "prepTime": 10,
    "cookTime": 15,
    "ingredients": [
      {
        "item": "all purpose flour",
        "qty": 2,
        "unit": "cup",
        "aisle": "Grains & Pasta"
      },
      {
        "item": "buttermilk",
        "qty": 2,
        "unit": "cup",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "eggs",
        "qty": 2,
        "unit": "unit",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "sugar",
        "qty": 2,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "baking powder",
        "qty": 2,
        "unit": "tsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "butter",
        "qty": 3,
        "unit": "tbsp",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "salt",
        "qty": 0.5,
        "unit": "tsp",
        "aisle": "Spices"
      }
    ],
    "steps": [
      "Whisk flour, sugar, baking powder, and salt in a bowl.",
      "In another bowl beat buttermilk, eggs, and melted butter.",
      "Fold wet into dry until just combined, leaving some lumps.",
      "Ladle onto a hot griddle and flip when bubbles form on the surface."
    ]
  },
  {
    "id": "bfa-banana-oat-pancakes",
    "name": "Banana Oat Pancakes",
    "mealTypes": [
      "breakfast"
    ],
    "tags": [
      "vegetarian",
      "gluten-free",
      "kid-friendly"
    ],
    "servings": 2,
    "calories": 340,
    "prepTime": 8,
    "cookTime": 12,
    "ingredients": [
      {
        "item": "rolled oats",
        "qty": 1,
        "unit": "cup",
        "aisle": "Grains & Pasta"
      },
      {
        "item": "banana",
        "qty": 2,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "eggs",
        "qty": 2,
        "unit": "unit",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "baking powder",
        "qty": 1,
        "unit": "tsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "cinnamon",
        "qty": 0.5,
        "unit": "tsp",
        "aisle": "Spices"
      },
      {
        "item": "coconut oil",
        "qty": 1,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      }
    ],
    "steps": [
      "Blend oats into a fine flour in a blender.",
      "Add bananas, eggs, baking powder, and cinnamon and blend smooth.",
      "Heat coconut oil in a nonstick pan over medium heat.",
      "Pour small rounds and cook until set, flipping once until golden."
    ]
  },
  {
    "id": "bfa-belgian-waffles",
    "name": "Crisp Belgian Waffles",
    "mealTypes": [
      "breakfast"
    ],
    "tags": [
      "vegetarian",
      "kid-friendly"
    ],
    "servings": 4,
    "calories": 420,
    "prepTime": 12,
    "cookTime": 16,
    "ingredients": [
      {
        "item": "all purpose flour",
        "qty": 2,
        "unit": "cup",
        "aisle": "Grains & Pasta"
      },
      {
        "item": "milk",
        "qty": 1.75,
        "unit": "cup",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "eggs",
        "qty": 2,
        "unit": "unit",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "butter",
        "qty": 0.5,
        "unit": "cup",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "sugar",
        "qty": 3,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "baking powder",
        "qty": 2,
        "unit": "tsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "vanilla extract",
        "qty": 1,
        "unit": "tsp",
        "aisle": "Condiments & Baking"
      }
    ],
    "steps": [
      "Whisk flour, sugar, and baking powder together.",
      "Beat in milk, eggs, melted butter, and vanilla until smooth.",
      "Preheat the waffle iron and grease lightly.",
      "Pour in batter and cook until crisp and deeply golden."
    ]
  },
  {
    "id": "bfa-cinnamon-french-toast",
    "name": "Cinnamon Brioche French Toast",
    "mealTypes": [
      "breakfast"
    ],
    "tags": [
      "vegetarian",
      "kid-friendly"
    ],
    "servings": 3,
    "calories": 440,
    "prepTime": 8,
    "cookTime": 12,
    "ingredients": [
      {
        "item": "brioche bread",
        "qty": 6,
        "unit": "slice",
        "aisle": "Bakery"
      },
      {
        "item": "eggs",
        "qty": 3,
        "unit": "unit",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "milk",
        "qty": 0.75,
        "unit": "cup",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "cinnamon",
        "qty": 1,
        "unit": "tsp",
        "aisle": "Spices"
      },
      {
        "item": "vanilla extract",
        "qty": 1,
        "unit": "tsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "butter",
        "qty": 2,
        "unit": "tbsp",
        "aisle": "Dairy & Eggs"
      }
    ],
    "steps": [
      "Whisk eggs, milk, cinnamon, and vanilla in a shallow dish.",
      "Soak each brioche slice for 20 seconds per side.",
      "Melt butter in a skillet over medium heat.",
      "Cook the slices until golden brown on both sides."
    ]
  },
  {
    "id": "bfa-classic-crepes",
    "name": "Thin French Crepes",
    "mealTypes": [
      "breakfast"
    ],
    "tags": [
      "vegetarian",
      "kid-friendly"
    ],
    "servings": 4,
    "calories": 260,
    "prepTime": 10,
    "cookTime": 18,
    "ingredients": [
      {
        "item": "all purpose flour",
        "qty": 1,
        "unit": "cup",
        "aisle": "Grains & Pasta"
      },
      {
        "item": "milk",
        "qty": 1.5,
        "unit": "cup",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "eggs",
        "qty": 3,
        "unit": "unit",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "butter",
        "qty": 3,
        "unit": "tbsp",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "sugar",
        "qty": 1,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "salt",
        "qty": 1,
        "unit": "pinch",
        "aisle": "Spices"
      }
    ],
    "steps": [
      "Blend flour, milk, eggs, melted butter, sugar, and salt until smooth.",
      "Rest the batter 15 minutes at room temperature.",
      "Heat a lightly buttered pan and pour in a thin layer, swirling to coat.",
      "Cook until edges lift, flip briefly, then slide out and repeat."
    ]
  },
  {
    "id": "bfa-maple-sausage-patties",
    "name": "Homemade Maple Sausage Patties",
    "mealTypes": [
      "breakfast"
    ],
    "tags": [
      "gluten-free",
      "high-protein",
      "low-carb",
      "dairy-free"
    ],
    "servings": 4,
    "calories": 300,
    "prepTime": 10,
    "cookTime": 10,
    "ingredients": [
      {
        "item": "ground pork",
        "qty": 1,
        "unit": "lb",
        "aisle": "Meat & Seafood"
      },
      {
        "item": "maple syrup",
        "qty": 1,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "sage",
        "qty": 1,
        "unit": "tsp",
        "aisle": "Spices"
      },
      {
        "item": "fennel seed",
        "qty": 0.5,
        "unit": "tsp",
        "aisle": "Spices"
      },
      {
        "item": "salt",
        "qty": 1,
        "unit": "tsp",
        "aisle": "Spices"
      },
      {
        "item": "black pepper",
        "qty": 0.5,
        "unit": "tsp",
        "aisle": "Spices"
      }
    ],
    "steps": [
      "Mix pork with maple syrup, sage, fennel, salt, and pepper.",
      "Shape into small flat patties with your hands.",
      "Heat a skillet over medium and cook patties 4 minutes per side.",
      "Rest briefly until juices settle and serve hot."
    ]
  },
  {
    "id": "bfa-crispy-breakfast-potato-hash",
    "name": "Crispy Breakfast Potato Hash",
    "mealTypes": [
      "breakfast"
    ],
    "tags": [
      "vegan",
      "vegetarian",
      "gluten-free",
      "dairy-free"
    ],
    "servings": 4,
    "calories": 320,
    "prepTime": 12,
    "cookTime": 25,
    "ingredients": [
      {
        "item": "russet potatoes",
        "qty": 3,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "bell pepper",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "yellow onion",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "olive oil",
        "qty": 3,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "paprika",
        "qty": 1,
        "unit": "tsp",
        "aisle": "Spices"
      },
      {
        "item": "salt",
        "qty": 1,
        "unit": "tsp",
        "aisle": "Spices"
      }
    ],
    "steps": [
      "Dice potatoes into small cubes and parboil 5 minutes, then drain.",
      "Heat oil in a large skillet over medium-high heat.",
      "Add potatoes, pepper, and onion and spread in a single layer.",
      "Cook without stirring often until crisp, seasoning with paprika and salt."
    ]
  },
  {
    "id": "bfa-corned-beef-hash",
    "name": "Corned Beef And Potato Hash",
    "mealTypes": [
      "breakfast"
    ],
    "tags": [
      "gluten-free",
      "high-protein",
      "dairy-free"
    ],
    "servings": 4,
    "calories": 410,
    "prepTime": 10,
    "cookTime": 22,
    "ingredients": [
      {
        "item": "corned beef",
        "qty": 12,
        "unit": "oz",
        "aisle": "Meat & Seafood"
      },
      {
        "item": "yukon potatoes",
        "qty": 3,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "yellow onion",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "olive oil",
        "qty": 2,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "black pepper",
        "qty": 0.5,
        "unit": "tsp",
        "aisle": "Spices"
      },
      {
        "item": "parsley",
        "qty": 2,
        "unit": "tbsp",
        "aisle": "Produce"
      }
    ],
    "steps": [
      "Dice potatoes and parboil until just tender, then drain.",
      "Saute onion in oil until soft, then add potatoes and brown.",
      "Stir in chopped corned beef and press flat to crisp.",
      "Season with pepper and finish with chopped parsley."
    ]
  },
  {
    "id": "bfa-bacon-egg-cheese-sandwich",
    "name": "Bacon Egg And Cheese Sandwich",
    "mealTypes": [
      "breakfast"
    ],
    "tags": [
      "high-protein",
      "quick"
    ],
    "servings": 1,
    "calories": 520,
    "prepTime": 5,
    "cookTime": 10,
    "ingredients": [
      {
        "item": "english muffin",
        "qty": 1,
        "unit": "unit",
        "aisle": "Bakery"
      },
      {
        "item": "eggs",
        "qty": 2,
        "unit": "unit",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "bacon",
        "qty": 3,
        "unit": "slice",
        "aisle": "Meat & Seafood"
      },
      {
        "item": "american cheese",
        "qty": 1,
        "unit": "slice",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "butter",
        "qty": 1,
        "unit": "tbsp",
        "aisle": "Dairy & Eggs"
      }
    ],
    "steps": [
      "Cook bacon in a skillet until crisp, then set aside.",
      "Toast the muffin halves and butter them lightly.",
      "Fry the eggs in the bacon fat to your preferred doneness.",
      "Stack eggs, bacon, and cheese between the muffin halves."
    ]
  },
  {
    "id": "bfa-lox-cream-cheese-bagel",
    "name": "Lox And Cream Cheese Bagel",
    "mealTypes": [
      "breakfast"
    ],
    "tags": [
      "pescatarian",
      "high-protein",
      "quick",
      "no-cook"
    ],
    "servings": 1,
    "calories": 460,
    "prepTime": 8,
    "cookTime": 0,
    "ingredients": [
      {
        "item": "everything bagel",
        "qty": 1,
        "unit": "unit",
        "aisle": "Bakery"
      },
      {
        "item": "smoked salmon",
        "qty": 3,
        "unit": "oz",
        "aisle": "Meat & Seafood"
      },
      {
        "item": "cream cheese",
        "qty": 3,
        "unit": "tbsp",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "red onion",
        "qty": 0.25,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "capers",
        "qty": 1,
        "unit": "tbsp",
        "aisle": "Canned Goods"
      },
      {
        "item": "dill",
        "qty": 1,
        "unit": "tbsp",
        "aisle": "Produce"
      }
    ],
    "steps": [
      "Slice the bagel and spread both halves with cream cheese.",
      "Layer the smoked salmon over the bottom half.",
      "Top with thin red onion slices, capers, and fresh dill.",
      "Close the bagel and slice in half to serve."
    ]
  },
  {
    "id": "bfa-breakfast-burrito",
    "name": "Loaded Breakfast Burrito",
    "mealTypes": [
      "breakfast"
    ],
    "tags": [
      "high-protein",
      "batch-cook"
    ],
    "servings": 4,
    "calories": 520,
    "prepTime": 12,
    "cookTime": 15,
    "ingredients": [
      {
        "item": "flour tortillas",
        "qty": 4,
        "unit": "unit",
        "aisle": "Bakery"
      },
      {
        "item": "eggs",
        "qty": 6,
        "unit": "unit",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "breakfast sausage",
        "qty": 8,
        "unit": "oz",
        "aisle": "Meat & Seafood"
      },
      {
        "item": "hash browns",
        "qty": 2,
        "unit": "cup",
        "aisle": "Produce"
      },
      {
        "item": "cheddar cheese",
        "qty": 1,
        "unit": "cup",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "salsa",
        "qty": 0.5,
        "unit": "cup",
        "aisle": "Condiments & Baking"
      }
    ],
    "steps": [
      "Brown the sausage in a skillet, then set aside.",
      "Crisp the hash browns in the same pan and scramble the eggs.",
      "Warm the tortillas and layer sausage, potatoes, eggs, and cheese.",
      "Spoon on salsa, fold in the sides, and roll into tight burritos."
    ]
  },
  {
    "id": "bfa-avocado-toast",
    "name": "Smashed Avocado Toast",
    "mealTypes": [
      "breakfast"
    ],
    "tags": [
      "vegan",
      "vegetarian",
      "dairy-free",
      "quick"
    ],
    "servings": 2,
    "calories": 340,
    "prepTime": 8,
    "cookTime": 3,
    "ingredients": [
      {
        "item": "sourdough bread",
        "qty": 2,
        "unit": "slice",
        "aisle": "Bakery"
      },
      {
        "item": "avocado",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "lemon juice",
        "qty": 1,
        "unit": "tsp",
        "aisle": "Produce"
      },
      {
        "item": "red pepper flakes",
        "qty": 1,
        "unit": "pinch",
        "aisle": "Spices"
      },
      {
        "item": "flaky sea salt",
        "qty": 1,
        "unit": "pinch",
        "aisle": "Spices"
      },
      {
        "item": "olive oil",
        "qty": 1,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      }
    ],
    "steps": [
      "Toast the sourdough slices until golden and crisp.",
      "Mash the avocado with lemon juice and a pinch of salt.",
      "Spread the avocado thickly over the toast.",
      "Drizzle with olive oil and finish with red pepper flakes."
    ]
  },
  {
    "id": "bfa-ricotta-honey-toast",
    "name": "Ricotta And Honey Toast",
    "mealTypes": [
      "breakfast"
    ],
    "tags": [
      "vegetarian",
      "quick"
    ],
    "servings": 2,
    "calories": 360,
    "prepTime": 6,
    "cookTime": 3,
    "ingredients": [
      {
        "item": "whole grain bread",
        "qty": 2,
        "unit": "slice",
        "aisle": "Bakery"
      },
      {
        "item": "ricotta cheese",
        "qty": 0.5,
        "unit": "cup",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "honey",
        "qty": 2,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "strawberries",
        "qty": 1,
        "unit": "cup",
        "aisle": "Produce"
      },
      {
        "item": "mint",
        "qty": 1,
        "unit": "tbsp",
        "aisle": "Produce"
      }
    ],
    "steps": [
      "Toast the bread until lightly golden.",
      "Spread a thick layer of ricotta over each slice.",
      "Top with sliced strawberries and torn mint.",
      "Drizzle generously with honey and serve."
    ]
  },
  {
    "id": "bfa-overnight-oats",
    "name": "Berry Overnight Oats",
    "mealTypes": [
      "breakfast"
    ],
    "tags": [
      "vegetarian",
      "vegan",
      "dairy-free",
      "no-cook"
    ],
    "servings": 2,
    "calories": 310,
    "prepTime": 8,
    "cookTime": 0,
    "ingredients": [
      {
        "item": "rolled oats",
        "qty": 1,
        "unit": "cup",
        "aisle": "Grains & Pasta"
      },
      {
        "item": "almond milk",
        "qty": 1.25,
        "unit": "cup",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "chia seeds",
        "qty": 2,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "maple syrup",
        "qty": 2,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "mixed berries",
        "qty": 1,
        "unit": "cup",
        "aisle": "Produce"
      }
    ],
    "steps": [
      "Stir oats, almond milk, chia seeds, and maple syrup in a jar.",
      "Fold in half the berries.",
      "Cover and refrigerate overnight to thicken.",
      "Top with the remaining berries before serving."
    ]
  },
  {
    "id": "bfa-greek-yogurt-parfait",
    "name": "Greek Yogurt Granola Parfait",
    "mealTypes": [
      "breakfast"
    ],
    "tags": [
      "vegetarian",
      "high-protein",
      "quick",
      "no-cook"
    ],
    "servings": 2,
    "calories": 330,
    "prepTime": 6,
    "cookTime": 0,
    "ingredients": [
      {
        "item": "greek yogurt",
        "qty": 2,
        "unit": "cup",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "granola",
        "qty": 0.75,
        "unit": "cup",
        "aisle": "Grains & Pasta"
      },
      {
        "item": "blueberries",
        "qty": 1,
        "unit": "cup",
        "aisle": "Produce"
      },
      {
        "item": "honey",
        "qty": 2,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      }
    ],
    "steps": [
      "Spoon a layer of yogurt into two glasses.",
      "Add a layer of granola and blueberries.",
      "Repeat the layers until the glasses are full.",
      "Drizzle honey over the top and serve immediately."
    ]
  },
  {
    "id": "bfb-classic-rolled-oatmeal",
    "name": "Classic Cinnamon Rolled Oatmeal",
    "mealTypes": [
      "breakfast"
    ],
    "tags": [
      "vegetarian",
      "quick",
      "kid-friendly"
    ],
    "servings": 2,
    "calories": 320,
    "prepTime": 3,
    "cookTime": 10,
    "ingredients": [
      {
        "item": "rolled oats",
        "qty": 1,
        "unit": "cup",
        "aisle": "Grains & Pasta"
      },
      {
        "item": "milk",
        "qty": 2,
        "unit": "cup",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "ground cinnamon",
        "qty": 0.5,
        "unit": "tsp",
        "aisle": "Spices"
      },
      {
        "item": "maple syrup",
        "qty": 2,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "banana",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      }
    ],
    "steps": [
      "Combine oats, milk and cinnamon in a saucepan over medium heat.",
      "Simmer while stirring for 8 to 10 minutes until creamy.",
      "Divide between two bowls and drizzle with maple syrup.",
      "Top with sliced banana and serve warm."
    ]
  },
  {
    "id": "bfb-steel-cut-apple-porridge",
    "name": "Steel Cut Apple Walnut Porridge",
    "mealTypes": [
      "breakfast"
    ],
    "tags": [
      "vegetarian",
      "batch-cook",
      "high-protein"
    ],
    "servings": 4,
    "calories": 380,
    "prepTime": 5,
    "cookTime": 30,
    "ingredients": [
      {
        "item": "steel cut oats",
        "qty": 1,
        "unit": "cup",
        "aisle": "Grains & Pasta"
      },
      {
        "item": "water",
        "qty": 3,
        "unit": "cup",
        "aisle": "Other"
      },
      {
        "item": "apple",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "walnuts",
        "qty": 0.5,
        "unit": "cup",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "ground cinnamon",
        "qty": 1,
        "unit": "tsp",
        "aisle": "Spices"
      },
      {
        "item": "honey",
        "qty": 3,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      }
    ],
    "steps": [
      "Bring water to a boil and stir in steel cut oats.",
      "Reduce heat and simmer for 25 minutes stirring occasionally.",
      "Grate the apple and fold it in with cinnamon.",
      "Cook 5 minutes more then top with walnuts and honey."
    ]
  },
  {
    "id": "bfb-peanut-butter-overnight-oats",
    "name": "Peanut Butter Overnight Oats",
    "mealTypes": [
      "breakfast"
    ],
    "tags": [
      "vegetarian",
      "no-cook",
      "high-protein",
      "batch-cook"
    ],
    "servings": 2,
    "calories": 410,
    "prepTime": 8,
    "cookTime": 0,
    "ingredients": [
      {
        "item": "rolled oats",
        "qty": 1,
        "unit": "cup",
        "aisle": "Grains & Pasta"
      },
      {
        "item": "milk",
        "qty": 1,
        "unit": "cup",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "peanut butter",
        "qty": 3,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "chia seeds",
        "qty": 1,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "maple syrup",
        "qty": 1,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      }
    ],
    "steps": [
      "Stir oats, milk, peanut butter and chia seeds together in a jar.",
      "Sweeten with maple syrup and mix well.",
      "Cover and refrigerate overnight or at least 6 hours.",
      "Stir and enjoy chilled the next morning."
    ]
  },
  {
    "id": "bfb-tropical-overnight-oats",
    "name": "Tropical Mango Coconut Overnight Oats",
    "mealTypes": [
      "breakfast"
    ],
    "tags": [
      "vegan",
      "vegetarian",
      "no-cook",
      "dairy-free"
    ],
    "servings": 2,
    "calories": 350,
    "prepTime": 10,
    "cookTime": 0,
    "ingredients": [
      {
        "item": "rolled oats",
        "qty": 1,
        "unit": "cup",
        "aisle": "Grains & Pasta"
      },
      {
        "item": "coconut milk",
        "qty": 1,
        "unit": "cup",
        "aisle": "Canned Goods"
      },
      {
        "item": "mango",
        "qty": 1,
        "unit": "cup",
        "aisle": "Produce"
      },
      {
        "item": "shredded coconut",
        "qty": 2,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "lime",
        "qty": 0.5,
        "unit": "unit",
        "aisle": "Produce"
      }
    ],
    "steps": [
      "Mix oats and coconut milk in two jars.",
      "Layer in diced mango and a squeeze of lime.",
      "Cover and chill overnight.",
      "Top with shredded coconut before serving."
    ]
  },
  {
    "id": "bfb-vanilla-chia-pudding",
    "name": "Vanilla Almond Chia Pudding",
    "mealTypes": [
      "breakfast"
    ],
    "tags": [
      "vegan",
      "vegetarian",
      "no-cook",
      "gluten-free"
    ],
    "servings": 2,
    "calories": 260,
    "prepTime": 5,
    "cookTime": 0,
    "ingredients": [
      {
        "item": "chia seeds",
        "qty": 0.33,
        "unit": "cup",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "almond milk",
        "qty": 1.5,
        "unit": "cup",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "vanilla extract",
        "qty": 1,
        "unit": "tsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "maple syrup",
        "qty": 2,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "raspberries",
        "qty": 0.5,
        "unit": "cup",
        "aisle": "Produce"
      }
    ],
    "steps": [
      "Whisk chia seeds, almond milk, vanilla and maple syrup in a bowl.",
      "Let sit 5 minutes then whisk again to break up clumps.",
      "Cover and refrigerate at least 4 hours until thick.",
      "Spoon into glasses and top with raspberries."
    ]
  },
  {
    "id": "bfb-berry-yogurt-parfait",
    "name": "Mixed Berry Yogurt Parfait",
    "mealTypes": [
      "breakfast"
    ],
    "tags": [
      "vegetarian",
      "quick",
      "high-protein",
      "kid-friendly"
    ],
    "servings": 2,
    "calories": 300,
    "prepTime": 8,
    "cookTime": 0,
    "ingredients": [
      {
        "item": "greek yogurt",
        "qty": 2,
        "unit": "cup",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "granola",
        "qty": 0.75,
        "unit": "cup",
        "aisle": "Grains & Pasta"
      },
      {
        "item": "strawberries",
        "qty": 1,
        "unit": "cup",
        "aisle": "Produce"
      },
      {
        "item": "blueberries",
        "qty": 0.5,
        "unit": "cup",
        "aisle": "Produce"
      },
      {
        "item": "honey",
        "qty": 1,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      }
    ],
    "steps": [
      "Spoon a layer of yogurt into two glasses.",
      "Add a layer of berries then a layer of granola.",
      "Repeat the layers until the glasses are full.",
      "Finish with a drizzle of honey and serve."
    ]
  },
  {
    "id": "bfb-honey-almond-granola-bowl",
    "name": "Honey Almond Granola Bowl",
    "mealTypes": [
      "breakfast"
    ],
    "tags": [
      "vegetarian",
      "batch-cook",
      "high-protein"
    ],
    "servings": 6,
    "calories": 420,
    "prepTime": 10,
    "cookTime": 25,
    "ingredients": [
      {
        "item": "rolled oats",
        "qty": 3,
        "unit": "cup",
        "aisle": "Grains & Pasta"
      },
      {
        "item": "sliced almonds",
        "qty": 1,
        "unit": "cup",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "honey",
        "qty": 0.33,
        "unit": "cup",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "coconut oil",
        "qty": 0.25,
        "unit": "cup",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "ground cinnamon",
        "qty": 1,
        "unit": "tsp",
        "aisle": "Spices"
      },
      {
        "item": "milk",
        "qty": 3,
        "unit": "cup",
        "aisle": "Dairy & Eggs"
      }
    ],
    "steps": [
      "Heat oven to 160C/325F and line a baking sheet.",
      "Toss oats and almonds with melted coconut oil, honey and cinnamon.",
      "Spread evenly and bake 25 minutes stirring halfway.",
      "Cool completely then serve in bowls with cold milk."
    ]
  },
  {
    "id": "bfb-strawberry-banana-smoothie-bowl",
    "name": "Strawberry Banana Smoothie Bowl",
    "mealTypes": [
      "breakfast"
    ],
    "tags": [
      "vegan",
      "vegetarian",
      "gluten-free",
      "quick"
    ],
    "servings": 2,
    "calories": 290,
    "prepTime": 10,
    "cookTime": 0,
    "ingredients": [
      {
        "item": "frozen strawberries",
        "qty": 2,
        "unit": "cup",
        "aisle": "Produce"
      },
      {
        "item": "banana",
        "qty": 2,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "almond milk",
        "qty": 0.5,
        "unit": "cup",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "granola",
        "qty": 0.5,
        "unit": "cup",
        "aisle": "Grains & Pasta"
      },
      {
        "item": "chia seeds",
        "qty": 1,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      }
    ],
    "steps": [
      "Blend frozen strawberries, banana and almond milk until thick.",
      "Divide the smoothie between two bowls.",
      "Top with granola and chia seeds.",
      "Serve immediately with a spoon."
    ]
  },
  {
    "id": "bfb-green-power-smoothie",
    "name": "Green Power Spinach Smoothie",
    "mealTypes": [
      "breakfast"
    ],
    "tags": [
      "vegan",
      "vegetarian",
      "gluten-free",
      "quick"
    ],
    "servings": 2,
    "calories": 240,
    "prepTime": 7,
    "cookTime": 0,
    "ingredients": [
      {
        "item": "baby spinach",
        "qty": 2,
        "unit": "cup",
        "aisle": "Produce"
      },
      {
        "item": "banana",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "pineapple",
        "qty": 1,
        "unit": "cup",
        "aisle": "Produce"
      },
      {
        "item": "almond milk",
        "qty": 1,
        "unit": "cup",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "chia seeds",
        "qty": 1,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      }
    ],
    "steps": [
      "Add spinach, banana, pineapple and almond milk to a blender.",
      "Blend on high until completely smooth.",
      "Add chia seeds and pulse briefly.",
      "Pour into glasses and serve cold."
    ]
  },
  {
    "id": "bfb-blueberry-oat-muffins",
    "name": "Blueberry Oat Muffins",
    "mealTypes": [
      "breakfast"
    ],
    "tags": [
      "vegetarian",
      "batch-cook",
      "kid-friendly"
    ],
    "servings": 6,
    "calories": 260,
    "prepTime": 15,
    "cookTime": 22,
    "ingredients": [
      {
        "item": "flour",
        "qty": 1.5,
        "unit": "cup",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "rolled oats",
        "qty": 0.5,
        "unit": "cup",
        "aisle": "Grains & Pasta"
      },
      {
        "item": "sugar",
        "qty": 0.5,
        "unit": "cup",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "baking powder",
        "qty": 2,
        "unit": "tsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "egg",
        "qty": 1,
        "unit": "unit",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "milk",
        "qty": 0.75,
        "unit": "cup",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "blueberries",
        "qty": 1,
        "unit": "cup",
        "aisle": "Produce"
      }
    ],
    "steps": [
      "Heat oven to 190C/375F and line a muffin tin.",
      "Whisk flour, oats, sugar and baking powder in a bowl.",
      "Stir in egg and milk until just combined then fold in blueberries.",
      "Divide into cups and bake 22 minutes until golden."
    ]
  },
  {
    "id": "bfb-cranberry-orange-scones",
    "name": "Cranberry Orange Scones",
    "mealTypes": [
      "breakfast"
    ],
    "tags": [
      "vegetarian",
      "batch-cook"
    ],
    "servings": 6,
    "calories": 340,
    "prepTime": 18,
    "cookTime": 18,
    "ingredients": [
      {
        "item": "flour",
        "qty": 2,
        "unit": "cup",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "sugar",
        "qty": 0.33,
        "unit": "cup",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "baking powder",
        "qty": 1,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "butter",
        "qty": 6,
        "unit": "tbsp",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "heavy cream",
        "qty": 0.75,
        "unit": "cup",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "dried cranberries",
        "qty": 0.5,
        "unit": "cup",
        "aisle": "Produce"
      },
      {
        "item": "orange",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      }
    ],
    "steps": [
      "Heat oven to 200C/400F and line a baking sheet.",
      "Rub cold butter into flour, sugar and baking powder until crumbly.",
      "Stir in cream, cranberries and orange zest to form a soft dough.",
      "Shape into a round, cut six wedges and bake 18 minutes."
    ]
  },
  {
    "id": "bfb-banana-walnut-bread",
    "name": "Banana Walnut Breakfast Bread",
    "mealTypes": [
      "breakfast"
    ],
    "tags": [
      "vegetarian",
      "batch-cook",
      "kid-friendly"
    ],
    "servings": 6,
    "calories": 380,
    "prepTime": 15,
    "cookTime": 55,
    "ingredients": [
      {
        "item": "banana",
        "qty": 3,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "flour",
        "qty": 2,
        "unit": "cup",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "sugar",
        "qty": 0.75,
        "unit": "cup",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "egg",
        "qty": 2,
        "unit": "unit",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "butter",
        "qty": 0.5,
        "unit": "cup",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "baking soda",
        "qty": 1,
        "unit": "tsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "walnuts",
        "qty": 0.5,
        "unit": "cup",
        "aisle": "Condiments & Baking"
      }
    ],
    "steps": [
      "Heat oven to 175C/350F and grease a loaf pan.",
      "Mash bananas and mix with melted butter, sugar and eggs.",
      "Fold in flour, baking soda and walnuts until just combined.",
      "Pour into the pan and bake 55 minutes until a skewer comes out clean."
    ]
  },
  {
    "id": "bfb-savory-chicken-congee",
    "name": "Savory Chicken Ginger Congee",
    "mealTypes": [
      "breakfast"
    ],
    "tags": [
      "gluten-free",
      "high-protein",
      "dairy-free"
    ],
    "servings": 4,
    "calories": 350,
    "prepTime": 10,
    "cookTime": 60,
    "ingredients": [
      {
        "item": "jasmine rice",
        "qty": 1,
        "unit": "cup",
        "aisle": "Grains & Pasta"
      },
      {
        "item": "chicken thigh",
        "qty": 0.75,
        "unit": "lb",
        "aisle": "Meat & Seafood"
      },
      {
        "item": "chicken broth",
        "qty": 8,
        "unit": "cup",
        "aisle": "Canned Goods"
      },
      {
        "item": "fresh ginger",
        "qty": 2,
        "unit": "tbsp",
        "aisle": "Produce"
      },
      {
        "item": "green onion",
        "qty": 3,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "soy sauce",
        "qty": 2,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      }
    ],
    "steps": [
      "Combine rice, chicken, broth and ginger in a large pot.",
      "Bring to a boil then simmer gently for 55 minutes stirring often.",
      "Shred the chicken and stir it back into the porridge.",
      "Season with soy sauce and top with sliced green onion."
    ]
  },
  {
    "id": "bfb-red-chilaquiles-verdes",
    "name": "Chilaquiles Verdes",
    "mealTypes": [
      "breakfast"
    ],
    "tags": [
      "vegetarian",
      "gluten-free"
    ],
    "servings": 4,
    "calories": 430,
    "prepTime": 12,
    "cookTime": 15,
    "ingredients": [
      {
        "item": "corn tortillas",
        "qty": 8,
        "unit": "unit",
        "aisle": "Bakery"
      },
      {
        "item": "salsa verde",
        "qty": 2,
        "unit": "cup",
        "aisle": "Canned Goods"
      },
      {
        "item": "queso fresco",
        "qty": 1,
        "unit": "cup",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "white onion",
        "qty": 0.5,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "cilantro",
        "qty": 0.25,
        "unit": "cup",
        "aisle": "Produce"
      },
      {
        "item": "sour cream",
        "qty": 0.5,
        "unit": "cup",
        "aisle": "Dairy & Eggs"
      }
    ],
    "steps": [
      "Cut tortillas into triangles and bake at 200C/400F until crisp.",
      "Warm the salsa verde in a large skillet.",
      "Toss the crisp tortillas in the salsa until lightly coated.",
      "Top with queso fresco, onion, cilantro and sour cream."
    ]
  },
  {
    "id": "bfb-ful-medames",
    "name": "Egyptian Ful Medames",
    "mealTypes": [
      "breakfast"
    ],
    "tags": [
      "vegan",
      "vegetarian",
      "gluten-free",
      "high-protein"
    ],
    "servings": 4,
    "calories": 360,
    "prepTime": 10,
    "cookTime": 15,
    "ingredients": [
      {
        "item": "fava beans",
        "qty": 2,
        "unit": "can",
        "aisle": "Canned Goods"
      },
      {
        "item": "garlic",
        "qty": 2,
        "unit": "clove",
        "aisle": "Produce"
      },
      {
        "item": "lemon",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "olive oil",
        "qty": 3,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "ground cumin",
        "qty": 1,
        "unit": "tsp",
        "aisle": "Spices"
      },
      {
        "item": "tomato",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "parsley",
        "qty": 0.25,
        "unit": "cup",
        "aisle": "Produce"
      }
    ],
    "steps": [
      "Warm the fava beans with their liquid and minced garlic.",
      "Mash roughly and stir in cumin and lemon juice.",
      "Spoon onto a plate and drizzle generously with olive oil.",
      "Top with diced tomato and chopped parsley."
    ]
  },
  {
    "id": "bfb-smashed-avocado-toast",
    "name": "Smashed Avocado Toast With Chili Flakes",
    "mealTypes": [
      "breakfast"
    ],
    "tags": [
      "vegan",
      "vegetarian",
      "quick",
      "dairy-free"
    ],
    "servings": 2,
    "calories": 340,
    "prepTime": 8,
    "cookTime": 3,
    "ingredients": [
      {
        "item": "sourdough bread",
        "qty": 2,
        "unit": "slice",
        "aisle": "Bakery"
      },
      {
        "item": "avocado",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "lemon",
        "qty": 0.5,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "chili flakes",
        "qty": 0.5,
        "unit": "tsp",
        "aisle": "Spices"
      },
      {
        "item": "olive oil",
        "qty": 1,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      }
    ],
    "steps": [
      "Toast the sourdough slices until golden.",
      "Mash the avocado with lemon juice and a pinch of salt.",
      "Spread the avocado over the toast.",
      "Drizzle with olive oil and sprinkle with chili flakes."
    ]
  },
  {
    "id": "bfb-cinnamon-breakfast-quinoa",
    "name": "Cinnamon Breakfast Quinoa",
    "mealTypes": [
      "breakfast"
    ],
    "tags": [
      "vegetarian",
      "gluten-free",
      "high-protein",
      "batch-cook"
    ],
    "servings": 4,
    "calories": 330,
    "prepTime": 5,
    "cookTime": 20,
    "ingredients": [
      {
        "item": "quinoa",
        "qty": 1,
        "unit": "cup",
        "aisle": "Grains & Pasta"
      },
      {
        "item": "milk",
        "qty": 2,
        "unit": "cup",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "ground cinnamon",
        "qty": 1,
        "unit": "tsp",
        "aisle": "Spices"
      },
      {
        "item": "maple syrup",
        "qty": 3,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "pecans",
        "qty": 0.5,
        "unit": "cup",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "blueberries",
        "qty": 0.5,
        "unit": "cup",
        "aisle": "Produce"
      }
    ],
    "steps": [
      "Rinse the quinoa then simmer it with milk and cinnamon.",
      "Cook covered for about 18 minutes until the liquid is absorbed.",
      "Stir in maple syrup and fluff with a fork.",
      "Serve topped with pecans and blueberries."
    ]
  },
  {
    "id": "bfb-miso-tofu-breakfast-soup",
    "name": "Miso Tofu Breakfast Soup",
    "mealTypes": [
      "breakfast"
    ],
    "tags": [
      "vegan",
      "vegetarian",
      "dairy-free",
      "quick"
    ],
    "servings": 2,
    "calories": 210,
    "prepTime": 7,
    "cookTime": 8,
    "ingredients": [
      {
        "item": "miso paste",
        "qty": 2,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "water",
        "qty": 4,
        "unit": "cup",
        "aisle": "Other"
      },
      {
        "item": "silken tofu",
        "qty": 0.5,
        "unit": "block",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "green onion",
        "qty": 2,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "dried wakame",
        "qty": 1,
        "unit": "tbsp",
        "aisle": "Other"
      }
    ],
    "steps": [
      "Bring water to a gentle simmer and add the wakame.",
      "Whisk the miso paste with a little hot water then stir it in.",
      "Add cubed tofu and heat through without boiling.",
      "Ladle into bowls and top with sliced green onion."
    ]
  },
  {
    "id": "bfb-apricot-breakfast-couscous",
    "name": "Apricot Pistachio Breakfast Couscous",
    "mealTypes": [
      "breakfast"
    ],
    "tags": [
      "vegetarian",
      "quick",
      "batch-cook"
    ],
    "servings": 4,
    "calories": 360,
    "prepTime": 8,
    "cookTime": 5,
    "ingredients": [
      {
        "item": "couscous",
        "qty": 1,
        "unit": "cup",
        "aisle": "Grains & Pasta"
      },
      {
        "item": "milk",
        "qty": 1.25,
        "unit": "cup",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "dried apricots",
        "qty": 0.5,
        "unit": "cup",
        "aisle": "Produce"
      },
      {
        "item": "pistachios",
        "qty": 0.33,
        "unit": "cup",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "honey",
        "qty": 2,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "ground cardamom",
        "qty": 0.5,
        "unit": "tsp",
        "aisle": "Spices"
      }
    ],
    "steps": [
      "Heat the milk with cardamom until steaming.",
      "Pour over the couscous and chopped apricots then cover.",
      "Let stand 5 minutes and fluff with a fork.",
      "Drizzle with honey and top with pistachios."
    ]
  },
  {
    "id": "bfb-smoked-salmon-bagel",
    "name": "Smoked Salmon Bagel With Dill Cream Cheese",
    "mealTypes": [
      "breakfast"
    ],
    "tags": [
      "pescatarian",
      "quick",
      "high-protein"
    ],
    "servings": 2,
    "calories": 450,
    "prepTime": 10,
    "cookTime": 2,
    "ingredients": [
      {
        "item": "bagel",
        "qty": 2,
        "unit": "unit",
        "aisle": "Bakery"
      },
      {
        "item": "smoked salmon",
        "qty": 4,
        "unit": "oz",
        "aisle": "Meat & Seafood"
      },
      {
        "item": "cream cheese",
        "qty": 4,
        "unit": "tbsp",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "fresh dill",
        "qty": 1,
        "unit": "tbsp",
        "aisle": "Produce"
      },
      {
        "item": "red onion",
        "qty": 0.25,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "capers",
        "qty": 1,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      }
    ],
    "steps": [
      "Slice and toast the bagels until golden.",
      "Mix the cream cheese with chopped dill and spread over the bagels.",
      "Layer on smoked salmon and thinly sliced red onion.",
      "Scatter with capers and serve open faced."
    ]
  },
  {
    "id": "bfb-pumpkin-spice-overnight-oats",
    "name": "Pumpkin Spice Overnight Oats",
    "mealTypes": [
      "breakfast"
    ],
    "tags": [
      "vegan",
      "vegetarian",
      "no-cook",
      "batch-cook"
    ],
    "servings": 2,
    "calories": 330,
    "prepTime": 8,
    "cookTime": 0,
    "ingredients": [
      {
        "item": "rolled oats",
        "qty": 1,
        "unit": "cup",
        "aisle": "Grains & Pasta"
      },
      {
        "item": "almond milk",
        "qty": 1,
        "unit": "cup",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "pumpkin puree",
        "qty": 0.5,
        "unit": "cup",
        "aisle": "Canned Goods"
      },
      {
        "item": "pumpkin pie spice",
        "qty": 1,
        "unit": "tsp",
        "aisle": "Spices"
      },
      {
        "item": "maple syrup",
        "qty": 2,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "pecans",
        "qty": 0.25,
        "unit": "cup",
        "aisle": "Condiments & Baking"
      }
    ],
    "steps": [
      "Combine oats, almond milk, pumpkin puree and spice in a jar.",
      "Stir in the maple syrup until evenly mixed.",
      "Cover and refrigerate overnight.",
      "Top with chopped pecans before serving."
    ]
  },
  {
    "id": "bfb-coconut-rice-porridge",
    "name": "Coconut Rice Porridge With Mango",
    "mealTypes": [
      "breakfast"
    ],
    "tags": [
      "vegan",
      "vegetarian",
      "gluten-free",
      "dairy-free"
    ],
    "servings": 4,
    "calories": 340,
    "prepTime": 5,
    "cookTime": 25,
    "ingredients": [
      {
        "item": "jasmine rice",
        "qty": 1,
        "unit": "cup",
        "aisle": "Grains & Pasta"
      },
      {
        "item": "coconut milk",
        "qty": 1,
        "unit": "can",
        "aisle": "Canned Goods"
      },
      {
        "item": "water",
        "qty": 2,
        "unit": "cup",
        "aisle": "Other"
      },
      {
        "item": "sugar",
        "qty": 3,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "mango",
        "qty": 1,
        "unit": "cup",
        "aisle": "Produce"
      },
      {
        "item": "shredded coconut",
        "qty": 2,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      }
    ],
    "steps": [
      "Simmer rice with coconut milk and water over low heat.",
      "Stir often for 25 minutes until soft and creamy.",
      "Sweeten with sugar to taste.",
      "Serve topped with diced mango and shredded coconut."
    ]
  },
  {
    "id": "bfb-lemon-poppyseed-muffins",
    "name": "Lemon Poppyseed Muffins",
    "mealTypes": [
      "breakfast"
    ],
    "tags": [
      "vegetarian",
      "batch-cook",
      "kid-friendly"
    ],
    "servings": 6,
    "calories": 280,
    "prepTime": 15,
    "cookTime": 20,
    "ingredients": [
      {
        "item": "flour",
        "qty": 2,
        "unit": "cup",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "sugar",
        "qty": 0.66,
        "unit": "cup",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "baking powder",
        "qty": 2,
        "unit": "tsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "poppy seeds",
        "qty": 2,
        "unit": "tbsp",
        "aisle": "Spices"
      },
      {
        "item": "egg",
        "qty": 2,
        "unit": "unit",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "yogurt",
        "qty": 0.75,
        "unit": "cup",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "lemon",
        "qty": 2,
        "unit": "unit",
        "aisle": "Produce"
      }
    ],
    "steps": [
      "Heat oven to 190C/375F and line a muffin tin.",
      "Combine flour, sugar, baking powder and poppy seeds.",
      "Whisk in eggs, yogurt, lemon zest and juice until smooth.",
      "Fill the cups and bake 20 minutes until springy."
    ]
  },
  {
    "id": "bfb-dark-chocolate-chia-pudding",
    "name": "Dark Chocolate Chia Pudding",
    "mealTypes": [
      "breakfast"
    ],
    "tags": [
      "vegan",
      "vegetarian",
      "gluten-free",
      "no-cook"
    ],
    "servings": 2,
    "calories": 280,
    "prepTime": 6,
    "cookTime": 0,
    "ingredients": [
      {
        "item": "chia seeds",
        "qty": 0.33,
        "unit": "cup",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "almond milk",
        "qty": 1.5,
        "unit": "cup",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "cocoa powder",
        "qty": 2,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "maple syrup",
        "qty": 3,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "banana",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      }
    ],
    "steps": [
      "Whisk chia seeds, almond milk, cocoa and maple syrup together.",
      "Let rest 10 minutes then whisk again to remove clumps.",
      "Cover and chill at least 4 hours until set.",
      "Top with sliced banana before serving."
    ]
  },
  {
    "id": "bfb-savory-turkey-sausage-hash",
    "name": "Turkey Sausage Sweet Potato Hash",
    "mealTypes": [
      "breakfast"
    ],
    "tags": [
      "gluten-free",
      "high-protein",
      "dairy-free"
    ],
    "servings": 4,
    "calories": 400,
    "prepTime": 15,
    "cookTime": 20,
    "ingredients": [
      {
        "item": "turkey sausage",
        "qty": 0.75,
        "unit": "lb",
        "aisle": "Meat & Seafood"
      },
      {
        "item": "sweet potato",
        "qty": 2,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "bell pepper",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "yellow onion",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "olive oil",
        "qty": 2,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "smoked paprika",
        "qty": 1,
        "unit": "tsp",
        "aisle": "Spices"
      }
    ],
    "steps": [
      "Dice the sweet potato, pepper and onion into small cubes.",
      "Brown the turkey sausage in olive oil then set aside.",
      "Cook the vegetables with paprika until tender and browned.",
      "Return the sausage to the pan, toss together and serve hot."
    ]
  },
  {
    "id": "lna-classic-cobb-salad",
    "name": "Classic Cobb Salad",
    "mealTypes": [
      "lunch"
    ],
    "tags": [
      "high-protein",
      "gluten-free",
      "low-carb"
    ],
    "servings": 2,
    "calories": 520,
    "prepTime": 15,
    "cookTime": 10,
    "ingredients": [
      {
        "item": "romaine lettuce",
        "qty": 4,
        "unit": "cup",
        "aisle": "Produce"
      },
      {
        "item": "cooked chicken breast",
        "qty": 6,
        "unit": "oz",
        "aisle": "Meat & Seafood"
      },
      {
        "item": "bacon",
        "qty": 3,
        "unit": "slice",
        "aisle": "Meat & Seafood"
      },
      {
        "item": "hard boiled egg",
        "qty": 2,
        "unit": "unit",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "avocado",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "blue cheese",
        "qty": 2,
        "unit": "oz",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "cherry tomatoes",
        "qty": 1,
        "unit": "cup",
        "aisle": "Produce"
      }
    ],
    "steps": [
      "Cook the bacon until crisp then crumble it.",
      "Chop the romaine and arrange it on two plates.",
      "Slice the chicken, eggs, avocado, and tomatoes into neat rows.",
      "Scatter blue cheese and bacon on top and serve."
    ]
  },
  {
    "id": "lna-caesar-salad",
    "name": "Chicken Caesar Salad",
    "mealTypes": [
      "lunch"
    ],
    "tags": [
      "high-protein"
    ],
    "servings": 2,
    "calories": 480,
    "prepTime": 12,
    "cookTime": 8,
    "ingredients": [
      {
        "item": "romaine lettuce",
        "qty": 5,
        "unit": "cup",
        "aisle": "Produce"
      },
      {
        "item": "cooked chicken breast",
        "qty": 6,
        "unit": "oz",
        "aisle": "Meat & Seafood"
      },
      {
        "item": "croutons",
        "qty": 1,
        "unit": "cup",
        "aisle": "Bakery"
      },
      {
        "item": "parmesan cheese",
        "qty": 0.5,
        "unit": "cup",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "caesar dressing",
        "qty": 4,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      }
    ],
    "steps": [
      "Chop the romaine and place it in a large bowl.",
      "Slice the chicken into strips.",
      "Toss the lettuce with dressing until evenly coated.",
      "Top with chicken, croutons, and shaved parmesan."
    ]
  },
  {
    "id": "lna-greek-salad",
    "name": "Traditional Greek Salad",
    "mealTypes": [
      "lunch"
    ],
    "tags": [
      "vegetarian",
      "gluten-free",
      "low-carb",
      "no-cook"
    ],
    "servings": 4,
    "calories": 320,
    "prepTime": 15,
    "cookTime": 0,
    "ingredients": [
      {
        "item": "cucumber",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "tomatoes",
        "qty": 3,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "red onion",
        "qty": 0.5,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "kalamata olives",
        "qty": 0.5,
        "unit": "cup",
        "aisle": "Canned Goods"
      },
      {
        "item": "feta cheese",
        "qty": 4,
        "unit": "oz",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "olive oil",
        "qty": 3,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "dried oregano",
        "qty": 1,
        "unit": "tsp",
        "aisle": "Spices"
      }
    ],
    "steps": [
      "Cut the cucumber, tomatoes, and onion into chunks.",
      "Combine the vegetables and olives in a bowl.",
      "Drizzle with olive oil and sprinkle oregano.",
      "Top with a slab of feta and serve."
    ]
  },
  {
    "id": "lna-nicoise-salad",
    "name": "Salad Nicoise",
    "mealTypes": [
      "lunch"
    ],
    "tags": [
      "pescatarian",
      "high-protein",
      "gluten-free"
    ],
    "servings": 2,
    "calories": 540,
    "prepTime": 20,
    "cookTime": 15,
    "ingredients": [
      {
        "item": "canned tuna",
        "qty": 1,
        "unit": "can",
        "aisle": "Canned Goods"
      },
      {
        "item": "baby potatoes",
        "qty": 8,
        "unit": "oz",
        "aisle": "Produce"
      },
      {
        "item": "green beans",
        "qty": 1,
        "unit": "cup",
        "aisle": "Produce"
      },
      {
        "item": "hard boiled egg",
        "qty": 2,
        "unit": "unit",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "cherry tomatoes",
        "qty": 1,
        "unit": "cup",
        "aisle": "Produce"
      },
      {
        "item": "kalamata olives",
        "qty": 0.25,
        "unit": "cup",
        "aisle": "Canned Goods"
      },
      {
        "item": "olive oil",
        "qty": 2,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      }
    ],
    "steps": [
      "Boil the potatoes until tender then cool them.",
      "Blanch the green beans until bright and crisp.",
      "Arrange greens, potatoes, beans, tomatoes, and olives on a platter.",
      "Flake the tuna on top and add halved eggs.",
      "Drizzle with olive oil before serving."
    ]
  },
  {
    "id": "lna-caprese-salad",
    "name": "Caprese Salad Plate",
    "mealTypes": [
      "lunch"
    ],
    "tags": [
      "vegetarian",
      "gluten-free",
      "low-carb",
      "quick"
    ],
    "servings": 2,
    "calories": 360,
    "prepTime": 10,
    "cookTime": 0,
    "ingredients": [
      {
        "item": "fresh mozzarella",
        "qty": 6,
        "unit": "oz",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "tomatoes",
        "qty": 3,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "fresh basil",
        "qty": 0.5,
        "unit": "cup",
        "aisle": "Produce"
      },
      {
        "item": "olive oil",
        "qty": 2,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "balsamic glaze",
        "qty": 1,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      }
    ],
    "steps": [
      "Slice the mozzarella and tomatoes into even rounds.",
      "Alternate the slices on a plate with basil leaves.",
      "Drizzle with olive oil and balsamic glaze.",
      "Season with salt and pepper and serve."
    ]
  },
  {
    "id": "lna-kale-caesar",
    "name": "Massaged Kale Salad",
    "mealTypes": [
      "lunch"
    ],
    "tags": [
      "vegetarian",
      "gluten-free"
    ],
    "servings": 3,
    "calories": 340,
    "prepTime": 15,
    "cookTime": 0,
    "ingredients": [
      {
        "item": "kale",
        "qty": 6,
        "unit": "cup",
        "aisle": "Produce"
      },
      {
        "item": "lemon juice",
        "qty": 2,
        "unit": "tbsp",
        "aisle": "Produce"
      },
      {
        "item": "olive oil",
        "qty": 3,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "parmesan cheese",
        "qty": 0.33,
        "unit": "cup",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "toasted almonds",
        "qty": 0.25,
        "unit": "cup",
        "aisle": "Other"
      }
    ],
    "steps": [
      "Remove the kale stems and tear the leaves into pieces.",
      "Massage the kale with lemon juice and olive oil for two minutes.",
      "Let it sit for ten minutes to soften.",
      "Top with parmesan and toasted almonds before serving."
    ]
  },
  {
    "id": "lna-turkey-club-sandwich",
    "name": "Turkey Club Sandwich",
    "mealTypes": [
      "lunch"
    ],
    "tags": [
      "high-protein"
    ],
    "servings": 1,
    "calories": 610,
    "prepTime": 12,
    "cookTime": 6,
    "ingredients": [
      {
        "item": "sandwich bread",
        "qty": 3,
        "unit": "slice",
        "aisle": "Bakery"
      },
      {
        "item": "sliced turkey",
        "qty": 4,
        "unit": "oz",
        "aisle": "Meat & Seafood"
      },
      {
        "item": "bacon",
        "qty": 2,
        "unit": "slice",
        "aisle": "Meat & Seafood"
      },
      {
        "item": "lettuce",
        "qty": 2,
        "unit": "slice",
        "aisle": "Produce"
      },
      {
        "item": "tomato",
        "qty": 0.5,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "mayonnaise",
        "qty": 1,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      }
    ],
    "steps": [
      "Toast the bread slices until golden.",
      "Cook the bacon until crisp.",
      "Spread mayonnaise on the toast.",
      "Layer turkey, bacon, lettuce, and tomato in a double stack.",
      "Cut into quarters and secure with picks."
    ]
  },
  {
    "id": "lna-caprese-panini",
    "name": "Caprese Panini",
    "mealTypes": [
      "lunch"
    ],
    "tags": [
      "vegetarian"
    ],
    "servings": 1,
    "calories": 520,
    "prepTime": 8,
    "cookTime": 6,
    "ingredients": [
      {
        "item": "ciabatta roll",
        "qty": 1,
        "unit": "unit",
        "aisle": "Bakery"
      },
      {
        "item": "fresh mozzarella",
        "qty": 3,
        "unit": "oz",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "tomato",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "fresh basil",
        "qty": 0.25,
        "unit": "cup",
        "aisle": "Produce"
      },
      {
        "item": "pesto",
        "qty": 1,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      }
    ],
    "steps": [
      "Slice the ciabatta roll in half.",
      "Spread pesto on the inside of the bread.",
      "Layer mozzarella, tomato, and basil inside.",
      "Press in a hot panini press until golden and melty."
    ]
  },
  {
    "id": "lna-veggie-hummus-wrap",
    "name": "Veggie Hummus Wrap",
    "mealTypes": [
      "lunch"
    ],
    "tags": [
      "vegan",
      "vegetarian",
      "dairy-free",
      "no-cook",
      "quick"
    ],
    "servings": 1,
    "calories": 410,
    "prepTime": 10,
    "cookTime": 0,
    "ingredients": [
      {
        "item": "flour tortilla",
        "qty": 1,
        "unit": "unit",
        "aisle": "Bakery"
      },
      {
        "item": "hummus",
        "qty": 3,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "cucumber",
        "qty": 0.5,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "carrot",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "spinach",
        "qty": 1,
        "unit": "cup",
        "aisle": "Produce"
      },
      {
        "item": "red bell pepper",
        "qty": 0.5,
        "unit": "unit",
        "aisle": "Produce"
      }
    ],
    "steps": [
      "Spread hummus evenly over the tortilla.",
      "Slice the cucumber, carrot, and pepper into thin strips.",
      "Layer the vegetables and spinach across the center.",
      "Roll tightly and slice in half."
    ]
  },
  {
    "id": "lna-italian-sub",
    "name": "Italian Deli Sub",
    "mealTypes": [
      "lunch"
    ],
    "tags": [
      "high-protein"
    ],
    "servings": 1,
    "calories": 650,
    "prepTime": 10,
    "cookTime": 0,
    "ingredients": [
      {
        "item": "sub roll",
        "qty": 1,
        "unit": "unit",
        "aisle": "Bakery"
      },
      {
        "item": "salami",
        "qty": 2,
        "unit": "oz",
        "aisle": "Meat & Seafood"
      },
      {
        "item": "ham",
        "qty": 2,
        "unit": "oz",
        "aisle": "Meat & Seafood"
      },
      {
        "item": "provolone cheese",
        "qty": 2,
        "unit": "slice",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "shredded lettuce",
        "qty": 0.5,
        "unit": "cup",
        "aisle": "Produce"
      },
      {
        "item": "italian dressing",
        "qty": 2,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      }
    ],
    "steps": [
      "Split the sub roll lengthwise.",
      "Layer salami, ham, and provolone inside.",
      "Add shredded lettuce and tomato.",
      "Drizzle with italian dressing and close the sandwich."
    ]
  },
  {
    "id": "lna-egg-salad-sandwich",
    "name": "Egg Salad Sandwich",
    "mealTypes": [
      "lunch"
    ],
    "tags": [
      "vegetarian",
      "high-protein"
    ],
    "servings": 2,
    "calories": 450,
    "prepTime": 15,
    "cookTime": 10,
    "ingredients": [
      {
        "item": "eggs",
        "qty": 6,
        "unit": "unit",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "mayonnaise",
        "qty": 3,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "dijon mustard",
        "qty": 1,
        "unit": "tsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "chives",
        "qty": 2,
        "unit": "tbsp",
        "aisle": "Produce"
      },
      {
        "item": "sandwich bread",
        "qty": 4,
        "unit": "slice",
        "aisle": "Bakery"
      }
    ],
    "steps": [
      "Boil the eggs for ten minutes then cool and peel.",
      "Chop the eggs and mix with mayonnaise and mustard.",
      "Stir in chopped chives and season to taste.",
      "Spread onto bread and close the sandwiches."
    ]
  },
  {
    "id": "lna-tuna-melt",
    "name": "Classic Tuna Melt",
    "mealTypes": [
      "lunch"
    ],
    "tags": [
      "pescatarian",
      "high-protein"
    ],
    "servings": 2,
    "calories": 520,
    "prepTime": 10,
    "cookTime": 8,
    "ingredients": [
      {
        "item": "canned tuna",
        "qty": 2,
        "unit": "can",
        "aisle": "Canned Goods"
      },
      {
        "item": "mayonnaise",
        "qty": 2,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "celery",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "cheddar cheese",
        "qty": 2,
        "unit": "slice",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "sandwich bread",
        "qty": 4,
        "unit": "slice",
        "aisle": "Bakery"
      }
    ],
    "steps": [
      "Drain the tuna and mix with mayonnaise and diced celery.",
      "Spread the tuna onto bread and top with cheese.",
      "Close the sandwiches and butter the outsides.",
      "Grill in a pan until golden and the cheese melts."
    ]
  },
  {
    "id": "lna-blt-sandwich",
    "name": "Bacon Lettuce And Tomato Sandwich",
    "mealTypes": [
      "lunch"
    ],
    "tags": [
      "quick"
    ],
    "servings": 1,
    "calories": 480,
    "prepTime": 5,
    "cookTime": 8,
    "ingredients": [
      {
        "item": "sandwich bread",
        "qty": 2,
        "unit": "slice",
        "aisle": "Bakery"
      },
      {
        "item": "bacon",
        "qty": 4,
        "unit": "slice",
        "aisle": "Meat & Seafood"
      },
      {
        "item": "lettuce",
        "qty": 2,
        "unit": "slice",
        "aisle": "Produce"
      },
      {
        "item": "tomato",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "mayonnaise",
        "qty": 1,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      }
    ],
    "steps": [
      "Cook the bacon until crisp.",
      "Toast the bread and spread with mayonnaise.",
      "Layer bacon, lettuce, and sliced tomato.",
      "Close the sandwich and cut in half."
    ]
  },
  {
    "id": "lna-chicken-avocado-wrap",
    "name": "Chicken Avocado Wrap",
    "mealTypes": [
      "lunch"
    ],
    "tags": [
      "high-protein"
    ],
    "servings": 1,
    "calories": 540,
    "prepTime": 12,
    "cookTime": 0,
    "ingredients": [
      {
        "item": "flour tortilla",
        "qty": 1,
        "unit": "unit",
        "aisle": "Bakery"
      },
      {
        "item": "cooked chicken breast",
        "qty": 5,
        "unit": "oz",
        "aisle": "Meat & Seafood"
      },
      {
        "item": "avocado",
        "qty": 0.5,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "romaine lettuce",
        "qty": 1,
        "unit": "cup",
        "aisle": "Produce"
      },
      {
        "item": "ranch dressing",
        "qty": 2,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      }
    ],
    "steps": [
      "Slice the chicken and mash the avocado.",
      "Spread avocado across the tortilla.",
      "Add chicken and lettuce down the center.",
      "Drizzle with ranch and roll up tightly."
    ]
  },
  {
    "id": "lna-classic-tomato-soup",
    "name": "Creamy Tomato Soup",
    "mealTypes": [
      "lunch"
    ],
    "tags": [
      "vegetarian",
      "gluten-free"
    ],
    "servings": 4,
    "calories": 300,
    "prepTime": 10,
    "cookTime": 25,
    "ingredients": [
      {
        "item": "canned crushed tomatoes",
        "qty": 2,
        "unit": "can",
        "aisle": "Canned Goods"
      },
      {
        "item": "onion",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "garlic",
        "qty": 2,
        "unit": "clove",
        "aisle": "Produce"
      },
      {
        "item": "vegetable broth",
        "qty": 2,
        "unit": "cup",
        "aisle": "Canned Goods"
      },
      {
        "item": "heavy cream",
        "qty": 0.5,
        "unit": "cup",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "olive oil",
        "qty": 1,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      }
    ],
    "steps": [
      "Saute the onion and garlic in olive oil until soft.",
      "Add the tomatoes and broth and simmer twenty minutes.",
      "Blend the soup until smooth.",
      "Stir in the cream and season before serving."
    ]
  },
  {
    "id": "lna-minestrone-soup",
    "name": "Hearty Minestrone Soup",
    "mealTypes": [
      "lunch"
    ],
    "tags": [
      "vegan",
      "vegetarian",
      "dairy-free",
      "batch-cook"
    ],
    "servings": 6,
    "calories": 340,
    "prepTime": 15,
    "cookTime": 30,
    "ingredients": [
      {
        "item": "canned white beans",
        "qty": 1,
        "unit": "can",
        "aisle": "Canned Goods"
      },
      {
        "item": "canned diced tomatoes",
        "qty": 1,
        "unit": "can",
        "aisle": "Canned Goods"
      },
      {
        "item": "carrot",
        "qty": 2,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "celery",
        "qty": 2,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "zucchini",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "small pasta",
        "qty": 1,
        "unit": "cup",
        "aisle": "Grains & Pasta"
      },
      {
        "item": "vegetable broth",
        "qty": 6,
        "unit": "cup",
        "aisle": "Canned Goods"
      }
    ],
    "steps": [
      "Dice the carrot, celery, and zucchini.",
      "Saute the vegetables until they begin to soften.",
      "Add the tomatoes, beans, and broth and simmer twenty minutes.",
      "Stir in the pasta and cook until tender.",
      "Season to taste and serve hot."
    ]
  },
  {
    "id": "lna-chicken-noodle-soup",
    "name": "Chicken Noodle Soup",
    "mealTypes": [
      "lunch"
    ],
    "tags": [
      "high-protein",
      "batch-cook"
    ],
    "servings": 6,
    "calories": 360,
    "prepTime": 15,
    "cookTime": 30,
    "ingredients": [
      {
        "item": "cooked chicken breast",
        "qty": 12,
        "unit": "oz",
        "aisle": "Meat & Seafood"
      },
      {
        "item": "egg noodles",
        "qty": 2,
        "unit": "cup",
        "aisle": "Grains & Pasta"
      },
      {
        "item": "carrot",
        "qty": 2,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "celery",
        "qty": 2,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "onion",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "chicken broth",
        "qty": 8,
        "unit": "cup",
        "aisle": "Canned Goods"
      }
    ],
    "steps": [
      "Dice the carrot, celery, and onion.",
      "Simmer the vegetables in broth until tender.",
      "Add the shredded chicken and noodles.",
      "Cook until the noodles are done and season to taste."
    ]
  },
  {
    "id": "lna-gazpacho",
    "name": "Chilled Tomato Gazpacho",
    "mealTypes": [
      "lunch"
    ],
    "tags": [
      "vegan",
      "vegetarian",
      "gluten-free",
      "no-cook"
    ],
    "servings": 4,
    "calories": 300,
    "prepTime": 20,
    "cookTime": 0,
    "ingredients": [
      {
        "item": "ripe tomatoes",
        "qty": 6,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "cucumber",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "red bell pepper",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "garlic",
        "qty": 1,
        "unit": "clove",
        "aisle": "Produce"
      },
      {
        "item": "olive oil",
        "qty": 3,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "red wine vinegar",
        "qty": 2,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      }
    ],
    "steps": [
      "Roughly chop the tomatoes, cucumber, and pepper.",
      "Blend the vegetables with garlic until smooth.",
      "Add olive oil and vinegar and blend again.",
      "Chill for at least one hour before serving."
    ]
  },
  {
    "id": "lna-lentil-soup",
    "name": "Spiced Red Lentil Soup",
    "mealTypes": [
      "lunch"
    ],
    "tags": [
      "vegan",
      "vegetarian",
      "dairy-free",
      "batch-cook"
    ],
    "servings": 6,
    "calories": 380,
    "prepTime": 10,
    "cookTime": 30,
    "ingredients": [
      {
        "item": "red lentils",
        "qty": 1.5,
        "unit": "cup",
        "aisle": "Grains & Pasta"
      },
      {
        "item": "onion",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "carrot",
        "qty": 2,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "ground cumin",
        "qty": 1,
        "unit": "tsp",
        "aisle": "Spices"
      },
      {
        "item": "vegetable broth",
        "qty": 6,
        "unit": "cup",
        "aisle": "Canned Goods"
      },
      {
        "item": "olive oil",
        "qty": 1,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      }
    ],
    "steps": [
      "Saute the diced onion and carrot in olive oil.",
      "Stir in the cumin until fragrant.",
      "Add the lentils and broth and bring to a boil.",
      "Simmer until the lentils break down, then season and serve."
    ]
  },
  {
    "id": "lna-quinoa-chickpea-bowl",
    "name": "Quinoa Chickpea Power Bowl",
    "mealTypes": [
      "lunch"
    ],
    "tags": [
      "vegan",
      "vegetarian",
      "gluten-free",
      "high-protein"
    ],
    "servings": 3,
    "calories": 470,
    "prepTime": 15,
    "cookTime": 15,
    "ingredients": [
      {
        "item": "quinoa",
        "qty": 1,
        "unit": "cup",
        "aisle": "Grains & Pasta"
      },
      {
        "item": "canned chickpeas",
        "qty": 1,
        "unit": "can",
        "aisle": "Canned Goods"
      },
      {
        "item": "cucumber",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "cherry tomatoes",
        "qty": 1,
        "unit": "cup",
        "aisle": "Produce"
      },
      {
        "item": "lemon juice",
        "qty": 2,
        "unit": "tbsp",
        "aisle": "Produce"
      },
      {
        "item": "olive oil",
        "qty": 2,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      }
    ],
    "steps": [
      "Cook the quinoa according to package directions and cool slightly.",
      "Rinse and drain the chickpeas.",
      "Dice the cucumber and halve the tomatoes.",
      "Toss everything with lemon juice and olive oil and serve."
    ]
  },
  {
    "id": "lna-caprese-orzo-salad",
    "name": "Caprese Orzo Salad",
    "mealTypes": [
      "lunch"
    ],
    "tags": [
      "vegetarian",
      "batch-cook"
    ],
    "servings": 4,
    "calories": 420,
    "prepTime": 12,
    "cookTime": 10,
    "ingredients": [
      {
        "item": "orzo pasta",
        "qty": 1.5,
        "unit": "cup",
        "aisle": "Grains & Pasta"
      },
      {
        "item": "cherry tomatoes",
        "qty": 1.5,
        "unit": "cup",
        "aisle": "Produce"
      },
      {
        "item": "mini mozzarella balls",
        "qty": 6,
        "unit": "oz",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "fresh basil",
        "qty": 0.5,
        "unit": "cup",
        "aisle": "Produce"
      },
      {
        "item": "olive oil",
        "qty": 3,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "balsamic glaze",
        "qty": 1,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      }
    ],
    "steps": [
      "Cook the orzo until tender then rinse and cool.",
      "Halve the tomatoes and mozzarella balls.",
      "Toss the orzo with tomatoes, mozzarella, and basil.",
      "Dress with olive oil and balsamic glaze and serve."
    ]
  },
  {
    "id": "lna-smoked-salmon-bagel",
    "name": "Smoked Salmon Bagel",
    "mealTypes": [
      "lunch"
    ],
    "tags": [
      "pescatarian",
      "high-protein",
      "quick"
    ],
    "servings": 1,
    "calories": 490,
    "prepTime": 8,
    "cookTime": 0,
    "ingredients": [
      {
        "item": "bagel",
        "qty": 1,
        "unit": "unit",
        "aisle": "Bakery"
      },
      {
        "item": "smoked salmon",
        "qty": 3,
        "unit": "oz",
        "aisle": "Meat & Seafood"
      },
      {
        "item": "cream cheese",
        "qty": 2,
        "unit": "tbsp",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "red onion",
        "qty": 0.25,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "capers",
        "qty": 1,
        "unit": "tbsp",
        "aisle": "Canned Goods"
      }
    ],
    "steps": [
      "Slice and toast the bagel.",
      "Spread cream cheese on both halves.",
      "Layer smoked salmon over the cream cheese.",
      "Top with thinly sliced onion and capers."
    ]
  },
  {
    "id": "lna-black-bean-quesadilla",
    "name": "Black Bean Quesadilla",
    "mealTypes": [
      "lunch"
    ],
    "tags": [
      "vegetarian",
      "kid-friendly"
    ],
    "servings": 2,
    "calories": 500,
    "prepTime": 8,
    "cookTime": 8,
    "ingredients": [
      {
        "item": "flour tortilla",
        "qty": 2,
        "unit": "unit",
        "aisle": "Bakery"
      },
      {
        "item": "canned black beans",
        "qty": 1,
        "unit": "can",
        "aisle": "Canned Goods"
      },
      {
        "item": "cheddar cheese",
        "qty": 1,
        "unit": "cup",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "corn",
        "qty": 0.5,
        "unit": "cup",
        "aisle": "Canned Goods"
      },
      {
        "item": "salsa",
        "qty": 0.25,
        "unit": "cup",
        "aisle": "Condiments & Baking"
      }
    ],
    "steps": [
      "Mash the black beans lightly and spread on a tortilla.",
      "Sprinkle cheese and corn over the beans.",
      "Top with the second tortilla and cook in a hot pan.",
      "Flip once until both sides are golden and cut into wedges."
    ]
  },
  {
    "id": "lna-cucumber-avocado-roll",
    "name": "Cucumber Avocado Rice Bowl",
    "mealTypes": [
      "lunch"
    ],
    "tags": [
      "vegan",
      "vegetarian",
      "gluten-free",
      "dairy-free"
    ],
    "servings": 2,
    "calories": 430,
    "prepTime": 15,
    "cookTime": 15,
    "ingredients": [
      {
        "item": "sushi rice",
        "qty": 1,
        "unit": "cup",
        "aisle": "Grains & Pasta"
      },
      {
        "item": "cucumber",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "avocado",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "edamame",
        "qty": 0.5,
        "unit": "cup",
        "aisle": "Produce"
      },
      {
        "item": "soy sauce",
        "qty": 2,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "sesame seeds",
        "qty": 1,
        "unit": "tsp",
        "aisle": "Spices"
      }
    ],
    "steps": [
      "Cook the sushi rice and let it cool slightly.",
      "Dice the cucumber and slice the avocado.",
      "Arrange the rice, cucumber, avocado, and edamame in bowls.",
      "Drizzle with soy sauce and sprinkle sesame seeds."
    ]
  },
  {
    "id": "lna-buffalo-chicken-wrap",
    "name": "Buffalo Chicken Wrap",
    "mealTypes": [
      "lunch"
    ],
    "tags": [
      "high-protein"
    ],
    "servings": 2,
    "calories": 560,
    "prepTime": 10,
    "cookTime": 0,
    "ingredients": [
      {
        "item": "flour tortilla",
        "qty": 2,
        "unit": "unit",
        "aisle": "Bakery"
      },
      {
        "item": "cooked chicken breast",
        "qty": 8,
        "unit": "oz",
        "aisle": "Meat & Seafood"
      },
      {
        "item": "buffalo sauce",
        "qty": 3,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "romaine lettuce",
        "qty": 1.5,
        "unit": "cup",
        "aisle": "Produce"
      },
      {
        "item": "blue cheese dressing",
        "qty": 2,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "shredded carrot",
        "qty": 0.5,
        "unit": "cup",
        "aisle": "Produce"
      }
    ],
    "steps": [
      "Toss the shredded chicken with buffalo sauce.",
      "Lay the lettuce and carrot on each tortilla.",
      "Add the buffalo chicken and drizzle with blue cheese dressing.",
      "Roll tightly and slice each wrap in half."
    ]
  },
  {
    "id": "lnb-quinoa-black-bean-buddha-bowl",
    "name": "Quinoa And Black Bean Buddha Bowl",
    "mealTypes": [
      "lunch"
    ],
    "tags": [
      "vegan",
      "vegetarian",
      "gluten-free",
      "high-protein"
    ],
    "servings": 2,
    "calories": 520,
    "prepTime": 15,
    "cookTime": 20,
    "ingredients": [
      {
        "item": "quinoa",
        "qty": 1,
        "unit": "cup",
        "aisle": "Grains & Pasta"
      },
      {
        "item": "black beans",
        "qty": 1,
        "unit": "can",
        "aisle": "Canned Goods"
      },
      {
        "item": "sweet potato",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "avocado",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "baby spinach",
        "qty": 2,
        "unit": "cup",
        "aisle": "Produce"
      },
      {
        "item": "olive oil",
        "qty": 2,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "ground cumin",
        "qty": 1,
        "unit": "tsp",
        "aisle": "Spices"
      },
      {
        "item": "lime",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      }
    ],
    "steps": [
      "Rinse quinoa and simmer in two cups water for fifteen minutes until fluffy.",
      "Toss diced sweet potato with olive oil and cumin, then roast at 200C for twenty minutes.",
      "Warm the drained black beans in a small pan with a pinch of salt.",
      "Divide quinoa among bowls and top with beans, sweet potato, spinach and sliced avocado.",
      "Squeeze lime over the top and serve."
    ]
  },
  {
    "id": "lnb-farro-roasted-veg-bowl",
    "name": "Farro And Roasted Vegetable Bowl",
    "mealTypes": [
      "lunch"
    ],
    "tags": [
      "vegetarian",
      "batch-cook",
      "high-protein"
    ],
    "servings": 4,
    "calories": 480,
    "prepTime": 15,
    "cookTime": 30,
    "ingredients": [
      {
        "item": "farro",
        "qty": 1.5,
        "unit": "cup",
        "aisle": "Grains & Pasta"
      },
      {
        "item": "zucchini",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "red bell pepper",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "red onion",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "feta cheese",
        "qty": 4,
        "unit": "oz",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "olive oil",
        "qty": 3,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "dried oregano",
        "qty": 1,
        "unit": "tsp",
        "aisle": "Spices"
      },
      {
        "item": "lemon",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      }
    ],
    "steps": [
      "Cook farro in salted water for twenty five minutes until tender, then drain.",
      "Chop zucchini, pepper and onion, toss with olive oil and oregano and roast at 210C for thirty minutes.",
      "Combine farro and roasted vegetables in a large bowl.",
      "Crumble feta over the top and finish with a squeeze of lemon.",
      "Serve warm or chilled for meal prep."
    ]
  },
  {
    "id": "lnb-brown-rice-teriyaki-tofu-bowl",
    "name": "Brown Rice Teriyaki Tofu Bowl",
    "mealTypes": [
      "lunch"
    ],
    "tags": [
      "vegan",
      "vegetarian",
      "high-protein",
      "dairy-free"
    ],
    "servings": 2,
    "calories": 560,
    "prepTime": 15,
    "cookTime": 25,
    "ingredients": [
      {
        "item": "brown rice",
        "qty": 1,
        "unit": "cup",
        "aisle": "Grains & Pasta"
      },
      {
        "item": "firm tofu",
        "qty": 1,
        "unit": "block",
        "aisle": "Other"
      },
      {
        "item": "teriyaki sauce",
        "qty": 4,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "broccoli",
        "qty": 2,
        "unit": "cup",
        "aisle": "Produce"
      },
      {
        "item": "carrot",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "sesame oil",
        "qty": 1,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "sesame seeds",
        "qty": 1,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      }
    ],
    "steps": [
      "Cook brown rice according to package directions.",
      "Press and cube tofu, then pan fry in sesame oil until golden on all sides.",
      "Add teriyaki sauce to the tofu and toss to coat, then remove from heat.",
      "Steam broccoli and sliced carrot until just tender.",
      "Serve rice topped with tofu and vegetables and sprinkle with sesame seeds."
    ]
  },
  {
    "id": "lnb-salmon-poke-bowl",
    "name": "Salmon Poke Bowl",
    "mealTypes": [
      "lunch"
    ],
    "tags": [
      "pescatarian",
      "high-protein",
      "dairy-free"
    ],
    "servings": 2,
    "calories": 540,
    "prepTime": 20,
    "cookTime": 15,
    "ingredients": [
      {
        "item": "sushi rice",
        "qty": 1,
        "unit": "cup",
        "aisle": "Grains & Pasta"
      },
      {
        "item": "sushi grade salmon",
        "qty": 8,
        "unit": "oz",
        "aisle": "Meat & Seafood"
      },
      {
        "item": "soy sauce",
        "qty": 3,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "cucumber",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "avocado",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "edamame",
        "qty": 0.5,
        "unit": "cup",
        "aisle": "Other"
      },
      {
        "item": "sesame oil",
        "qty": 1,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "green onion",
        "qty": 2,
        "unit": "unit",
        "aisle": "Produce"
      }
    ],
    "steps": [
      "Cook sushi rice and let it cool slightly.",
      "Cube the salmon and toss with soy sauce and sesame oil.",
      "Slice cucumber, avocado and green onion.",
      "Divide rice among bowls and arrange salmon, cucumber, avocado and edamame on top.",
      "Garnish with green onion and serve."
    ]
  },
  {
    "id": "lnb-chana-masala",
    "name": "Chana Masala",
    "mealTypes": [
      "lunch"
    ],
    "tags": [
      "vegan",
      "vegetarian",
      "gluten-free",
      "batch-cook"
    ],
    "servings": 4,
    "calories": 420,
    "prepTime": 10,
    "cookTime": 25,
    "ingredients": [
      {
        "item": "chickpeas",
        "qty": 2,
        "unit": "can",
        "aisle": "Canned Goods"
      },
      {
        "item": "crushed tomatoes",
        "qty": 1,
        "unit": "can",
        "aisle": "Canned Goods"
      },
      {
        "item": "onion",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "garlic",
        "qty": 3,
        "unit": "clove",
        "aisle": "Produce"
      },
      {
        "item": "garam masala",
        "qty": 2,
        "unit": "tsp",
        "aisle": "Spices"
      },
      {
        "item": "ground turmeric",
        "qty": 1,
        "unit": "tsp",
        "aisle": "Spices"
      },
      {
        "item": "ginger",
        "qty": 1,
        "unit": "tbsp",
        "aisle": "Produce"
      },
      {
        "item": "vegetable oil",
        "qty": 2,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      }
    ],
    "steps": [
      "Saute chopped onion in oil until soft, then add garlic and ginger.",
      "Stir in garam masala and turmeric and cook for one minute.",
      "Add crushed tomatoes and drained chickpeas and simmer for twenty minutes.",
      "Mash a few chickpeas to thicken the sauce.",
      "Season to taste and serve with rice or naan."
    ]
  },
  {
    "id": "lnb-soba-noodle-salad",
    "name": "Sesame Soba Noodle Salad",
    "mealTypes": [
      "lunch"
    ],
    "tags": [
      "vegan",
      "vegetarian",
      "dairy-free"
    ],
    "servings": 3,
    "calories": 440,
    "prepTime": 15,
    "cookTime": 8,
    "ingredients": [
      {
        "item": "soba noodles",
        "qty": 8,
        "unit": "oz",
        "aisle": "Grains & Pasta"
      },
      {
        "item": "edamame",
        "qty": 1,
        "unit": "cup",
        "aisle": "Other"
      },
      {
        "item": "red cabbage",
        "qty": 2,
        "unit": "cup",
        "aisle": "Produce"
      },
      {
        "item": "carrot",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "soy sauce",
        "qty": 3,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "rice vinegar",
        "qty": 2,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "sesame oil",
        "qty": 2,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "sesame seeds",
        "qty": 1,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      }
    ],
    "steps": [
      "Boil soba noodles for six minutes, then rinse under cold water and drain.",
      "Whisk together soy sauce, rice vinegar and sesame oil for the dressing.",
      "Shred cabbage and carrot and combine with noodles and edamame.",
      "Pour over the dressing and toss well.",
      "Top with sesame seeds and serve chilled."
    ]
  },
  {
    "id": "lnb-rice-noodle-salad-peanut",
    "name": "Rice Noodle Salad With Peanut Dressing",
    "mealTypes": [
      "lunch"
    ],
    "tags": [
      "vegan",
      "vegetarian",
      "gluten-free",
      "dairy-free"
    ],
    "servings": 3,
    "calories": 470,
    "prepTime": 18,
    "cookTime": 6,
    "ingredients": [
      {
        "item": "rice noodles",
        "qty": 8,
        "unit": "oz",
        "aisle": "Grains & Pasta"
      },
      {
        "item": "peanut butter",
        "qty": 3,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "lime",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "cucumber",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "carrot",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "cilantro",
        "qty": 0.5,
        "unit": "cup",
        "aisle": "Produce"
      },
      {
        "item": "soy sauce",
        "qty": 2,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      }
    ],
    "steps": [
      "Soak rice noodles in hot water until tender, then drain and cool.",
      "Whisk peanut butter with lime juice, soy sauce and a splash of warm water.",
      "Julienne cucumber and carrot and chop the cilantro.",
      "Toss noodles with vegetables and peanut dressing.",
      "Garnish with extra cilantro and serve."
    ]
  },
  {
    "id": "lnb-mediterranean-orzo-salad",
    "name": "Mediterranean Orzo Salad",
    "mealTypes": [
      "lunch"
    ],
    "tags": [
      "vegetarian",
      "batch-cook"
    ],
    "servings": 4,
    "calories": 430,
    "prepTime": 15,
    "cookTime": 10,
    "ingredients": [
      {
        "item": "orzo",
        "qty": 1.5,
        "unit": "cup",
        "aisle": "Grains & Pasta"
      },
      {
        "item": "cherry tomatoes",
        "qty": 1,
        "unit": "cup",
        "aisle": "Produce"
      },
      {
        "item": "kalamata olives",
        "qty": 0.5,
        "unit": "cup",
        "aisle": "Canned Goods"
      },
      {
        "item": "cucumber",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "feta cheese",
        "qty": 4,
        "unit": "oz",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "olive oil",
        "qty": 3,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "lemon",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "fresh parsley",
        "qty": 0.25,
        "unit": "cup",
        "aisle": "Produce"
      }
    ],
    "steps": [
      "Cook orzo in salted water until al dente, then drain and cool.",
      "Halve the cherry tomatoes and dice the cucumber.",
      "Combine orzo, tomatoes, cucumber and olives in a large bowl.",
      "Dress with olive oil and lemon juice and toss.",
      "Fold in crumbled feta and chopped parsley before serving."
    ]
  },
  {
    "id": "lnb-falafel-hummus-plate",
    "name": "Falafel And Hummus Plate",
    "mealTypes": [
      "lunch"
    ],
    "tags": [
      "vegetarian",
      "high-protein"
    ],
    "servings": 3,
    "calories": 540,
    "prepTime": 20,
    "cookTime": 15,
    "ingredients": [
      {
        "item": "chickpeas",
        "qty": 1,
        "unit": "can",
        "aisle": "Canned Goods"
      },
      {
        "item": "hummus",
        "qty": 1,
        "unit": "cup",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "fresh parsley",
        "qty": 0.5,
        "unit": "cup",
        "aisle": "Produce"
      },
      {
        "item": "garlic",
        "qty": 2,
        "unit": "clove",
        "aisle": "Produce"
      },
      {
        "item": "ground cumin",
        "qty": 1,
        "unit": "tsp",
        "aisle": "Spices"
      },
      {
        "item": "flour",
        "qty": 2,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "pita bread",
        "qty": 3,
        "unit": "unit",
        "aisle": "Bakery"
      },
      {
        "item": "olive oil",
        "qty": 3,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      }
    ],
    "steps": [
      "Blend chickpeas, parsley, garlic, cumin and flour into a coarse paste.",
      "Form the mixture into small patties.",
      "Pan fry the falafel in olive oil until crisp and golden on both sides.",
      "Warm the pita bread briefly in a dry pan.",
      "Serve falafel with hummus and warm pita."
    ]
  },
  {
    "id": "lnb-tabbouleh",
    "name": "Classic Tabbouleh",
    "mealTypes": [
      "lunch"
    ],
    "tags": [
      "vegan",
      "vegetarian",
      "no-cook",
      "dairy-free"
    ],
    "servings": 4,
    "calories": 320,
    "prepTime": 20,
    "cookTime": 0,
    "ingredients": [
      {
        "item": "bulgur wheat",
        "qty": 0.75,
        "unit": "cup",
        "aisle": "Grains & Pasta"
      },
      {
        "item": "fresh parsley",
        "qty": 2,
        "unit": "cup",
        "aisle": "Produce"
      },
      {
        "item": "fresh mint",
        "qty": 0.5,
        "unit": "cup",
        "aisle": "Produce"
      },
      {
        "item": "tomato",
        "qty": 2,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "green onion",
        "qty": 3,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "lemon",
        "qty": 2,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "olive oil",
        "qty": 3,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      }
    ],
    "steps": [
      "Soak bulgur in hot water for fifteen minutes until tender, then drain well.",
      "Finely chop the parsley, mint, tomato and green onion.",
      "Combine bulgur with the chopped herbs and vegetables.",
      "Dress with lemon juice and olive oil and season with salt.",
      "Chill briefly and serve."
    ]
  },
  {
    "id": "lnb-chicken-burrito-bowl",
    "name": "Chicken Burrito Bowl",
    "mealTypes": [
      "lunch"
    ],
    "tags": [
      "high-protein",
      "gluten-free"
    ],
    "servings": 4,
    "calories": 620,
    "prepTime": 15,
    "cookTime": 20,
    "ingredients": [
      {
        "item": "chicken breast",
        "qty": 1,
        "unit": "lb",
        "aisle": "Meat & Seafood"
      },
      {
        "item": "white rice",
        "qty": 1,
        "unit": "cup",
        "aisle": "Grains & Pasta"
      },
      {
        "item": "black beans",
        "qty": 1,
        "unit": "can",
        "aisle": "Canned Goods"
      },
      {
        "item": "corn",
        "qty": 1,
        "unit": "cup",
        "aisle": "Produce"
      },
      {
        "item": "salsa",
        "qty": 0.5,
        "unit": "cup",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "avocado",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "chili powder",
        "qty": 1,
        "unit": "tbsp",
        "aisle": "Spices"
      },
      {
        "item": "lime",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      }
    ],
    "steps": [
      "Cook rice according to package directions.",
      "Season chicken with chili powder and pan fry until cooked through, then slice.",
      "Warm the black beans and corn together in a pan.",
      "Build bowls with rice, beans, corn and sliced chicken.",
      "Top with salsa, avocado and a squeeze of lime."
    ]
  },
  {
    "id": "lnb-black-bean-quesadilla",
    "name": "Black Bean And Cheese Quesadilla",
    "mealTypes": [
      "lunch"
    ],
    "tags": [
      "vegetarian",
      "kid-friendly",
      "quick"
    ],
    "servings": 2,
    "calories": 500,
    "prepTime": 8,
    "cookTime": 10,
    "ingredients": [
      {
        "item": "flour tortillas",
        "qty": 4,
        "unit": "unit",
        "aisle": "Bakery"
      },
      {
        "item": "black beans",
        "qty": 1,
        "unit": "can",
        "aisle": "Canned Goods"
      },
      {
        "item": "cheddar cheese",
        "qty": 1,
        "unit": "cup",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "salsa",
        "qty": 0.5,
        "unit": "cup",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "ground cumin",
        "qty": 0.5,
        "unit": "tsp",
        "aisle": "Spices"
      },
      {
        "item": "olive oil",
        "qty": 1,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      }
    ],
    "steps": [
      "Mash the drained black beans with cumin and a spoonful of salsa.",
      "Spread the bean mixture over two tortillas and top with cheese.",
      "Cover with remaining tortillas and cook in an oiled pan until golden.",
      "Flip carefully and cook the second side until the cheese melts.",
      "Slice into wedges and serve with extra salsa."
    ]
  },
  {
    "id": "lnb-fish-tacos",
    "name": "Baja Fish Tacos",
    "mealTypes": [
      "lunch"
    ],
    "tags": [
      "pescatarian",
      "high-protein"
    ],
    "servings": 3,
    "calories": 520,
    "prepTime": 15,
    "cookTime": 12,
    "ingredients": [
      {
        "item": "white fish fillets",
        "qty": 1,
        "unit": "lb",
        "aisle": "Meat & Seafood"
      },
      {
        "item": "corn tortillas",
        "qty": 6,
        "unit": "unit",
        "aisle": "Bakery"
      },
      {
        "item": "red cabbage",
        "qty": 2,
        "unit": "cup",
        "aisle": "Produce"
      },
      {
        "item": "lime",
        "qty": 2,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "greek yogurt",
        "qty": 0.5,
        "unit": "cup",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "chili powder",
        "qty": 1,
        "unit": "tbsp",
        "aisle": "Spices"
      },
      {
        "item": "olive oil",
        "qty": 2,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      }
    ],
    "steps": [
      "Season fish with chili powder and pan fry in olive oil until flaky.",
      "Mix greek yogurt with lime juice to make a quick crema.",
      "Warm the corn tortillas in a dry pan.",
      "Flake the fish and divide among the tortillas.",
      "Top with shredded cabbage and a drizzle of crema."
    ]
  },
  {
    "id": "lnb-veggie-burrito-bowl",
    "name": "Roasted Veggie Burrito Bowl",
    "mealTypes": [
      "lunch"
    ],
    "tags": [
      "vegan",
      "vegetarian",
      "gluten-free",
      "batch-cook"
    ],
    "servings": 4,
    "calories": 490,
    "prepTime": 15,
    "cookTime": 25,
    "ingredients": [
      {
        "item": "brown rice",
        "qty": 1,
        "unit": "cup",
        "aisle": "Grains & Pasta"
      },
      {
        "item": "bell pepper",
        "qty": 2,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "zucchini",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "pinto beans",
        "qty": 1,
        "unit": "can",
        "aisle": "Canned Goods"
      },
      {
        "item": "corn",
        "qty": 1,
        "unit": "cup",
        "aisle": "Produce"
      },
      {
        "item": "salsa",
        "qty": 0.5,
        "unit": "cup",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "chili powder",
        "qty": 1,
        "unit": "tbsp",
        "aisle": "Spices"
      },
      {
        "item": "olive oil",
        "qty": 2,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      }
    ],
    "steps": [
      "Cook brown rice according to package directions.",
      "Toss chopped peppers and zucchini with olive oil and chili powder and roast at 210C for twenty five minutes.",
      "Warm the pinto beans and corn in a pan.",
      "Assemble bowls with rice, roasted vegetables, beans and corn.",
      "Finish each bowl with a spoonful of salsa."
    ]
  },
  {
    "id": "lnb-thai-tofu-rice-bowl",
    "name": "Thai Basil Tofu Rice Bowl",
    "mealTypes": [
      "lunch"
    ],
    "tags": [
      "vegan",
      "vegetarian",
      "dairy-free",
      "high-protein"
    ],
    "servings": 2,
    "calories": 530,
    "prepTime": 15,
    "cookTime": 15,
    "ingredients": [
      {
        "item": "jasmine rice",
        "qty": 1,
        "unit": "cup",
        "aisle": "Grains & Pasta"
      },
      {
        "item": "firm tofu",
        "qty": 1,
        "unit": "block",
        "aisle": "Other"
      },
      {
        "item": "thai basil",
        "qty": 1,
        "unit": "cup",
        "aisle": "Produce"
      },
      {
        "item": "garlic",
        "qty": 3,
        "unit": "clove",
        "aisle": "Produce"
      },
      {
        "item": "soy sauce",
        "qty": 3,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "bell pepper",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "vegetable oil",
        "qty": 2,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      }
    ],
    "steps": [
      "Cook jasmine rice according to package directions.",
      "Crumble tofu and stir fry in hot oil with garlic until golden.",
      "Add sliced bell pepper and cook until crisp tender.",
      "Stir in soy sauce and thai basil until the leaves wilt.",
      "Serve the tofu over rice."
    ]
  },
  {
    "id": "lnb-tuna-poke-bowl",
    "name": "Spicy Tuna Poke Bowl",
    "mealTypes": [
      "lunch"
    ],
    "tags": [
      "pescatarian",
      "high-protein",
      "dairy-free"
    ],
    "servings": 2,
    "calories": 510,
    "prepTime": 20,
    "cookTime": 15,
    "ingredients": [
      {
        "item": "sushi grade tuna",
        "qty": 8,
        "unit": "oz",
        "aisle": "Meat & Seafood"
      },
      {
        "item": "sushi rice",
        "qty": 1,
        "unit": "cup",
        "aisle": "Grains & Pasta"
      },
      {
        "item": "soy sauce",
        "qty": 3,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "sriracha",
        "qty": 1,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "cucumber",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "avocado",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "sesame seeds",
        "qty": 1,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      }
    ],
    "steps": [
      "Cook the sushi rice and let it cool.",
      "Cube the tuna and toss with soy sauce and sriracha.",
      "Slice cucumber and avocado.",
      "Divide rice among bowls and top with tuna, cucumber and avocado.",
      "Sprinkle with sesame seeds and serve."
    ]
  },
  {
    "id": "lnb-chicken-teriyaki-rice-bowl",
    "name": "Chicken Teriyaki Rice Bowl",
    "mealTypes": [
      "lunch"
    ],
    "tags": [
      "high-protein",
      "dairy-free"
    ],
    "servings": 3,
    "calories": 590,
    "prepTime": 12,
    "cookTime": 20,
    "ingredients": [
      {
        "item": "chicken thighs",
        "qty": 1,
        "unit": "lb",
        "aisle": "Meat & Seafood"
      },
      {
        "item": "white rice",
        "qty": 1,
        "unit": "cup",
        "aisle": "Grains & Pasta"
      },
      {
        "item": "teriyaki sauce",
        "qty": 5,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "broccoli",
        "qty": 2,
        "unit": "cup",
        "aisle": "Produce"
      },
      {
        "item": "green onion",
        "qty": 2,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "sesame seeds",
        "qty": 1,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "vegetable oil",
        "qty": 1,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      }
    ],
    "steps": [
      "Cook white rice according to package directions.",
      "Pan fry the chicken in oil until cooked through, then slice.",
      "Add teriyaki sauce to the chicken and toss to glaze.",
      "Steam the broccoli until tender.",
      "Serve chicken and broccoli over rice topped with green onion and sesame seeds."
    ]
  },
  {
    "id": "lnb-greek-hummus-bowl",
    "name": "Greek Hummus Power Bowl",
    "mealTypes": [
      "lunch"
    ],
    "tags": [
      "vegetarian",
      "high-protein",
      "no-cook"
    ],
    "servings": 2,
    "calories": 460,
    "prepTime": 15,
    "cookTime": 0,
    "ingredients": [
      {
        "item": "hummus",
        "qty": 1,
        "unit": "cup",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "cherry tomatoes",
        "qty": 1,
        "unit": "cup",
        "aisle": "Produce"
      },
      {
        "item": "cucumber",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "kalamata olives",
        "qty": 0.5,
        "unit": "cup",
        "aisle": "Canned Goods"
      },
      {
        "item": "feta cheese",
        "qty": 3,
        "unit": "oz",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "chickpeas",
        "qty": 1,
        "unit": "can",
        "aisle": "Canned Goods"
      },
      {
        "item": "olive oil",
        "qty": 2,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      }
    ],
    "steps": [
      "Spread hummus across the base of two shallow bowls.",
      "Halve the cherry tomatoes and dice the cucumber.",
      "Arrange tomatoes, cucumber, olives and drained chickpeas over the hummus.",
      "Crumble feta on top and drizzle with olive oil.",
      "Serve immediately with pita if desired."
    ]
  },
  {
    "id": "lnb-shrimp-rice-noodle-bowl",
    "name": "Shrimp Rice Noodle Bowl",
    "mealTypes": [
      "lunch"
    ],
    "tags": [
      "pescatarian",
      "high-protein",
      "dairy-free",
      "gluten-free"
    ],
    "servings": 2,
    "calories": 480,
    "prepTime": 15,
    "cookTime": 10,
    "ingredients": [
      {
        "item": "rice noodles",
        "qty": 6,
        "unit": "oz",
        "aisle": "Grains & Pasta"
      },
      {
        "item": "shrimp",
        "qty": 0.75,
        "unit": "lb",
        "aisle": "Meat & Seafood"
      },
      {
        "item": "lime",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "fish sauce",
        "qty": 2,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "carrot",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "cilantro",
        "qty": 0.5,
        "unit": "cup",
        "aisle": "Produce"
      },
      {
        "item": "vegetable oil",
        "qty": 1,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      }
    ],
    "steps": [
      "Soak rice noodles in hot water until tender, then drain.",
      "Saute the shrimp in oil until pink and cooked through.",
      "Whisk lime juice with fish sauce for the dressing.",
      "Toss noodles with shrimp, julienned carrot and cilantro.",
      "Pour over the dressing and serve."
    ]
  },
  {
    "id": "lnb-coconut-chickpea-curry",
    "name": "Coconut Chickpea Curry",
    "mealTypes": [
      "lunch"
    ],
    "tags": [
      "vegan",
      "vegetarian",
      "gluten-free",
      "batch-cook"
    ],
    "servings": 4,
    "calories": 470,
    "prepTime": 10,
    "cookTime": 25,
    "ingredients": [
      {
        "item": "chickpeas",
        "qty": 2,
        "unit": "can",
        "aisle": "Canned Goods"
      },
      {
        "item": "coconut milk",
        "qty": 1,
        "unit": "can",
        "aisle": "Canned Goods"
      },
      {
        "item": "spinach",
        "qty": 3,
        "unit": "cup",
        "aisle": "Produce"
      },
      {
        "item": "onion",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "curry powder",
        "qty": 2,
        "unit": "tbsp",
        "aisle": "Spices"
      },
      {
        "item": "garlic",
        "qty": 3,
        "unit": "clove",
        "aisle": "Produce"
      },
      {
        "item": "vegetable oil",
        "qty": 2,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      }
    ],
    "steps": [
      "Saute chopped onion and garlic in oil until soft.",
      "Stir in curry powder and cook until fragrant.",
      "Add drained chickpeas and coconut milk and simmer for twenty minutes.",
      "Fold in the spinach and cook until wilted.",
      "Season to taste and serve over rice."
    ]
  },
  {
    "id": "lnb-caprese-pasta-salad",
    "name": "Caprese Pasta Salad",
    "mealTypes": [
      "lunch"
    ],
    "tags": [
      "vegetarian",
      "batch-cook"
    ],
    "servings": 4,
    "calories": 450,
    "prepTime": 15,
    "cookTime": 10,
    "ingredients": [
      {
        "item": "fusilli pasta",
        "qty": 3,
        "unit": "cup",
        "aisle": "Grains & Pasta"
      },
      {
        "item": "cherry tomatoes",
        "qty": 1.5,
        "unit": "cup",
        "aisle": "Produce"
      },
      {
        "item": "fresh mozzarella",
        "qty": 6,
        "unit": "oz",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "fresh basil",
        "qty": 0.5,
        "unit": "cup",
        "aisle": "Produce"
      },
      {
        "item": "olive oil",
        "qty": 3,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "balsamic vinegar",
        "qty": 2,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      }
    ],
    "steps": [
      "Cook the fusilli until al dente, then drain and cool.",
      "Halve the cherry tomatoes and cube the mozzarella.",
      "Combine pasta, tomatoes, mozzarella and torn basil.",
      "Dress with olive oil and balsamic vinegar.",
      "Toss gently and serve at room temperature."
    ]
  },
  {
    "id": "lnb-carnitas-taco-bowl",
    "name": "Pork Carnitas Taco Bowl",
    "mealTypes": [
      "lunch"
    ],
    "tags": [
      "high-protein",
      "gluten-free"
    ],
    "servings": 4,
    "calories": 630,
    "prepTime": 15,
    "cookTime": 25,
    "ingredients": [
      {
        "item": "pork shoulder",
        "qty": 1,
        "unit": "lb",
        "aisle": "Meat & Seafood"
      },
      {
        "item": "white rice",
        "qty": 1,
        "unit": "cup",
        "aisle": "Grains & Pasta"
      },
      {
        "item": "black beans",
        "qty": 1,
        "unit": "can",
        "aisle": "Canned Goods"
      },
      {
        "item": "lime",
        "qty": 2,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "cilantro",
        "qty": 0.5,
        "unit": "cup",
        "aisle": "Produce"
      },
      {
        "item": "ground cumin",
        "qty": 1,
        "unit": "tbsp",
        "aisle": "Spices"
      },
      {
        "item": "onion",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "vegetable oil",
        "qty": 2,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      }
    ],
    "steps": [
      "Cook rice according to package directions.",
      "Cut pork into chunks and brown in oil with onion and cumin.",
      "Add a splash of water and simmer until the pork is tender, then shred.",
      "Warm the black beans in a small pan.",
      "Build bowls with rice, beans and carnitas and finish with lime and cilantro."
    ]
  },
  {
    "id": "lnb-mezze-plate",
    "name": "Mediterranean Mezze Plate",
    "mealTypes": [
      "lunch"
    ],
    "tags": [
      "vegetarian",
      "no-cook"
    ],
    "servings": 2,
    "calories": 490,
    "prepTime": 15,
    "cookTime": 0,
    "ingredients": [
      {
        "item": "hummus",
        "qty": 0.75,
        "unit": "cup",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "baba ganoush",
        "qty": 0.5,
        "unit": "cup",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "pita bread",
        "qty": 2,
        "unit": "unit",
        "aisle": "Bakery"
      },
      {
        "item": "cucumber",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "cherry tomatoes",
        "qty": 1,
        "unit": "cup",
        "aisle": "Produce"
      },
      {
        "item": "kalamata olives",
        "qty": 0.5,
        "unit": "cup",
        "aisle": "Canned Goods"
      },
      {
        "item": "feta cheese",
        "qty": 3,
        "unit": "oz",
        "aisle": "Dairy & Eggs"
      }
    ],
    "steps": [
      "Spoon the hummus and baba ganoush into small dishes.",
      "Cut the cucumber into sticks and halve the tomatoes.",
      "Cut the pita bread into triangles.",
      "Arrange the dips, vegetables, olives and feta on a large plate.",
      "Serve as a shared mezze platter."
    ]
  },
  {
    "id": "lnb-egg-fried-rice",
    "name": "Vegetable Egg Fried Rice",
    "mealTypes": [
      "lunch"
    ],
    "tags": [
      "vegetarian",
      "quick",
      "kid-friendly"
    ],
    "servings": 3,
    "calories": 440,
    "prepTime": 8,
    "cookTime": 10,
    "ingredients": [
      {
        "item": "cooked rice",
        "qty": 3,
        "unit": "cup",
        "aisle": "Grains & Pasta"
      },
      {
        "item": "eggs",
        "qty": 3,
        "unit": "unit",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "frozen peas and carrots",
        "qty": 1,
        "unit": "cup",
        "aisle": "Other"
      },
      {
        "item": "soy sauce",
        "qty": 3,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "green onion",
        "qty": 2,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "sesame oil",
        "qty": 1,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "vegetable oil",
        "qty": 1,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      }
    ],
    "steps": [
      "Scramble the eggs in a hot oiled pan, then set aside.",
      "Add the cold rice and frozen vegetables and stir fry over high heat.",
      "Stir in soy sauce and sesame oil.",
      "Return the eggs and toss to combine.",
      "Top with sliced green onion and serve."
    ]
  },
  {
    "id": "lnb-cauliflower-rice-taco-bowl",
    "name": "Cauliflower Rice Taco Bowl",
    "mealTypes": [
      "lunch"
    ],
    "tags": [
      "vegetarian",
      "gluten-free",
      "low-carb"
    ],
    "servings": 2,
    "calories": 380,
    "prepTime": 12,
    "cookTime": 12,
    "ingredients": [
      {
        "item": "cauliflower rice",
        "qty": 3,
        "unit": "cup",
        "aisle": "Produce"
      },
      {
        "item": "black beans",
        "qty": 1,
        "unit": "can",
        "aisle": "Canned Goods"
      },
      {
        "item": "avocado",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "salsa",
        "qty": 0.5,
        "unit": "cup",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "cheddar cheese",
        "qty": 0.5,
        "unit": "cup",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "chili powder",
        "qty": 1,
        "unit": "tsp",
        "aisle": "Spices"
      },
      {
        "item": "olive oil",
        "qty": 1,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      }
    ],
    "steps": [
      "Saute the cauliflower rice in olive oil with chili powder until tender.",
      "Warm the black beans in a small pan.",
      "Divide the cauliflower rice between two bowls.",
      "Top with beans, sliced avocado, salsa and cheddar.",
      "Serve warm."
    ]
  },
  {
    "id": "dna-roast-chicken-thyme",
    "name": "Herb Roasted Chicken With Lemon",
    "mealTypes": [
      "dinner"
    ],
    "tags": [
      "high-protein",
      "gluten-free"
    ],
    "servings": 4,
    "calories": 620,
    "prepTime": 15,
    "cookTime": 75,
    "ingredients": [
      {
        "item": "whole chicken",
        "qty": 1,
        "unit": "unit",
        "aisle": "Meat & Seafood"
      },
      {
        "item": "lemon",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "fresh thyme",
        "qty": 2,
        "unit": "tbsp",
        "aisle": "Produce"
      },
      {
        "item": "garlic",
        "qty": 4,
        "unit": "clove",
        "aisle": "Produce"
      },
      {
        "item": "olive oil",
        "qty": 2,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "salt",
        "qty": 1,
        "unit": "tsp",
        "aisle": "Spices"
      }
    ],
    "steps": [
      "Heat the oven to 200C/400F and pat the chicken dry.",
      "Rub the skin with olive oil, salt, thyme and minced garlic.",
      "Stuff the cavity with halved lemon and roast for 75 minutes.",
      "Rest for 10 minutes before carving and serving."
    ]
  },
  {
    "id": "dna-grilled-chicken-fajitas",
    "name": "Grilled Chicken Fajitas",
    "mealTypes": [
      "dinner"
    ],
    "tags": [
      "high-protein",
      "dairy-free"
    ],
    "servings": 4,
    "calories": 540,
    "prepTime": 15,
    "cookTime": 15,
    "ingredients": [
      {
        "item": "chicken breast",
        "qty": 1.5,
        "unit": "lb",
        "aisle": "Meat & Seafood"
      },
      {
        "item": "bell pepper",
        "qty": 3,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "onion",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "flour tortillas",
        "qty": 8,
        "unit": "unit",
        "aisle": "Bakery"
      },
      {
        "item": "chili powder",
        "qty": 1,
        "unit": "tbsp",
        "aisle": "Spices"
      },
      {
        "item": "olive oil",
        "qty": 2,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      }
    ],
    "steps": [
      "Slice the chicken, peppers and onion into thin strips.",
      "Toss with olive oil and chili powder.",
      "Grill the chicken over high heat until charred and cooked through.",
      "Char the vegetables, then serve everything wrapped in warm tortillas."
    ]
  },
  {
    "id": "dna-chicken-parmesan",
    "name": "Crispy Chicken Parmesan",
    "mealTypes": [
      "dinner"
    ],
    "tags": [
      "high-protein",
      "kid-friendly"
    ],
    "servings": 4,
    "calories": 710,
    "prepTime": 20,
    "cookTime": 25,
    "ingredients": [
      {
        "item": "chicken breast",
        "qty": 4,
        "unit": "unit",
        "aisle": "Meat & Seafood"
      },
      {
        "item": "breadcrumbs",
        "qty": 1,
        "unit": "cup",
        "aisle": "Grains & Pasta"
      },
      {
        "item": "marinara sauce",
        "qty": 1,
        "unit": "can",
        "aisle": "Canned Goods"
      },
      {
        "item": "mozzarella",
        "qty": 1,
        "unit": "cup",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "parmesan",
        "qty": 0.5,
        "unit": "cup",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "egg",
        "qty": 2,
        "unit": "unit",
        "aisle": "Dairy & Eggs"
      }
    ],
    "steps": [
      "Dip each chicken breast in beaten egg then coat in breadcrumbs and parmesan.",
      "Pan fry until golden on both sides.",
      "Top with marinara and mozzarella, then bake at 200C/400F for 15 minutes.",
      "Serve hot over pasta or greens."
    ]
  },
  {
    "id": "dna-baked-lemon-herb-chicken",
    "name": "Baked Garlic Butter Chicken Thighs",
    "mealTypes": [
      "dinner"
    ],
    "tags": [
      "high-protein",
      "gluten-free",
      "low-carb"
    ],
    "servings": 4,
    "calories": 560,
    "prepTime": 10,
    "cookTime": 35,
    "ingredients": [
      {
        "item": "chicken thighs",
        "qty": 8,
        "unit": "unit",
        "aisle": "Meat & Seafood"
      },
      {
        "item": "butter",
        "qty": 3,
        "unit": "tbsp",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "garlic",
        "qty": 5,
        "unit": "clove",
        "aisle": "Produce"
      },
      {
        "item": "paprika",
        "qty": 1,
        "unit": "tsp",
        "aisle": "Spices"
      },
      {
        "item": "fresh parsley",
        "qty": 2,
        "unit": "tbsp",
        "aisle": "Produce"
      }
    ],
    "steps": [
      "Heat the oven to 200C/400F.",
      "Melt butter with minced garlic and paprika.",
      "Coat the thighs and arrange in a baking dish.",
      "Bake for 35 minutes until the skin is crisp and juices run clear.",
      "Scatter with parsley before serving."
    ]
  },
  {
    "id": "dna-turkey-meatballs",
    "name": "Baked Turkey Meatballs In Tomato Sauce",
    "mealTypes": [
      "dinner"
    ],
    "tags": [
      "high-protein",
      "dairy-free"
    ],
    "servings": 5,
    "calories": 480,
    "prepTime": 15,
    "cookTime": 30,
    "ingredients": [
      {
        "item": "ground turkey",
        "qty": 1.5,
        "unit": "lb",
        "aisle": "Meat & Seafood"
      },
      {
        "item": "breadcrumbs",
        "qty": 0.5,
        "unit": "cup",
        "aisle": "Grains & Pasta"
      },
      {
        "item": "egg",
        "qty": 1,
        "unit": "unit",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "crushed tomatoes",
        "qty": 1,
        "unit": "can",
        "aisle": "Canned Goods"
      },
      {
        "item": "garlic",
        "qty": 3,
        "unit": "clove",
        "aisle": "Produce"
      },
      {
        "item": "oregano",
        "qty": 1,
        "unit": "tsp",
        "aisle": "Spices"
      }
    ],
    "steps": [
      "Mix turkey, breadcrumbs, egg, garlic and oregano and roll into balls.",
      "Brown the meatballs in a skillet.",
      "Pour over crushed tomatoes and simmer for 20 minutes.",
      "Serve over rice or pasta."
    ]
  },
  {
    "id": "dna-turkey-chili",
    "name": "Hearty Turkey And Bean Chili",
    "mealTypes": [
      "dinner"
    ],
    "tags": [
      "high-protein",
      "gluten-free",
      "batch-cook",
      "dairy-free"
    ],
    "servings": 6,
    "calories": 450,
    "prepTime": 15,
    "cookTime": 45,
    "ingredients": [
      {
        "item": "ground turkey",
        "qty": 1.5,
        "unit": "lb",
        "aisle": "Meat & Seafood"
      },
      {
        "item": "kidney beans",
        "qty": 2,
        "unit": "can",
        "aisle": "Canned Goods"
      },
      {
        "item": "diced tomatoes",
        "qty": 1,
        "unit": "can",
        "aisle": "Canned Goods"
      },
      {
        "item": "onion",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "chili powder",
        "qty": 2,
        "unit": "tbsp",
        "aisle": "Spices"
      },
      {
        "item": "cumin",
        "qty": 1,
        "unit": "tsp",
        "aisle": "Spices"
      }
    ],
    "steps": [
      "Brown the turkey with diced onion in a large pot.",
      "Stir in chili powder and cumin.",
      "Add beans and tomatoes and simmer for 40 minutes.",
      "Season to taste and serve hot."
    ]
  },
  {
    "id": "dna-pan-seared-steak",
    "name": "Pan Seared Steak With Garlic Butter",
    "mealTypes": [
      "dinner"
    ],
    "tags": [
      "high-protein",
      "gluten-free",
      "low-carb",
      "quick"
    ],
    "servings": 2,
    "calories": 680,
    "prepTime": 5,
    "cookTime": 12,
    "ingredients": [
      {
        "item": "ribeye steak",
        "qty": 2,
        "unit": "unit",
        "aisle": "Meat & Seafood"
      },
      {
        "item": "butter",
        "qty": 2,
        "unit": "tbsp",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "garlic",
        "qty": 2,
        "unit": "clove",
        "aisle": "Produce"
      },
      {
        "item": "fresh rosemary",
        "qty": 1,
        "unit": "tbsp",
        "aisle": "Produce"
      },
      {
        "item": "salt",
        "qty": 1,
        "unit": "tsp",
        "aisle": "Spices"
      }
    ],
    "steps": [
      "Season the steaks generously and heat a skillet until smoking.",
      "Sear each side for 3 minutes for medium rare.",
      "Add butter, garlic and rosemary and baste the steaks.",
      "Rest for 5 minutes before slicing."
    ]
  },
  {
    "id": "dna-beef-meatballs",
    "name": "Classic Italian Beef Meatballs",
    "mealTypes": [
      "dinner"
    ],
    "tags": [
      "high-protein",
      "kid-friendly"
    ],
    "servings": 5,
    "calories": 590,
    "prepTime": 20,
    "cookTime": 25,
    "ingredients": [
      {
        "item": "ground beef",
        "qty": 1.5,
        "unit": "lb",
        "aisle": "Meat & Seafood"
      },
      {
        "item": "breadcrumbs",
        "qty": 0.5,
        "unit": "cup",
        "aisle": "Grains & Pasta"
      },
      {
        "item": "parmesan",
        "qty": 0.5,
        "unit": "cup",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "egg",
        "qty": 1,
        "unit": "unit",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "marinara sauce",
        "qty": 1,
        "unit": "can",
        "aisle": "Canned Goods"
      },
      {
        "item": "garlic",
        "qty": 3,
        "unit": "clove",
        "aisle": "Produce"
      }
    ],
    "steps": [
      "Combine beef, breadcrumbs, parmesan, egg and garlic.",
      "Form into balls and brown in a hot skillet.",
      "Simmer the meatballs in marinara for 20 minutes.",
      "Serve over spaghetti with extra parmesan."
    ]
  },
  {
    "id": "dna-pork-chops-apple",
    "name": "Skillet Pork Chops With Apples",
    "mealTypes": [
      "dinner"
    ],
    "tags": [
      "high-protein",
      "gluten-free",
      "dairy-free"
    ],
    "servings": 4,
    "calories": 570,
    "prepTime": 10,
    "cookTime": 25,
    "ingredients": [
      {
        "item": "pork chops",
        "qty": 4,
        "unit": "unit",
        "aisle": "Meat & Seafood"
      },
      {
        "item": "apple",
        "qty": 2,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "onion",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "apple cider",
        "qty": 1,
        "unit": "cup",
        "aisle": "Other"
      },
      {
        "item": "olive oil",
        "qty": 2,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "thyme",
        "qty": 1,
        "unit": "tsp",
        "aisle": "Spices"
      }
    ],
    "steps": [
      "Sear the seasoned pork chops in olive oil until browned, then set aside.",
      "Saute sliced apple and onion in the same pan.",
      "Pour in cider and thyme and simmer to reduce.",
      "Return the chops and cook through, then serve."
    ]
  },
  {
    "id": "dna-beef-stew",
    "name": "Rustic Beef And Vegetable Stew",
    "mealTypes": [
      "dinner"
    ],
    "tags": [
      "high-protein",
      "batch-cook",
      "dairy-free"
    ],
    "servings": 6,
    "calories": 520,
    "prepTime": 20,
    "cookTime": 120,
    "ingredients": [
      {
        "item": "beef chuck",
        "qty": 2,
        "unit": "lb",
        "aisle": "Meat & Seafood"
      },
      {
        "item": "carrot",
        "qty": 4,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "potato",
        "qty": 4,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "onion",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "beef broth",
        "qty": 4,
        "unit": "cup",
        "aisle": "Canned Goods"
      },
      {
        "item": "tomato paste",
        "qty": 2,
        "unit": "tbsp",
        "aisle": "Canned Goods"
      }
    ],
    "steps": [
      "Brown the cubed beef in batches in a heavy pot.",
      "Add chopped onion, carrot and potato.",
      "Stir in tomato paste and broth.",
      "Cover and simmer for 2 hours until the beef is tender.",
      "Season and serve with crusty bread."
    ]
  },
  {
    "id": "dna-beef-bolognese",
    "name": "Slow Simmered Beef Bolognese",
    "mealTypes": [
      "dinner"
    ],
    "tags": [
      "high-protein",
      "batch-cook"
    ],
    "servings": 6,
    "calories": 610,
    "prepTime": 15,
    "cookTime": 90,
    "ingredients": [
      {
        "item": "ground beef",
        "qty": 1.5,
        "unit": "lb",
        "aisle": "Meat & Seafood"
      },
      {
        "item": "crushed tomatoes",
        "qty": 2,
        "unit": "can",
        "aisle": "Canned Goods"
      },
      {
        "item": "carrot",
        "qty": 2,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "celery",
        "qty": 2,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "onion",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "spaghetti",
        "qty": 1,
        "unit": "lb",
        "aisle": "Grains & Pasta"
      }
    ],
    "steps": [
      "Saute finely chopped carrot, celery and onion until soft.",
      "Add the beef and brown thoroughly.",
      "Pour in crushed tomatoes and simmer gently for 90 minutes.",
      "Cook the spaghetti and toss with the sauce."
    ]
  },
  {
    "id": "dna-pork-carnitas",
    "name": "Slow Cooked Pork Carnitas",
    "mealTypes": [
      "dinner"
    ],
    "tags": [
      "high-protein",
      "gluten-free",
      "batch-cook",
      "dairy-free"
    ],
    "servings": 6,
    "calories": 550,
    "prepTime": 15,
    "cookTime": 180,
    "ingredients": [
      {
        "item": "pork shoulder",
        "qty": 3,
        "unit": "lb",
        "aisle": "Meat & Seafood"
      },
      {
        "item": "orange",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "onion",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "cumin",
        "qty": 1,
        "unit": "tbsp",
        "aisle": "Spices"
      },
      {
        "item": "garlic",
        "qty": 4,
        "unit": "clove",
        "aisle": "Produce"
      },
      {
        "item": "chicken broth",
        "qty": 1,
        "unit": "cup",
        "aisle": "Canned Goods"
      }
    ],
    "steps": [
      "Rub the pork with cumin, salt and minced garlic.",
      "Place in a pot with onion, orange juice and broth.",
      "Cover and cook low for 3 hours until fork tender.",
      "Shred the pork and crisp under the broiler before serving."
    ]
  },
  {
    "id": "dna-classic-lasagna",
    "name": "Classic Beef Lasagna",
    "mealTypes": [
      "dinner"
    ],
    "tags": [
      "high-protein",
      "kid-friendly",
      "batch-cook"
    ],
    "servings": 6,
    "calories": 720,
    "prepTime": 30,
    "cookTime": 50,
    "ingredients": [
      {
        "item": "lasagna noodles",
        "qty": 12,
        "unit": "unit",
        "aisle": "Grains & Pasta"
      },
      {
        "item": "ground beef",
        "qty": 1,
        "unit": "lb",
        "aisle": "Meat & Seafood"
      },
      {
        "item": "ricotta",
        "qty": 2,
        "unit": "cup",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "mozzarella",
        "qty": 2,
        "unit": "cup",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "marinara sauce",
        "qty": 2,
        "unit": "can",
        "aisle": "Canned Goods"
      },
      {
        "item": "egg",
        "qty": 1,
        "unit": "unit",
        "aisle": "Dairy & Eggs"
      }
    ],
    "steps": [
      "Brown the beef and stir in marinara sauce.",
      "Mix ricotta with egg.",
      "Layer noodles, meat sauce, ricotta and mozzarella in a baking dish.",
      "Bake at 190C/375F for 50 minutes until bubbling.",
      "Rest for 15 minutes before slicing."
    ]
  },
  {
    "id": "dna-spaghetti-carbonara",
    "name": "Spaghetti Carbonara",
    "mealTypes": [
      "dinner"
    ],
    "tags": [
      "high-protein"
    ],
    "servings": 4,
    "calories": 640,
    "prepTime": 10,
    "cookTime": 15,
    "ingredients": [
      {
        "item": "spaghetti",
        "qty": 1,
        "unit": "lb",
        "aisle": "Grains & Pasta"
      },
      {
        "item": "pancetta",
        "qty": 6,
        "unit": "oz",
        "aisle": "Meat & Seafood"
      },
      {
        "item": "egg",
        "qty": 4,
        "unit": "unit",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "parmesan",
        "qty": 1,
        "unit": "cup",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "black pepper",
        "qty": 1,
        "unit": "tsp",
        "aisle": "Spices"
      }
    ],
    "steps": [
      "Cook the spaghetti in salted water until al dente.",
      "Crisp the pancetta in a skillet.",
      "Whisk eggs with parmesan and black pepper.",
      "Toss hot drained pasta with pancetta then stir in the egg mixture off the heat.",
      "Loosen with pasta water and serve immediately."
    ]
  },
  {
    "id": "dna-pesto-pasta-chicken",
    "name": "Chicken Pesto Pasta",
    "mealTypes": [
      "dinner"
    ],
    "tags": [
      "high-protein",
      "quick"
    ],
    "servings": 4,
    "calories": 600,
    "prepTime": 10,
    "cookTime": 10,
    "ingredients": [
      {
        "item": "penne",
        "qty": 1,
        "unit": "lb",
        "aisle": "Grains & Pasta"
      },
      {
        "item": "cooked chicken",
        "qty": 2,
        "unit": "cup",
        "aisle": "Meat & Seafood"
      },
      {
        "item": "basil pesto",
        "qty": 0.5,
        "unit": "cup",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "cherry tomatoes",
        "qty": 1,
        "unit": "cup",
        "aisle": "Produce"
      },
      {
        "item": "parmesan",
        "qty": 0.5,
        "unit": "cup",
        "aisle": "Dairy & Eggs"
      }
    ],
    "steps": [
      "Boil the penne until al dente and drain.",
      "Toss the hot pasta with pesto and shredded chicken.",
      "Fold in halved cherry tomatoes.",
      "Top with parmesan and serve."
    ]
  },
  {
    "id": "dna-baked-ziti",
    "name": "Cheesy Baked Ziti",
    "mealTypes": [
      "dinner"
    ],
    "tags": [
      "vegetarian",
      "kid-friendly",
      "batch-cook"
    ],
    "servings": 6,
    "calories": 630,
    "prepTime": 20,
    "cookTime": 35,
    "ingredients": [
      {
        "item": "ziti",
        "qty": 1,
        "unit": "lb",
        "aisle": "Grains & Pasta"
      },
      {
        "item": "marinara sauce",
        "qty": 2,
        "unit": "can",
        "aisle": "Canned Goods"
      },
      {
        "item": "ricotta",
        "qty": 2,
        "unit": "cup",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "mozzarella",
        "qty": 2,
        "unit": "cup",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "parmesan",
        "qty": 0.5,
        "unit": "cup",
        "aisle": "Dairy & Eggs"
      }
    ],
    "steps": [
      "Cook the ziti until just shy of al dente.",
      "Mix pasta with marinara and ricotta.",
      "Spread into a dish and top with mozzarella and parmesan.",
      "Bake at 190C/375F for 35 minutes until golden."
    ]
  },
  {
    "id": "dna-fettuccine-alfredo",
    "name": "Creamy Fettuccine Alfredo",
    "mealTypes": [
      "dinner"
    ],
    "tags": [
      "vegetarian",
      "quick",
      "kid-friendly"
    ],
    "servings": 4,
    "calories": 700,
    "prepTime": 5,
    "cookTime": 15,
    "ingredients": [
      {
        "item": "fettuccine",
        "qty": 1,
        "unit": "lb",
        "aisle": "Grains & Pasta"
      },
      {
        "item": "butter",
        "qty": 4,
        "unit": "tbsp",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "heavy cream",
        "qty": 1,
        "unit": "cup",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "parmesan",
        "qty": 1.5,
        "unit": "cup",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "garlic",
        "qty": 2,
        "unit": "clove",
        "aisle": "Produce"
      }
    ],
    "steps": [
      "Cook the fettuccine until al dente.",
      "Melt butter with garlic, then add cream and simmer.",
      "Whisk in parmesan until smooth.",
      "Toss the pasta in the sauce and serve at once."
    ]
  },
  {
    "id": "dna-shepherds-pie",
    "name": "Traditional Shepherds Pie",
    "mealTypes": [
      "dinner"
    ],
    "tags": [
      "high-protein",
      "kid-friendly",
      "batch-cook"
    ],
    "servings": 6,
    "calories": 590,
    "prepTime": 25,
    "cookTime": 40,
    "ingredients": [
      {
        "item": "ground lamb",
        "qty": 1.5,
        "unit": "lb",
        "aisle": "Meat & Seafood"
      },
      {
        "item": "potato",
        "qty": 5,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "carrot",
        "qty": 2,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "frozen peas",
        "qty": 1,
        "unit": "cup",
        "aisle": "Other"
      },
      {
        "item": "beef broth",
        "qty": 1,
        "unit": "cup",
        "aisle": "Canned Goods"
      },
      {
        "item": "butter",
        "qty": 3,
        "unit": "tbsp",
        "aisle": "Dairy & Eggs"
      }
    ],
    "steps": [
      "Boil and mash the potatoes with butter.",
      "Brown the lamb with carrot, then add peas and broth.",
      "Spread the meat into a dish and top with mashed potato.",
      "Bake at 200C/400F for 25 minutes until the top is golden."
    ]
  },
  {
    "id": "dna-pot-roast",
    "name": "Sunday Pot Roast",
    "mealTypes": [
      "dinner"
    ],
    "tags": [
      "high-protein",
      "gluten-free",
      "batch-cook",
      "dairy-free"
    ],
    "servings": 6,
    "calories": 560,
    "prepTime": 20,
    "cookTime": 180,
    "ingredients": [
      {
        "item": "beef chuck roast",
        "qty": 3,
        "unit": "lb",
        "aisle": "Meat & Seafood"
      },
      {
        "item": "carrot",
        "qty": 4,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "potato",
        "qty": 4,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "onion",
        "qty": 2,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "beef broth",
        "qty": 3,
        "unit": "cup",
        "aisle": "Canned Goods"
      },
      {
        "item": "garlic",
        "qty": 4,
        "unit": "clove",
        "aisle": "Produce"
      }
    ],
    "steps": [
      "Sear the roast on all sides in a heavy pot.",
      "Add onion, carrot, potato, garlic and broth.",
      "Cover and braise at 160C/325F for 3 hours.",
      "Slice the beef and serve with the vegetables and pan juices."
    ]
  },
  {
    "id": "dna-mac-and-cheese",
    "name": "Baked Three Cheese Macaroni",
    "mealTypes": [
      "dinner"
    ],
    "tags": [
      "vegetarian",
      "kid-friendly",
      "batch-cook"
    ],
    "servings": 6,
    "calories": 680,
    "prepTime": 15,
    "cookTime": 30,
    "ingredients": [
      {
        "item": "elbow macaroni",
        "qty": 1,
        "unit": "lb",
        "aisle": "Grains & Pasta"
      },
      {
        "item": "cheddar",
        "qty": 2,
        "unit": "cup",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "gruyere",
        "qty": 1,
        "unit": "cup",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "milk",
        "qty": 2,
        "unit": "cup",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "butter",
        "qty": 3,
        "unit": "tbsp",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "flour",
        "qty": 3,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      }
    ],
    "steps": [
      "Cook the macaroni until al dente.",
      "Make a roux with butter and flour, then whisk in milk.",
      "Stir in the cheeses until smooth and combine with the pasta.",
      "Bake at 190C/375F for 25 minutes until bubbling and golden."
    ]
  },
  {
    "id": "dna-chicken-pot-pie",
    "name": "Homestyle Chicken Pot Pie",
    "mealTypes": [
      "dinner"
    ],
    "tags": [
      "high-protein",
      "kid-friendly"
    ],
    "servings": 6,
    "calories": 650,
    "prepTime": 25,
    "cookTime": 40,
    "ingredients": [
      {
        "item": "cooked chicken",
        "qty": 3,
        "unit": "cup",
        "aisle": "Meat & Seafood"
      },
      {
        "item": "mixed vegetables",
        "qty": 2,
        "unit": "cup",
        "aisle": "Other"
      },
      {
        "item": "pie crust",
        "qty": 2,
        "unit": "unit",
        "aisle": "Bakery"
      },
      {
        "item": "butter",
        "qty": 4,
        "unit": "tbsp",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "flour",
        "qty": 4,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "chicken broth",
        "qty": 2,
        "unit": "cup",
        "aisle": "Canned Goods"
      }
    ],
    "steps": [
      "Make a roux with butter and flour, then whisk in broth to thicken.",
      "Stir in the chicken and vegetables.",
      "Line a dish with one crust, add the filling and top with the second crust.",
      "Bake at 200C/400F for 40 minutes until golden."
    ]
  },
  {
    "id": "dna-beef-tacos",
    "name": "Weeknight Ground Beef Tacos",
    "mealTypes": [
      "dinner"
    ],
    "tags": [
      "high-protein",
      "quick",
      "kid-friendly"
    ],
    "servings": 4,
    "calories": 520,
    "prepTime": 10,
    "cookTime": 10,
    "ingredients": [
      {
        "item": "ground beef",
        "qty": 1,
        "unit": "lb",
        "aisle": "Meat & Seafood"
      },
      {
        "item": "taco shells",
        "qty": 8,
        "unit": "unit",
        "aisle": "Grains & Pasta"
      },
      {
        "item": "cheddar",
        "qty": 1,
        "unit": "cup",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "lettuce",
        "qty": 2,
        "unit": "cup",
        "aisle": "Produce"
      },
      {
        "item": "taco seasoning",
        "qty": 2,
        "unit": "tbsp",
        "aisle": "Spices"
      }
    ],
    "steps": [
      "Brown the beef and drain excess fat.",
      "Stir in taco seasoning with a splash of water.",
      "Warm the taco shells.",
      "Fill the shells with beef, cheese and lettuce."
    ]
  },
  {
    "id": "dna-chicken-stir-fry",
    "name": "Ginger Chicken Stir Fry",
    "mealTypes": [
      "dinner"
    ],
    "tags": [
      "high-protein",
      "quick",
      "dairy-free"
    ],
    "servings": 4,
    "calories": 490,
    "prepTime": 10,
    "cookTime": 10,
    "ingredients": [
      {
        "item": "chicken breast",
        "qty": 1,
        "unit": "lb",
        "aisle": "Meat & Seafood"
      },
      {
        "item": "broccoli",
        "qty": 3,
        "unit": "cup",
        "aisle": "Produce"
      },
      {
        "item": "soy sauce",
        "qty": 3,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "ginger",
        "qty": 1,
        "unit": "tbsp",
        "aisle": "Produce"
      },
      {
        "item": "garlic",
        "qty": 2,
        "unit": "clove",
        "aisle": "Produce"
      },
      {
        "item": "sesame oil",
        "qty": 1,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      }
    ],
    "steps": [
      "Slice the chicken and stir fry in sesame oil over high heat.",
      "Add broccoli, ginger and garlic.",
      "Pour in soy sauce and toss until glossy.",
      "Serve over steamed rice."
    ]
  },
  {
    "id": "dna-bbq-pulled-pork",
    "name": "Barbecue Pulled Pork Sandwiches",
    "mealTypes": [
      "dinner"
    ],
    "tags": [
      "high-protein",
      "batch-cook",
      "dairy-free"
    ],
    "servings": 6,
    "calories": 620,
    "prepTime": 15,
    "cookTime": 240,
    "ingredients": [
      {
        "item": "pork shoulder",
        "qty": 3,
        "unit": "lb",
        "aisle": "Meat & Seafood"
      },
      {
        "item": "barbecue sauce",
        "qty": 1,
        "unit": "cup",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "brown sugar",
        "qty": 2,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "paprika",
        "qty": 1,
        "unit": "tbsp",
        "aisle": "Spices"
      },
      {
        "item": "burger buns",
        "qty": 6,
        "unit": "unit",
        "aisle": "Bakery"
      }
    ],
    "steps": [
      "Rub the pork with brown sugar and paprika.",
      "Slow cook covered for 4 hours until it shreds easily.",
      "Shred the pork and toss with barbecue sauce.",
      "Pile onto toasted buns and serve."
    ]
  },
  {
    "id": "dna-chicken-parmesan-2",
    "name": "Chicken Parmesan",
    "mealTypes": [
      "dinner"
    ],
    "tags": [
      "high-protein",
      "kid-friendly"
    ],
    "servings": 4,
    "calories": 610,
    "prepTime": 20,
    "cookTime": 30,
    "ingredients": [
      {
        "item": "chicken breast",
        "qty": 4,
        "unit": "unit",
        "aisle": "Meat & Seafood"
      },
      {
        "item": "breadcrumbs",
        "qty": 1,
        "unit": "cup",
        "aisle": "Grains & Pasta"
      },
      {
        "item": "egg",
        "qty": 2,
        "unit": "unit",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "marinara sauce",
        "qty": 1,
        "unit": "can",
        "aisle": "Canned Goods"
      },
      {
        "item": "mozzarella",
        "qty": 1.5,
        "unit": "cup",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "parmesan",
        "qty": 0.5,
        "unit": "cup",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "spaghetti",
        "qty": 400,
        "unit": "g",
        "aisle": "Grains & Pasta"
      }
    ],
    "steps": [
      "Pound the chicken breasts thin, dip in beaten egg and coat in breadcrumbs mixed with parmesan.",
      "Pan-fry the cutlets until golden on both sides, about 3 minutes per side.",
      "Top each cutlet with marinara and mozzarella in a baking dish.",
      "Bake at 200C/400F for 20 minutes until the cheese is melted and bubbling.",
      "Serve over cooked spaghetti with extra sauce."
    ]
  },
  {
    "id": "dnb-honey-garlic-salmon",
    "name": "Honey Garlic Glazed Salmon",
    "mealTypes": [
      "dinner"
    ],
    "tags": [
      "pescatarian",
      "high-protein",
      "gluten-free"
    ],
    "servings": 4,
    "calories": 520,
    "prepTime": 10,
    "cookTime": 15,
    "ingredients": [
      {
        "item": "salmon fillets",
        "qty": 4,
        "unit": "unit",
        "aisle": "Meat & Seafood"
      },
      {
        "item": "honey",
        "qty": 3,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "garlic",
        "qty": 3,
        "unit": "clove",
        "aisle": "Produce"
      },
      {
        "item": "soy sauce",
        "qty": 2,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "lemon",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "olive oil",
        "qty": 1,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      }
    ],
    "steps": [
      "Whisk honey, minced garlic, soy sauce and lemon juice into a glaze.",
      "Sear salmon in olive oil skin side down for 4 minutes.",
      "Flip, pour glaze over and cook 4 more minutes basting often.",
      "Rest 2 minutes then spoon pan sauce over the fillets."
    ]
  },
  {
    "id": "dnb-garlic-butter-shrimp",
    "name": "Garlic Butter Shrimp Skillet",
    "mealTypes": [
      "dinner"
    ],
    "tags": [
      "pescatarian",
      "high-protein",
      "quick",
      "low-carb"
    ],
    "servings": 4,
    "calories": 430,
    "prepTime": 8,
    "cookTime": 10,
    "ingredients": [
      {
        "item": "shrimp",
        "qty": 1.5,
        "unit": "lb",
        "aisle": "Meat & Seafood"
      },
      {
        "item": "butter",
        "qty": 3,
        "unit": "tbsp",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "garlic",
        "qty": 4,
        "unit": "clove",
        "aisle": "Produce"
      },
      {
        "item": "parsley",
        "qty": 0.25,
        "unit": "cup",
        "aisle": "Produce"
      },
      {
        "item": "lemon",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "red pepper flakes",
        "qty": 0.5,
        "unit": "tsp",
        "aisle": "Spices"
      }
    ],
    "steps": [
      "Melt butter in a skillet over medium high heat.",
      "Add garlic and red pepper flakes and cook 30 seconds.",
      "Add shrimp and cook 2 minutes per side until pink.",
      "Finish with lemon juice and chopped parsley."
    ]
  },
  {
    "id": "dnb-baked-cod-tomato",
    "name": "Mediterranean Baked Cod",
    "mealTypes": [
      "dinner"
    ],
    "tags": [
      "pescatarian",
      "high-protein",
      "gluten-free"
    ],
    "servings": 4,
    "calories": 410,
    "prepTime": 12,
    "cookTime": 20,
    "ingredients": [
      {
        "item": "cod fillets",
        "qty": 4,
        "unit": "unit",
        "aisle": "Meat & Seafood"
      },
      {
        "item": "cherry tomatoes",
        "qty": 2,
        "unit": "cup",
        "aisle": "Produce"
      },
      {
        "item": "kalamata olives",
        "qty": 0.5,
        "unit": "cup",
        "aisle": "Canned Goods"
      },
      {
        "item": "capers",
        "qty": 2,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "olive oil",
        "qty": 2,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "oregano",
        "qty": 1,
        "unit": "tsp",
        "aisle": "Spices"
      }
    ],
    "steps": [
      "Heat oven to 200C/400F.",
      "Arrange cod in a baking dish and surround with tomatoes and olives.",
      "Drizzle with olive oil, scatter capers and oregano, and season.",
      "Bake 20 minutes until fish flakes easily."
    ]
  },
  {
    "id": "dnb-seared-tuna-sesame",
    "name": "Sesame Crusted Seared Tuna",
    "mealTypes": [
      "dinner"
    ],
    "tags": [
      "pescatarian",
      "high-protein",
      "quick",
      "dairy-free"
    ],
    "servings": 2,
    "calories": 450,
    "prepTime": 10,
    "cookTime": 6,
    "ingredients": [
      {
        "item": "tuna steaks",
        "qty": 2,
        "unit": "unit",
        "aisle": "Meat & Seafood"
      },
      {
        "item": "sesame seeds",
        "qty": 0.33,
        "unit": "cup",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "soy sauce",
        "qty": 2,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "sesame oil",
        "qty": 1,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "ginger",
        "qty": 1,
        "unit": "tbsp",
        "aisle": "Produce"
      }
    ],
    "steps": [
      "Press tuna steaks into sesame seeds to coat all sides.",
      "Heat sesame oil in a pan over high heat until shimmering.",
      "Sear tuna 90 seconds per side leaving centers rare.",
      "Slice thin and serve with soy sauce and grated ginger."
    ]
  },
  {
    "id": "dnb-fish-tacos-slaw",
    "name": "Crispy Fish Tacos With Lime Slaw",
    "mealTypes": [
      "dinner"
    ],
    "tags": [
      "pescatarian",
      "kid-friendly"
    ],
    "servings": 4,
    "calories": 560,
    "prepTime": 15,
    "cookTime": 12,
    "ingredients": [
      {
        "item": "white fish fillets",
        "qty": 1,
        "unit": "lb",
        "aisle": "Meat & Seafood"
      },
      {
        "item": "corn tortillas",
        "qty": 8,
        "unit": "unit",
        "aisle": "Bakery"
      },
      {
        "item": "cabbage",
        "qty": 2,
        "unit": "cup",
        "aisle": "Produce"
      },
      {
        "item": "lime",
        "qty": 2,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "sour cream",
        "qty": 0.5,
        "unit": "cup",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "chili powder",
        "qty": 1,
        "unit": "tbsp",
        "aisle": "Spices"
      }
    ],
    "steps": [
      "Toss shredded cabbage with lime juice and a pinch of salt.",
      "Season fish with chili powder and pan fry 3 minutes per side.",
      "Warm tortillas in a dry skillet.",
      "Flake fish into tortillas and top with slaw and sour cream."
    ]
  },
  {
    "id": "dnb-seafood-linguine",
    "name": "Garlicky Seafood Linguine",
    "mealTypes": [
      "dinner"
    ],
    "tags": [
      "pescatarian",
      "high-protein"
    ],
    "servings": 4,
    "calories": 610,
    "prepTime": 15,
    "cookTime": 20,
    "ingredients": [
      {
        "item": "linguine",
        "qty": 12,
        "unit": "oz",
        "aisle": "Grains & Pasta"
      },
      {
        "item": "shrimp",
        "qty": 0.5,
        "unit": "lb",
        "aisle": "Meat & Seafood"
      },
      {
        "item": "mussels",
        "qty": 1,
        "unit": "lb",
        "aisle": "Meat & Seafood"
      },
      {
        "item": "garlic",
        "qty": 4,
        "unit": "clove",
        "aisle": "Produce"
      },
      {
        "item": "white wine",
        "qty": 0.5,
        "unit": "cup",
        "aisle": "Other"
      },
      {
        "item": "cherry tomatoes",
        "qty": 1,
        "unit": "cup",
        "aisle": "Produce"
      },
      {
        "item": "olive oil",
        "qty": 3,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      }
    ],
    "steps": [
      "Cook linguine until al dente and reserve some pasta water.",
      "Saute garlic in olive oil then add tomatoes and wine.",
      "Add mussels and shrimp, cover and steam until shells open.",
      "Toss with pasta and a splash of pasta water to coat."
    ]
  },
  {
    "id": "dnb-quinoa-stuffed-peppers",
    "name": "Quinoa Stuffed Bell Peppers",
    "mealTypes": [
      "dinner"
    ],
    "tags": [
      "vegetarian",
      "gluten-free",
      "high-protein"
    ],
    "servings": 4,
    "calories": 480,
    "prepTime": 15,
    "cookTime": 35,
    "ingredients": [
      {
        "item": "bell peppers",
        "qty": 4,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "quinoa",
        "qty": 1,
        "unit": "cup",
        "aisle": "Grains & Pasta"
      },
      {
        "item": "black beans",
        "qty": 1,
        "unit": "can",
        "aisle": "Canned Goods"
      },
      {
        "item": "corn",
        "qty": 1,
        "unit": "cup",
        "aisle": "Produce"
      },
      {
        "item": "shredded cheese",
        "qty": 1,
        "unit": "cup",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "cumin",
        "qty": 1,
        "unit": "tsp",
        "aisle": "Spices"
      }
    ],
    "steps": [
      "Heat oven to 190C/375F and halve and seed the peppers.",
      "Cook quinoa then mix with beans, corn and cumin.",
      "Fill peppers with the mixture and top with cheese.",
      "Bake 35 minutes until peppers are tender and cheese melts."
    ]
  },
  {
    "id": "dnb-eggplant-parmesan",
    "name": "Baked Eggplant Parmesan",
    "mealTypes": [
      "dinner"
    ],
    "tags": [
      "vegetarian"
    ],
    "servings": 6,
    "calories": 540,
    "prepTime": 20,
    "cookTime": 40,
    "ingredients": [
      {
        "item": "eggplant",
        "qty": 2,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "marinara sauce",
        "qty": 3,
        "unit": "cup",
        "aisle": "Canned Goods"
      },
      {
        "item": "mozzarella",
        "qty": 2,
        "unit": "cup",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "parmesan",
        "qty": 0.5,
        "unit": "cup",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "breadcrumbs",
        "qty": 1.5,
        "unit": "cup",
        "aisle": "Bakery"
      },
      {
        "item": "eggs",
        "qty": 2,
        "unit": "unit",
        "aisle": "Dairy & Eggs"
      }
    ],
    "steps": [
      "Heat oven to 200C/400F and slice eggplant into rounds.",
      "Dip slices in beaten egg then breadcrumbs and bake 20 minutes.",
      "Layer eggplant, marinara and mozzarella in a dish.",
      "Top with parmesan and bake 20 minutes until bubbling."
    ]
  },
  {
    "id": "dnb-coconut-veggie-curry",
    "name": "Coconut Vegetable Curry",
    "mealTypes": [
      "dinner"
    ],
    "tags": [
      "vegan",
      "vegetarian",
      "gluten-free",
      "dairy-free"
    ],
    "servings": 4,
    "calories": 460,
    "prepTime": 15,
    "cookTime": 25,
    "ingredients": [
      {
        "item": "coconut milk",
        "qty": 1,
        "unit": "can",
        "aisle": "Canned Goods"
      },
      {
        "item": "cauliflower",
        "qty": 2,
        "unit": "cup",
        "aisle": "Produce"
      },
      {
        "item": "chickpeas",
        "qty": 1,
        "unit": "can",
        "aisle": "Canned Goods"
      },
      {
        "item": "spinach",
        "qty": 2,
        "unit": "cup",
        "aisle": "Produce"
      },
      {
        "item": "curry powder",
        "qty": 2,
        "unit": "tbsp",
        "aisle": "Spices"
      },
      {
        "item": "onion",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "garlic",
        "qty": 3,
        "unit": "clove",
        "aisle": "Produce"
      }
    ],
    "steps": [
      "Saute onion and garlic until soft.",
      "Stir in curry powder and cook until fragrant.",
      "Add coconut milk, cauliflower and chickpeas and simmer 20 minutes.",
      "Fold in spinach until wilted and season to taste."
    ]
  },
  {
    "id": "dnb-crispy-tofu-bowl",
    "name": "Crispy Peanut Tofu Bowl",
    "mealTypes": [
      "dinner"
    ],
    "tags": [
      "vegan",
      "vegetarian",
      "high-protein",
      "dairy-free"
    ],
    "servings": 4,
    "calories": 520,
    "prepTime": 15,
    "cookTime": 20,
    "ingredients": [
      {
        "item": "firm tofu",
        "qty": 1,
        "unit": "block",
        "aisle": "Other"
      },
      {
        "item": "peanut butter",
        "qty": 3,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "soy sauce",
        "qty": 3,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "rice",
        "qty": 1,
        "unit": "cup",
        "aisle": "Grains & Pasta"
      },
      {
        "item": "broccoli",
        "qty": 2,
        "unit": "cup",
        "aisle": "Produce"
      },
      {
        "item": "cornstarch",
        "qty": 2,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      }
    ],
    "steps": [
      "Cube tofu, toss with cornstarch and bake at 220C/425F for 20 minutes.",
      "Whisk peanut butter and soy sauce with a little water into a sauce.",
      "Steam broccoli and cook the rice.",
      "Build bowls with rice, tofu and broccoli then drizzle with peanut sauce."
    ]
  },
  {
    "id": "dnb-smoky-bean-chili",
    "name": "Smoky Three Bean Chili",
    "mealTypes": [
      "dinner"
    ],
    "tags": [
      "vegan",
      "vegetarian",
      "gluten-free",
      "batch-cook"
    ],
    "servings": 6,
    "calories": 430,
    "prepTime": 15,
    "cookTime": 40,
    "ingredients": [
      {
        "item": "kidney beans",
        "qty": 1,
        "unit": "can",
        "aisle": "Canned Goods"
      },
      {
        "item": "black beans",
        "qty": 1,
        "unit": "can",
        "aisle": "Canned Goods"
      },
      {
        "item": "pinto beans",
        "qty": 1,
        "unit": "can",
        "aisle": "Canned Goods"
      },
      {
        "item": "crushed tomatoes",
        "qty": 1,
        "unit": "can",
        "aisle": "Canned Goods"
      },
      {
        "item": "onion",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "smoked paprika",
        "qty": 1,
        "unit": "tbsp",
        "aisle": "Spices"
      },
      {
        "item": "cumin",
        "qty": 1,
        "unit": "tbsp",
        "aisle": "Spices"
      }
    ],
    "steps": [
      "Saute onion until soft then add paprika and cumin.",
      "Add tomatoes and all the beans with a cup of water.",
      "Simmer uncovered 40 minutes stirring occasionally.",
      "Season and serve topped with fresh cilantro."
    ]
  },
  {
    "id": "dnb-mushroom-risotto",
    "name": "Creamy Mushroom Risotto",
    "mealTypes": [
      "dinner"
    ],
    "tags": [
      "vegetarian",
      "gluten-free"
    ],
    "servings": 4,
    "calories": 560,
    "prepTime": 10,
    "cookTime": 35,
    "ingredients": [
      {
        "item": "arborio rice",
        "qty": 1.5,
        "unit": "cup",
        "aisle": "Grains & Pasta"
      },
      {
        "item": "mushrooms",
        "qty": 3,
        "unit": "cup",
        "aisle": "Produce"
      },
      {
        "item": "vegetable broth",
        "qty": 4,
        "unit": "cup",
        "aisle": "Canned Goods"
      },
      {
        "item": "parmesan",
        "qty": 0.5,
        "unit": "cup",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "white wine",
        "qty": 0.5,
        "unit": "cup",
        "aisle": "Other"
      },
      {
        "item": "onion",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "butter",
        "qty": 2,
        "unit": "tbsp",
        "aisle": "Dairy & Eggs"
      }
    ],
    "steps": [
      "Saute mushrooms in butter until browned then set aside.",
      "Cook onion, add rice and toast one minute then add wine.",
      "Add warm broth one ladle at a time stirring until absorbed.",
      "Fold in mushrooms and parmesan and serve creamy."
    ]
  },
  {
    "id": "dnb-beef-broccoli-stirfry",
    "name": "Beef And Broccoli Stir Fry",
    "mealTypes": [
      "dinner"
    ],
    "tags": [
      "high-protein",
      "dairy-free"
    ],
    "servings": 4,
    "calories": 540,
    "prepTime": 15,
    "cookTime": 12,
    "ingredients": [
      {
        "item": "flank steak",
        "qty": 1,
        "unit": "lb",
        "aisle": "Meat & Seafood"
      },
      {
        "item": "broccoli",
        "qty": 4,
        "unit": "cup",
        "aisle": "Produce"
      },
      {
        "item": "soy sauce",
        "qty": 3,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "garlic",
        "qty": 3,
        "unit": "clove",
        "aisle": "Produce"
      },
      {
        "item": "ginger",
        "qty": 1,
        "unit": "tbsp",
        "aisle": "Produce"
      },
      {
        "item": "cornstarch",
        "qty": 1,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      }
    ],
    "steps": [
      "Slice steak thin and toss with cornstarch and half the soy sauce.",
      "Sear beef in a hot wok until browned then remove.",
      "Stir fry broccoli, garlic and ginger for 4 minutes.",
      "Return beef, add remaining soy sauce and toss to glaze."
    ]
  },
  {
    "id": "dnb-kung-pao-chicken",
    "name": "Kung Pao Chicken",
    "mealTypes": [
      "dinner"
    ],
    "tags": [
      "high-protein",
      "dairy-free",
      "quick"
    ],
    "servings": 4,
    "calories": 500,
    "prepTime": 12,
    "cookTime": 8,
    "ingredients": [
      {
        "item": "chicken thighs",
        "qty": 1,
        "unit": "lb",
        "aisle": "Meat & Seafood"
      },
      {
        "item": "peanuts",
        "qty": 0.5,
        "unit": "cup",
        "aisle": "Other"
      },
      {
        "item": "dried chilies",
        "qty": 6,
        "unit": "unit",
        "aisle": "Spices"
      },
      {
        "item": "soy sauce",
        "qty": 3,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "rice vinegar",
        "qty": 1,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "garlic",
        "qty": 3,
        "unit": "clove",
        "aisle": "Produce"
      }
    ],
    "steps": [
      "Cut chicken into cubes and stir fry until golden.",
      "Add dried chilies and garlic and cook 1 minute.",
      "Pour in soy sauce and rice vinegar and toss to coat.",
      "Stir in peanuts and serve over rice."
    ]
  },
  {
    "id": "dnb-veggie-pad-thai",
    "name": "Vegetable Pad Thai",
    "mealTypes": [
      "dinner"
    ],
    "tags": [
      "vegetarian",
      "dairy-free"
    ],
    "servings": 4,
    "calories": 540,
    "prepTime": 15,
    "cookTime": 12,
    "ingredients": [
      {
        "item": "rice noodles",
        "qty": 8,
        "unit": "oz",
        "aisle": "Grains & Pasta"
      },
      {
        "item": "eggs",
        "qty": 2,
        "unit": "unit",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "bean sprouts",
        "qty": 2,
        "unit": "cup",
        "aisle": "Produce"
      },
      {
        "item": "peanuts",
        "qty": 0.5,
        "unit": "cup",
        "aisle": "Other"
      },
      {
        "item": "tamarind paste",
        "qty": 2,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "soy sauce",
        "qty": 2,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "lime",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      }
    ],
    "steps": [
      "Soak rice noodles until pliable then drain.",
      "Scramble eggs in a hot wok then push aside.",
      "Add noodles, tamarind and soy sauce and toss to coat.",
      "Fold in bean sprouts, top with peanuts and lime."
    ]
  },
  {
    "id": "dnb-cashew-chicken",
    "name": "Cashew Chicken Stir Fry",
    "mealTypes": [
      "dinner"
    ],
    "tags": [
      "high-protein",
      "dairy-free",
      "quick"
    ],
    "servings": 4,
    "calories": 520,
    "prepTime": 12,
    "cookTime": 8,
    "ingredients": [
      {
        "item": "chicken breast",
        "qty": 1,
        "unit": "lb",
        "aisle": "Meat & Seafood"
      },
      {
        "item": "cashews",
        "qty": 0.75,
        "unit": "cup",
        "aisle": "Other"
      },
      {
        "item": "bell peppers",
        "qty": 2,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "oyster sauce",
        "qty": 2,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "soy sauce",
        "qty": 2,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "garlic",
        "qty": 2,
        "unit": "clove",
        "aisle": "Produce"
      }
    ],
    "steps": [
      "Stir fry cubed chicken until cooked through then remove.",
      "Cook peppers and garlic 3 minutes in the hot wok.",
      "Return chicken with oyster and soy sauces and toss.",
      "Add cashews, heat through and serve."
    ]
  },
  {
    "id": "dnb-thai-green-curry",
    "name": "Thai Green Curry With Chicken",
    "mealTypes": [
      "dinner"
    ],
    "tags": [
      "high-protein",
      "gluten-free",
      "dairy-free"
    ],
    "servings": 4,
    "calories": 560,
    "prepTime": 15,
    "cookTime": 25,
    "ingredients": [
      {
        "item": "chicken thighs",
        "qty": 1,
        "unit": "lb",
        "aisle": "Meat & Seafood"
      },
      {
        "item": "green curry paste",
        "qty": 3,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "coconut milk",
        "qty": 1,
        "unit": "can",
        "aisle": "Canned Goods"
      },
      {
        "item": "green beans",
        "qty": 2,
        "unit": "cup",
        "aisle": "Produce"
      },
      {
        "item": "fish sauce",
        "qty": 1,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "basil",
        "qty": 0.5,
        "unit": "cup",
        "aisle": "Produce"
      }
    ],
    "steps": [
      "Fry curry paste in a splash of coconut milk until fragrant.",
      "Add chicken and coat then pour in remaining coconut milk.",
      "Simmer 15 minutes then add green beans and fish sauce.",
      "Cook 5 minutes more and stir in fresh basil."
    ]
  },
  {
    "id": "dnb-chana-masala",
    "name": "Chickpea Chana Masala",
    "mealTypes": [
      "dinner"
    ],
    "tags": [
      "vegan",
      "vegetarian",
      "gluten-free",
      "batch-cook"
    ],
    "servings": 4,
    "calories": 440,
    "prepTime": 12,
    "cookTime": 30,
    "ingredients": [
      {
        "item": "chickpeas",
        "qty": 2,
        "unit": "can",
        "aisle": "Canned Goods"
      },
      {
        "item": "crushed tomatoes",
        "qty": 1,
        "unit": "can",
        "aisle": "Canned Goods"
      },
      {
        "item": "onion",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "garam masala",
        "qty": 1,
        "unit": "tbsp",
        "aisle": "Spices"
      },
      {
        "item": "ginger",
        "qty": 1,
        "unit": "tbsp",
        "aisle": "Produce"
      },
      {
        "item": "garlic",
        "qty": 3,
        "unit": "clove",
        "aisle": "Produce"
      }
    ],
    "steps": [
      "Cook onion, garlic and ginger until soft and golden.",
      "Add garam masala and toast for 1 minute.",
      "Stir in tomatoes and chickpeas and simmer 25 minutes.",
      "Mash a few chickpeas to thicken and season to taste."
    ]
  },
  {
    "id": "dnb-japanese-katsu-curry",
    "name": "Japanese Vegetable Katsu Curry",
    "mealTypes": [
      "dinner"
    ],
    "tags": [
      "vegetarian",
      "dairy-free"
    ],
    "servings": 4,
    "calories": 620,
    "prepTime": 20,
    "cookTime": 30,
    "ingredients": [
      {
        "item": "sweet potato",
        "qty": 2,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "carrots",
        "qty": 2,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "onion",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "curry powder",
        "qty": 2,
        "unit": "tbsp",
        "aisle": "Spices"
      },
      {
        "item": "rice",
        "qty": 1.5,
        "unit": "cup",
        "aisle": "Grains & Pasta"
      },
      {
        "item": "flour",
        "qty": 2,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "vegetable broth",
        "qty": 3,
        "unit": "cup",
        "aisle": "Canned Goods"
      }
    ],
    "steps": [
      "Saute onion and carrots then stir in curry powder and flour.",
      "Slowly add broth stirring into a smooth sauce.",
      "Add sweet potato and simmer 20 minutes until tender.",
      "Serve the curry over steamed rice."
    ]
  },
  {
    "id": "dnb-fajita-sheet-pan",
    "name": "Sheet Pan Chicken Fajita Bake",
    "mealTypes": [
      "dinner"
    ],
    "tags": [
      "high-protein",
      "gluten-free",
      "dairy-free"
    ],
    "servings": 4,
    "calories": 480,
    "prepTime": 15,
    "cookTime": 25,
    "ingredients": [
      {
        "item": "chicken breast",
        "qty": 1.5,
        "unit": "lb",
        "aisle": "Meat & Seafood"
      },
      {
        "item": "bell peppers",
        "qty": 3,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "onion",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "fajita seasoning",
        "qty": 2,
        "unit": "tbsp",
        "aisle": "Spices"
      },
      {
        "item": "olive oil",
        "qty": 2,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "lime",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      }
    ],
    "steps": [
      "Heat oven to 220C/425F.",
      "Slice chicken and vegetables and spread on a sheet pan.",
      "Toss with olive oil and fajita seasoning.",
      "Roast 25 minutes and finish with lime juice."
    ]
  },
  {
    "id": "dnb-cajun-jambalaya",
    "name": "One Pot Cajun Jambalaya",
    "mealTypes": [
      "dinner"
    ],
    "tags": [
      "high-protein",
      "dairy-free",
      "batch-cook"
    ],
    "servings": 6,
    "calories": 590,
    "prepTime": 20,
    "cookTime": 40,
    "ingredients": [
      {
        "item": "andouille sausage",
        "qty": 12,
        "unit": "oz",
        "aisle": "Meat & Seafood"
      },
      {
        "item": "shrimp",
        "qty": 0.5,
        "unit": "lb",
        "aisle": "Meat & Seafood"
      },
      {
        "item": "rice",
        "qty": 2,
        "unit": "cup",
        "aisle": "Grains & Pasta"
      },
      {
        "item": "diced tomatoes",
        "qty": 1,
        "unit": "can",
        "aisle": "Canned Goods"
      },
      {
        "item": "bell peppers",
        "qty": 2,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "cajun seasoning",
        "qty": 2,
        "unit": "tbsp",
        "aisle": "Spices"
      },
      {
        "item": "chicken broth",
        "qty": 3,
        "unit": "cup",
        "aisle": "Canned Goods"
      }
    ],
    "steps": [
      "Brown the sliced sausage in a large pot.",
      "Add peppers and cajun seasoning and cook 5 minutes.",
      "Stir in rice, tomatoes and broth and simmer covered 20 minutes.",
      "Add shrimp and cook 5 minutes until pink and rice is tender."
    ]
  },
  {
    "id": "dnb-vegetable-paella",
    "name": "Spanish Vegetable Paella",
    "mealTypes": [
      "dinner"
    ],
    "tags": [
      "vegan",
      "vegetarian",
      "gluten-free",
      "dairy-free"
    ],
    "servings": 6,
    "calories": 470,
    "prepTime": 20,
    "cookTime": 35,
    "ingredients": [
      {
        "item": "paella rice",
        "qty": 2,
        "unit": "cup",
        "aisle": "Grains & Pasta"
      },
      {
        "item": "saffron",
        "qty": 1,
        "unit": "pinch",
        "aisle": "Spices"
      },
      {
        "item": "bell peppers",
        "qty": 2,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "green beans",
        "qty": 2,
        "unit": "cup",
        "aisle": "Produce"
      },
      {
        "item": "diced tomatoes",
        "qty": 1,
        "unit": "can",
        "aisle": "Canned Goods"
      },
      {
        "item": "vegetable broth",
        "qty": 5,
        "unit": "cup",
        "aisle": "Canned Goods"
      },
      {
        "item": "smoked paprika",
        "qty": 1,
        "unit": "tbsp",
        "aisle": "Spices"
      }
    ],
    "steps": [
      "Saute peppers then add tomatoes, paprika and saffron.",
      "Stir in rice to coat in the sofrito.",
      "Pour in broth and green beans and do not stir.",
      "Simmer 20 minutes until liquid absorbs and a crust forms."
    ]
  },
  {
    "id": "dnb-ratatouille-bake",
    "name": "Provencal Ratatouille Bake",
    "mealTypes": [
      "dinner"
    ],
    "tags": [
      "vegan",
      "vegetarian",
      "gluten-free",
      "low-carb"
    ],
    "servings": 4,
    "calories": 400,
    "prepTime": 25,
    "cookTime": 45,
    "ingredients": [
      {
        "item": "zucchini",
        "qty": 2,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "eggplant",
        "qty": 1,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "tomatoes",
        "qty": 4,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "bell peppers",
        "qty": 2,
        "unit": "unit",
        "aisle": "Produce"
      },
      {
        "item": "olive oil",
        "qty": 3,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "herbs de provence",
        "qty": 1,
        "unit": "tbsp",
        "aisle": "Spices"
      }
    ],
    "steps": [
      "Heat oven to 190C/375F.",
      "Slice all vegetables into thin rounds.",
      "Arrange in a spiral in a baking dish and drizzle with oil and herbs.",
      "Cover and bake 45 minutes until tender."
    ]
  },
  {
    "id": "dnb-miso-glazed-cod",
    "name": "Miso Glazed Black Cod",
    "mealTypes": [
      "dinner"
    ],
    "tags": [
      "pescatarian",
      "high-protein",
      "dairy-free"
    ],
    "servings": 4,
    "calories": 440,
    "prepTime": 10,
    "cookTime": 12,
    "ingredients": [
      {
        "item": "black cod fillets",
        "qty": 4,
        "unit": "unit",
        "aisle": "Meat & Seafood"
      },
      {
        "item": "white miso",
        "qty": 3,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "mirin",
        "qty": 2,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "soy sauce",
        "qty": 1,
        "unit": "tbsp",
        "aisle": "Condiments & Baking"
      },
      {
        "item": "scallions",
        "qty": 3,
        "unit": "unit",
        "aisle": "Produce"
      }
    ],
    "steps": [
      "Whisk miso, mirin and soy sauce into a glaze.",
      "Coat cod and let sit 10 minutes.",
      "Broil 8 to 10 minutes until caramelized and flaky.",
      "Garnish with sliced scallions."
    ]
  },
  {
    "id": "dnb-black-bean-enchilada-bake",
    "name": "Black Bean Enchilada Bake",
    "mealTypes": [
      "dinner"
    ],
    "tags": [
      "vegetarian",
      "batch-cook",
      "kid-friendly"
    ],
    "servings": 6,
    "calories": 510,
    "prepTime": 15,
    "cookTime": 30,
    "ingredients": [
      {
        "item": "corn tortillas",
        "qty": 10,
        "unit": "unit",
        "aisle": "Bakery"
      },
      {
        "item": "black beans",
        "qty": 2,
        "unit": "can",
        "aisle": "Canned Goods"
      },
      {
        "item": "enchilada sauce",
        "qty": 2,
        "unit": "cup",
        "aisle": "Canned Goods"
      },
      {
        "item": "shredded cheese",
        "qty": 2,
        "unit": "cup",
        "aisle": "Dairy & Eggs"
      },
      {
        "item": "corn",
        "qty": 1,
        "unit": "cup",
        "aisle": "Produce"
      },
      {
        "item": "cumin",
        "qty": 1,
        "unit": "tsp",
        "aisle": "Spices"
      }
    ],
    "steps": [
      "Heat oven to 190C/375F.",
      "Mix beans, corn and cumin with half the enchilada sauce.",
      "Layer tortillas, bean mixture, sauce and cheese in a dish.",
      "Bake 30 minutes until cheese is melted and bubbling."
    ]
  }
];

// Ordered list of grocery aisles for grouping the shopping list.
const AISLE_ORDER = [
  "Produce",
  "Meat & Seafood",
  "Dairy & Eggs",
  "Bakery",
  "Grains & Pasta",
  "Canned Goods",
  "Condiments & Baking",
  "Spices",
  "Other"
];

// The dietary/preference tags a user can filter suggestions by.
const DIET_FILTERS = [
  'vegetarian',
  'vegan',
  'gluten-free',
  'pescatarian',
  'dairy-free',
  'high-protein',
  'low-carb',
  'quick',
  'kid-friendly',
];

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'];

function getRecipeById(id) {
  return RECIPES.find((r) => r.id === id) || null;
}
