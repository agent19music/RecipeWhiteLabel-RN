// Community recipes from popular Kenyan TikTok creators
import { Recipe } from './types';

// Helper to create recipe IDs
const createId = (prefix: string, num: number) => `${prefix}-${num.toString().padStart(3, '0')}`;

export const communityRecipes: Recipe[] = [
  {
    id: createId('community', 1),
    title: 'Ombachi\'s Famous Kenyan Pilau',
    summary: 'The viral TikTok recipe from Roaming Chef that broke the internet! Perfectly spiced pilau with tender beef.',
    description: 'This is the famous pilau recipe that made Ombachi (Roaming Chef) a TikTok sensation. His unique technique of layering spices creates the most aromatic and flavorful pilau you\'ll ever taste. Follow his exact method for restaurant-quality results.',
    
    // Images (placeholders for now - you'll add actual assets)
    image: require('@/assets/images/pilau.jpg'),
    images: [
      require('@/assets/images/pilau.jpg'),
    ],
    heroImage: require('@/assets/images/pilau.jpg'),
    
    // Creator info
    author: 'Ombachi (Roaming Chef)',
    createdBy: 'community',
    source: 'TikTok',
    sourceUrl: 'https://www.tiktok.com/@theroamingchef',
    
    // TikTok video info (placeholder URLs - you'll replace with actual)
    videoUrl: 'https://www.tiktok.com/@theroamingchef/video/pilau-recipe',
    socialMedia: {
      platform: 'TikTok',
      handle: '@theroamingchef',
      followers: '2.3M',
      videoId: 'placeholder-pilau-video',
    },
    
    ingredients: [
      { name: 'Basmati rice', quantity: 2, unit: 'cups', group: 'Main' },
      { name: 'Beef (cut into chunks)', quantity: 500, unit: 'g', group: 'Protein' },
      { name: 'Onions (large)', quantity: 2, unit: 'whole', group: 'Vegetables' },
      { name: 'Tomatoes', quantity: 3, unit: 'medium', group: 'Vegetables' },
      { name: 'Garlic cloves', quantity: 4, unit: 'whole', group: 'Aromatics' },
      { name: 'Fresh ginger', quantity: 1, unit: 'inch piece', group: 'Aromatics' },
      { name: 'Pilau masala', quantity: 2, unit: 'tbsp', note: 'Ombachi\'s secret blend!', group: 'Spices' },
      { name: 'Cumin seeds', quantity: 1, unit: 'tsp', group: 'Spices' },
      { name: 'Cardamom pods', quantity: 4, unit: 'whole', group: 'Spices' },
      { name: 'Cinnamon stick', quantity: 1, unit: 'whole', group: 'Spices' },
      { name: 'Bay leaves', quantity: 2, unit: 'whole', group: 'Spices' },
      { name: 'Salt', quantity: 1, unit: 'tsp', group: 'Seasoning' },
      { name: 'Cooking oil', quantity: 3, unit: 'tbsp', group: 'Fat' },
      { name: 'Beef stock', quantity: 3, unit: 'cups', group: 'Liquid' },
    ],
    
    steps: [
      {
        title: 'Prepare the Beef',
        body: 'Season beef chunks with salt and half the pilau masala. Let marinate for 15 minutes while you prep other ingredients.',
        time: 15,
        tips: ['Ombachi\'s tip: Don\'t skip the marinating step!'],
      },
      {
        title: 'Toast the Spices',
        body: 'In a heavy-bottomed pot, dry roast cumin seeds, cardamom, cinnamon, and bay leaves for 2 minutes until fragrant.',
        time: 2,
        tips: ['This is Ombachi\'s secret to deep flavor'],
      },
      {
        title: 'Brown the Beef',
        body: 'Add oil to the pot and brown the marinated beef on all sides. Remove and set aside.',
        time: 8,
        tips: ['Don\'t overcrowd the pot'],
      },
      {
        title: 'Build the Base',
        body: 'In the same pot, sauté onions until golden, add garlic and ginger paste, then tomatoes. Cook until tomatoes break down.',
        time: 10,
        tips: ['The base should be thick and fragrant'],
      },
      {
        title: 'Add Rice and Spices',
        body: 'Return beef to pot, add remaining pilau masala, then add rice. Stir gently to coat with the spice mixture.',
        time: 3,
        tips: ['Be gentle to avoid breaking rice grains'],
      },
      {
        title: 'Simmer to Perfection',
        body: 'Pour in hot beef stock, bring to boil, then reduce heat to low. Cover and cook for 20 minutes until rice is tender.',
        time: 20,
        tips: ['Don\'t lift the lid during cooking!'],
      },
      {
        title: 'Rest and Fluff',
        body: 'Let pilau rest off heat for 5 minutes, then gently fluff with a fork. Garnish with fried onions if desired.',
        time: 5,
        tips: ['Resting allows flavors to settle'],
      },
    ],
    
    details: {
      servings: 6,
      prepTime: 20,
      cookTime: 45,
      totalTime: 65,
      difficulty: 'medium',
      cost: 'moderate',
      equipment: ['Heavy-bottomed pot with lid', 'Sharp knife', 'Cutting board'],
      cuisine: 'Kenyan',
      course: ['Main Course'],
      occasion: ['Family Dinner', 'Special Occasions'],
      rating: 4.9,
      ratingCount: 15420,
      favoriteCount: 8900,
    },
    
    nutrition: {
      calories: 380,
      carbs: 45,
      protein: 25,
      fat: 12,
      fiber: 2,
      sodium: 450,
    },
    
    tips: [
      'Ombachi swears by using basmati rice for the best texture',
      'Toast your spices for maximum flavor impact',
      'Let the pilau rest before serving for better flavor distribution',
    ],
    
    tags: ['pilau', 'kenyan', 'tiktok-viral', 'ombachi', 'spiced-rice', 'beef'],
    time: '1h 5min',
    difficulty: 'Medium',
    minutes: 65,
  },

  {
    id: createId('community', 2),
    title: 'Chef Kaluhi\'s Crispy Samosas',
    summary: 'Learn the technique that made Chef Kaluhi TikTok famous - perfectly crispy samosas with spiced potato filling.',
    description: 'Chef Kaluhi\'s samosa technique has been viewed millions of times on TikTok. Her secret folding method and spice blend creates the crispiest, most flavorful samosas that stay crunchy for hours.',
    
    image: require('@/assets/images/samosas.jpg'),
    images: [require('@/assets/images/samosas.jpg')],
    heroImage: require('@/assets/images/samosas.jpg'),
    
    author: 'Chef Kaluhi',
    createdBy: 'community',
    source: 'TikTok',
    sourceUrl: 'https://www.tiktok.com/@chefkaluhi',
    
    videoUrl: 'https://www.tiktok.com/@chefkaluhi/video/samosa-technique',
    socialMedia: {
      platform: 'TikTok',
      handle: '@chefkaluhi',
      followers: '850K',
      videoId: 'placeholder-samosa-video',
    },
    
    ingredients: [
      { name: 'Samosa wrappers', quantity: 20, unit: 'sheets', group: 'Wrapper' },
      { name: 'Potatoes (medium)', quantity: 4, unit: 'whole', group: 'Filling' },
      { name: 'Green peas', quantity: 0.5, unit: 'cup', group: 'Filling' },
      { name: 'Onion (finely chopped)', quantity: 1, unit: 'medium', group: 'Filling' },
      { name: 'Garlic cloves', quantity: 3, unit: 'whole', group: 'Aromatics' },
      { name: 'Fresh ginger', quantity: 1, unit: 'inch piece', group: 'Aromatics' },
      { name: 'Cumin seeds', quantity: 1, unit: 'tsp', group: 'Spices' },
      { name: 'Coriander seeds', quantity: 1, unit: 'tsp', group: 'Spices' },
      { name: 'Turmeric powder', quantity: 0.5, unit: 'tsp', group: 'Spices' },
      { name: 'Red chili powder', quantity: 1, unit: 'tsp', group: 'Spices' },
      { name: 'Garam masala', quantity: 1, unit: 'tsp', group: 'Spices' },
      { name: 'Fresh coriander', quantity: 2, unit: 'tbsp', group: 'Herbs' },
      { name: 'Oil for frying', quantity: 2, unit: 'cups', group: 'Fat' },
      { name: 'Salt', quantity: 1, unit: 'tsp', group: 'Seasoning' },
    ],
    
    steps: [
      {
        title: 'Prepare Filling',
        body: 'Boil potatoes until tender, then mash roughly. Sauté onions, add spices, then mix with potatoes and peas.',
        time: 20,
        tips: ['Don\'t over-mash - some texture is good!'],
      },
      {
        title: 'Cool the Filling',
        body: 'Let the spiced potato mixture cool completely before assembling samosas.',
        time: 15,
        tips: ['Hot filling makes wrappers soggy'],
      },
      {
        title: 'Kaluhi\'s Folding Technique',
        body: 'Place filling in center of wrapper, fold into triangle using Chef Kaluhi\'s signature 3-point fold method.',
        time: 25,
        tips: ['Watch the TikTok for the exact folding technique!'],
      },
      {
        title: 'Heat Oil Perfectly',
        body: 'Heat oil to exactly 350°F. Test with a small piece of wrapper - it should sizzle immediately.',
        time: 5,
        temperature: { value: 175, unit: 'C' },
      },
      {
        title: 'Fry to Golden Perfection',
        body: 'Fry samosas in batches for 3-4 minutes until golden and crispy. Don\'t overcrowd.',
        time: 12,
        tips: ['Kaluhi\'s secret: Fry twice for extra crispiness!'],
      },
      {
        title: 'Drain and Serve',
        body: 'Drain on paper towels and serve hot with mint chutney or ketchup.',
        time: 2,
        tips: ['Best enjoyed immediately while crispy'],
      },
    ],
    
    details: {
      servings: 20,
      prepTime: 30,
      cookTime: 20,
      totalTime: 50,
      difficulty: 'medium',
      cost: 'budget',
      equipment: ['Deep frying pan', 'Slotted spoon', 'Mixing bowls'],
      cuisine: 'Kenyan-Indian',
      course: ['Snack', 'Appetizer'],
      rating: 4.7,
      ratingCount: 8934,
      favoriteCount: 5600,
    },
    
    nutrition: {
      calories: 85,
      carbs: 12,
      protein: 2,
      fat: 3,
      fiber: 1,
      sodium: 180,
    },
    
    tags: ['samosas', 'kenyan', 'tiktok-viral', 'chef-kaluhi', 'crispy', 'snack'],
    time: '50min',
    difficulty: 'Medium',
    minutes: 50,
  },

  {
    id: createId('community', 3),
    title: 'Mama Caro\'s Ugali Perfection',
    summary: 'The TikTok queen of ugali shares her foolproof technique for smooth, lump-free ugali every time.',
    description: 'Mama Caro has perfected the art of ugali making and her TikTok videos have helped thousands master this Kenyan staple. Her technique guarantees smooth, perfectly textured ugali without lumps.',
    
    image: require('@/assets/images/ugalisukumabeef.jpeg'),
    images: [require('@/assets/images/ugalisukumabeef.jpeg')],
    heroImage: require('@/assets/images/ugalisukumabeef.jpeg'),
    
    author: 'Mama Caro',
    createdBy: 'community',
    source: 'TikTok',
    sourceUrl: 'https://www.tiktok.com/@mamacaro_kitchen',
    
    videoUrl: 'https://www.tiktok.com/@mamacaro_kitchen/video/perfect-ugali',
    socialMedia: {
      platform: 'TikTok',
      handle: '@mamacaro_kitchen',
      followers: '1.2M',
      videoId: 'placeholder-ugali-video',
    },
    
    ingredients: [
      { name: 'Maize flour (white)', quantity: 2, unit: 'cups', group: 'Main' },
      { name: 'Water', quantity: 3, unit: 'cups', group: 'Liquid' },
      { name: 'Salt', quantity: 0.5, unit: 'tsp', optional: true, group: 'Seasoning' },
    ],
    
    steps: [
      {
        title: 'Boil Water',
        body: 'Bring 3 cups of water to a rolling boil in a heavy-bottomed sufuria.',
        time: 5,
        tips: ['Use a heavy pan to prevent burning'],
      },
      {
        title: 'Add Flour Gradually',
        body: 'Slowly add maize flour while stirring continuously with a wooden spoon to prevent lumps.',
        time: 3,
        tips: ['Mama Caro\'s secret: Add flour in three stages!'],
      },
      {
        title: 'Stir Vigorously',
        body: 'Stir vigorously for 3-4 minutes until mixture thickens and pulls away from sides.',
        time: 4,
        tips: ['This is the workout part - put in the effort!'],
      },
      {
        title: 'Lower Heat and Cook',
        body: 'Reduce heat to low, cover and cook for 10 minutes, stirring occasionally.',
        time: 10,
        tips: ['Low heat prevents burning the bottom'],
      },
      {
        title: 'Final Stir and Rest',
        body: 'Give a final vigorous stir, then let rest for 2 minutes before serving.',
        time: 2,
        tips: ['Resting makes it easier to shape'],
      },
    ],
    
    details: {
      servings: 6,
      prepTime: 2,
      cookTime: 22,
      totalTime: 24,
      difficulty: 'easy',
      cost: 'budget',
      equipment: ['Heavy-bottomed sufuria', 'Wooden spoon'],
      cuisine: 'Kenyan',
      course: ['Side Dish'],
      rating: 4.8,
      ratingCount: 12450,
      favoriteCount: 9800,
    },
    
    nutrition: {
      calories: 120,
      carbs: 28,
      protein: 3,
      fat: 0.5,
      fiber: 2,
      sodium: 200,
    },
    
    tags: ['ugali', 'kenyan', 'tiktok-viral', 'mama-caro', 'staple', 'simple'],
    time: '24min',
    difficulty: 'Easy',
    minutes: 24,
  },

  {
    id: createId('community', 4),
    title: 'Chef Njugz\'s Loaded Nyama Choma',
    summary: 'The viral nyama choma recipe with Chef Njugz\'s signature marinade and grilling technique.',
    description: 'Chef Njugz revolutionized nyama choma with his loaded version featuring a special marinade and perfect grilling technique. This TikTok sensation combines traditional flavors with modern presentation.',
    
    image: require('@/assets/images/chicken-tacos.jpg'), // Placeholder - you'll replace
    images: [require('@/assets/images/chicken-tacos.jpg')],
    heroImage: require('@/assets/images/chicken-tacos.jpg'),
    
    author: 'Chef Njugz',
    createdBy: 'community',
    source: 'TikTok',
    sourceUrl: 'https://www.tiktok.com/@chefnjugz',
    
    videoUrl: 'https://www.tiktok.com/@chefnjugz/video/loaded-nyama-choma',
    socialMedia: {
      platform: 'TikTok',
      handle: '@chefnjugz',
      followers: '680K',
      videoId: 'placeholder-nyama-choma-video',
    },
    
    ingredients: [
      { name: 'Beef ribs', quantity: 1, unit: 'kg', group: 'Meat' },
      { name: 'Soy sauce', quantity: 3, unit: 'tbsp', group: 'Marinade' },
      { name: 'Tomato sauce', quantity: 2, unit: 'tbsp', group: 'Marinade' },
      { name: 'Garlic paste', quantity: 2, unit: 'tbsp', group: 'Marinade' },
      { name: 'Ginger paste', quantity: 1, unit: 'tbsp', group: 'Marinade' },
      { name: 'Black pepper', quantity: 1, unit: 'tsp', group: 'Spices' },
      { name: 'Rosemary (fresh)', quantity: 2, unit: 'sprigs', group: 'Herbs' },
      { name: 'Thyme (fresh)', quantity: 1, unit: 'tsp', group: 'Herbs' },
      { name: 'Vegetable oil', quantity: 2, unit: 'tbsp', group: 'Fat' },
      { name: 'Red onions', quantity: 2, unit: 'large', group: 'Vegetables' },
      { name: 'Bell peppers', quantity: 2, unit: 'whole', group: 'Vegetables' },
      { name: 'Salt', quantity: 1, unit: 'tsp', group: 'Seasoning' },
    ],
    
    steps: [
      {
        title: 'Prepare the Marinade',
        body: 'Mix soy sauce, tomato sauce, garlic paste, ginger paste, herbs, and spices into a rich marinade.',
        time: 5,
        tips: ['Njugz\'s secret: Let the marinade sit for 10 minutes first!'],
      },
      {
        title: 'Marinate the Meat',
        body: 'Coat beef ribs thoroughly with marinade and let sit for at least 2 hours, preferably overnight.',
        time: 120,
        tips: ['Longer marination = better flavor'],
      },
      {
        title: 'Prepare the Grill',
        body: 'Set up your grill for medium-high heat with both direct and indirect zones.',
        time: 10,
        tips: ['Charcoal gives the best smoky flavor'],
      },
      {
        title: 'Sear the Ribs',
        body: 'Sear ribs over direct heat for 3-4 minutes per side to lock in juices.',
        time: 8,
        tips: ['Don\'t move them too early - let them sear!'],
      },
      {
        title: 'Slow Cook',
        body: 'Move to indirect heat and cook for 45-60 minutes, basting with marinade every 15 minutes.',
        time: 60,
        tips: ['This is where the magic happens - low and slow'],
      },
      {
        title: 'Add Vegetables',
        body: 'In the last 15 minutes, add sliced onions and bell peppers to the grill.',
        time: 15,
        tips: ['Vegetables should be slightly charred'],
      },
      {
        title: 'Rest and Serve',
        body: 'Let meat rest for 5 minutes, then serve with grilled vegetables and ugali.',
        time: 5,
        tips: ['Resting redistributes the juices'],
      },
    ],
    
    details: {
      servings: 6,
      prepTime: 15,
      cookTime: 90,
      totalTime: 105,
      difficulty: 'medium',
      cost: 'moderate',
      equipment: ['Grill', 'Basting brush', 'Meat thermometer'],
      cuisine: 'Kenyan',
      course: ['Main Course'],
      rating: 4.6,
      ratingCount: 7823,
      favoriteCount: 4500,
    },
    
    nutrition: {
      calories: 420,
      carbs: 8,
      protein: 35,
      fat: 26,
      fiber: 2,
      sodium: 680,
    },
    
    tags: ['nyama-choma', 'kenyan', 'tiktok-viral', 'chef-njugz', 'grilled', 'bbq'],
    time: '1h 45min',
    difficulty: 'Medium',
    minutes: 105,
  },

  {
    id: createId('community', 5),
    title: 'Zawadi\'s Fusion Chapati Wraps',
    summary: 'The TikTok star who made chapati cool again with her creative fusion wraps that went viral worldwide.',
    description: 'Zawadi took traditional chapati and created Instagram-worthy fusion wraps that caught the attention of food lovers globally. Her technique for soft, flexible chapati makes perfect wraps every time.',
    
    image: require('@/assets/images/chapatichai.webp'),
    images: [require('@/assets/images/chapatichai.webp')],
    heroImage: require('@/assets/images/chapatichai.webp'),
    
    author: 'Zawadi Eats',
    createdBy: 'community',
    source: 'TikTok',
    sourceUrl: 'https://www.tiktok.com/@zawadieats',
    
    videoUrl: 'https://www.tiktok.com/@zawadieats/video/fusion-chapati-wraps',
    socialMedia: {
      platform: 'TikTok',
      handle: '@zawadieats',
      followers: '950K',
      videoId: 'placeholder-chapati-video',
    },
    
    ingredients: [
      // Chapati
      { name: 'All-purpose flour', quantity: 2, unit: 'cups', group: 'Chapati Dough' },
      { name: 'Warm water', quantity: 0.75, unit: 'cup', group: 'Chapati Dough' },
      { name: 'Salt', quantity: 1, unit: 'tsp', group: 'Chapati Dough' },
      { name: 'Vegetable oil', quantity: 2, unit: 'tbsp', group: 'Chapati Dough' },
      
      // Filling
      { name: 'Chicken breast', quantity: 300, unit: 'g', group: 'Protein' },
      { name: 'Avocado', quantity: 1, unit: 'large', group: 'Vegetables' },
      { name: 'Lettuce leaves', quantity: 4, unit: 'large', group: 'Vegetables' },
      { name: 'Tomatoes', quantity: 2, unit: 'medium', group: 'Vegetables' },
      { name: 'Red onion', quantity: 0.5, unit: 'small', group: 'Vegetables' },
      { name: 'Cheese (cheddar)', quantity: 100, unit: 'g', group: 'Dairy' },
      
      // Sauce
      { name: 'Mayonnaise', quantity: 3, unit: 'tbsp', group: 'Sauce' },
      { name: 'Hot sauce', quantity: 1, unit: 'tsp', group: 'Sauce' },
      { name: 'Lime juice', quantity: 1, unit: 'tbsp', group: 'Sauce' },
    ],
    
    steps: [
      {
        title: 'Make Chapati Dough',
        body: 'Mix flour, salt, and oil. Gradually add warm water to form soft dough. Knead for 5 minutes until smooth.',
        time: 8,
        tips: ['Zawadi\'s tip: Dough should be soft but not sticky'],
      },
      {
        title: 'Rest the Dough',
        body: 'Cover dough with damp cloth and rest for 30 minutes.',
        time: 30,
        tips: ['Resting makes rolling easier'],
      },
      {
        title: 'Prepare Filling',
        body: 'Season and cook chicken until done. Slice all vegetables and prepare the sauce mixture.',
        time: 15,
        tips: ['Prep everything before rolling chapatis'],
      },
      {
        title: 'Roll Chapatis',
        body: 'Divide dough into 6 portions. Roll each into thin circles using Zawadi\'s technique.',
        time: 12,
        tips: ['Keep them thin for easy wrapping'],
      },
      {
        title: 'Cook Chapatis',
        body: 'Cook each chapati on hot pan for 1-2 minutes per side until soft spots appear.',
        time: 12,
        tips: ['Don\'t overcook - they should stay soft'],
      },
      {
        title: 'Assemble Wraps',
        body: 'Spread sauce on chapati, add filling ingredients, and wrap tightly using Zawadi\'s folding method.',
        time: 8,
        tips: ['Tight wrapping prevents ingredients from falling out'],
      },
    ],
    
    details: {
      servings: 6,
      prepTime: 45,
      cookTime: 30,
      totalTime: 75,
      difficulty: 'medium',
      cost: 'moderate',
      equipment: ['Rolling pin', 'Non-stick pan', 'Mixing bowl'],
      cuisine: 'Fusion',
      course: ['Lunch', 'Dinner'],
      rating: 4.7,
      ratingCount: 9645,
      favoriteCount: 7200,
    },
    
    nutrition: {
      calories: 340,
      carbs: 35,
      protein: 22,
      fat: 14,
      fiber: 4,
      sodium: 520,
    },
    
    tags: ['chapati', 'kenyan', 'tiktok-viral', 'zawadi', 'fusion', 'wraps'],
    time: '1h 15min',
    difficulty: 'Medium',
    minutes: 75,
  },

  {
    id: createId('community', 6),
    title: 'KitchenBae\'s Viral Mukimo',
    summary: 'The modern twist on traditional mukimo that made KitchenBae a TikTok sensation with over 5M views.',
    description: 'KitchenBae elevated the humble mukimo into a gourmet dish that impressed both traditionalists and food enthusiasts. Her technique creates the creamiest, most flavorful mukimo with a modern presentation.',
    
    image: require('@/assets/images/mukimo.jpg'),
    images: [require('@/assets/images/mukimo.jpg')],
    heroImage: require('@/assets/images/mukimo.jpg'),
    
    author: 'KitchenBae',
    createdBy: 'community',
    source: 'TikTok',
    sourceUrl: 'https://www.tiktok.com/@kitchenbae_ke',
    
    videoUrl: 'https://www.tiktok.com/@kitchenbae_ke/video/viral-mukimo',
    socialMedia: {
      platform: 'TikTok',
      handle: '@kitchenbae_ke',
      followers: '1.5M',
      videoId: 'placeholder-mukimo-video',
    },
    
    ingredients: [
      { name: 'Potatoes (medium)', quantity: 4, unit: 'whole', group: 'Vegetables' },
      { name: 'Green bananas', quantity: 3, unit: 'whole', group: 'Vegetables' },
      { name: 'Fresh maize kernels', quantity: 1, unit: 'cup', group: 'Vegetables' },
      { name: 'Pumpkin leaves (kunde)', quantity: 2, unit: 'cups', group: 'Greens' },
      { name: 'Onions (large)', quantity: 2, unit: 'whole', group: 'Aromatics' },
      { name: 'Garlic cloves', quantity: 4, unit: 'whole', group: 'Aromatics' },
      { name: 'Fresh ginger', quantity: 1, unit: 'inch piece', group: 'Aromatics' },
      { name: 'Green chilies', quantity: 2, unit: 'whole', optional: true, group: 'Spices' },
      { name: 'Butter', quantity: 3, unit: 'tbsp', group: 'Fat' },
      { name: 'Milk', quantity: 0.25, unit: 'cup', group: 'Liquid' },
      { name: 'Salt', quantity: 1, unit: 'tsp', group: 'Seasoning' },
      { name: 'Black pepper', quantity: 0.5, unit: 'tsp', group: 'Seasoning' },
      { name: 'Fresh coriander', quantity: 2, unit: 'tbsp', group: 'Garnish' },
    ],
    
    steps: [
      {
        title: 'Prep and Boil Vegetables',
        body: 'Peel and chop potatoes and bananas. Boil together with maize kernels until tender, about 20 minutes.',
        time: 25,
        tips: ['KitchenBae\'s tip: Add salt to boiling water for flavor'],
      },
      {
        title: 'Prepare the Greens',
        body: 'Clean and chop the pumpkin leaves. Blanch in salted water for 3 minutes, then drain.',
        time: 8,
        tips: ['Don\'t overcook the greens - they should stay vibrant'],
      },
      {
        title: 'Sauté Aromatics',
        body: 'In a large pan, sauté onions until golden, then add garlic, ginger, and green chilies.',
        time: 8,
        tips: ['This creates the flavor base'],
      },
      {
        title: 'Mash with Love',
        body: 'Drain vegetables and mash with butter and milk until creamy. KitchenBae\'s secret: don\'t overmash!',
        time: 5,
        tips: ['Some texture is good - don\'t make it too smooth'],
      },
      {
        title: 'Combine Everything',
        body: 'Fold in the sautéed aromatics and blanched greens. Season with salt and pepper.',
        time: 3,
        tips: ['Gentle folding preserves the green color'],
      },
      {
        title: 'Final Touch',
        body: 'Garnish with fresh coriander and serve hot with your favorite stew.',
        time: 1,
        tips: ['Serve immediately while hot for best texture'],
      },
    ],
    
    details: {
      servings: 8,
      prepTime: 15,
      cookTime: 50,
      totalTime: 65,
      difficulty: 'easy',
      cost: 'budget',
      equipment: ['Large pot', 'Masher', 'Large pan'],
      cuisine: 'Kenyan',
      course: ['Side Dish'],
      rating: 4.8,
      ratingCount: 11230,
      favoriteCount: 8900,
    },
    
    nutrition: {
      calories: 180,
      carbs: 32,
      protein: 4,
      fat: 5,
      fiber: 6,
      sodium: 320,
    },
    
    tags: ['mukimo', 'kenyan', 'tiktok-viral', 'kitchenbae', 'traditional', 'vegetables'],
    time: '1h 5min',
    difficulty: 'Easy',
    minutes: 65,
  },

  {
    id: createId('community', 7),
    title: 'Chef Mwangi\'s Perfect Githeri',
    summary: 'The viral githeri recipe that shows how to transform simple ingredients into a gourmet meal.',
    description: 'Chef Mwangi proved that githeri doesn\'t have to be boring. His technique creates a rich, flavorful dish that\'s been recreated by thousands of TikTok followers worldwide.',
    
    image: require('@/assets/images/githeri.jpg'),
    images: [require('@/assets/images/githeri.jpg')],
    heroImage: require('@/assets/images/githeri.jpg'),
    
    author: 'Chef Mwangi',
    createdBy: 'community',
    source: 'TikTok',
    sourceUrl: 'https://www.tiktok.com/@chefmwangi_official',
    
    videoUrl: 'https://www.tiktok.com/@chefmwangi_official/video/perfect-githeri',
    socialMedia: {
      platform: 'TikTok',
      handle: '@chefmwangi_official',
      followers: '750K',
      videoId: 'placeholder-githeri-video',
    },
    
    ingredients: [
      { name: 'Maize (dried)', quantity: 1, unit: 'cup', group: 'Base' },
      { name: 'Kidney beans (dried)', quantity: 1, unit: 'cup', group: 'Base' },
      { name: 'Beef (cubed)', quantity: 300, unit: 'g', group: 'Protein' },
      { name: 'Onions (large)', quantity: 2, unit: 'whole', group: 'Vegetables' },
      { name: 'Tomatoes', quantity: 3, unit: 'medium', group: 'Vegetables' },
      { name: 'Carrots', quantity: 2, unit: 'medium', group: 'Vegetables' },
      { name: 'Green bell pepper', quantity: 1, unit: 'whole', group: 'Vegetables' },
      { name: 'Garlic cloves', quantity: 4, unit: 'whole', group: 'Aromatics' },
      { name: 'Fresh ginger', quantity: 1, unit: 'inch piece', group: 'Aromatics' },
      { name: 'Beef stock cubes', quantity: 2, unit: 'whole', group: 'Seasoning' },
      { name: 'Tomato paste', quantity: 2, unit: 'tbsp', group: 'Sauce' },
      { name: 'Cooking oil', quantity: 3, unit: 'tbsp', group: 'Fat' },
      { name: 'Coriander (dhania)', quantity: 2, unit: 'tbsp', group: 'Herbs' },
      { name: 'Salt', quantity: 1, unit: 'tsp', group: 'Seasoning' },
      { name: 'Black pepper', quantity: 0.5, unit: 'tsp', group: 'Seasoning' },
    ],
    
    steps: [
      {
        title: 'Soak Overnight',
        body: 'Soak maize and kidney beans separately overnight to soften them.',
        time: 480,
        tips: ['Chef Mwangi\'s tip: This step is crucial for even cooking'],
      },
      {
        title: 'Boil the Base',
        body: 'Drain and rinse soaked maize and beans. Boil together for 45 minutes until tender.',
        time: 45,
        tips: ['Add salt only in the last 10 minutes'],
      },
      {
        title: 'Brown the Beef',
        body: 'In a separate pan, brown the beef cubes until all sides are seared.',
        time: 8,
        tips: ['Searing locks in the juices'],
      },
      {
        title: 'Build the Flavor Base',
        body: 'Sauté onions until golden, add garlic and ginger, then tomatoes and tomato paste.',
        time: 12,
        tips: ['Cook until tomatoes completely break down'],
      },
      {
        title: 'Combine and Simmer',
        body: 'Add browned beef to the tomato base, then add the boiled maize and beans. Add vegetables and stock.',
        time: 25,
        tips: ['Let everything marry together slowly'],
      },
      {
        title: 'Final Seasoning',
        body: 'Season with salt and pepper, garnish with fresh coriander before serving.',
        time: 2,
        tips: ['Taste and adjust seasoning as needed'],
      },
    ],
    
    details: {
      servings: 8,
      prepTime: 20,
      cookTime: 90,
      totalTime: 110,
      difficulty: 'easy',
      cost: 'budget',
      equipment: ['Large pot', 'Wooden spoon', 'Sharp knife'],
      cuisine: 'Kenyan',
      course: ['Main Course'],
      rating: 4.6,
      ratingCount: 6789,
      favoriteCount: 4200,
    },
    
    nutrition: {
      calories: 280,
      carbs: 38,
      protein: 18,
      fat: 8,
      fiber: 8,
      sodium: 450,
    },
    
    tags: ['githeri', 'kenyan', 'tiktok-viral', 'chef-mwangi', 'traditional', 'healthy'],
    time: '1h 50min',
    difficulty: 'Easy',
    minutes: 110,
  },
];

// Import the enhanced recipes
import { 
  communityRecipesEnhanced,
  getEnhancedRecipesByCreator,
  getEnhancedViralRecipes,
  getRecipesByPlatform,
  getTrendingRecipes
} from './community-recipes-enhanced';

// Export function to get all community recipes - now returns enhanced versions
export const getCommunityRecipes = (): Recipe[] => {
  return communityRecipesEnhanced;
};

// Export function to get recipe by creator - uses enhanced data
export const getRecipesByCreator = (creator: string): Recipe[] => {
  return getEnhancedRecipesByCreator(creator);
};

// Export function to get viral recipes - uses enhanced data
export const getViralRecipes = (): Recipe[] => {
  return getEnhancedViralRecipes();
};

// Re-export additional functions
export { getRecipesByPlatform, getTrendingRecipes } from './community-recipes-enhanced';
