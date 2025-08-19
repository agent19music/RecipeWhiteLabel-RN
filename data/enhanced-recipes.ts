// Enhanced recipes with detailed cooking instructions and rich metadata
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserRecipes } from '../utils/ai';
import { getAllRecipes } from './recipes';
import { Recipe } from './types';
import { getInternationalRecipes } from './international-recipes';

// Helper to create recipe IDs
const createId = (prefix: string, num: number) => `${prefix}-${num.toString().padStart(3, '0')}`;

// Rich East African Breakfast Recipes
export const enhancedBreakfastRecipes: Recipe[] = [
  {
    id: createId('breakfast', 1),
    title: 'Mandazi (East African Donuts)',
    summary: 'Light, fluffy, and slightly sweet triangular donuts that are a beloved breakfast treat across East Africa. Perfect with chai tea.',
    description: 'Mandazi, also known as Swahili donuts or African donuts, are a popular snack throughout East Africa. These delightful treats are less sweet than Western donuts and have a wonderful cardamom flavor that pairs perfectly with tea or coffee.',
    
    // Images
    image: require('@/assets/images/mandazi.jpg'),
    images: [
      require('@/assets/images/mandazi.jpg'),
      require('@/assets/images/mandazi.jpg'),
    ],
    heroImage: require('@/assets/images/mandazi.jpg'),
    
    // Ingredients with detailed information
    ingredients: [
      { name: 'All-purpose flour', quantity: 3, unit: 'cups', group: 'Dry ingredients' },
      { name: 'Sugar', quantity: 0.25, unit: 'cup', note: 'Adjust to taste' },
      { name: 'Baking powder', quantity: 2, unit: 'tsp' },
      { name: 'Ground cardamom', quantity: 1, unit: 'tsp', note: 'Key flavor!' },
      { name: 'Salt', quantity: 0.5, unit: 'tsp' },
      { name: 'Coconut milk', quantity: 1, unit: 'cup', note: 'Can substitute with regular milk', group: 'Wet ingredients' },
      { name: 'Eggs', quantity: 2, unit: 'large' },
      { name: 'Melted butter', quantity: 2, unit: 'tbsp' },
      { name: 'Vegetable oil', quantity: 2, unit: 'cups', note: 'For deep frying', group: 'For frying' },
    ],
    
    // Detailed steps
    steps: [
      {
        title: 'Activate Yeast',
        body: 'Mix yeast with warm water and 1 tsp sugar. Let sit for 5-10 minutes until foamy.',
        time: 10,
        tips: ['Water should be warm, not hot (around 37°C)'],
      },
      {
        title: 'Make Dough',
        body: 'In a large bowl, combine flour, remaining sugar, cardamom, and salt. Add coconut milk, yeast mixture, and melted butter. Mix until a soft dough forms.',
        time: 8,
        tips: ['Dough should be soft and slightly sticky'],
      },
      {
        title: 'Knead and Rise',
        body: 'Knead the dough on a floured surface for 8-10 minutes until smooth and elastic. Place in oiled bowl, cover, and let rise for 1 hour until doubled in size.',
        time: 70,
        tips: ['Cover with damp cloth to prevent drying'],
      },
      {
        title: 'Shape Mandazi',
        body: 'Punch down dough and divide into 8 portions. Roll each into 1/4 inch thick circles, then cut into triangular shapes.',
        time: 10,
        tips: ['Traditional triangular shape is key'],
      },
      {
        title: 'Heat Oil',
        body: 'Heat vegetable oil in a deep pan to 350°F (175°C). Test with a small piece of dough - it should sizzle and float.',
        time: 5,
        temperature: { value: 175, unit: 'C' },
      },
      {
        title: 'Fry Mandazi',
        body: 'Carefully add mandazi to hot oil, a few at a time. Fry for 2-3 minutes per side until golden brown and puffed up.',
        time: 12,
        tips: ['Don\'t overcrowd the pan', 'Turn gently to avoid deflating'],
      },
      {
        title: 'Drain and Serve',
        body: 'Remove mandazi with a slotted spoon and drain on paper towels. Serve warm with chai tea or coffee.',
        time: 2,
        tips: ['Best enjoyed fresh and warm'],
      },
    ],
    
    // Detailed metadata
    details: {
      servings: 8,
      prepTime: 20,
      cookTime: 25,
      totalTime: 45,
      difficulty: 'easy',
      cost: 'budget',
      equipment: ['Mixing bowl', 'Deep frying pan', 'Slotted spoon', 'Rolling pin'],
      allergens: ['Gluten', 'Eggs', 'Dairy'],
      dietTags: ['Vegetarian'],
      cuisine: 'East African',
      course: ['Breakfast', 'Snack'],
      occasion: ['Weekend', 'Special occasions'],
      rating: 4.8,
      ratingCount: 342,
      favoriteCount: 1250,
    },
    
    // Nutrition information
    nutrition: {
      calories: 220,
      carbs: 28,
      protein: 4,
      fat: 10,
      fiber: 1,
      sugar: 6,
      sodium: 150,
    },
    
    // Additional information
    tips: [
      'For a richer flavor, use coconut oil for frying',
      'Dust with powdered sugar for a sweeter version',
      'Can be stored in an airtight container for up to 3 days',
    ],
    variations: [
      'Add ground cinnamon or nutmeg for different flavor profiles',
      'Make chocolate mandazi by adding cocoa powder',
      'Create savory version by reducing sugar and adding herbs',
    ],
    pairings: ['Kenyan chai tea', 'Ethiopian coffee', 'Fresh fruit salad'],
    
    // Metadata
    createdBy: 'curated',
    author: 'Traditional Recipe',
    tags: ['breakfast', 'african', 'donuts', 'fried', 'sweet', 'traditional'],
    
    // Legacy fields for compatibility
    time: '45 min',
    difficulty: 'Easy',
    minutes: 45,
  },
  
  {
    id: createId('breakfast', 2),
    title: 'Ugali & Scrambled Eggs',
    summary: 'A hearty East African breakfast combining the staple cornmeal porridge with perfectly seasoned scrambled eggs.',
    description: 'Ugali, the cornerstone of East African cuisine, transforms into a delicious breakfast when paired with fluffy scrambled eggs seasoned with local spices. This protein-rich meal provides sustained energy throughout the morning.',
    
    image: require('@/assets/images/homemade-ugali-scrambled-eggs-and-plain-kales.webp'),
    images: [
      require('@/assets/images/homemade-ugali-scrambled-eggs-and-plain-kales.webp'),
      require('@/assets/images/homemade-ugali-scrambled-eggs-and-plain-kales.webp'),
    ],
    heroImage: require('@/assets/images/homemade-ugali-scrambled-eggs-and-plain-kales.webp'),
    
    ingredients: [
      { name: 'White cornmeal (maize flour)', quantity: 2, unit: 'cups', group: 'For Ugali' },
      { name: 'Water', quantity: 4, unit: 'cups' },
      { name: 'Salt', quantity: 1, unit: 'tsp' },
      { name: 'Eggs', quantity: 6, unit: 'large', group: 'For Scrambled Eggs' },
      { name: 'Milk', quantity: 0.25, unit: 'cup', optional: true },
      { name: 'Butter', quantity: 2, unit: 'tbsp' },
      { name: 'Onion', quantity: 1, unit: 'medium', note: 'Finely diced' },
      { name: 'Tomatoes', quantity: 2, unit: 'medium', note: 'Diced' },
      { name: 'Green bell pepper', quantity: 1, unit: 'small', optional: true },
      { name: 'Fresh coriander', quantity: 0.25, unit: 'cup', note: 'Chopped' },
      { name: 'Black pepper', quantity: 0.5, unit: 'tsp' },
      { name: 'Royco seasoning cube', quantity: 1, unit: 'cube', note: 'Or salt to taste' },
    ],
    
    steps: [
      {
        title: 'Prepare Ugali - Boil Water',
        body: 'In a heavy-bottomed pot, bring 3 cups of water to a rolling boil. Add salt and stir.',
        time: 5,
        temperature: { value: 100, unit: 'C' },
      },
      {
        title: 'Add Cornmeal Gradually',
        body: 'Reduce heat to medium. Slowly add cornmeal while stirring continuously with a wooden spoon to prevent lumps.',
        time: 3,
        tips: ['Add cornmeal in a steady stream', 'Keep stirring to avoid lumps'],
      },
      {
        title: 'Cook and Stir',
        body: 'Continue stirring vigorously as the mixture thickens. Add remaining water gradually if needed. Cook for 10-15 minutes until it pulls away from the sides.',
        time: 15,
        tips: ['Use a strong wooden spoon', 'The ugali is ready when it doesn\'t stick to the pan'],
      },
      {
        title: 'Shape and Rest',
        body: 'Turn the ugali onto a wet plate and shape into a mound. Cover to keep warm while preparing eggs.',
        time: 2,
      },
      {
        title: 'Prepare Egg Mixture',
        body: 'Crack eggs into a bowl. Add milk if using, and whisk until well combined. Season with black pepper.',
        time: 2,
      },
      {
        title: 'Sauté Vegetables',
        body: 'Heat butter in a pan over medium heat. Add onions and cook until translucent. Add tomatoes and bell pepper, cook until softened.',
        time: 5,
      },
      {
        title: 'Scramble the Eggs',
        body: 'Pour egg mixture into the pan with vegetables. Add crumbled Royco cube. Gently scramble, stirring frequently until eggs are just set but still creamy.',
        time: 3,
        tips: ['Don\'t overcook - eggs continue cooking after removing from heat'],
      },
      {
        title: 'Garnish and Serve',
        body: 'Sprinkle fresh coriander over the eggs. Serve immediately alongside warm ugali.',
        time: 1,
      },
    ],
    
    details: {
      servings: 4,
      prepTime: 10,
      cookTime: 25,
      totalTime: 35,
      difficulty: 'easy',
      cost: 'budget',
      equipment: ['Heavy-bottomed pot', 'Wooden spoon', 'Frying pan', 'Whisk'],
      allergens: ['Eggs', 'Dairy'],
      dietTags: ['Vegetarian', 'Gluten-free'],
      cuisine: 'East African',
      course: ['Breakfast', 'Brunch'],
      rating: 4.6,
      ratingCount: 189,
    },
    
    nutrition: {
      calories: 380,
      carbs: 42,
      protein: 18,
      fat: 15,
      fiber: 3,
      sugar: 3,
      sodium: 420,
    },
    
    tips: [
      'Leftover ugali can be sliced and fried for breakfast',
      'Add cheese to eggs for extra richness',
      'Serve with kachumbari (fresh salsa) on the side',
    ],
    
    createdBy: 'curated',
    tags: ['breakfast', 'eggs', 'ugali', 'traditional', 'protein-rich'],
    time: '35 min',
    difficulty: 'Easy',
    minutes: 35,
  },
  
  {
    id: createId('breakfast', 3),
    title: 'Chapati & Spiced Chai',
    summary: 'Soft, layered flatbreads served with aromatic spiced tea - a perfect East African breakfast combination.',
    description: 'Chapati, the beloved East African flatbread with Indian origins, creates perfect layers when properly prepared. Paired with cardamom-scented chai, this breakfast is both comforting and energizing.',
    
    image: require('@/assets/images/chapatichai.webp'),
    images: [require('@/assets/images/chapatichai.webp')],
    heroImage: require('@/assets/images/chapatichai.webp'),
    
    ingredients: [
      { name: 'All-purpose flour', quantity: 3, unit: 'cups', group: 'For Chapati' },
      { name: 'Warm water', quantity: 1.25, unit: 'cups' },
      { name: 'Salt', quantity: 1, unit: 'tsp' },
      { name: 'Sugar', quantity: 1, unit: 'tbsp' },
      { name: 'Vegetable oil', quantity: 0.25, unit: 'cup', note: 'Plus extra for cooking' },
      { name: 'Black tea leaves', quantity: 3, unit: 'tbsp', group: 'For Chai' },
      { name: 'Milk', quantity: 2, unit: 'cups' },
      { name: 'Water', quantity: 1, unit: 'cup' },
      { name: 'Sugar', quantity: 3, unit: 'tbsp', note: 'Adjust to taste' },
      { name: 'Fresh ginger', quantity: 1, unit: 'inch', note: 'Grated' },
      { name: 'Cardamom pods', quantity: 4, unit: 'pods', note: 'Crushed' },
      { name: 'Cinnamon stick', quantity: 1, unit: 'small' },
      { name: 'Black pepper', quantity: 3, unit: 'whole', optional: true },
    ],
    
    steps: [
      {
        title: 'Make Chapati Dough',
        body: 'Mix flour, salt, and sugar. Add oil and warm water gradually, mixing until a soft dough forms. Knead for 8-10 minutes until smooth.',
        time: 12,
        tips: ['The dough should be softer than bread dough'],
      },
      {
        title: 'Rest the Dough',
        body: 'Brush dough with oil, cover with a damp cloth, and let rest for 30 minutes. This makes rolling easier.',
        time: 30,
      },
      {
        title: 'Prepare Chai Spices',
        body: 'While dough rests, crush cardamom pods and grate ginger. Combine with cinnamon and pepper.',
        time: 3,
      },
      {
        title: 'Divide and Roll',
        body: 'Divide dough into 8 portions. Roll each into a thin circle, brush with oil, and fold into quarters.',
        time: 10,
        tips: ['The oil between layers creates the flaky texture'],
      },
      {
        title: 'Cook Chapati',
        body: 'Heat a dry skillet over medium-high heat. Cook each chapati for 1-2 minutes per side until golden spots appear and it puffs up.',
        time: 16,
        tips: ['Press gently with a cloth to help puffing'],
      },
      {
        title: 'Brew the Chai',
        body: 'Boil water with spices for 2 minutes. Add tea leaves and simmer for 3 minutes. Add milk and sugar, bring to a boil.',
        time: 8,
        tips: ['Watch carefully to prevent overflow'],
      },
      {
        title: 'Strain and Serve',
        body: 'Strain chai into cups. Serve hot with warm chapati. Can be enjoyed plain or with jam, honey, or eggs.',
        time: 2,
      },
    ],
    
    details: {
      servings: 4,
      prepTime: 45,
      cookTime: 35,
      totalTime: 80,
      difficulty: 'medium',
      cost: 'budget',
      equipment: ['Rolling pin', 'Skillet', 'Saucepan', 'Strainer'],
      allergens: ['Gluten', 'Dairy'],
      dietTags: ['Vegetarian'],
      cuisine: 'East African-Indian fusion',
      course: ['Breakfast'],
      rating: 4.9,
      ratingCount: 567,
    },
    
    nutrition: {
      calories: 290,
      carbs: 48,
      protein: 8,
      fat: 8,
      fiber: 2,
      sugar: 10,
      sodium: 300,
    },
    
    tips: [
      'Stack cooked chapatis and cover to keep soft',
      'Leftover chapati can be used to make chapati rolls',
      'Add cloves or fennel seeds to chai for variation',
    ],
    
    createdBy: 'curated',
    tags: ['breakfast', 'chapati', 'chai', 'tea', 'flatbread'],
    time: '80 min',
    difficulty: 'Medium',
    minutes: 80,
  },
  
  // Additional Enhanced Breakfast Recipes
  {
    id: createId('breakfast', 4),
    title: 'Sambusa (Samosas)',
    summary: 'Crispy triangular pastries filled with spiced meat or vegetables, perfect for breakfast or any time.',
    description: 'These golden triangular delights are a beloved breakfast treat across East Africa. Crispy on the outside with flavorful spiced filling, sambusas are perfect with a cup of chai.',
    
    image: require('@/assets/images/samosas.jpg'),
    images: [require('@/assets/images/samosas.jpg')],
    heroImage: require('@/assets/images/samosas.jpg'),
    
    ingredients: [
      { name: 'Spring roll wrappers', quantity: 1, unit: 'package', group: 'Wrapper' },
      { name: 'Ground beef or chicken', quantity: 300, unit: 'g', group: 'Filling' },
      { name: 'Onions', quantity: 1, unit: 'medium', note: 'Finely diced' },
      { name: 'Garlic', quantity: 3, unit: 'cloves', note: 'Minced' },
      { name: 'Ginger', quantity: 1, unit: 'tsp', note: 'Minced' },
      { name: 'Cumin powder', quantity: 1, unit: 'tsp' },
      { name: 'Coriander powder', quantity: 1, unit: 'tsp' },
      { name: 'Turmeric powder', quantity: 0.5, unit: 'tsp' },
      { name: 'Green chilies', quantity: 2, unit: 'pieces', note: 'Finely chopped' },
      { name: 'Fresh coriander', quantity: 0.25, unit: 'cup', note: 'Chopped' },
      { name: 'Salt', quantity: 1, unit: 'tsp' },
      { name: 'Vegetable oil', quantity: 2, unit: 'cups', note: 'For deep frying' },
    ],
    
    steps: [
      {
        title: 'Prepare the Filling',
        body: 'Heat oil in a pan. Sauté onions until golden, add garlic and ginger. Add meat and spices, cook until meat is done and dry.',
        time: 15,
      },
      {
        title: 'Season and Cool',
        body: 'Add salt, chilies, and fresh coriander. Mix well and let the filling cool completely.',
        time: 20,
      },
      {
        title: 'Wrap the Sambusas',
        body: 'Cut spring roll wrappers in half. Place filling at one end and fold into triangles, sealing edges with water.',
        time: 20,
        tips: ['Ensure triangles are well sealed to prevent opening during frying'],
      },
      {
        title: 'Deep Fry',
        body: 'Heat oil to 180°C. Fry sambusas in batches until golden brown and crispy, about 3-4 minutes.',
        time: 10,
        temperature: { value: 180, unit: 'C' },
      },
      {
        title: 'Serve',
        body: 'Drain on paper towels and serve hot with tamarind or mint chutney.',
        time: 2,
      },
    ],
    
    details: {
      servings: 6,
      prepTime: 30,
      cookTime: 25,
      totalTime: 55,
      difficulty: 'medium',
      cost: 'budget',
      equipment: ['Deep frying pan', 'Slotted spoon'],
      allergens: ['Gluten'],
      dietTags: ['Halal'],
      cuisine: 'Somali-East African',
      course: ['Breakfast', 'Snack'],
      rating: 4.7,
      ratingCount: 234,
    },
    
    nutrition: {
      calories: 180,
      carbs: 15,
      protein: 12,
      fat: 8,
      fiber: 1,
      sodium: 320,
    },
    
    tips: [
      'Can be made with vegetable filling for vegetarian option',
      'Freeze uncooked sambusas for quick snacks later',
      'Serve with spicy tamarind chutney',
    ],
    
    createdBy: 'curated',
    tags: ['breakfast', 'somali', 'fried', 'snack', 'pastry'],
    time: '55 min',
    difficulty: 'Medium',
    minutes: 55,
  },
  
  {
    id: createId('breakfast', 5),
    title: 'Mkate wa Ufuta (Rice Pancakes)',
    summary: 'Fluffy Tanzanian rice pancakes that are naturally gluten-free and perfect for breakfast.',
    description: 'These delightful rice-based pancakes from Tanzania are naturally gluten-free and have a unique texture. Made with rice flour and coconut milk, they offer a tropical twist to your morning meal.',
    
    image: require('@/assets/images/mkate-ufuta.jpg'),
    images: [require('@/assets/images/mkate-ufuta.jpg')],
    heroImage: require('@/assets/images/mkate-ufuta.jpg'),
    
    ingredients: [
      { name: 'Rice flour', quantity: 2, unit: 'cups', group: 'Dry ingredients' },
      { name: 'Coconut milk', quantity: 1.5, unit: 'cups', group: 'Wet ingredients' },
      { name: 'Sugar', quantity: 3, unit: 'tbsp' },
      { name: 'Active dry yeast', quantity: 1, unit: 'tsp' },
      { name: 'Warm water', quantity: 0.25, unit: 'cup' },
      { name: 'Salt', quantity: 0.5, unit: 'tsp' },
      { name: 'Cardamom powder', quantity: 0.5, unit: 'tsp' },
      { name: 'Vegetable oil', quantity: 2, unit: 'tbsp', note: 'For cooking' },
    ],
    
    steps: [
      {
        title: 'Activate Yeast',
        body: 'Dissolve yeast in warm water with 1 tsp sugar. Let sit for 5 minutes until foamy.',
        time: 5,
      },
      {
        title: 'Make Batter',
        body: 'Mix rice flour, remaining sugar, salt, and cardamom. Add coconut milk and yeast mixture. Whisk until smooth.',
        time: 5,
      },
      {
        title: 'Let Rise',
        body: 'Cover and let the batter rest in a warm place for 30 minutes until slightly bubbly.',
        time: 30,
      },
      {
        title: 'Cook Pancakes',
        body: 'Heat oil in a pan. Pour batter to form small pancakes. Cook for 2-3 minutes per side until golden.',
        time: 15,
        tips: ['Keep heat medium to ensure even cooking'],
      },
      {
        title: 'Serve',
        body: 'Serve hot with honey, jam, or fresh fruit.',
        time: 2,
      },
    ],
    
    details: {
      servings: 4,
      prepTime: 40,
      cookTime: 15,
      totalTime: 55,
      difficulty: 'easy',
      cost: 'budget',
      equipment: ['Mixing bowl', 'Frying pan', 'Whisk'],
      allergens: [],
      dietTags: ['Gluten-free', 'Vegetarian'],
      cuisine: 'Tanzanian',
      course: ['Breakfast'],
      rating: 4.5,
      ratingCount: 156,
    },
    
    nutrition: {
      calories: 260,
      carbs: 45,
      protein: 4,
      fat: 8,
      fiber: 2,
      sugar: 8,
      sodium: 150,
    },
    
    tips: [
      'Rice flour gives these pancakes a unique texture',
      'Can add grated coconut for extra flavor',
      'Best served fresh and warm',
    ],
    
    createdBy: 'curated',
    tags: ['breakfast', 'tanzanian', 'gluten-free', 'pancakes', 'rice'],
    time: '55 min',
    difficulty: 'Easy',
    minutes: 55,
  },
  
  
  {
    id: createId('breakfast', 7),
    title: 'Injera with Scrambled Eggs',
    summary: 'Ethiopian sourdough flatbread served with spiced scrambled eggs for an authentic East African breakfast.',
    description: 'Injera, the spongy sourdough flatbread that\'s Ethiopia\'s staple, pairs beautifully with scrambled eggs seasoned with berbere spice. This combination offers a unique breakfast experience.',
    
    image: require('@/assets/images/injera.webp'),
    images: [require('@/assets/images/injera.webp')],
    heroImage: require('@/assets/images/injera.webp'),
    
    ingredients: [
      { name: 'Injera bread', quantity: 4, unit: 'pieces', note: 'Store-bought or homemade', group: 'Bread' },
      { name: 'Eggs', quantity: 6, unit: 'large', group: 'Scrambled Eggs' },
      { name: 'Onions', quantity: 1, unit: 'medium', note: 'Diced' },
      { name: 'Tomatoes', quantity: 2, unit: 'medium', note: 'Diced' },
      { name: 'Berbere spice', quantity: 1, unit: 'tsp', note: 'Ethiopian spice blend' },
      { name: 'Garlic', quantity: 2, unit: 'cloves', note: 'Minced' },
      { name: 'Ginger', quantity: 1, unit: 'tsp', note: 'Minced' },
      { name: 'Clarified butter (niter kibbeh)', quantity: 3, unit: 'tbsp' },
      { name: 'Salt', quantity: 0.5, unit: 'tsp' },
      { name: 'Fresh coriander', quantity: 0.25, unit: 'cup', note: 'Chopped' },
    ],
    
    steps: [
      {
        title: 'Warm Injera',
        body: 'Warm injera bread in a dry pan for 30 seconds per side or wrap in damp cloth and microwave briefly.',
        time: 2,
      },
      {
        title: 'Sauté Aromatics',
        body: 'Heat clarified butter in a pan. Add onions and cook until translucent. Add garlic, ginger, and berbere spice.',
        time: 5,
      },
      {
        title: 'Add Tomatoes',
        body: 'Add diced tomatoes and cook until they soften and release juices, about 3-4 minutes.',
        time: 4,
      },
      {
        title: 'Scramble Eggs',
        body: 'Beat eggs with salt. Pour into the pan and gently scramble, stirring frequently until just set but still creamy.',
        time: 3,
        tips: ['Don\'t overcook - eggs continue cooking after removing from heat'],
      },
      {
        title: 'Garnish and Serve',
        body: 'Sprinkle with fresh coriander. Serve immediately over warm injera, allowing diners to tear and scoop.',
        time: 1,
      },
    ],
    
    details: {
      servings: 2,
      prepTime: 5,
      cookTime: 15,
      totalTime: 20,
      difficulty: 'medium',
      cost: 'moderate',
      equipment: ['Frying pan', 'Whisk'],
      allergens: ['Eggs', 'Dairy'],
      dietTags: ['Vegetarian', 'Gluten-free'],
      cuisine: 'Ethiopian',
      course: ['Breakfast'],
      rating: 4.6,
      ratingCount: 198,
    },
    
    nutrition: {
      calories: 340,
      carbs: 15,
      protein: 20,
      fat: 22,
      fiber: 3,
      sugar: 4,
      sodium: 420,
    },
    
    tips: [
      'Berbere spice is key - find it at Ethiopian markets',
      'Injera can be found frozen in many international stores',
      'Eat with your hands using pieces of injera to scoop',
    ],
    
    createdBy: 'curated',
    tags: ['breakfast', 'ethiopian', 'injera', 'eggs', 'spiced'],
    time: '20 min',
    difficulty: 'Medium',
    minutes: 20,
  },
  
  {
    id: createId('breakfast', 8),
    title: 'Mahamri (Swahili Donuts)',
    summary: 'Sweet, cardamom-scented donuts from the Swahili coast, perfect with chai or coffee.',
    description: 'Mahamri are delightful Swahili coast donuts that are slightly sweet and beautifully spiced with cardamom. These triangular treats are perfect for breakfast or as an afternoon snack with tea.',
    
    image: require('@/assets/images/mahamri.jpg'),
    images: [require('@/assets/images/mahamri.jpg')],
    heroImage: require('@/assets/images/mahamri.jpg'),
    
    ingredients: [
      { name: 'All-purpose flour', quantity: 3, unit: 'cups', group: 'Dry ingredients' },
      { name: 'Sugar', quantity: 0.5, unit: 'cup' },
      { name: 'Active dry yeast', quantity: 1, unit: 'packet' },
      { name: 'Ground cardamom', quantity: 1, unit: 'tsp' },
      { name: 'Salt', quantity: 0.5, unit: 'tsp' },
      { name: 'Coconut milk', quantity: 1, unit: 'cup', group: 'Wet ingredients' },
      { name: 'Warm water', quantity: 0.25, unit: 'cup' },
      { name: 'Ghee or butter', quantity: 3, unit: 'tbsp', note: 'Melted' },
      { name: 'Vegetable oil', quantity: 2, unit: 'cups', note: 'For deep frying', group: 'For frying' },
    ],
    
    steps: [
      {
        title: 'Activate Yeast',
        body: 'Mix yeast with warm water and 1 tsp sugar. Let sit for 5-10 minutes until foamy.',
        time: 10,
      },
      {
        title: 'Make Dough',
        body: 'Combine flour, remaining sugar, cardamom, and salt. Add coconut milk, yeast mixture, and melted ghee. Mix to form soft dough.',
        time: 8,
      },
      {
        title: 'Knead and Rise',
        body: 'Knead for 8-10 minutes until smooth. Place in oiled bowl, cover, and let rise for 1 hour until doubled.',
        time: 70,
      },
      {
        title: 'Shape and Second Rise',
        body: 'Punch down dough. Roll and cut into triangles. Place on floured surface, cover, and let rise 30 minutes.',
        time: 35,
      },
      {
        title: 'Fry Mahamri',
        body: 'Heat oil to 350°F. Fry mahamri in batches for 2-3 minutes per side until golden brown and puffed.',
        time: 12,
        temperature: { value: 175, unit: 'C' },
      },
      {
        title: 'Drain and Serve',
        body: 'Drain on paper towels. Serve warm with chai tea or coffee.',
        time: 2,
      },
    ],
    
    details: {
      servings: 10,
      prepTime: 20,
      cookTime: 15,
      totalTime: 140,
      difficulty: 'medium',
      cost: 'budget',
      equipment: ['Mixing bowl', 'Deep frying pan', 'Slotted spoon'],
      allergens: ['Gluten', 'Dairy'],
      dietTags: ['Vegetarian'],
      cuisine: 'Swahili',
      course: ['Breakfast', 'Snack'],
      rating: 4.7,
      ratingCount: 289,
    },
    
    nutrition: {
      calories: 240,
      carbs: 35,
      protein: 5,
      fat: 9,
      fiber: 1,
      sugar: 8,
      sodium: 180,
    },
    
    tips: [
      'The dough should be soft and slightly sticky',
      'Don\'t skip the second rise for fluffy mahamri',
      'Dust with powdered sugar for extra sweetness',
    ],
    
    createdBy: 'curated',
    tags: ['breakfast', 'swahili', 'donuts', 'fried', 'sweet'],
    time: '140 min',
    difficulty: 'Medium',
    minutes: 140,
  },
];

