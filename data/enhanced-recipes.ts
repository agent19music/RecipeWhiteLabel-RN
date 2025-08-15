// Enhanced Recipe Data Structure with Full Details

export interface Ingredient {
  name: string;
  amount: string;
  unit?: string;
  optional?: boolean;
  alternatives?: string[];
}

export interface Utensil {
  name: string;
  essential: boolean;
  alternatives?: string[];
}

export interface NutritionalInfo {
  calories: number;
  protein: string;
  carbs: string;
  fat: string;
  fiber?: string;
  sugar?: string;
  sodium?: string;
}

export interface CookingStep {
  id: string;
  title: string;
  description: string;
  time: string;
  timerSeconds?: number;
  tip?: string;
  warning?: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  category: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack' | 'Dessert';
  cuisine: string;
  image: any;
  prepTime: string;
  cookTime: string;
  totalTime: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  servings: number;
  rating: number;
  reviewCount: number;
  featured?: boolean;
  new?: boolean;
  ingredients: Ingredient[];
  utensils: Utensil[];
  nutritionalInfo: NutritionalInfo;
  steps: CookingStep[];
  tags: string[];
  tips?: string[];
}

// Sample Enhanced Recipes with Full Details
export const enhancedRecipes: Recipe[] = [
  {
    id: 'nyama-choma',
    title: 'Nyama Choma (Grilled Meat)',
    description: 'Traditional East African grilled meat marinated with Royco cubes and spices, perfect for gatherings and special occasions.',
    category: 'Dinner',
    cuisine: 'Kenyan',
    image: require('@/assets/images/food-example.jpg'),
    prepTime: '20 min',
    cookTime: '45 min',
    totalTime: '65 min',
    difficulty: 'Medium',
    servings: 6,
    rating: 4.9,
    reviewCount: 1234,
    featured: true,
    ingredients: [
      { name: 'Beef (or goat meat)', amount: '2', unit: 'kg', alternatives: ['Chicken', 'Lamb'] },
      { name: 'Royco Beef Cubes', amount: '3', unit: 'cubes' },
      { name: 'Garlic', amount: '6', unit: 'cloves' },
      { name: 'Ginger', amount: '2', unit: 'tablespoons' },
      { name: 'Lemon juice', amount: '4', unit: 'tablespoons' },
      { name: 'Black pepper', amount: '1', unit: 'teaspoon' },
      { name: 'Vegetable oil', amount: '3', unit: 'tablespoons' },
      { name: 'Salt', amount: 'To taste' },
      { name: 'Fresh rosemary', amount: '2', unit: 'sprigs', optional: true },
    ],
    utensils: [
      { name: 'Grill or BBQ', essential: true, alternatives: ['Oven with broiler', 'Cast iron grill pan'] },
      { name: 'Meat tongs', essential: true, alternatives: ['Long fork'] },
      { name: 'Mixing bowl', essential: true },
      { name: 'Sharp knife', essential: true },
      { name: 'Cutting board', essential: true },
      { name: 'Meat thermometer', essential: false, alternatives: ['Timer and visual check'] },
      { name: 'Basting brush', essential: false, alternatives: ['Spoon'] },
    ],
    nutritionalInfo: {
      calories: 420,
      protein: '45g',
      carbs: '3g',
      fat: '25g',
      fiber: '0g',
      sodium: '580mg',
    },
    steps: [
      {
        id: '1',
        title: 'Prepare the Meat',
        description: 'Cut beef into large chunks (about 2-inch pieces). Pat dry with paper towels for better grilling.',
        time: '10 min',
        tip: 'Room temperature meat grills more evenly',
      },
      {
        id: '2',
        title: 'Make Marinade',
        description: 'Crush Royco cubes and mix with minced garlic, grated ginger, lemon juice, black pepper, and oil.',
        time: '5 min',
        timerSeconds: 300,
      },
      {
        id: '3',
        title: 'Marinate the Meat',
        description: 'Coat meat thoroughly with marinade. Cover and refrigerate for at least 2 hours, preferably overnight.',
        time: '5 min + marinating',
        tip: 'Longer marination = more flavor',
      },
      {
        id: '4',
        title: 'Prepare the Grill',
        description: 'Heat grill to medium-high heat (about 200°C). Clean grates and oil them lightly.',
        time: '10 min',
        timerSeconds: 600,
        warning: 'Ensure grill is not too hot to avoid burning',
      },
      {
        id: '5',
        title: 'Grill the Meat',
        description: 'Place meat on grill. Cook for 6-8 minutes per side for medium-rare, turning once.',
        time: '25 min',
        timerSeconds: 1500,
        tip: 'Don\'t flip too often - once is enough',
      },
      {
        id: '6',
        title: 'Check Doneness',
        description: 'Internal temperature should reach 63°C for medium-rare, 71°C for medium.',
        time: '2 min',
        tip: 'Let meat rest for 5 minutes before serving',
      },
    ],
    tags: ['Grilled', 'BBQ', 'Traditional', 'Party Food', 'High Protein'],
    tips: [
      'Serve with kachumbari (tomato-onion salad) and ugali',
      'Save marinade to baste meat while grilling',
      'For smokier flavor, add wood chips to your grill',
    ],
  },
  {
    id: 'pilau',
    title: 'Pilau (Spiced Rice)',
    description: 'Aromatic one-pot rice dish with meat and East African spices, perfect for celebrations and family gatherings.',
    category: 'Lunch',
    cuisine: 'Swahili',
    image: require('@/assets/images/food-example.jpg'),
    prepTime: '15 min',
    cookTime: '40 min',
    totalTime: '55 min',
    difficulty: 'Medium',
    servings: 8,
    rating: 4.8,
    reviewCount: 892,
    featured: true,
    new: true,
    ingredients: [
      { name: 'Basmati rice', amount: '3', unit: 'cups' },
      { name: 'Beef or chicken', amount: '500', unit: 'g', alternatives: ['Goat meat', 'Vegetables for vegetarian'] },
      { name: 'Royco Mchuzi Mix', amount: '2', unit: 'cubes' },
      { name: 'Onions', amount: '2', unit: 'large' },
      { name: 'Garlic', amount: '4', unit: 'cloves' },
      { name: 'Ginger', amount: '1', unit: 'tablespoon' },
      { name: 'Pilau masala', amount: '2', unit: 'tablespoons' },
      { name: 'Cinnamon stick', amount: '1', unit: 'piece' },
      { name: 'Cardamom pods', amount: '4', unit: 'pieces' },
      { name: 'Cloves', amount: '4', unit: 'pieces' },
      { name: 'Bay leaves', amount: '2', unit: 'leaves' },
      { name: 'Beef/chicken stock', amount: '5', unit: 'cups' },
      { name: 'Cooking oil', amount: '3', unit: 'tablespoons' },
      { name: 'Salt', amount: 'To taste' },
    ],
    utensils: [
      { name: 'Large pot with lid', essential: true },
      { name: 'Wooden spoon', essential: true },
      { name: 'Measuring cups', essential: true },
      { name: 'Sharp knife', essential: true },
      { name: 'Cutting board', essential: true },
    ],
    nutritionalInfo: {
      calories: 380,
      protein: '22g',
      carbs: '52g',
      fat: '12g',
      fiber: '3g',
      sugar: '4g',
      sodium: '620mg',
    },
    steps: [
      {
        id: '1',
        title: 'Prepare Ingredients',
        description: 'Cube meat into bite-sized pieces. Slice onions, mince garlic and ginger.',
        time: '10 min',
        timerSeconds: 600,
      },
      {
        id: '2',
        title: 'Brown the Meat',
        description: 'Heat oil in pot. Brown meat on all sides over high heat. Remove and set aside.',
        time: '8 min',
        timerSeconds: 480,
        tip: 'Don\'t overcrowd the pot',
      },
      {
        id: '3',
        title: 'Cook Aromatics',
        description: 'In same pot, sauté onions until golden. Add garlic, ginger, and whole spices.',
        time: '5 min',
        timerSeconds: 300,
      },
      {
        id: '4',
        title: 'Add Rice and Spices',
        description: 'Add rice and pilau masala. Stir to coat rice with oil and toast lightly.',
        time: '3 min',
        timerSeconds: 180,
        warning: 'Don\'t let rice burn',
      },
      {
        id: '5',
        title: 'Add Liquid',
        description: 'Return meat to pot. Add stock and Royco cubes. Bring to boil.',
        time: '5 min',
        timerSeconds: 300,
      },
      {
        id: '6',
        title: 'Simmer',
        description: 'Reduce heat to low, cover tightly. Cook for 20 minutes without lifting lid.',
        time: '20 min',
        timerSeconds: 1200,
        tip: 'No peeking! Steam is important',
      },
      {
        id: '7',
        title: 'Rest and Fluff',
        description: 'Turn off heat. Let rest 5 minutes. Fluff with fork before serving.',
        time: '5 min',
        timerSeconds: 300,
      },
    ],
    tags: ['One-Pot', 'Spiced', 'Festive', 'Comfort Food'],
    tips: [
      'Use good quality basmati rice for best results',
      'Toast whole spices before adding liquid for more flavor',
      'Garnish with fried onions and raisins',
    ],
  },
  {
    id: 'ugali-sukuma',
    title: 'Ugali with Sukuma Wiki',
    description: 'Kenya\'s staple food - cornmeal ugali served with sautéed collard greens in a flavorful tomato sauce.',
    category: 'Dinner',
    cuisine: 'Kenyan',
    image: require('@/assets/images/food-example.jpg'),
    prepTime: '10 min',
    cookTime: '30 min',
    totalTime: '40 min',
    difficulty: 'Easy',
    servings: 4,
    rating: 4.7,
    reviewCount: 567,
    ingredients: [
      { name: 'Maize flour', amount: '2', unit: 'cups' },
      { name: 'Water', amount: '3', unit: 'cups' },
      { name: 'Sukuma wiki (collard greens)', amount: '1', unit: 'bunch' },
      { name: 'Tomatoes', amount: '2', unit: 'medium' },
      { name: 'Onion', amount: '1', unit: 'medium' },
      { name: 'Royco Mchuzi Mix', amount: '1', unit: 'cube' },
      { name: 'Cooking oil', amount: '2', unit: 'tablespoons' },
      { name: 'Salt', amount: 'To taste' },
    ],
    utensils: [
      { name: 'Heavy-bottomed pot', essential: true },
      { name: 'Wooden spoon (mwiko)', essential: true },
      { name: 'Frying pan', essential: true },
      { name: 'Sharp knife', essential: true },
    ],
    nutritionalInfo: {
      calories: 320,
      protein: '8g',
      carbs: '68g',
      fat: '4g',
      fiber: '8g',
      sugar: '3g',
      sodium: '340mg',
    },
    steps: [
      {
        id: '1',
        title: 'Prepare Sukuma Wiki',
        description: 'Wash and chop collard greens into thin strips. Dice onions and tomatoes.',
        time: '5 min',
        timerSeconds: 300,
      },
      {
        id: '2',
        title: 'Start Ugali',
        description: 'Boil 2 cups of water in heavy pot. Keep remaining water warm.',
        time: '5 min',
        timerSeconds: 300,
      },
      {
        id: '3',
        title: 'Make Ugali',
        description: 'Add maize flour gradually while stirring continuously to avoid lumps.',
        time: '10 min',
        timerSeconds: 600,
        tip: 'Stir vigorously - ugali needs muscle!',
      },
      {
        id: '4',
        title: 'Cook Ugali',
        description: 'Continue stirring and pressing against pot sides until ugali pulls away from sides.',
        time: '10 min',
        timerSeconds: 600,
        warning: 'Ugali gets very hot - be careful',
      },
      {
        id: '5',
        title: 'Sauté Vegetables',
        description: 'In pan, sauté onions until soft. Add tomatoes and Royco cube, cook until saucy.',
        time: '5 min',
        timerSeconds: 300,
      },
      {
        id: '6',
        title: 'Add Greens',
        description: 'Add sukuma wiki to pan. Cover and steam for 3-5 minutes until wilted.',
        time: '5 min',
        timerSeconds: 300,
        tip: 'Don\'t overcook - keep greens vibrant',
      },
    ],
    tags: ['Staple', 'Vegetarian Option', 'Budget-Friendly', 'Traditional'],
    tips: [
      'Wet your hands when shaping ugali',
      'Add milk to ugali water for creamier texture',
      'Serve immediately while hot',
    ],
  },
  {
    id: 'chapati',
    title: 'Soft Chapati',
    description: 'Flaky, layered East African flatbread perfect for scooping up stews and curries.',
    category: 'Breakfast',
    cuisine: 'Kenyan',
    image: require('@/assets/images/food-example.jpg'),
    prepTime: '20 min',
    cookTime: '30 min',
    totalTime: '50 min',
    difficulty: 'Medium',
    servings: 8,
    rating: 4.9,
    reviewCount: 1456,
    featured: true,
    ingredients: [
      { name: 'All-purpose flour', amount: '3', unit: 'cups' },
      { name: 'Warm water', amount: '1', unit: 'cup' },
      { name: 'Salt', amount: '1', unit: 'teaspoon' },
      { name: 'Sugar', amount: '1', unit: 'tablespoon' },
      { name: 'Vegetable oil', amount: '4', unit: 'tablespoons' },
      { name: 'Extra oil for layering', amount: '2', unit: 'tablespoons' },
    ],
    utensils: [
      { name: 'Mixing bowl', essential: true },
      { name: 'Rolling pin', essential: true, alternatives: ['Clean bottle'] },
      { name: 'Flat pan or tawa', essential: true, alternatives: ['Non-stick pan'] },
      { name: 'Spatula', essential: true },
    ],
    nutritionalInfo: {
      calories: 290,
      protein: '6g',
      carbs: '42g',
      fat: '11g',
      fiber: '2g',
      sugar: '2g',
      sodium: '290mg',
    },
    steps: [
      {
        id: '1',
        title: 'Make Dough',
        description: 'Mix flour, salt, and sugar. Add oil and water gradually to form soft dough.',
        time: '5 min',
        timerSeconds: 300,
      },
      {
        id: '2',
        title: 'Knead',
        description: 'Knead dough for 8-10 minutes until smooth and elastic.',
        time: '10 min',
        timerSeconds: 600,
        tip: 'Proper kneading = softer chapatis',
      },
      {
        id: '3',
        title: 'Rest Dough',
        description: 'Cover dough with damp cloth. Let rest for 30 minutes.',
        time: '30 min',
        timerSeconds: 1800,
      },
      {
        id: '4',
        title: 'Divide and Roll',
        description: 'Divide into 8 balls. Roll each thin, brush with oil, roll into coil, then flatten.',
        time: '15 min',
        tip: 'The coiling creates layers',
      },
      {
        id: '5',
        title: 'Cook Chapati',
        description: 'Cook on hot pan for 2-3 minutes per side until golden with brown spots.',
        time: '3 min',
        timerSeconds: 180,
        warning: 'Pan should be hot but not smoking',
      },
      {
        id: '6',
        title: 'Keep Warm',
        description: 'Stack cooked chapatis and cover with kitchen towel to keep soft.',
        time: '1 min',
      },
    ],
    tags: ['Flatbread', 'Vegetarian', 'Staple', 'Kid-Friendly'],
    tips: [
      'Use warm water for softer chapatis',
      'Don\'t skip the resting time',
      'Brush with ghee after cooking for extra flavor',
    ],
  },
  {
    id: 'mandazi',
    title: 'Mandazi (Swahili Donuts)',
    description: 'Light and fluffy triangular donuts with cardamom and coconut, perfect with chai.',
    category: 'Breakfast',
    cuisine: 'Swahili',
    image: require('@/assets/images/food-example.jpg'),
    prepTime: '15 min',
    cookTime: '20 min',
    totalTime: '35 min',
    difficulty: 'Easy',
    servings: 20,
    rating: 4.8,
    reviewCount: 789,
    new: true,
    ingredients: [
      { name: 'All-purpose flour', amount: '3', unit: 'cups' },
      { name: 'Sugar', amount: '1/2', unit: 'cup' },
      { name: 'Coconut milk', amount: '1', unit: 'cup' },
      { name: 'Eggs', amount: '2', unit: 'large' },
      { name: 'Baking powder', amount: '2', unit: 'teaspoons' },
      { name: 'Ground cardamom', amount: '1', unit: 'teaspoon' },
      { name: 'Salt', amount: '1/2', unit: 'teaspoon' },
      { name: 'Oil for deep frying', amount: '3', unit: 'cups' },
    ],
    utensils: [
      { name: 'Deep pot for frying', essential: true },
      { name: 'Mixing bowl', essential: true },
      { name: 'Rolling pin', essential: true },
      { name: 'Slotted spoon', essential: true },
      { name: 'Paper towels', essential: true },
    ],
    nutritionalInfo: {
      calories: 220,
      protein: '4g',
      carbs: '28g',
      fat: '10g',
      fiber: '1g',
      sugar: '8g',
      sodium: '180mg',
    },
    steps: [
      {
        id: '1',
        title: 'Mix Dry Ingredients',
        description: 'Combine flour, sugar, baking powder, cardamom, and salt in bowl.',
        time: '2 min',
      },
      {
        id: '2',
        title: 'Add Wet Ingredients',
        description: 'Beat eggs with coconut milk. Add to dry ingredients to form soft dough.',
        time: '5 min',
        timerSeconds: 300,
      },
      {
        id: '3',
        title: 'Knead and Rest',
        description: 'Knead briefly until smooth. Cover and rest for 20 minutes.',
        time: '22 min',
        timerSeconds: 1320,
      },
      {
        id: '4',
        title: 'Shape Mandazi',
        description: 'Roll dough to 1/4 inch thick. Cut into triangles or diamonds.',
        time: '5 min',
        tip: 'Make them uniform for even cooking',
      },
      {
        id: '5',
        title: 'Heat Oil',
        description: 'Heat oil to 350°F (175°C). Test with small piece of dough.',
        time: '5 min',
        timerSeconds: 300,
        warning: 'Oil must be right temperature',
      },
      {
        id: '6',
        title: 'Fry Mandazi',
        description: 'Fry in batches for 2-3 minutes per side until golden brown.',
        time: '15 min',
        tip: 'Don\'t overcrowd the pot',
      },
    ],
    tags: ['Sweet', 'Fried', 'Tea-Time', 'Snack'],
    tips: [
      'Dust with powdered sugar while warm',
      'Add lemon zest for citrus flavor',
      'Best served fresh and warm',
    ],
  },
];

