export interface Recipe {
  id: string;
  title: string;
  time: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  calories: string;
  servings: number;
  image: any;
  category: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack' | 'Dessert';
  cuisine: string;
  rating: number;
  reviews: number;
  ingredients?: string[];
  isFavorite?: boolean;
}

// East African Breakfast Dishes
export const eastAfricanBreakfast: Recipe[] = [
  {
    id: 'b1',
    title: 'Mandazi (East African Donuts)',
    time: '45 min',
    difficulty: 'Easy',
    calories: '220 cal',
    servings: 8,
    image: require('@/assets/images/food-example.jpg'),
    category: 'Breakfast',
    cuisine: 'Kenyan',
    rating: 4.8,
    reviews: 342,
  },
  {
    id: 'b2',
    title: 'Ugali & Eggs',
    time: '25 min',
    difficulty: 'Easy',
    calories: '380 cal',
    servings: 2,
    image: require('@/assets/images/food-example.jpg'),
    category: 'Breakfast',
    cuisine: 'Kenyan',
    rating: 4.6,
    reviews: 189,
  },
  {
    id: 'b3',
    title: 'Chapati & Chai',
    time: '30 min',
    difficulty: 'Medium',
    calories: '290 cal',
    servings: 4,
    image: require('@/assets/images/food-example.jpg'),
    category: 'Breakfast',
    cuisine: 'Kenyan',
    rating: 4.9,
    reviews: 567,
  },
  {
    id: 'b4',
    title: 'Sambusa (Samosas)',
    time: '40 min',
    difficulty: 'Medium',
    calories: '180 cal',
    servings: 6,
    image: require('@/assets/images/food-example.jpg'),
    category: 'Breakfast',
    cuisine: 'Somali',
    rating: 4.7,
    reviews: 234,
  },
  {
    id: 'b5',
    title: 'Mkate wa Ufuta (Rice Pancakes)',
    time: '35 min',
    difficulty: 'Easy',
    calories: '260 cal',
    servings: 4,
    image: require('@/assets/images/food-example.jpg'),
    category: 'Breakfast',
    cuisine: 'Tanzanian',
    rating: 4.5,
    reviews: 156,
  },
  {
    id: 'b6',
    title: 'Rolex (Rolled Eggs & Chapati)',
    time: '15 min',
    difficulty: 'Easy',
    calories: '320 cal',
    servings: 1,
    image: require('@/assets/images/food-example.jpg'),
    category: 'Breakfast',
    cuisine: 'Ugandan',
    rating: 4.8,
    reviews: 423,
  },
  {
    id: 'b7',
    title: 'Injera with Scrambled Eggs',
    time: '25 min',
    difficulty: 'Medium',
    calories: '340 cal',
    servings: 2,
    image: require('@/assets/images/food-example.jpg'),
    category: 'Breakfast',
    cuisine: 'Ethiopian',
    rating: 4.6,
    reviews: 198,
  },
  {
    id: 'b8',
    title: 'Mahamri (Swahili Donuts)',
    time: '50 min',
    difficulty: 'Medium',
    calories: '240 cal',
    servings: 10,
    image: require('@/assets/images/food-example.jpg'),
    category: 'Breakfast',
    cuisine: 'Swahili',
    rating: 4.7,
    reviews: 289,
  },
];