// Rich East African Lunch Recipes  
export const enhancedLunchRecipes: Recipe[] = [
  {
    id: createId('lunch', 1),
    title: 'Nyama Choma (Grilled Meat)',
    summary: 'Kenya\'s national dish - succulent grilled meat marinated in local spices, perfect for gatherings.',
    description: 'Nyama Choma, literally meaning "roasted meat" in Swahili, is more than just food - it\'s a social experience. This beloved dish brings people together around the grill, creating memories over perfectly charred, tender meat.',
    
    image: require('@/assets/images/food-example.jpg'),
    images: [require('@/assets/images/food-example.jpg')],
    heroImage: require('@/assets/images/food-example.jpg'),
    
    ingredients: [
      { name: 'Goat meat or beef', quantity: 2, unit: 'kg', note: 'Cut into large pieces', group: 'Meat' },
      { name: 'Lemon juice', quantity: 0.25, unit: 'cup', group: 'Marinade' },
      { name: 'Vegetable oil', quantity: 3, unit: 'tbsp' },
      { name: 'Garlic', quantity: 6, unit: 'cloves', note: 'Minced' },
      { name: 'Fresh ginger', quantity: 2, unit: 'tbsp', note: 'Minced' },
      { name: 'Royco beef cube', quantity: 2, unit: 'cubes', note: 'Crushed' },
      { name: 'Black pepper', quantity: 1, unit: 'tbsp', note: 'Freshly ground' },
      { name: 'Paprika', quantity: 1, unit: 'tbsp' },
      { name: 'Coriander powder', quantity: 1, unit: 'tsp' },
      { name: 'Salt', quantity: 2, unit: 'tsp' },
      { name: 'Onions', quantity: 2, unit: 'large', note: 'For serving', group: 'Accompaniments' },
      { name: 'Tomatoes', quantity: 4, unit: 'medium' },
      { name: 'Fresh coriander', quantity: 1, unit: 'bunch' },
      { name: 'Green chilies', quantity: 2, unit: 'pieces', optional: true },
    ],
    
    steps: [
      {
        title: 'Prepare the Marinade',
        body: 'Combine lemon juice, oil, garlic, ginger, crushed Royco cubes, black pepper, paprika, and coriander powder to create a thick paste.',
        time: 5,
      },
      {
        title: 'Marinate the Meat',
        body: 'Score the meat pieces deeply. Rub the marinade thoroughly into all surfaces and cuts. Cover and refrigerate for at least 2 hours, preferably overnight.',
        time: 10,
        tips: ['Longer marination = more flavor', 'Bring to room temperature before grilling'],
      },
      {
        title: 'Prepare the Grill',
        body: 'Heat charcoal grill to medium-high heat. The coals should be white-hot with no flames. Clean and oil the grill grates.',
        time: 20,
        temperature: { value: 200, unit: 'C' },
      },
      {
        title: 'Grill the Meat',
        body: 'Place meat on grill, not directly over flames. Grill for 15-20 minutes per side, turning occasionally for even charring.',
        time: 40,
        tips: ['Don\'t flip too often', 'Use a meat thermometer for doneness'],
      },
      {
        title: 'Prepare Kachumbari',
        body: 'While meat grills, dice onions and tomatoes finely. Mix with chopped coriander, chilies, and a pinch of salt. Add lemon juice.',
        time: 5,
      },
      {
        title: 'Rest and Serve',
        body: 'Let meat rest for 5 minutes before cutting. Slice into serving pieces. Serve hot with kachumbari, ugali, and cold beer.',
        time: 5,
        tips: ['Resting keeps the meat juicy'],
      },
    ],
    
    details: {
      servings: 6,
      prepTime: 140,
      cookTime: 45,
      totalTime: 185,
      difficulty: 'medium',
      cost: 'moderate',
      equipment: ['Charcoal grill', 'Tongs', 'Meat thermometer', 'Cutting board'],
      allergens: [],
      dietTags: ['High-protein', 'Keto-friendly', 'Paleo'],
      cuisine: 'Kenyan',
      course: ['Lunch', 'Dinner'],
      occasion: ['Weekend', 'Party', 'Special occasions'],
      rating: 4.9,
      ratingCount: 678,
      favoriteCount: 2340,
    },
    
    nutrition: {
      calories: 420,
      carbs: 5,
      protein: 45,
      fat: 24,
      fiber: 1,
      sugar: 2,
      sodium: 580,
      cholesterol: 130,
    },
    
    tips: [
      'Goat meat is traditional, but beef or chicken work well',
      'Serve with ugali to soak up the juices',
      'Keep some marinade aside for basting while grilling',
    ],
    variations: [
      'Mbuzi Choma - specifically using goat meat',
      'Kuku Choma - grilled chicken version',
      'Fish Nyama Choma - using whole tilapia',
    ],
    pairings: ['Ugali', 'Kachumbari salad', 'Tusker beer', 'Sukuma wiki'],
    
    createdBy: 'curated',
    author: 'Traditional Kenyan Recipe',
    tags: ['lunch', 'dinner', 'grilled', 'meat', 'kenyan', 'social'],
    time: '3 hours',
    difficulty: 'Medium',
    minutes: 185,
  },
  
  {
    id: createId('lunch', 2),
    title: 'Pilau (Spiced Rice)',
    summary: 'Aromatic one-pot rice dish infused with exotic spices, a Swahili coast favorite for special occasions.',
    description: 'Pilau represents the rich spice trade history of the East African coast. This fragrant rice dish, with its complex blend of spices, transforms simple ingredients into a celebration-worthy meal.',
    
    image: require('@/assets/images/pilau.jpg'),
    images: [require('@/assets/images/pilau.jpg')],
    heroImage: require('@/assets/images/pilau.jpg'),
    
    ingredients: [
      { name: 'Basmati rice', quantity: 2, unit: 'cups', group: 'Base' },
      { name: 'Beef or chicken', quantity: 500, unit: 'g', note: 'Cut in chunks' },
      { name: 'Onions', quantity: 2, unit: 'large', note: 'Sliced thin' },
      { name: 'Garlic', quantity: 1, unit: 'tbsp', note: 'Minced' },
      { name: 'Ginger', quantity: 1, unit: 'tbsp', note: 'Minced' },
      { name: 'Tomato paste', quantity: 2, unit: 'tbsp' },
      { name: 'Beef/chicken stock', quantity: 4, unit: 'cups' },
      { name: 'Vegetable oil', quantity: 3, unit: 'tbsp' },
      { name: 'Cinnamon sticks', quantity: 2, unit: 'pieces', group: 'Whole Spices' },
      { name: 'Cardamom pods', quantity: 6, unit: 'pods' },
      { name: 'Cloves', quantity: 6, unit: 'whole' },
      { name: 'Black peppercorns', quantity: 1, unit: 'tsp' },
      { name: 'Cumin seeds', quantity: 1, unit: 'tsp' },
      { name: 'Pilau masala', quantity: 2, unit: 'tbsp', group: 'Ground Spices' },
      { name: 'Royco cube', quantity: 1, unit: 'cube' },
      { name: 'Salt', quantity: 1, unit: 'tsp' },
    ],
    
    steps: [
      {
        title: 'Brown the Meat',
        body: 'Heat oil in a heavy-bottomed pot. Season meat with salt and brown on all sides. Remove and set aside.',
        time: 10,
        tips: ['Don\'t overcrowd the pot', 'High heat for good browning'],
      },
      {
        title: 'Toast Whole Spices',
        body: 'In the same oil, add whole spices (cinnamon, cardamom, cloves, peppercorns, cumin). Toast for 1 minute until fragrant.',
        time: 2,
        tips: ['Don\'t let them burn'],
      },
      {
        title: 'Caramelize Onions',
        body: 'Add sliced onions and cook slowly until deep golden brown. This is crucial for color and flavor - be patient!',
        time: 15,
        tips: ['Low-medium heat', 'Stir occasionally'],
      },
      {
        title: 'Build the Base',
        body: 'Add garlic and ginger, cook for 2 minutes. Add tomato paste and pilau masala, stirring constantly for another 2 minutes.',
        time: 4,
      },
      {
        title: 'Cook the Meat',
        body: 'Return meat to pot. Add crushed Royco cube and 1 cup of stock. Cover and simmer until meat is tender, about 30 minutes.',
        time: 30,
      },
      {
        title: 'Add Rice',
        body: 'Add rice and stir gently to coat with the spiced mixture. Pour in remaining stock (should be 1 inch above rice).',
        time: 3,
      },
      {
        title: 'Cook the Pilau',
        body: 'Bring to a boil, then reduce heat to low. Cover tightly and simmer for 20 minutes. Don\'t lift the lid!',
        time: 20,
        tips: ['Tight-fitting lid is essential'],
      },
      {
        title: 'Rest and Fluff',
        body: 'Turn off heat and let stand for 5 minutes. Fluff gently with a fork before serving.',
        time: 5,
      },
    ],
    
    details: {
      servings: 6,
      prepTime: 20,
      cookTime: 70,
      totalTime: 90,
      difficulty: 'medium',
      cost: 'moderate',
      equipment: ['Heavy-bottomed pot with lid', 'Wooden spoon'],
      allergens: [],
      dietTags: ['Halal', 'Dairy-free'],
      cuisine: 'Swahili',
      course: ['Lunch', 'Dinner'],
      occasion: ['Eid', 'Weddings', 'Special occasions'],
      rating: 4.8,
      ratingCount: 534,
    },
    
    nutrition: {
      calories: 380,
      carbs: 52,
      protein: 22,
      fat: 10,
      fiber: 2,
      sugar: 3,
      sodium: 490,
    },
    
    tips: [
      'Use aged basmati rice for best results',
      'Make your own pilau masala by grinding the whole spices',
      'Add raisins and cashews for festive occasions',
    ],
    
    createdBy: 'curated',
    tags: ['lunch', 'rice', 'spiced', 'one-pot', 'swahili'],
    time: '90 min',
    difficulty: 'Medium',
    minutes: 90,
  },
  
  // Additional Enhanced Lunch Recipes
  {
    id: createId('lunch', 3),
    title: 'Githeri (Beans & Maize)',
    summary: 'A nutritious Kenyan one-pot meal combining beans and maize, often enhanced with vegetables and meat.',
    description: 'Githeri is a beloved Kenyan comfort food that combines boiled beans and maize. This hearty, nutritious dish can be enjoyed as is or enhanced with vegetables, meat, and spices for a complete meal.',
    
    image: require('@/assets/images/githeri.jpg'),
    images: [require('@/assets/images/githeri.jpg')],
    heroImage: require('@/assets/images/githeri.jpg'),
    
    ingredients: [
      { name: 'Dried kidney beans', quantity: 1, unit: 'cup', note: 'Soaked overnight', group: 'Base' },
      { name: 'Whole kernel corn', quantity: 1, unit: 'cup', note: 'Dried or fresh' },
      { name: 'Beef or chicken', quantity: 300, unit: 'g', note: 'Cut in chunks', optional: true },
      { name: 'Onions', quantity: 1, unit: 'large', note: 'Diced' },
      { name: 'Tomatoes', quantity: 2, unit: 'medium', note: 'Diced' },
      { name: 'Carrots', quantity: 2, unit: 'medium', note: 'Diced' },
      { name: 'Green bell pepper', quantity: 1, unit: 'medium', note: 'Diced' },
      { name: 'Garlic', quantity: 3, unit: 'cloves', note: 'Minced' },
      { name: 'Royco beef cube', quantity: 2, unit: 'cubes' },
      { name: 'Curry powder', quantity: 1, unit: 'tbsp' },
      { name: 'Vegetable oil', quantity: 3, unit: 'tbsp' },
      { name: 'Fresh coriander', quantity: 0.25, unit: 'cup', note: 'Chopped' },
      { name: 'Salt', quantity: 1, unit: 'tsp' },
    ],
    
    steps: [
      {
        title: 'Prepare Beans and Corn',
        body: 'Boil pre-soaked beans and corn separately until tender. Beans may take 45-60 minutes, corn about 30 minutes.',
        time: 60,
        tips: ['Soak beans overnight for faster cooking'],
      },
      {
        title: 'Brown the Meat',
        body: 'If using meat, heat oil in a large pot and brown meat pieces on all sides. Season with salt and pepper.',
        time: 8,
        tips: ['This step is optional if not using meat'],
      },
      {
        title: 'Build the Base',
        body: 'Add onions to the pot and cook until soft. Add garlic and curry powder, cooking for 1 minute until fragrant.',
        time: 5,
      },
      {
        title: 'Add Vegetables',
        body: 'Add tomatoes, carrots, and bell pepper. Cook until tomatoes break down and vegetables start to soften.',
        time: 8,
      },
      {
        title: 'Combine Everything',
        body: 'Add cooked beans, corn, crumbled Royco cubes, and enough water to create a thick stew. Simmer for 15 minutes.',
        time: 15,
      },
      {
        title: 'Final Seasoning',
        body: 'Adjust seasoning with salt and pepper. Garnish with fresh coriander before serving.',
        time: 2,
      },
    ],
    
    details: {
      servings: 4,
      prepTime: 15,
      cookTime: 75,
      totalTime: 90,
      difficulty: 'easy',
      cost: 'budget',
      equipment: ['Large pot', 'Wooden spoon'],
      allergens: [],
      dietTags: ['High-protein', 'High-fiber', 'Vegetarian (without meat)'],
      cuisine: 'Kenyan',
      course: ['Lunch', 'Dinner'],
      rating: 4.6,
      ratingCount: 345,
    },
    
    nutrition: {
      calories: 320,
      carbs: 52,
      protein: 18,
      fat: 6,
      fiber: 12,
      sugar: 8,
      sodium: 480,
    },
    
    tips: [
      'Soak beans overnight to reduce cooking time',
      'Can add greens like spinach in the last 5 minutes',
      'Leftovers taste even better the next day',
    ],
    
    createdBy: 'curated',
    tags: ['lunch', 'kenyan', 'beans', 'one-pot', 'nutritious'],
    time: '90 min',
    difficulty: 'Easy',
    minutes: 90,
  },
  
  {
    id: createId('lunch', 4),
    title: 'Mukimo (Mashed Vegetables)',
    summary: 'Traditional Kenyan mashed dish combining potatoes, greens, beans, and corn.',
    description: 'Mukimo is a beloved Kikuyu dish that transforms simple vegetables into a comforting, nutritious meal. The combination of potatoes, greens, beans, and corn creates a satisfying dish rich in vitamins and fiber.',
    
    image: require('@/assets/images/mukimo.jpg'),
    images: [require('@/assets/images/mukimo.jpg')],
    heroImage: require('@/assets/images/mukimo.jpg'),
    
    ingredients: [
      { name: 'Potatoes', quantity: 6, unit: 'medium', note: 'Peeled and quartered', group: 'Base' },
      { name: 'Green beans', quantity: 1, unit: 'cup', note: 'Trimmed and chopped' },
      { name: 'Sweet corn kernels', quantity: 1, unit: 'cup' },
      { name: 'Pumpkin leaves or spinach', quantity: 2, unit: 'cups', note: 'Chopped' },
      { name: 'Green peas', quantity: 0.5, unit: 'cup', optional: true },
      { name: 'Onions', quantity: 1, unit: 'medium', note: 'Diced' },
      { name: 'Garlic', quantity: 2, unit: 'cloves', note: 'Minced' },
      { name: 'Vegetable oil', quantity: 2, unit: 'tbsp' },
      { name: 'Salt', quantity: 1, unit: 'tsp' },
      { name: 'Black pepper', quantity: 0.5, unit: 'tsp' },
    ],
    
    steps: [
      {
        title: 'Boil Potatoes',
        body: 'Boil potatoes in salted water until tender, about 15-20 minutes. Drain and set aside.',
        time: 20,
      },
      {
        title: 'Cook Other Vegetables',
        body: 'In the same pot, boil green beans, corn, and peas until tender, about 10 minutes. Add greens in the last 2 minutes.',
        time: 10,
      },
      {
        title: 'Sauté Aromatics',
        body: 'Heat oil in a large pan. Sauté onions until soft, then add garlic and cook for 1 minute.',
        time: 5,
      },
      {
        title: 'Combine and Mash',
        body: 'Add all vegetables to the pan. Mash together until well combined but still chunky. Season with salt and pepper.',
        time: 8,
        tips: ['Don\'t over-mash - some texture is good'],
      },
      {
        title: 'Final Mixing',
        body: 'Mix everything thoroughly and cook for 2-3 minutes to blend flavors. Serve hot.',
        time: 3,
      },
    ],
    
    details: {
      servings: 4,
      prepTime: 15,
      cookTime: 35,
      totalTime: 50,
      difficulty: 'easy',
      cost: 'budget',
      equipment: ['Large pot', 'Potato masher', 'Frying pan'],
      allergens: [],
      dietTags: ['Vegetarian', 'Vegan', 'Gluten-free', 'High-fiber'],
      cuisine: 'Kenyan',
      course: ['Lunch', 'Dinner'],
      rating: 4.5,
      ratingCount: 267,
    },
    
    nutrition: {
      calories: 280,
      carbs: 58,
      protein: 8,
      fat: 4,
      fiber: 8,
      sugar: 6,
      sodium: 320,
    },
    
    tips: [
      'Use any available green vegetables',
      'Can add groundnuts for extra protein',
      'Great side dish for grilled meats',
    ],
    
    createdBy: 'curated',
    tags: ['lunch', 'kenyan', 'vegetables', 'mashed', 'traditional'],
    time: '50 min',
    difficulty: 'Easy',
    minutes: 50,
  },
  
  {
    id: createId('lunch', 5),
    title: 'Wali wa Nazi (Coconut Rice)',
    summary: 'Fragrant Tanzanian rice cooked in coconut milk, perfect as a side or main dish.',
    description: 'Wali wa Nazi is a popular Tanzanian dish where rice is cooked in rich coconut milk, creating a creamy, aromatic side dish that pairs beautifully with curries, grilled fish, or vegetables.',
    
    image: require('@/assets/images/waliwanazi.webp'),
    images: [require('@/assets/images/waliwanazi.webp')],
    heroImage: require('@/assets/images/waliwanazi.webp'),
    
    ingredients: [
      { name: 'Basmati rice', quantity: 2, unit: 'cups', group: 'Base' },
      { name: 'Coconut milk', quantity: 400, unit: 'ml', note: 'Thick coconut milk' },
      { name: 'Water', quantity: 1.5, unit: 'cups' },
      { name: 'Onions', quantity: 1, unit: 'small', note: 'Finely diced' },
      { name: 'Garlic', quantity: 2, unit: 'cloves', note: 'Minced' },
      { name: 'Ginger', quantity: 1, unit: 'tsp', note: 'Minced' },
      { name: 'Cardamom pods', quantity: 4, unit: 'whole' },
      { name: 'Cinnamon stick', quantity: 1, unit: 'small' },
      { name: 'Vegetable oil', quantity: 2, unit: 'tbsp' },
      { name: 'Salt', quantity: 1, unit: 'tsp' },
      { name: 'Fresh coriander', quantity: 2, unit: 'tbsp', note: 'Chopped', optional: true },
    ],
    
    steps: [
      {
        title: 'Wash Rice',
        body: 'Rinse basmati rice until water runs clear. Soak for 15 minutes, then drain.',
        time: 15,
      },
      {
        title: 'Sauté Aromatics',
        body: 'Heat oil in a heavy-bottomed pot. Add onions and cook until translucent. Add garlic and ginger.',
        time: 5,
      },
      {
        title: 'Add Spices',
        body: 'Add cardamom pods and cinnamon stick. Cook for 1 minute until fragrant.',
        time: 1,
      },
      {
        title: 'Add Rice',
        body: 'Add drained rice and stir gently to coat with the aromatics. Toast for 2 minutes.',
        time: 2,
      },
      {
        title: 'Add Liquids',
        body: 'Pour in coconut milk, water, and salt. Bring to a boil, then reduce heat to low, cover, and simmer for 18 minutes.',
        time: 20,
        tips: ['Don\'t lift the lid during cooking'],
      },
      {
        title: 'Rest and Fluff',
        body: 'Remove from heat and let stand for 5 minutes. Fluff with a fork and garnish with coriander.',
        time: 5,
      },
    ],
    
    details: {
      servings: 4,
      prepTime: 20,
      cookTime: 25,
      totalTime: 45,
      difficulty: 'easy',
      cost: 'moderate',
      equipment: ['Heavy-bottomed pot', 'Fork'],
      allergens: [],
      dietTags: ['Vegetarian', 'Vegan', 'Dairy-free', 'Gluten-free'],
      cuisine: 'Tanzanian',
      course: ['Lunch', 'Side dish'],
      rating: 4.7,
      ratingCount: 412,
    },
    
    nutrition: {
      calories: 360,
      carbs: 52,
      protein: 6,
      fat: 14,
      fiber: 1,
      sugar: 2,
      sodium: 320,
    },
    
    tips: [
      'Use good quality coconut milk for best flavor',
      'Can add raisins and cashews for festive occasions',
      'Perfect with fish curry or grilled chicken',
    ],
    
    createdBy: 'curated',
    tags: ['lunch', 'tanzanian', 'rice', 'coconut', 'side-dish'],
    time: '45 min',
    difficulty: 'Easy',
    minutes: 45,
  },
];

