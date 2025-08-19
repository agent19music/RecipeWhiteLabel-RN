// International recipes with diverse cuisines
import { Recipe } from './types';

// Helper to create recipe IDs
const createId = (prefix: string, num: number) => `${prefix}-${num.toString().padStart(3, '0')}`;

export const internationalRecipes: Recipe[] = [
  {
    id: createId('mexican', 1),
    title: 'Authentic Chicken Tacos',
    summary: 'Classic Mexican street tacos with tender seasoned chicken, fresh toppings, and homemade salsa verde.',
    description: 'These authentic chicken tacos bring the vibrant flavors of Mexican street food to your kitchen. Marinated chicken is grilled to perfection and served on warm corn tortillas with traditional toppings.',
    
    // Images
    image: require('@/assets/images/chicken-tacos.jpg'),
    images: [
      require('@/assets/images/chicken-tacos.jpg'),
    ],
    heroImage: require('@/assets/images/chicken-tacos.jpg'),
    
    // Ingredients
    ingredients: [
      { name: 'Chicken breast', quantity: 500, unit: 'g', group: 'Protein' },
      { name: 'Corn tortillas', quantity: 12, unit: 'small', group: 'Base' },
      { name: 'Lime juice', quantity: 3, unit: 'tbsp', group: 'Marinade' },
      { name: 'Cumin powder', quantity: 2, unit: 'tsp' },
      { name: 'Chili powder', quantity: 1, unit: 'tbsp' },
      { name: 'Paprika', quantity: 1, unit: 'tsp' },
      { name: 'Garlic', quantity: 4, unit: 'cloves', note: 'Minced' },
      { name: 'Red onion', quantity: 1, unit: 'medium', note: 'Diced', group: 'Toppings' },
      { name: 'Fresh cilantro', quantity: 1, unit: 'cup', note: 'Chopped' },
      { name: 'Avocado', quantity: 2, unit: 'ripe', note: 'Sliced' },
      { name: 'Salsa verde', quantity: 1, unit: 'cup' },
      { name: 'Queso fresco', quantity: 100, unit: 'g', note: 'Crumbled', optional: true },
      { name: 'Vegetable oil', quantity: 2, unit: 'tbsp' },
    ],
    
    // Steps
    steps: [
      {
        title: 'Marinate Chicken',
        body: 'Cut chicken into strips. Mix with lime juice, cumin, chili powder, paprika, minced garlic, and a pinch of salt. Let marinate for at least 30 minutes.',
        time: 35,
        tips: ['Marinate overnight for deeper flavor'],
      },
      {
        title: 'Prepare Toppings',
        body: 'Dice red onion, chop cilantro, slice avocados, and crumble queso fresco. Set aside in separate bowls.',
        time: 10,
      },
      {
        title: 'Cook Chicken',
        body: 'Heat oil in a skillet over medium-high heat. Cook marinated chicken strips for 6-8 minutes until golden and cooked through.',
        time: 8,
        temperature: { value: 165, unit: 'F' },
        tips: ['Don\'t overcrowd the pan'],
      },
      {
        title: 'Warm Tortillas',
        body: 'Heat tortillas on a dry skillet or directly over a gas flame for 30 seconds per side until warm and pliable.',
        time: 5,
        tips: ['Keep warm wrapped in a towel'],
      },
      {
        title: 'Assemble Tacos',
        body: 'Place chicken on tortillas, top with onion, cilantro, avocado, salsa verde, and queso fresco. Serve with lime wedges.',
        time: 3,
      },
    ],
    
    // Metadata
    details: {
      servings: 4,
      prepTime: 45,
      cookTime: 20,
      totalTime: 65,
      difficulty: 'easy',
      cost: 'budget',
      cuisine: 'Mexican',
      course: ['Lunch', 'Dinner'],
      rating: 4.9,
      ratingCount: 567,
    },
    
    nutrition: {
      calories: 380,
      carbs: 35,
      protein: 28,
      fat: 15,
      fiber: 5,
      sodium: 420,
    },
    
    tags: ['mexican', 'tacos', 'chicken', 'street-food', 'gluten-free'],
    time: '65 min',
    difficulty: 'Easy',
    minutes: 65,
    cuisine: 'Mexican',
  },
  
  {
    id: createId('asian', 1),
    title: 'Asian Vegetable Stir-Fried Rice',
    summary: 'A colorful and flavorful fried rice loaded with fresh vegetables and authentic Asian seasonings.',
    description: 'This restaurant-style stir-fried rice combines day-old rice with crisp vegetables and aromatic seasonings for a quick and satisfying meal that\'s better than takeout.',
    
    image: require('@/assets/images/stir-fry-rice.jpg'),
    images: [require('@/assets/images/stir-fry-rice.jpg')],
    heroImage: require('@/assets/images/stir-fry-rice.jpg'),
    
    ingredients: [
      { name: 'Cooked rice', quantity: 4, unit: 'cups', note: 'Day-old is best', group: 'Base' },
      { name: 'Eggs', quantity: 3, unit: 'large', group: 'Protein' },
      { name: 'Carrots', quantity: 2, unit: 'medium', note: 'Diced', group: 'Vegetables' },
      { name: 'Green peas', quantity: 1, unit: 'cup', note: 'Fresh or frozen' },
      { name: 'Bell pepper', quantity: 1, unit: 'large', note: 'Any color, diced' },
      { name: 'Green onions', quantity: 4, unit: 'stalks', note: 'Sliced' },
      { name: 'Garlic', quantity: 3, unit: 'cloves', note: 'Minced' },
      { name: 'Ginger', quantity: 1, unit: 'tbsp', note: 'Fresh, minced' },
      { name: 'Soy sauce', quantity: 3, unit: 'tbsp', group: 'Seasonings' },
      { name: 'Oyster sauce', quantity: 1, unit: 'tbsp', optional: true },
      { name: 'Sesame oil', quantity: 2, unit: 'tsp' },
      { name: 'Vegetable oil', quantity: 3, unit: 'tbsp', note: 'For stir-frying' },
      { name: 'White pepper', quantity: 0.5, unit: 'tsp' },
    ],
    
    steps: [
      {
        title: 'Prepare Rice',
        body: 'If using fresh rice, spread on a tray and let cool completely. Break up any clumps with a fork.',
        time: 5,
        tips: ['Day-old refrigerated rice works best'],
      },
      {
        title: 'Scramble Eggs',
        body: 'Heat 1 tbsp oil in wok. Scramble eggs until just set, remove and set aside.',
        time: 3,
      },
      {
        title: 'Stir-fry Vegetables',
        body: 'Heat remaining oil in wok over high heat. Add garlic and ginger, stir for 30 seconds. Add carrots, cook 2 minutes. Add bell pepper and peas, cook 2 more minutes.',
        time: 5,
        temperature: { value: 200, unit: 'C' },
      },
      {
        title: 'Add Rice',
        body: 'Add rice to wok, breaking up clumps. Stir-fry for 3-4 minutes until heated through and slightly crispy.',
        time: 4,
        tips: ['Use a spatula to press rice against the wok'],
      },
      {
        title: 'Season and Finish',
        body: 'Add soy sauce, oyster sauce, and white pepper. Return eggs to wok, add green onions. Stir-fry 1 minute. Drizzle with sesame oil.',
        time: 2,
      },
    ],
    
    details: {
      servings: 4,
      prepTime: 15,
      cookTime: 15,
      totalTime: 30,
      difficulty: 'easy',
      cost: 'budget',
      cuisine: 'Asian',
      course: ['Lunch', 'Dinner'],
      rating: 4.7,
      ratingCount: 432,
    },
    
    nutrition: {
      calories: 320,
      carbs: 48,
      protein: 12,
      fat: 10,
      fiber: 3,
      sodium: 580,
    },
    
    tags: ['asian', 'chinese', 'fried-rice', 'vegetarian', 'quick'],
    time: '30 min',
    difficulty: 'Easy',
    minutes: 30,
    cuisine: 'Asian',
  },
  
  {
    id: createId('indian', 1),
    title: 'Chicken Tikka Masala',
    summary: 'Tender chunks of marinated chicken in a creamy, spiced tomato sauce - India\'s most beloved curry.',
    description: 'This restaurant-favorite curry features yogurt-marinated chicken pieces grilled and then simmered in a rich, creamy tomato-based sauce with aromatic Indian spices.',
    
    image: require('@/assets/images/chickentikkamasala.jpg'),
    images: [require('@/assets/images/chickentikkamasala.jpg')],
    heroImage: require('@/assets/images/chickentikkamasala.jpg'),
    
    ingredients: [
      { name: 'Chicken thighs', quantity: 700, unit: 'g', note: 'Boneless, cut into chunks', group: 'Protein' },
      { name: 'Plain yogurt', quantity: 1, unit: 'cup', group: 'Marinade' },
      { name: 'Lemon juice', quantity: 2, unit: 'tbsp' },
      { name: 'Garam masala', quantity: 2, unit: 'tbsp', group: 'Spices' },
      { name: 'Cumin powder', quantity: 1, unit: 'tbsp' },
      { name: 'Turmeric', quantity: 1, unit: 'tsp' },
      { name: 'Paprika', quantity: 1, unit: 'tbsp' },
      { name: 'Cayenne pepper', quantity: 0.5, unit: 'tsp', optional: true },
      { name: 'Garlic', quantity: 6, unit: 'cloves', note: 'Minced' },
      { name: 'Ginger', quantity: 2, unit: 'tbsp', note: 'Fresh, grated' },
      { name: 'Onion', quantity: 1, unit: 'large', note: 'Finely chopped', group: 'Sauce' },
      { name: 'Tomato puree', quantity: 400, unit: 'g' },
      { name: 'Heavy cream', quantity: 1, unit: 'cup' },
      { name: 'Butter', quantity: 3, unit: 'tbsp' },
      { name: 'Fresh cilantro', quantity: 0.5, unit: 'cup', note: 'For garnish' },
      { name: 'Basmati rice', quantity: 2, unit: 'cups', note: 'For serving' },
    ],
    
    steps: [
      {
        title: 'Marinate Chicken',
        body: 'Mix yogurt, lemon juice, 1 tbsp garam masala, cumin, turmeric, half the garlic and ginger. Add chicken, coat well. Marinate 2 hours or overnight.',
        time: 125,
        tips: ['Overnight marination gives best flavor'],
      },
      {
        title: 'Grill Chicken',
        body: 'Thread chicken on skewers or place on grill pan. Grill 15-20 minutes, turning occasionally, until charred and cooked through.',
        time: 20,
        temperature: { value: 200, unit: 'C' },
      },
      {
        title: 'Make Sauce Base',
        body: 'In a large pan, melt butter. Sauté onion until golden. Add remaining garlic and ginger, cook 2 minutes.',
        time: 10,
      },
      {
        title: 'Add Spices and Tomato',
        body: 'Add remaining garam masala, paprika, and cayenne. Cook 1 minute. Add tomato puree, simmer 10 minutes.',
        time: 12,
      },
      {
        title: 'Finish Curry',
        body: 'Add cream and grilled chicken. Simmer 10 minutes until sauce thickens. Season with salt. Garnish with cilantro.',
        time: 10,
        tips: ['Don\'t boil after adding cream'],
      },
    ],
    
    details: {
      servings: 6,
      prepTime: 140,
      cookTime: 50,
      totalTime: 190,
      difficulty: 'medium',
      cost: 'moderate',
      cuisine: 'Indian',
      course: ['Dinner'],
      rating: 4.9,
      ratingCount: 892,
    },
    
    nutrition: {
      calories: 420,
      carbs: 15,
      protein: 35,
      fat: 25,
      fiber: 2,
      sodium: 650,
    },
    
    tags: ['indian', 'curry', 'chicken', 'spicy', 'creamy'],
    time: '190 min',
    difficulty: 'Medium',
    minutes: 190,
    cuisine: 'Indian',
  },
  
  {
    id: createId('mexican', 2),
    title: 'Loaded Chicken Burrito',
    summary: 'A hefty burrito packed with seasoned rice, beans, chicken, and all your favorite toppings.',
    description: 'This California-style burrito is a complete meal wrapped in a flour tortilla, featuring cilantro-lime rice, black beans, grilled chicken, and fresh toppings.',
    
    image: require('@/assets/images/rice-and-chorizo-burrito.webp'),
    images: [require('@/assets/images/rice-and-chorizo-burrito.webp')],
    heroImage: require('@/assets/images/rice-and-chorizo-burrito.webp'),
    
    ingredients: [
      { name: 'Large flour tortillas', quantity: 4, unit: 'extra-large', group: 'Wrap' },
      { name: 'Chicken breast', quantity: 500, unit: 'g', group: 'Protein' },
      { name: 'White rice', quantity: 2, unit: 'cups', note: 'Cooked', group: 'Filling' },
      { name: 'Black beans', quantity: 1, unit: 'can', note: '400g, drained' },
      { name: 'Cheddar cheese', quantity: 1.5, unit: 'cups', note: 'Shredded' },
      { name: 'Sour cream', quantity: 0.5, unit: 'cup' },
      { name: 'Guacamole', quantity: 1, unit: 'cup' },
      { name: 'Pico de gallo', quantity: 1, unit: 'cup' },
      { name: 'Lettuce', quantity: 2, unit: 'cups', note: 'Shredded' },
      { name: 'Lime', quantity: 2, unit: 'whole', group: 'Seasonings' },
      { name: 'Cilantro', quantity: 0.5, unit: 'cup', note: 'Chopped' },
      { name: 'Cumin', quantity: 1, unit: 'tsp' },
      { name: 'Chili powder', quantity: 1, unit: 'tbsp' },
      { name: 'Hot sauce', quantity: 2, unit: 'tbsp', optional: true },
    ],
    
    steps: [
      {
        title: 'Season and Cook Chicken',
        body: 'Season chicken with cumin, chili powder, salt, and pepper. Grill or pan-fry until cooked through. Slice into strips.',
        time: 15,
        temperature: { value: 165, unit: 'F' },
      },
      {
        title: 'Prepare Cilantro-Lime Rice',
        body: 'Mix cooked rice with lime juice, chopped cilantro, and a pinch of salt.',
        time: 5,
      },
      {
        title: 'Warm Beans',
        body: 'Heat black beans in a small pot with a splash of water and pinch of cumin.',
        time: 5,
      },
      {
        title: 'Warm Tortillas',
        body: 'Heat tortillas in microwave for 20 seconds or on a skillet until pliable.',
        time: 2,
      },
      {
        title: 'Assemble Burritos',
        body: 'Layer rice, beans, chicken, cheese, sour cream, guacamole, pico de gallo, and lettuce in center of tortilla. Fold bottom up, sides in, and roll tightly.',
        time: 5,
        tips: ['Don\'t overfill', 'Wrap in foil to keep warm'],
      },
    ],
    
    details: {
      servings: 4,
      prepTime: 20,
      cookTime: 15,
      totalTime: 35,
      difficulty: 'easy',
      cost: 'budget',
      cuisine: 'Mexican',
      course: ['Lunch', 'Dinner'],
      rating: 4.8,
      ratingCount: 654,
    },
    
    nutrition: {
      calories: 680,
      carbs: 72,
      protein: 38,
      fat: 25,
      fiber: 12,
      sodium: 980,
    },
    
    tags: ['mexican', 'burrito', 'tex-mex', 'chicken', 'filling'],
    time: '35 min',
    difficulty: 'Easy',
    minutes: 35,
    cuisine: 'Mexican',
  },
];

// Export function to get all international recipes
export function getInternationalRecipes(): Recipe[] {
  return internationalRecipes;
}

// Export function to get recipes by cuisine
export function getRecipesByCuisine(cuisine: string): Recipe[] {
  return internationalRecipes.filter(recipe => 
    recipe.cuisine?.toLowerCase() === cuisine.toLowerCase() ||
    recipe.details?.cuisine?.toLowerCase() === cuisine.toLowerCase()
  );
}