// East African Lunch Dishes
export const eastAfricanLunch: Recipe[] = [
  {
    id: 'l1',
    title: 'Nyama Choma (Grilled Meat)',
    time: '45 min',
    difficulty: 'Medium',
    calories: '420 cal',
    servings: 4,
    image: require('@/assets/images/food-example.jpg'),
    category: 'Lunch',
    cuisine: 'Kenyan',
    rating: 4.9,
    reviews: 678,
  },
  {
    id: 'l2',
    title: 'Pilau (Spiced Rice)',
    time: '40 min',
    difficulty: 'Medium',
    calories: '380 cal',
    servings: 6,
    image: require('@/assets/images/pilau.jpg'),
    category: 'Lunch',
    cuisine: 'Swahili',
    rating: 4.8,
    reviews: 534,
  },
  {
    id: 'l3',
    title: 'Githeri (Beans & Maize)',
    time: '60 min',
    difficulty: 'Easy',
    calories: '320 cal',
    servings: 4,
    image: require('@/assets/images/githeri.jpg'),
    category: 'Lunch',
    cuisine: 'Kenyan',
    rating: 4.6,
    reviews: 345,
  },
  {
    id: 'l4',
    title: 'Mukimo (Mashed Vegetables)',
    time: '35 min',
    difficulty: 'Easy',
    calories: '280 cal',
    servings: 4,
    image: require('@/assets/images/mukimo.jpg'),
    category: 'Lunch',
    cuisine: 'Kenyan',
    rating: 4.5,
    reviews: 267,
  },
  {
    id: 'l5',
    title: 'Wali wa Nazi (Coconut Rice)',
    time: '30 min',
    difficulty: 'Easy',
    calories: '360 cal',
    servings: 4,
    image: require('@/assets/images/waliwanazi.webp'),
    category: 'Lunch',
    cuisine: 'Tanzanian',
    rating: 4.7,
    reviews: 412,
  },
  {
    id: 'l6',
    title: 'Matoke (Steamed Bananas)',
    time: '40 min',
    difficulty: 'Medium',
    calories: '290 cal',
    servings: 4,
    image: require('@/assets/images/food-example.jpg'),
    category: 'Lunch',
    cuisine: 'Ugandan',
    rating: 4.6,
    reviews: 298,
  },
  {
    id: 'l7',
    title: 'Doro Wat (Chicken Stew)',
    time: '90 min',
    difficulty: 'Hard',
    calories: '450 cal',
    servings: 6,
    image: require('@/assets/images/food-example.jpg'),
    category: 'Lunch',
    cuisine: 'Ethiopian',
    rating: 4.9,
    reviews: 567,
  },
  {
    id: 'l8',
    title: 'Supu ya Ndizi (Plantain Soup)',
    time: '45 min',
    difficulty: 'Medium',
    calories: '310 cal',
    servings: 4,
    image: require('@/assets/images/food-example.jpg'),
    category: 'Lunch',
    cuisine: 'Tanzanian',
    rating: 4.5,
    reviews: 234,
  },
  {
    id: 'l9',
    title: 'Kachumbari Salad',
    time: '15 min',
    difficulty: 'Easy',
    calories: '120 cal',
    servings: 4,
    image: require('@/assets/images/Kachumbari-African-Tomato-and-Onion-Salad-2546.21.jpg'),
    category: 'Lunch',
    cuisine: 'Kenyan',
    rating: 4.4,
    reviews: 189,
  },
  {
    id: 'l10',
    title: 'Mchuzi wa Samaki (Fish Curry)',
    time: '35 min',
    difficulty: 'Medium',
    calories: '380 cal',
    servings: 4,
    image: require('@/assets/images/food-example.jpg'),
    category: 'Lunch',
    cuisine: 'Swahili',
    rating: 4.8,
    reviews: 456,
  },
];

// East African Dinner Dishes
export const eastAfricanDinner: Recipe[] = [
  {
    id: 'd1',
    title: 'Ugali & Sukuma Wiki',
    time: '30 min',
    difficulty: 'Easy',
    calories: '340 cal',
    servings: 4,
    image: require('@/assets/images/food-example.jpg'),
    category: 'Dinner',
    cuisine: 'Kenyan',
    rating: 4.7,
    reviews: 789,
  },
  {
    id: 'd2',
    title: 'Biryani',
    time: '90 min',
    difficulty: 'Hard',
    calories: '520 cal',
    servings: 6,
    image: require('@/assets/images/food-example.jpg'),
    category: 'Dinner',
    cuisine: 'Swahili',
    rating: 4.9,
    reviews: 892,
  },
  {
    id: 'd3',
    title: 'Tilapia Fish with Ugali',
    time: '45 min',
    difficulty: 'Medium',
    calories: '420 cal',
    servings: 2,
    image: require('@/assets/images/food-example.jpg'),
    category: 'Dinner',
    cuisine: 'Kenyan',
    rating: 4.8,
    reviews: 567,
  },
  {
    id: 'd4',
    title: 'Mishkaki (Beef Skewers)',
    time: '40 min',
    difficulty: 'Medium',
    calories: '380 cal',
    servings: 4,
    image: require('@/assets/images/food-example.jpg'),
    category: 'Dinner',
    cuisine: 'Tanzanian',
    rating: 4.7,
    reviews: 445,
  },
  {
    id: 'd5',
    title: 'Luwombo (Steamed Stew)',
    time: '120 min',
    difficulty: 'Hard',
    calories: '460 cal',
    servings: 4,
    image: require('@/assets/images/food-example.jpg'),
    category: 'Dinner',
    cuisine: 'Ugandan',
    rating: 4.8,
    reviews: 334,
  },
  {
    id: 'd6',
    title: 'Kitfo (Ethiopian Tartare)',
    time: '25 min',
    difficulty: 'Medium',
    calories: '480 cal',
    servings: 2,
    image: require('@/assets/images/food-example.jpg'),
    category: 'Dinner',
    cuisine: 'Ethiopian',
    rating: 4.6,
    reviews: 278,
  },
  {
    id: 'd7',
    title: 'Goat Curry',
    time: '90 min',
    difficulty: 'Hard',
    calories: '440 cal',
    servings: 6,
    image: require('@/assets/images/food-example.jpg'),
    category: 'Dinner',
    cuisine: 'Kenyan',
    rating: 4.9,
    reviews: 623,
  },
  {
    id: 'd8',
    title: 'Chapati & Beef Stew',
    time: '60 min',
    difficulty: 'Medium',
    calories: '490 cal',
    servings: 4,
    image: require('@/assets/images/food-example.jpg'),
    category: 'Dinner',
    cuisine: 'Kenyan',
    rating: 4.8,
    reviews: 712,
  },
  {
    id: 'd9',
    title: 'Zanzibar Pizza',
    time: '30 min',
    difficulty: 'Medium',
    calories: '410 cal',
    servings: 2,
    image: require('@/assets/images/food-example.jpg'),
    category: 'Dinner',
    cuisine: 'Tanzanian',
    rating: 4.5,
    reviews: 298,
  },
  {
    id: 'd10',
    title: 'Irio (Mashed Peas & Potatoes)',
    time: '40 min',
    difficulty: 'Easy',
    calories: '320 cal',
    servings: 4,
    image: require('@/assets/images/food-example.jpg'),
    category: 'Dinner',
    cuisine: 'Kenyan',
    rating: 4.6,
    reviews: 389,
  },
];