// Rich East African Dinner Recipes
export const enhancedDinnerRecipes: Recipe[] = [
  {
    id: createId('dinner', 1),
    title: 'Ugali with Sukuma Wiki & Beef Stew',
    summary: 'The quintessential East African dinner - cornmeal staple with sautéed collard greens and rich beef stew.',
    description: 'This trio represents the heart of East African home cooking. Ugali provides the foundation, sukuma wiki adds nutrition and color, while the beef stew brings rich, comforting flavors to complete this satisfying meal.',
    
    image: require('@/assets/images/ugalisukumabeef.jpeg'),
    images: [
      require('@/assets/images/ugalisukumabeef.jpeg'),
      require('@/assets/images/ugalisukumabeef.jpeg'),
    ],
    
    ingredients: [
      { name: 'White cornmeal', quantity: 3, unit: 'cups', group: 'For Ugali' },
      { name: 'Water', quantity: 6, unit: 'cups' },
      { name: 'Salt', quantity: 1, unit: 'tsp' },
      { name: 'Beef', quantity: 750, unit: 'g', note: 'Cut in chunks', group: 'For Beef Stew' },
      { name: 'Onions', quantity: 2, unit: 'large', note: 'Diced' },
      { name: 'Tomatoes', quantity: 4, unit: 'medium', note: 'Chopped' },
      { name: 'Garlic', quantity: 4, unit: 'cloves', note: 'Minced' },
      { name: 'Royco beef cube', quantity: 2, unit: 'cubes' },
      { name: 'Curry powder', quantity: 1, unit: 'tbsp' },
      { name: 'Beef stock', quantity: 2, unit: 'cups' },
      { name: 'Collard greens (sukuma)', quantity: 2, unit: 'bunches', group: 'For Sukuma Wiki' },
      { name: 'Cooking oil', quantity: 4, unit: 'tbsp' },
      { name: 'Carrots', quantity: 2, unit: 'medium', note: 'Optional' },
    ],
    
    steps: [
      {
        title: 'Start the Beef Stew',
        body: 'Brown beef pieces in oil over high heat. Add onions and cook until softened. Add garlic and curry powder.',
        time: 15,
      },
      {
        title: 'Simmer the Stew',
        body: 'Add tomatoes, Royco cubes, and stock. Cover and simmer for 45 minutes until beef is tender. Add water if needed.',
        time: 45,
        tips: ['Low and slow for tender meat'],
      },
      {
        title: 'Prepare Sukuma Wiki',
        body: 'Wash and chop collard greens into strips. Heat oil in a pan, add onions, then greens. Sauté for 10 minutes.',
        time: 15,
      },
      {
        title: 'Make the Ugali',
        body: 'Boil water with salt. Gradually add cornmeal while stirring vigorously. Cook for 15 minutes until thick and pulling from sides.',
        time: 20,
        tips: ['Continuous stirring prevents lumps'],
      },
      {
        title: 'Serve Together',
        body: 'Mound ugali on plates. Serve with sukuma wiki on one side and beef stew on the other. Eat with hands, using ugali to scoop.',
        time: 5,
      },
    ],
    
    details: {
      servings: 6,
      prepTime: 20,
      cookTime: 80,
      totalTime: 100,
      difficulty: 'medium',
      cost: 'budget',
      equipment: ['Large pot', 'Wooden spoon', 'Frying pan'],
      cuisine: 'East African',
      course: ['Dinner'],
      rating: 4.9,
      ratingCount: 890,
    },
    
    nutrition: {
      calories: 480,
      carbs: 58,
      protein: 32,
      fat: 12,
      fiber: 6,
      sodium: 620,
    },
    
    createdBy: 'curated',
    tags: ['dinner', 'traditional', 'ugali', 'stew', 'vegetables'],
    time: '100 min',
    difficulty: 'Medium',
    minutes: 100,
  },
  
  // Additional Enhanced Dinner Recipes
  {
    id: createId('dinner', 2),
    title: 'Biryani',
    summary: 'Aromatic layered rice dish with spiced meat, a celebration meal from the Swahili coast.',
    description: 'This fragrant biryani represents the rich culinary heritage of the Swahili coast. Layers of spiced rice and tender meat create a dish that\'s perfect for special occasions and gatherings.',
    
    image: require('@/assets/images/biryani.jpg'),
    images: [require('@/assets/images/biryani.jpg')],
    heroImage: require('@/assets/images/biryani.jpg'),
    
    ingredients: [
      { name: 'Basmati rice', quantity: 3, unit: 'cups', group: 'Rice' },
      { name: 'Chicken or goat meat', quantity: 1, unit: 'kg', note: 'Cut in pieces', group: 'Meat' },
      { name: 'Yogurt', quantity: 1, unit: 'cup', group: 'Marinade' },
      { name: 'Ginger-garlic paste', quantity: 2, unit: 'tbsp' },
      { name: 'Red chili powder', quantity: 1, unit: 'tbsp' },
      { name: 'Turmeric powder', quantity: 0.5, unit: 'tsp' },
      { name: 'Biryani masala', quantity: 2, unit: 'tbsp' },
      { name: 'Onions', quantity: 4, unit: 'large', note: 'Thinly sliced', group: 'Aromatics' },
      { name: 'Saffron', quantity: 0.5, unit: 'tsp', note: 'Soaked in warm milk' },
      { name: 'Whole spices', quantity: 1, unit: 'set', note: 'Bay leaves, cardamom, cinnamon, cloves' },
      { name: 'Mint leaves', quantity: 0.5, unit: 'cup' },
      { name: 'Coriander leaves', quantity: 0.5, unit: 'cup' },
      { name: 'Ghee', quantity: 4, unit: 'tbsp' },
      { name: 'Salt', quantity: 2, unit: 'tsp' },
    ],
    
    steps: [
      {
        title: 'Marinate Meat',
        body: 'Mix meat with yogurt, ginger-garlic paste, chili powder, turmeric, and half the biryani masala. Marinate for 2 hours.',
        time: 120,
      },
      {
        title: 'Fry Onions',
        body: 'Deep fry sliced onions until golden brown. Reserve half for garnish, crush the rest.',
        time: 15,
      },
      {
        title: 'Cook Meat',
        body: 'Cook marinated meat with crushed fried onions until tender, about 45 minutes.',
        time: 45,
      },
      {
        title: 'Parboil Rice',
        body: 'Boil rice with whole spices and salt until 70% cooked. Drain and set aside.',
        time: 8,
      },
      {
        title: 'Layer the Biryani',
        body: 'Layer rice over cooked meat. Sprinkle with saffron milk, mint, coriander, and reserved fried onions.',
        time: 10,
      },
      {
        title: 'Final Cooking (Dum)',
        body: 'Cover tightly and cook on high for 3 minutes, then low for 45 minutes. Let rest for 10 minutes before serving.',
        time: 60,
      },
    ],
    
    details: {
      servings: 6,
      prepTime: 150,
      cookTime: 90,
      totalTime: 240,
      difficulty: 'hard',
      cost: 'expensive',
      equipment: ['Heavy-bottomed pot', 'Deep frying pan'],
      allergens: ['Dairy'],
      dietTags: ['Halal'],
      cuisine: 'Swahili',
      course: ['Dinner'],
      occasion: ['Special occasions', 'Celebrations'],
      rating: 4.9,
      ratingCount: 892,
    },
    
    nutrition: {
      calories: 520,
      carbs: 62,
      protein: 28,
      fat: 18,
      fiber: 2,
      sodium: 680,
    },
    
    tips: [
      'Soak saffron in warm milk for best color',
      'Don\'t skip the dum cooking - it\'s crucial for flavor',
      'Serve with raita and boiled eggs',
    ],
    
    createdBy: 'curated',
    tags: ['dinner', 'biryani', 'celebration', 'spiced-rice', 'swahili'],
    time: '4 hours',
    difficulty: 'Hard',
    minutes: 240,
  },
];

