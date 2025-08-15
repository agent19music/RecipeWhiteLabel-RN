import { Diet, Goal, MealPlan, PantryItem, Product, Recipe } from './types';
import { addDays, formatISO, nextMonday } from 'date-fns';

// Products (brand-neutral placeholders)
export const products: Product[] = [
  { id: 'p1', title: 'Beef Cubes 10g', priceKES: 30 },
  { id: 'p2', title: 'Coconut Milk 400ml', priceKES: 180 },
  { id: 'p3', title: 'Mixed Spice 50g', priceKES: 120 },
  { id: 'p4', title: 'Long Grain Rice 1kg', priceKES: 260 },
  { id: 'p5', title: 'Brown Chapati 10pcs', priceKES: 200 },
];

export const recipes: Recipe[] = [
  {
    id: 'r1',
    title: 'Beef Sukuma Stew',
    minutes: 40,
    calories: 520,
    tags: ['stew','quick','budget'],
    ingredients: [
      { name: 'beef', qty: 300, unit: 'g', productId: 'p1' },
      { name: 'sukuma wiki (kale)', qty: 200, unit: 'g' },
      { name: 'tomatoes', qty: 3, unit: 'pcs' },
      { name: 'onions', qty: 1, unit: 'pcs' },
      { name: 'mixed spice', qty: 1, unit: 'tsp', productId: 'p3' },
    ],
    steps: [
      'Sauté onions and tomatoes until soft.',
      'Add beef, brown lightly, add spice and simmer.',
      'Stir in chopped sukuma, cook until tender.'
    ],
    likes: 124,
    by: 'Amina',
  },
  {
    id: 'r2',
    title: 'Coastal Pilau',
    minutes: 55,
    calories: 640,
    tags: ['rice','spiced','dinner'],
    ingredients: [
      { name: 'rice', qty: 2, unit: 'cups', productId: 'p4' },
      { name: 'beef', qty: 250, unit: 'g' },
      { name: 'pilau masala', qty: 2, unit: 'tsp' },
      { name: 'onions', qty: 2, unit: 'pcs' },
    ],
    steps: [
      'Caramelize onions with spices.',
      'Add beef and sear.',
      'Add rice and water, cook covered until done.'
    ],
    likes: 201,
    by: 'Brian',
  },
  {
    id: 'r3',
    title: 'Kachumbari Fresh Salad',
    minutes: 10,
    calories: 120,
    tags: ['salad','quick','light'],
    ingredients: [
      { name: 'tomatoes', qty: 3, unit: 'pcs' },
      { name: 'onions', qty: 1, unit: 'pcs' },
      { name: 'coriander', qty: 1, unit: 'bunch' },
      { name: 'lemon', qty: 1, unit: 'pcs' },
    ],
    steps: [
      'Chop tomatoes, onions, and coriander.',
      'Squeeze lemon, season, and toss.'
    ],
    likes: 312,
    by: 'Grace',
  },
  {
    id: 'r4',
    title: 'Coconut Bean Curry',
    minutes: 35,
    calories: 480,
    tags: ['vegan','curry','budget'],
    ingredients: [
      { name: 'beans (pre-cooked)', qty: 400, unit: 'g' },
      { name: 'coconut milk', qty: 400, unit: 'ml', productId: 'p2' },
      { name: 'tomatoes', qty: 2, unit: 'pcs' },
      { name: 'garlic', qty: 2, unit: 'cloves' },
    ],
    steps: [
      'Sauté aromatics, add tomatoes.',
      'Stir in beans and coconut milk; simmer.',
      'Season and serve with rice.'
    ],
    likes: 150,
    by: 'Neema',
  },
  {
    id: 'r5',
    title: 'Chapati Veggie Wraps',
    minutes: 20,
    calories: 430,
    tags: ['wrap','lunch','quick'],
    ingredients: [
      { name: 'chapati', qty: 4, unit: 'pcs', productId: 'p5' },
      { name: 'avocado', qty: 1, unit: 'pcs' },
      { name: 'lettuce', qty: 100, unit: 'g' },
      { name: 'tomatoes', qty: 1, unit: 'pcs' },
    ],
    steps: [
      'Warm chapati; slice veggies.',
      'Assemble wraps and roll.'
    ],
    likes: 98,
    by: 'Janet',
  },
  {
    id: 'r6',
    title: 'Matoke Stew',
    minutes: 45,
    calories: 510,
    tags: ['stew','comfort'],
    ingredients: [
      { name: 'green bananas (matoke)', qty: 6, unit: 'pcs' },
      { name: 'tomatoes', qty: 2, unit: 'pcs' },
      { name: 'onions', qty: 1, unit: 'pcs' },
    ],
    steps: [
      'Sauté onions and tomatoes; add matoke.',
      'Add water and simmer until soft.'
    ],
    likes: 140,
    by: 'Moraa',
  },
  {
    id: 'r7',
    title: 'Ugali with Sukuma',
    minutes: 25,
    calories: 520,
    tags: ['quick','budget'],
    ingredients: [
      { name: 'maize flour', qty: 2, unit: 'cups' },
      { name: 'sukuma wiki (kale)', qty: 200, unit: 'g' },
    ],
    steps: [
      'Cook ugali to firm consistency.',
      'Stir-fry sukuma with onions.'
    ],
    likes: 260,
    by: 'Linet',
  },
  {
    id: 'r8',
    title: 'Spicy Lentil Soup',
    minutes: 30,
    calories: 350,
    tags: ['soup','vegan','light'],
    ingredients: [
      { name: 'red lentils', qty: 200, unit: 'g' },
      { name: 'mixed spice', qty: 1, unit: 'tsp', productId: 'p3' },
      { name: 'carrots', qty: 2, unit: 'pcs' },
    ],
    steps: [
      'Simmer lentils with spices and veggies.',
      'Blend partially for texture.'
    ],
    likes: 77,
    by: 'Omar',
  }
];