// Helper function to get all recipes
export function getAllEnhancedRecipes(): Recipe[] {
  return enhancedRecipes;
}

// Helper function to get recipe by ID with fallback
export function getRecipeById(id: string): Recipe | undefined {
  // Try to find by exact ID match
  let recipe = enhancedRecipes.find(recipe => recipe.id === id);
  
  // If not found, return a default recipe for any ID (for demo purposes)
  if (!recipe && id) {
    // Return the first recipe as a fallback with the requested ID
    recipe = { ...enhancedRecipes[0], id };
  }
  
  return recipe;
}

// Helper function to get recipes by category
export function getRecipesByCategory(category: string): Recipe[] {
  return enhancedRecipes.filter(recipe => 
    recipe.category.toLowerCase() === category.toLowerCase()
  );
}

// Helper function to get featured recipes
export function getFeaturedRecipes(): Recipe[] {
  return enhancedRecipes.filter(recipe => recipe.featured);
}

// Helper function to get new recipes
export function getNewRecipes(): Recipe[] {
  return enhancedRecipes.filter(recipe => recipe.new);
}

// Helper function to search recipes
export function searchRecipes(query: string): Recipe[] {
  const lowercaseQuery = query.toLowerCase();
  return enhancedRecipes.filter(recipe => 
    recipe.title.toLowerCase().includes(lowercaseQuery) ||
    recipe.description.toLowerCase().includes(lowercaseQuery) ||
    recipe.cuisine.toLowerCase().includes(lowercaseQuery) ||
    recipe.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
}