// Quick & Easy Recipes (Under 30 minutes)
export const enhancedQuickRecipes: Recipe[] = [
  {
    id: createId('quick', 1),
    title: 'Rolex (Ugandan Rolled Egg)',
    summary: 'Street food favorite - omelet rolled in chapati, ready in just 15 minutes!',
    description: 'The Rolex, a playful take on "rolled eggs," is Uganda\'s most popular street food. This quick, satisfying meal combines a vegetable-packed omelet with soft chapati for the perfect grab-and-go breakfast or snack.',
    
    image: require('@/assets/images/rolex.jpg'),
    images: [require('@/assets/images/rolex.jpg')],
    heroImage: require('@/assets/images/rolex.jpg'),
    
    ingredients: [
      { name: 'Eggs', quantity: 3, unit: 'large' },
      { name: 'Chapati', quantity: 1, unit: 'piece', note: 'Store-bought or homemade' },
      { name: 'Tomatoes', quantity: 1, unit: 'medium', note: 'Diced' },
      { name: 'Onions', quantity: 0.5, unit: 'medium', note: 'Diced' },
      { name: 'Cabbage', quantity: 0.25, unit: 'cup', note: 'Shredded' },
      { name: 'Green pepper', quantity: 0.25, unit: 'piece', note: 'Diced', optional: true },
      { name: 'Salt', quantity: 0.5, unit: 'tsp' },
      { name: 'Black pepper', quantity: 0.25, unit: 'tsp' },
      { name: 'Cooking oil', quantity: 1, unit: 'tbsp' },
    ],
    
    steps: [
      {
        title: 'Prepare Vegetables',
        body: 'Dice all vegetables finely. The key is to have them small enough to cook quickly with the eggs.',
        time: 3,
      },
      {
        title: 'Beat Eggs',
        body: 'Crack eggs into a bowl. Add vegetables, salt, and pepper. Beat well to combine.',
        time: 2,
      },
      {
        title: 'Cook Omelet',
        body: 'Heat oil in a pan. Pour in egg mixture and spread evenly. Cook for 2-3 minutes until bottom is set.',
        time: 3,
      },
      {
        title: 'Add Chapati',
        body: 'Place chapati on top of the partially cooked omelet. Press gently. Flip the entire thing and cook for 1 minute.',
        time: 2,
      },
      {
        title: 'Roll and Serve',
        body: 'Transfer to a plate, roll tightly, and wrap in paper or foil. Serve immediately while hot.',
        time: 1,
        tips: ['Can add chili sauce or ketchup before rolling'],
      },
    ],
    
    details: {
      servings: 1,
      prepTime: 5,
      cookTime: 10,
      totalTime: 15,
      difficulty: 'easy',
      cost: 'budget',
      equipment: ['Frying pan', 'Spatula'],
      allergens: ['Eggs', 'Gluten'],
      dietTags: ['Vegetarian'],
      cuisine: 'Ugandan',
      course: ['Breakfast', 'Snack'],
      rating: 4.8,
      ratingCount: 423,
    },
    
    nutrition: {
      calories: 320,
      carbs: 28,
      protein: 18,
      fat: 15,
      fiber: 3,
      sodium: 380,
    },
    
    tips: [
      'Use day-old chapati for easier rolling',
      'Add cheese for extra richness',
      'Great for using leftover vegetables',
    ],
    
    createdBy: 'curated',
    tags: ['quick', 'street-food', 'eggs', 'breakfast', 'ugandan'],
    time: '15 min',
    difficulty: 'Easy',
    minutes: 15,
  },
];