export const pantry: PantryItem[] = [
  { id: 'i1', title: 'Tomatoes', qty: 4, unit: 'pcs', expiresOn: '2025-08-18' },
  { id: 'i2', title: 'Onions', qty: 6, unit: 'pcs', expiresOn: '2025-09-01' },
  { id: 'i3', title: 'Kale (Sukuma)', qty: 250, unit: 'g', expiresOn: '2025-08-15' },
  { id: 'i4', title: 'Beef', qty: 500, unit: 'g', expiresOn: '2025-08-14' },
  { id: 'i5', title: 'Rice', qty: 1, unit: 'kg' },
  { id: 'i6', title: 'Beans (pre-cooked)', qty: 400, unit: 'g', expiresOn: '2025-08-20' },
  { id: 'i7', title: 'Coconut Milk', qty: 2, unit: 'cans', expiresOn: '2026-01-01' },
  { id: 'i8', title: 'Chili', qty: 2, unit: 'pcs' },
  { id: 'i9', title: 'Garlic', qty: 1, unit: 'bulb' },
  { id: 'i10', title: 'Avocado', qty: 2, unit: 'pcs', expiresOn: '2025-08-13' },
  { id: 'i11', title: 'Maize Flour', qty: 2, unit: 'kg' },
  { id: 'i12', title: 'Chapati', qty: 6, unit: 'pcs', expiresOn: '2025-08-12' },
  { id: 'i13', title: 'Carrots', qty: 3, unit: 'pcs', expiresOn: '2025-08-16' },
  { id: 'i14', title: 'Coriander', qty: 1, unit: 'bunch', expiresOn: '2025-08-11' },
  { id: 'i15', title: 'Lemon', qty: 2, unit: 'pcs', expiresOn: '2025-08-19' },
  { id: 'i16', title: 'Red Lentils', qty: 500, unit: 'g' },
  { id: 'i17', title: 'Mixed Spice', qty: 1, unit: 'jar' },
  { id: 'i18', title: 'Milk', qty: 1, unit: 'L', expiresOn: '2025-08-10' },
  { id: 'i19', title: 'Eggs', qty: 10, unit: 'pcs', expiresOn: '2025-08-22' },
  { id: 'i20', title: 'Spinach', qty: 200, unit: 'g', expiresOn: '2025-08-14' }
];

export const challenges = [
  {
    id: 'c1',
    title: 'Zero-Waste Week',
    endsOn: formatISO(addDays(new Date(), 5)),
    prize: 'KSh 500 voucher',
    entries: 38,
  },
  {
    id: 'c2',
    title: 'Taste of Lamu',
    endsOn: formatISO(addDays(new Date(), 12)),
    prize: 'Cooking class ticket',
    entries: 21,
  },
  {
    id: 'c3',
    title: 'Pilau Week Challenge',
    endsOn: formatISO(addDays(new Date(), 8)),
    prize: 'KSh 800 voucher',
    entries: 44,
  }
];

const monday = nextMonday(new Date());

export const demoPlan: MealPlan = {
  id: 'm1',
  weekOf: formatISO(monday, { representation: 'date' }),
  totalEstimatedCostKES: 2300,
  days: Array.from({ length: 7 }).map((_, i) => ({
    date: formatISO(addDays(monday, i), { representation: 'date' }),
    meals: [
      { meal: 'Breakfast', recipeId: 'r3' },
      { meal: 'Lunch', recipeId: i % 2 === 0 ? 'r4' : 'r5' },
      { meal: 'Dinner', recipeId: i % 3 === 0 ? 'r1' : 'r2' },
    ]
  }))
};

export const popularIngredients = [
  'kale', 'beef', 'tomatoes', 'onions', 'beans', 'coconut milk', 'rice', 'chapati', 'avocado', 'lentils'
];