// International Dishes for variety
export const internationalRecipes: Recipe[] = [
  {
    id: 'i1',
    title: 'Spaghetti Carbonara',
    time: '20 min',
    difficulty: 'Medium',
    calories: '450 cal',
    servings: 2,
    image: require('@/assets/images/carbonara.jpg'),
    category: 'Dinner',
    cuisine: 'Italian',
    rating: 4.8,
    reviews: 1234,
  },
  {
    id: 'i2',
    title: 'Pad Thai',
    time: '30 min',
    difficulty: 'Medium',
    calories: '380 cal',
    servings: 2,
    image: require('@/assets/images/Authentic-Pad-Thai_square-1908.jpg'),
    category: 'Lunch',
    cuisine: 'Thai',
    rating: 4.7,
    reviews: 890,
  },
  {
    id: 'i3',
    title: 'Tacos al Pastor',
    time: '25 min',
    difficulty: 'Easy',
    calories: '420 cal',
    servings: 4,
    image: require('@/assets/images/food-example.jpg'),
    category: 'Dinner',
    cuisine: 'Mexican',
    rating: 4.9,
    reviews: 678,
  },
  {
    id: 'i4',
    title: 'Chicken Tikka Masala',
    time: '45 min',
    difficulty: 'Medium',
    calories: '480 cal',
    servings: 4,
    image: require('@/assets/images/food-example.jpg'),
    category: 'Dinner',
    cuisine: 'Indian',
    rating: 4.8,
    reviews: 1456,
  },
  {
    id: 'i5',
    title: 'Greek Moussaka',
    time: '90 min',
    difficulty: 'Hard',
    calories: '520 cal',
    servings: 6,
    image: require('@/assets/images/food-example.jpg'),
    category: 'Dinner',
    cuisine: 'Greek',
    rating: 4.7,
    reviews: 567,
  },
];

// Helper function to get meals based on time of day
export function getMealsByTimeOfDay(): Recipe[] {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 11) {
    // Breakfast time (5 AM - 11 AM)
    return eastAfricanBreakfast;
  } else if (hour >= 11 && hour < 16) {
    // Lunch time (11 AM - 4 PM)
    return eastAfricanLunch;
  } else {
    // Dinner time (4 PM - 5 AM)
    return eastAfricanDinner;
  }
}

// Get featured recipes (mix of East African and International)
export function getFeaturedRecipes(): Recipe[] {
  const timeBasedMeals = getMealsByTimeOfDay();
  const featured = timeBasedMeals.slice(0, 3);
  const international = internationalRecipes.slice(0, 2);
  return [...featured, ...international];
}

// Get all recipes
export function getAllRecipes(): Recipe[] {
  return [
    ...eastAfricanBreakfast,
    ...eastAfricanLunch,
    ...eastAfricanDinner,
    ...internationalRecipes,
  ];
}

// Get recipes by category
export function getRecipesByCategory(category: string): Recipe[] {
  return getAllRecipes().filter(recipe => recipe.category === category);
}

// Get recipes by cuisine
export function getRecipesByCuisine(cuisine: string): Recipe[] {
  return getAllRecipes().filter(recipe => recipe.cuisine === cuisine);
}