// Featured/Special Recipes
export const enhancedFeaturedRecipes: Recipe[] = [
  {
    id: createId('featured', 1),
    title: 'Tilapia in Coconut Curry',
    summary: 'Coastal delicacy featuring fresh fish in creamy coconut sauce with aromatic spices.',
    description: 'This Swahili coast specialty showcases the region\'s abundant seafood and coconut. The delicate tilapia absorbs the rich, spiced coconut curry, creating a dish that\'s both exotic and comforting.',
    
    image: require('@/assets/images/tilapiacoconut.jpg'),
    images: [
      require('@/assets/images/tilapiacoconut.jpg'),
      require('@/assets/images/tilapiacoconut.jpg'),
    ],
    
    ingredients: [
      { name: 'Whole tilapia', quantity: 2, unit: 'medium', note: 'Cleaned and scaled', group: 'Fish' },
      { name: 'Coconut milk', quantity: 400, unit: 'ml', group: 'Curry Sauce' },
      { name: 'Onions', quantity: 1, unit: 'large', note: 'Sliced' },
      { name: 'Tomatoes', quantity: 2, unit: 'medium', note: 'Diced' },
      { name: 'Garlic', quantity: 4, unit: 'cloves', note: 'Minced' },
      { name: 'Ginger', quantity: 1, unit: 'tbsp', note: 'Minced' },
      { name: 'Green chilies', quantity: 2, unit: 'pieces', note: 'Slit' },
      { name: 'Turmeric powder', quantity: 1, unit: 'tsp' },
      { name: 'Curry powder', quantity: 1, unit: 'tbsp' },
      { name: 'Cumin powder', quantity: 1, unit: 'tsp' },
      { name: 'Royco fish cube', quantity: 1, unit: 'cube' },
      { name: 'Lime juice', quantity: 2, unit: 'tbsp' },
      { name: 'Fresh coriander', quantity: 0.25, unit: 'cup' },
      { name: 'Cooking oil', quantity: 3, unit: 'tbsp' },
    ],
    
    steps: [
      {
        title: 'Marinate Fish',
        body: 'Make diagonal cuts on fish. Rub with salt, turmeric, and lime juice. Let marinate for 20 minutes.',
        time: 20,
      },
      {
        title: 'Pan-fry Fish',
        body: 'Heat oil in a large pan. Carefully fry fish for 3-4 minutes per side until golden. Remove and set aside.',
        time: 8,
        tips: ['Don\'t move fish too early or skin will stick'],
      },
      {
        title: 'Make Curry Base',
        body: 'In the same pan, sauté onions until soft. Add garlic, ginger, and chilies. Cook for 2 minutes.',
        time: 5,
      },
      {
        title: 'Add Spices',
        body: 'Add curry powder, cumin, and remaining turmeric. Stir for 1 minute. Add tomatoes and cook until soft.',
        time: 5,
      },
      {
        title: 'Create Coconut Curry',
        body: 'Pour in coconut milk and crumbled Royco cube. Simmer gently for 5 minutes. Don\'t boil or it will curdle.',
        time: 5,
        tips: ['Low heat is crucial for coconut milk'],
      },
      {
        title: 'Finish the Dish',
        body: 'Return fish to pan, spooning sauce over. Simmer for 5 minutes. Garnish with coriander and serve with rice.',
        time: 5,
      },
    ],
    
    details: {
      servings: 4,
      prepTime: 25,
      cookTime: 25,
      totalTime: 50,
      difficulty: 'medium',
      cost: 'moderate',
      equipment: ['Large pan', 'Fish spatula'],
      allergens: ['Fish'],
      dietTags: ['Pescatarian', 'Dairy-free', 'Gluten-free'],
      cuisine: 'Swahili Coast',
      course: ['Lunch', 'Dinner'],
      occasion: ['Special occasions', 'Weekend'],
      rating: 4.9,
      ratingCount: 456,
    },
    
    nutrition: {
      calories: 380,
      carbs: 12,
      protein: 35,
      fat: 22,
      fiber: 3,
      sodium: 420,
    },
    
    tips: [
      'Use any firm white fish as substitute',
      'Add tamarind paste for tangy flavor',
      'Serve with coconut rice for authentic experience',
    ],
    
    pairings: ['Coconut rice', 'Chapati', 'Kachumbari salad'],
    
    createdBy: 'curated',
    author: 'Coastal Traditional Recipe',
    tags: ['seafood', 'coconut', 'curry', 'swahili', 'featured'],
    time: '50 min',
    difficulty: 'Medium',
    minutes: 50,
  },
];

// Helper function to get time-based meal recommendations
export function getEnhancedMealsByTimeOfDay(): Recipe[] {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 11) {
    return enhancedBreakfastRecipes;
  } else if (hour >= 11 && hour < 16) {
    return enhancedLunchRecipes;
  } else {
    return enhancedDinnerRecipes;
  }
}

// Get all featured recipes
export function getEnhancedFeaturedRecipes(): Recipe[] {
  return [
    ...enhancedFeaturedRecipes,
    ...enhancedBreakfastRecipes.filter(r => r.details?.rating && r.details.rating >= 4.8),
    ...enhancedLunchRecipes.filter(r => r.details?.rating && r.details.rating >= 4.8),
  ];
}

// Get quick recipes (under 30 minutes)
export function getEnhancedQuickRecipes(): Recipe[] {
  return [
    ...enhancedQuickRecipes,
    ...enhancedBreakfastRecipes.filter(r => (r.details?.totalTime || 100) <= 30),
    ...enhancedLunchRecipes.filter(r => (r.details?.totalTime || 100) <= 30),
  ];
}

// Get all enhanced recipes
export function getAllEnhancedRecipes(): Recipe[] {
  const internationalRecipes = getInternationalRecipes();
  const all = [
    ...enhancedBreakfastRecipes,
    ...enhancedLunchRecipes,
    ...enhancedDinnerRecipes,
    ...enhancedQuickRecipes,
    ...enhancedFeaturedRecipes,
    ...internationalRecipes,
  ];

  // Apply local image overrides when titles match
  return all.map(r => {
    const override = imageOverrides[r.title as string];
    if (override) {
      return { ...r, image: override, heroImage: override };
    }
    return r;
  });
}

// Search recipes by ingredients
export function searchRecipesByIngredients(ingredients: string[]): Recipe[] {
  const searchTerms = ingredients.map(i => i.toLowerCase());
  
  return getAllEnhancedRecipes().filter(recipe => {
    const recipeIngredients = recipe.ingredients.map(i => i.name.toLowerCase());
    return searchTerms.some(term => 
      recipeIngredients.some(ing => ing.includes(term))
    );
  });
}

// Get recipes by dietary preference
export function getRecipesByDiet(diet: string): Recipe[] {
  return getAllEnhancedRecipes().filter(recipe => 
    recipe.details?.dietTags?.some(tag => 
      tag.toLowerCase().includes(diet.toLowerCase())
    )
  );
}

// Get recipes by cuisine
export function getRecipesByCuisine(cuisine: string): Recipe[] {
  return getAllEnhancedRecipes().filter(recipe => 
    recipe.cuisine?.toLowerCase().includes(cuisine.toLowerCase()) ||
    recipe.details?.cuisine?.toLowerCase().includes(cuisine.toLowerCase())
  );
}

// Export individual recipe collections for backward compatibility
export const breakfastRecipes = enhancedBreakfastRecipes;
export const lunchRecipes = enhancedLunchRecipes;
export const dinnerRecipes = enhancedDinnerRecipes;
export const quickRecipes = enhancedQuickRecipes;
export const featuredRecipes = enhancedFeaturedRecipes;

// Get a single recipe by id, augmenting legacy fields expected by screens
export async function getRecipeById(id: string): Promise<Recipe | null> {
  // First check enhanced recipes
  const all = getAllEnhancedRecipes();
  let recipe = all.find(r => r.id === id);
  
  // Then check user-generated recipes
  if (!recipe) {
    try {
      const userRecipes = await getUserRecipes();
      recipe = userRecipes.find(r => r.id === id);
    } catch (error) {
      console.error('Error fetching user recipes:', error);
    }
  }
  
  // Then check individual user recipe storage
  if (!recipe) {
    try {
      const storedRecipe = await AsyncStorage.getItem(`user_recipe_${id}`);
      if (storedRecipe) {
        recipe = JSON.parse(storedRecipe);
      }
    } catch (error) {
      console.error('Error fetching individual recipe:', error);
    }
  }
  
  if (!recipe) {
    // Fallback to legacy/basic recipes so routes from home still work
    const legacyAll = getAllRecipes();
    const legacy = legacyAll.find((r: any) => r.id === id);
    if (!legacy) return null;

    // Normalize legacy recipe to enhanced-like shape where possible
    return {
      id: legacy.id,
      title: legacy.title,
      description: legacy.description,
      image: legacy.image,
      // Provide minimal structures so UI renders without crashing
      ingredients: [],
      steps: [],
      minutes: parseInt((legacy.time || '0').toString().split(' ')[0]) || undefined,
      time: legacy.time,
      difficulty: legacy.difficulty,
      calories: legacy.calories,
      cuisine: legacy.cuisine,
      rating: legacy.rating,
      reviews: legacy.reviews,
    } as any;
  }

  const rating = recipe.details?.rating ?? (recipe as any).rating ?? 0;
  const reviews = recipe.details?.ratingCount ?? (recipe as any).reviews ?? 0;
  const calories = recipe.nutrition?.calories ?? (recipe as any).calories ?? 0;
  const time = recipe.time || (recipe.details?.totalTime ? `${recipe.details.totalTime} min` : undefined);
  const difficulty = recipe.difficulty || recipe.details?.difficulty || 'easy';
  const cuisine = recipe.cuisine || recipe.details?.cuisine;

  return {
    ...recipe,
    rating,
    reviews,
    calories,
    time,
    difficulty,
    cuisine,
  };
}

// Synchronous version for compatibility (will not include user recipes)
export function getRecipeByIdSync(id: string): Recipe | null {
  const all = getAllEnhancedRecipes();
  const recipe = all.find(r => r.id === id);
  if (!recipe) {
    // Fallback to legacy/basic recipes
    const legacyAll = getAllRecipes();
    const legacy = legacyAll.find((r: any) => r.id === id);
    if (!legacy) return null;

    return {
      id: legacy.id,
      title: legacy.title,
      description: legacy.description,
      image: legacy.image,
      ingredients: [],
      steps: [],
      minutes: parseInt((legacy.time || '0').toString().split(' ')[0]) || undefined,
      time: legacy.time,
      difficulty: legacy.difficulty,
      calories: legacy.calories,
      cuisine: legacy.cuisine,
      rating: legacy.rating,
      reviews: legacy.reviews,
    } as any;
  }

  const rating = recipe.details?.rating ?? (recipe as any).rating ?? 0;
  const reviews = recipe.details?.ratingCount ?? (recipe as any).reviews ?? 0;
  const calories = recipe.nutrition?.calories ?? (recipe as any).calories ?? 0;
  const time = recipe.time || (recipe.details?.totalTime ? `${recipe.details.totalTime} min` : undefined);
  const difficulty = recipe.difficulty || recipe.details?.difficulty || 'easy';
  const cuisine = recipe.cuisine || recipe.details?.cuisine;

  return {
    ...recipe,
    rating,
    reviews,
    calories,
    time,
    difficulty,
    cuisine,
  };
}

// Local asset overrides for hero images
const imageOverrides: Record<string, any> = {
  'Spaghetti Carbonara': require('@/assets/images/carbonara.jpg'),
  'Greek Salad': require('@/assets/images/greeksalad.jpg'),
  'Chicken Tikka Masala': require('@/assets/images/chickentikkamasala.jpg'),
  'Mushroom Risotto': require('@/assets/images/mushroomrisotto.jpeg'),
  'Rice and Chorizo Burrito': require('@/assets/images/rice-and-chorizo-burrito.webp'),
  'Rolex (Rolled Eggs & Chapati)': require('@/assets/images/rolex.jpg'),
  'Rolex (Ugandan Rolled Egg)': require('@/assets/images/rolex.jpg'),
  'Stir-Fry Rice': require('@/assets/images/stir-fry-rice.jpg'),
  'Tilapia in Coconut Curry': require('@/assets/images/tilapiacoconut.jpg'),
  'Ugali with Sukuma Wiki & Beef Stew': require('@/assets/images/ugalisukumabeef.jpeg'),
  'Injera with Scrambled Eggs': require('@/assets/images/injera.webp'),
  'Mandazi (East African Donuts)': require('@/assets/images/mandazi.jpg'),
  'Chapati & Spiced Chai': require('@/assets/images/chapatichai.webp'),
  'Biryani': require('@/assets/images/biryani.jpg'),
};
