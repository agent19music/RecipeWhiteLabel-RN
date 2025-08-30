// Enhanced Community Recipes from TikTok Creators with Full Recipe Structure
import { Recipe } from './types';

// Helper to create recipe IDs
const createId = (prefix: string, num: number) => `${prefix}-${num.toString().padStart(3, '0')}`;

export const communityRecipesEnhanced: Recipe[] = [
  {
    id: createId('community', 1),
    title: 'Ombachi\'s Famous Kenyan Pilau',
    summary: 'The viral TikTok recipe from Roaming Chef that broke the internet! Perfectly spiced pilau with tender beef.',
    description: 'This is the famous pilau recipe that made Ombachi (Roaming Chef) a TikTok sensation. His unique technique of layering spices creates the most aromatic and flavorful pilau you\'ll ever taste. Follow his exact method for restaurant-quality results at home.',
    
    // Images
    image: require('@/assets/images/pilau.jpg'),
    images: [
      require('@/assets/images/pilau.jpg'),
      require('@/assets/images/pilau.jpg'),
    ],
    heroImage: require('@/assets/images/pilau.jpg'),
    
    // Creator info
    author: 'Ombachi (Roaming Chef)',
    createdBy: 'community',
    source: 'TikTok',
    sourceUrl: 'https://www.tiktok.com/@theroamingchef',
    
    // TikTok video info
    videoUrl: 'https://www.tiktok.com/@theroamingchef/video/pilau-recipe',
    socialMedia: {
      platform: 'TikTok',
      handle: '@theroamingchef',
      followers: '2.3M',
      videoId: 'viral-pilau-video',
      likes: '456K',
      shares: '89K',
    },
    
    // Enhanced Ingredients
    ingredients: [
      { name: 'Basmati rice', quantity: 2, unit: 'cups', group: 'Main', note: 'Rinse until water runs clear' },
      { name: 'Beef (cut into chunks)', quantity: 500, unit: 'g', group: 'Protein', note: 'Use beef with some fat for flavor' },
      { name: 'Onions (large)', quantity: 2, unit: 'whole', group: 'Vegetables', note: 'Thinly sliced' },
      { name: 'Tomatoes', quantity: 3, unit: 'medium', group: 'Vegetables', note: 'Diced' },
      { name: 'Garlic cloves', quantity: 4, unit: 'whole', group: 'Aromatics', note: 'Minced' },
      { name: 'Fresh ginger', quantity: 1, unit: 'inch piece', group: 'Aromatics', note: 'Grated' },
      { name: 'Pilau masala', quantity: 2, unit: 'tbsp', note: 'Ombachi\'s secret blend!', group: 'Spices' },
      { name: 'Cumin seeds', quantity: 1, unit: 'tsp', group: 'Spices' },
      { name: 'Cardamom pods', quantity: 4, unit: 'whole', group: 'Spices', note: 'Lightly crushed' },
      { name: 'Cinnamon stick', quantity: 1, unit: 'whole', group: 'Spices', note: '2-inch piece' },
      { name: 'Bay leaves', quantity: 2, unit: 'whole', group: 'Spices' },
      { name: 'Salt', quantity: 1, unit: 'tsp', group: 'Seasoning', note: 'Adjust to taste' },
      { name: 'Cooking oil', quantity: 3, unit: 'tbsp', group: 'Fat', note: 'Or ghee for richer flavor' },
      { name: 'Beef stock', quantity: 3, unit: 'cups', group: 'Liquid', note: 'Hot, for better absorption' },
    ],
    
    // Detailed Steps with Tips
    steps: [
      {
        title: 'Prepare the Beef',
        body: 'Season beef chunks with salt and half the pilau masala. Mix well, ensuring each piece is coated. Let marinate for 15 minutes while you prep other ingredients.',
        time: 15,
        tips: ['Ombachi\'s tip: Don\'t skip the marinating step!', 'Room temperature beef browns better'],
        temperature: { value: 20, unit: 'C' },
      },
      {
        title: 'Toast the Spices',
        body: 'In a heavy-bottomed pot, dry roast cumin seeds, cardamom, cinnamon, and bay leaves for 2 minutes until fragrant. The kitchen should smell amazing!',
        time: 2,
        tips: ['This is Ombachi\'s secret to deep flavor', 'Keep stirring to prevent burning'],
        temperature: { value: 180, unit: 'C' },
      },
      {
        title: 'Brown the Beef',
        body: 'Add oil to the pot with toasted spices and heat until shimmering. Brown the marinated beef in batches on all sides. Remove and set aside.',
        time: 8,
        tips: ['Don\'t overcrowd the pot', 'Each side should be deeply caramelized'],
        temperature: { value: 200, unit: 'C' },
      },
      {
        title: 'Build the Base',
        body: 'In the same pot, sauté onions until golden brown (about 8 minutes). Add garlic and ginger paste, cook for 1 minute, then add tomatoes. Cook until tomatoes break down into a thick sauce.',
        time: 10,
        tips: ['The base should be thick and fragrant', 'This is where the magic happens'],
      },
      {
        title: 'Add Rice and Spices',
        body: 'Return beef to pot with any juices. Add remaining pilau masala and stir for 30 seconds. Add rice and gently stir to coat with the spice mixture without breaking the grains.',
        time: 3,
        tips: ['Be gentle to avoid breaking rice grains', 'Every grain should be coated with spices'],
      },
      {
        title: 'Simmer to Perfection',
        body: 'Pour in hot beef stock, bring to a rapid boil. Once boiling, reduce heat to low, cover with a tight-fitting lid. Cook for 20 minutes without lifting the lid.',
        time: 20,
        tips: ['Don\'t lift the lid during cooking!', 'Trust the process - Ombachi\'s golden rule'],
        temperature: { value: 95, unit: 'C' },
      },
      {
        title: 'Rest and Fluff',
        body: 'Turn off heat and let pilau rest for 5 minutes without opening. Remove lid, gently fluff with a fork from the edges. Garnish with fried onions if desired.',
        time: 5,
        tips: ['Resting allows flavors to settle', 'Fluff gently to keep grains separate'],
      },
    ],
    
    // Comprehensive Details
    details: {
      servings: 6,
      prepTime: 20,
      cookTime: 45,
      totalTime: 65,
      difficulty: 'medium',
      cost: 'moderate',
      equipment: ['Heavy-bottomed pot with lid', 'Sharp knife', 'Cutting board', 'Wooden spoon'],
      allergens: [],
      dietTags: ['Halal'],
      cuisine: 'Kenyan',
      course: ['Main Course'],
      occasion: ['Family Dinner', 'Special Occasions', 'Eid', 'Christmas'],
      rating: 4.9,
      ratingCount: 15420,
      favoriteCount: 8900,
    },
    
    // Nutrition Information
    nutrition: {
      calories: 380,
      carbs: 45,
      protein: 25,
      fat: 12,
      fiber: 2,
      sugar: 4,
      sodium: 450,
      cholesterol: 65,
      saturatedFat: 4,
    },
    
    // Pro Tips & Variations
    tips: [
      'Ombachi swears by using basmati rice for the best texture',
      'Toast your spices for maximum flavor impact',
      'Let the pilau rest before serving for better flavor distribution',
      'Save some fried onions for garnish - game changer!',
    ],
    variations: [
      'Chicken Pilau: Replace beef with bone-in chicken pieces',
      'Vegetable Pilau: Use mixed vegetables and vegetable stock',
      'Coastal Style: Add coconut milk for Swahili coast variation',
    ],
    pairings: ['Kachumbari salad', 'Mango chutney', 'Yogurt raita', 'Fresh juice'],
    
    // Tags for Discovery
    tags: ['pilau', 'kenyan', 'tiktok-viral', 'ombachi', 'spiced-rice', 'beef', 'one-pot', 'comfort-food'],
    
    // Legacy fields
    time: '1h 5min',
    difficulty: 'Medium',
    minutes: 65,
  },

  {
    id: createId('community', 2),
    title: 'Chef Kaluhi\'s Crispy Samosas',
    summary: 'Learn the technique that made Chef Kaluhi TikTok famous - perfectly crispy samosas with spiced potato filling.',
    description: 'Chef Kaluhi\'s samosa technique has been viewed millions of times on TikTok. Her secret folding method and double-frying technique creates the crispiest, most flavorful samosas that stay crunchy for hours. This is the exact recipe that launched her to social media stardom.',
    
    image: require('@/assets/images/samosas.jpg'),
    images: [
      require('@/assets/images/samosas.jpg'),
      require('@/assets/images/samosas.jpg'),
    ],
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
      videoId: 'crispy-samosa-video',
      likes: '234K',
      shares: '45K',
    },
    
    ingredients: [
      // Wrapper
      { name: 'Samosa wrappers', quantity: 20, unit: 'sheets', group: 'Wrapper', note: 'Or spring roll wrappers' },
      { name: 'All-purpose flour', quantity: 2, unit: 'tbsp', group: 'Wrapper', note: 'For sealing paste' },
      { name: 'Water', quantity: 3, unit: 'tbsp', group: 'Wrapper', note: 'For paste' },
      
      // Filling
      { name: 'Potatoes (medium)', quantity: 4, unit: 'whole', group: 'Filling', note: 'Boiled and diced' },
      { name: 'Green peas', quantity: 0.5, unit: 'cup', group: 'Filling', note: 'Fresh or frozen' },
      { name: 'Onion (finely chopped)', quantity: 1, unit: 'medium', group: 'Filling' },
      { name: 'Garlic cloves', quantity: 3, unit: 'whole', group: 'Aromatics', note: 'Minced' },
      { name: 'Fresh ginger', quantity: 1, unit: 'inch piece', group: 'Aromatics', note: 'Grated' },
      
      // Spices
      { name: 'Cumin seeds', quantity: 1, unit: 'tsp', group: 'Spices' },
      { name: 'Coriander seeds', quantity: 1, unit: 'tsp', group: 'Spices', note: 'Crushed' },
      { name: 'Turmeric powder', quantity: 0.5, unit: 'tsp', group: 'Spices' },
      { name: 'Red chili powder', quantity: 1, unit: 'tsp', group: 'Spices', note: 'Adjust to taste' },
      { name: 'Garam masala', quantity: 1, unit: 'tsp', group: 'Spices' },
      { name: 'Fresh coriander', quantity: 2, unit: 'tbsp', group: 'Herbs', note: 'Chopped' },
      { name: 'Oil for frying', quantity: 2, unit: 'cups', group: 'Fat' },
      { name: 'Salt', quantity: 1, unit: 'tsp', group: 'Seasoning' },
    ],
    
    steps: [
      {
        title: 'Prepare Filling Base',
        body: 'Boil potatoes until fork-tender (15 minutes). Peel and mash roughly, leaving some chunks for texture. Set aside to cool completely.',
        time: 20,
        tips: ['Don\'t over-mash - some texture is good!', 'Cooling prevents soggy wrappers'],
        temperature: { value: 100, unit: 'C' },
      },
      {
        title: 'Temper the Spices',
        body: 'Heat 2 tbsp oil in a pan. Add cumin and coriander seeds, let them splutter. Add onions and sauté until golden.',
        time: 5,
        tips: ['This tempering is Kaluhi\'s flavor secret', 'Don\'t burn the spices'],
        temperature: { value: 180, unit: 'C' },
      },
      {
        title: 'Complete the Filling',
        body: 'Add garlic, ginger, and all dry spices. Cook for 1 minute. Add peas and cook for 2 minutes. Mix in mashed potatoes and fresh coriander. Cool completely.',
        time: 10,
        tips: ['Taste and adjust seasoning', 'Filling must be completely cool'],
      },
      {
        title: 'Make Sealing Paste',
        body: 'Mix flour with water to make a smooth, thick paste. This is your glue for sealing samosas.',
        time: 2,
        tips: ['Paste should be like thick cream', 'No lumps!'],
      },
      {
        title: 'Kaluhi\'s Folding Technique',
        body: 'Cut wrapper in half. Form a cone, add 1 tbsp filling, seal top in triangle shape using paste. Watch Kaluhi\'s video for visual guide!',
        time: 25,
        tips: ['Don\'t overfill', 'Seal edges properly to prevent opening'],
      },
      {
        title: 'First Fry (Secret Step!)',
        body: 'Heat oil to 160°C (medium heat). Fry samosas for 3 minutes until lightly golden. Remove and drain.',
        time: 10,
        temperature: { value: 160, unit: 'C' },
        tips: ['This first fry cooks the inside', 'Don\'t let them brown too much'],
      },
      {
        title: 'Second Fry for Crispiness',
        body: 'Increase oil temperature to 180°C. Fry samosas again for 2 minutes until deep golden and super crispy.',
        time: 5,
        temperature: { value: 180, unit: 'C' },
        tips: ['Kaluhi\'s secret: Double frying = extra crispy!', 'They\'ll stay crispy for hours'],
      },
      {
        title: 'Drain and Serve',
        body: 'Drain on paper towels. Serve hot with tamarind chutney or ketchup.',
        time: 2,
        tips: ['Best enjoyed immediately while crispy', 'Save extras in airtight container'],
      },
    ],
    
    details: {
      servings: 20,
      prepTime: 30,
      cookTime: 20,
      totalTime: 50,
      difficulty: 'medium',
      cost: 'budget',
      equipment: ['Deep frying pan', 'Slotted spoon', 'Mixing bowls', 'Thermometer'],
      allergens: ['Gluten'],
      dietTags: ['Vegetarian', 'Vegan-adaptable'],
      cuisine: 'Kenyan-Indian',
      course: ['Snack', 'Appetizer', 'Street Food'],
      occasion: ['Tea Time', 'Parties', 'Iftar'],
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
      sugar: 1,
      sodium: 180,
      cholesterol: 0,
      saturatedFat: 0.5,
    },
    
    tips: [
      'Double frying is the secret to ultimate crispiness',
      'Keep oil temperature consistent for best results',
      'Make extra and freeze unfried samosas for later',
      'Experiment with different fillings - meat, cheese, or vegetables',
    ],
    variations: [
      'Beef Samosas: Use minced beef instead of potatoes',
      'Chicken Keema: Spiced minced chicken filling',
      'Cheese & Spinach: Modern vegetarian twist',
    ],
    pairings: ['Tamarind chutney', 'Mint chutney', 'Masala chai', 'Ketchup'],
    
    tags: ['samosas', 'kenyan', 'tiktok-viral', 'chef-kaluhi', 'crispy', 'snack', 'street-food', 'appetizer'],
    time: '50min',
    difficulty: 'Medium',
    minutes: 50,
  },

  {
    id: createId('community', 3),
    title: 'Zawadi\'s Famous Chapati Wraps',
    summary: 'The chapati wrap hack that got 3M views! Soft chapatis filled with seasoned chicken and fresh vegetables.',
    description: 'Zawadi Kitchen revolutionized the humble chapati by turning it into gourmet wraps. Her technique for ultra-soft chapatis and perfectly balanced filling combinations has inspired thousands to recreate this viral recipe. The secret is in the dough resting time and her special folding technique.',
    
    image: require('@/assets/images/chicken-tacos.jpg'),
    images: [
      require('@/assets/images/chicken-tacos.jpg'),
      require('@/assets/images/chicken-tacos.jpg'),
    ],
    heroImage: require('@/assets/images/chicken-tacos.jpg'),
    
    author: 'Zawadi Kitchen',
    createdBy: 'community',
    source: 'TikTok',
    sourceUrl: 'https://www.tiktok.com/@zawadikitchen',
    
    videoUrl: 'https://www.tiktok.com/@zawadikitchen/video/chapati-wraps',
    socialMedia: {
      platform: 'TikTok',
      handle: '@zawadikitchen',
      followers: '420K',
      videoId: 'chapati-wrap-hack',
      likes: '567K',
      shares: '123K',
    },
    
    ingredients: [
      // Chapati
      { name: 'All-purpose flour', quantity: 2, unit: 'cups', group: 'Chapati', note: 'Sifted' },
      { name: 'Warm water', quantity: 0.75, unit: 'cup', group: 'Chapati' },
      { name: 'Salt', quantity: 1, unit: 'tsp', group: 'Chapati' },
      { name: 'Sugar', quantity: 1, unit: 'tsp', group: 'Chapati', note: 'For softness' },
      { name: 'Vegetable oil', quantity: 2, unit: 'tbsp', group: 'Chapati', note: 'Plus extra for cooking' },
      
      // Filling
      { name: 'Chicken breast', quantity: 400, unit: 'g', group: 'Filling', note: 'Sliced thin' },
      { name: 'Lettuce', quantity: 1, unit: 'head', group: 'Filling', note: 'Shredded' },
      { name: 'Tomatoes', quantity: 2, unit: 'large', group: 'Filling', note: 'Sliced' },
      { name: 'Red onions', quantity: 1, unit: 'medium', group: 'Filling', note: 'Thinly sliced' },
      { name: 'Cucumber', quantity: 1, unit: 'whole', group: 'Filling', note: 'Julienned' },
      { name: 'Avocado', quantity: 1, unit: 'large', group: 'Filling', optional: true },
      
      // Sauce
      { name: 'Mayonnaise', quantity: 3, unit: 'tbsp', group: 'Sauce' },
      { name: 'Hot sauce', quantity: 1, unit: 'tbsp', group: 'Sauce', note: 'Adjust to taste' },
      { name: 'Honey', quantity: 1, unit: 'tsp', group: 'Sauce' },
      { name: 'Garlic powder', quantity: 0.5, unit: 'tsp', group: 'Sauce' },
      
      // Chicken Seasoning
      { name: 'Paprika', quantity: 1, unit: 'tsp', group: 'Seasoning' },
      { name: 'Black pepper', quantity: 0.5, unit: 'tsp', group: 'Seasoning' },
      { name: 'Garlic powder', quantity: 1, unit: 'tsp', group: 'Seasoning' },
      { name: 'Soy sauce', quantity: 1, unit: 'tbsp', group: 'Seasoning' },
    ],
    
    steps: [
      {
        title: 'Make Chapati Dough',
        body: 'Mix flour, salt, and sugar. Add oil and warm water gradually while mixing. Knead for 10 minutes until smooth and elastic.',
        time: 12,
        tips: ['Zawadi\'s secret: Knead until dough is baby-soft', 'Warm water makes softer chapatis'],
      },
      {
        title: 'Rest the Dough',
        body: 'Cover dough with damp cloth and rest for 30 minutes. This relaxes gluten for easier rolling.',
        time: 30,
        tips: ['Resting is crucial for soft chapatis', 'Keep covered to prevent drying'],
      },
      {
        title: 'Prepare Chicken',
        body: 'Season chicken strips with paprika, black pepper, garlic powder, and soy sauce. Marinate for 15 minutes.',
        time: 15,
        tips: ['Thin slices cook faster and roll better', 'Don\'t skip the marinating'],
      },
      {
        title: 'Cook Chicken',
        body: 'Heat 1 tbsp oil in pan. Cook chicken strips for 6-8 minutes until golden and cooked through. Set aside.',
        time: 8,
        temperature: { value: 180, unit: 'C' },
        tips: ['Don\'t overcook - chicken will dry out', 'Keep some char for flavor'],
      },
      {
        title: 'Prepare Vegetables',
        body: 'Wash and prep all vegetables. Shred lettuce, slice tomatoes and onions, julienne cucumber. Keep crisp and fresh.',
        time: 10,
        tips: ['Prep everything before rolling chapatis', 'Pat vegetables dry to prevent soggy wraps'],
      },
      {
        title: 'Make Zawadi\'s Sauce',
        body: 'Mix mayonnaise, hot sauce, honey, and garlic powder until smooth. Taste and adjust seasoning.',
        time: 3,
        tips: ['This sauce is the magic touch', 'Make extra - it\'s addictive!'],
      },
      {
        title: 'Roll Chapatis',
        body: 'Divide dough into 6 portions. Roll each very thin (2mm). Brush with oil between layers using Zawadi\'s technique.',
        time: 12,
        tips: ['Thin chapatis wrap better', 'Oil between layers creates flaky texture'],
      },
      {
        title: 'Cook Chapatis',
        body: 'Heat dry pan until very hot. Cook each chapati for 1-2 minutes per side until light brown spots appear. Keep soft and pliable.',
        time: 12,
        temperature: { value: 200, unit: 'C' },
        tips: ['Don\'t overcook - they should stay soft', 'Stack and cover to keep warm'],
      },
      {
        title: 'Assemble Wraps',
        body: 'Spread sauce on chapati, add lettuce, chicken, vegetables. Roll tightly using Zawadi\'s burrito-style folding method.',
        time: 8,
        tips: ['Don\'t overfill', 'Tight wrapping prevents falling apart'],
      },
      {
        title: 'Optional Grilling',
        body: 'For crispy exterior, grill wrapped chapatis for 2 minutes per side until golden.',
        time: 4,
        optional: true,
        tips: ['Grilling adds amazing texture', 'Use panini press if available'],
      },
    ],
    
    details: {
      servings: 6,
      prepTime: 45,
      cookTime: 30,
      totalTime: 75,
      difficulty: 'medium',
      cost: 'moderate',
      equipment: ['Rolling pin', 'Non-stick pan', 'Mixing bowl', 'Sharp knife'],
      allergens: ['Gluten'],
      dietTags: ['Customizable'],
      cuisine: 'Fusion',
      course: ['Lunch', 'Dinner', 'Street Food'],
      occasion: ['Quick Lunch', 'Picnic', 'Party Food'],
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
      sugar: 5,
      sodium: 520,
      cholesterol: 55,
      saturatedFat: 3,
    },
    
    tips: [
      'Make chapatis ahead and reheat when needed',
      'Customize fillings based on preference',
      'Great for meal prep - assemble and wrap in foil',
      'Kids love these for school lunch',
    ],
    variations: [
      'Beef Wraps: Use seasoned beef strips',
      'Vegetarian: Replace chicken with paneer or beans',
      'Breakfast Wraps: Scrambled eggs and sausage',
    ],
    pairings: ['Fresh juice', 'Chips', 'Coleslaw', 'Fruit salad'],
    
    tags: ['chapati', 'wraps', 'kenyan', 'tiktok-viral', 'zawadi', 'fusion', 'chicken', 'lunch'],
    time: '1h 15min',
    difficulty: 'Medium',
    minutes: 75,
  },

  {
    id: createId('community', 4),
    title: 'KitchenBae\'s Viral Mukimo',
    summary: 'The modern twist on traditional mukimo that made KitchenBae a TikTok sensation with over 5M views.',
    description: 'KitchenBae elevated the humble mukimo into a gourmet dish that impressed both traditionalists and food enthusiasts. Her technique creates the creamiest, most flavorful mukimo with a modern presentation that\'s Instagram-worthy. The secret is in the butter-milk combination and her special seasoning blend.',
    
    image: require('@/assets/images/mukimo.jpg'),
    images: [
      require('@/assets/images/mukimo.jpg'),
      require('@/assets/images/mukimo.jpg'),
    ],
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
      videoId: 'mukimo-gourmet',
      likes: '789K',
      shares: '234K',
    },
    
    ingredients: [
      // Main Ingredients
      { name: 'Potatoes (medium)', quantity: 4, unit: 'whole', group: 'Vegetables', note: 'Peeled and quartered' },
      { name: 'Green bananas', quantity: 3, unit: 'whole', group: 'Vegetables', note: 'Peeled' },
      { name: 'Fresh maize kernels', quantity: 1, unit: 'cup', group: 'Vegetables', note: 'Or frozen' },
      { name: 'Pumpkin leaves (kunde)', quantity: 2, unit: 'cups', group: 'Greens', note: 'Can substitute with spinach' },
      
      // Aromatics
      { name: 'Onions (large)', quantity: 2, unit: 'whole', group: 'Aromatics', note: 'Finely chopped' },
      { name: 'Garlic cloves', quantity: 4, unit: 'whole', group: 'Aromatics', note: 'Minced' },
      { name: 'Fresh ginger', quantity: 1, unit: 'inch piece', group: 'Aromatics', note: 'Grated' },
      { name: 'Green chilies', quantity: 2, unit: 'whole', optional: true, group: 'Spices', note: 'For heat lovers' },
      
      // Dairy & Fats
      { name: 'Butter', quantity: 3, unit: 'tbsp', group: 'Fat', note: 'KitchenBae\'s secret!' },
      { name: 'Milk', quantity: 0.25, unit: 'cup', group: 'Liquid', note: 'Warm' },
      { name: 'Cooking oil', quantity: 2, unit: 'tbsp', group: 'Fat' },
      
      // Seasoning
      { name: 'Salt', quantity: 1, unit: 'tsp', group: 'Seasoning' },
      { name: 'Black pepper', quantity: 0.5, unit: 'tsp', group: 'Seasoning' },
      { name: 'Fresh coriander', quantity: 2, unit: 'tbsp', group: 'Garnish', note: 'Chopped' },
    ],
    
    steps: [
      {
        title: 'Prep and Boil Vegetables',
        body: 'In a large pot, add potatoes, green bananas, and maize with salted water. Bring to boil and cook for 20 minutes until everything is fork-tender.',
        time: 25,
        temperature: { value: 100, unit: 'C' },
        tips: ['KitchenBae\'s tip: Salt the water well for flavor', 'Don\'t overcook - vegetables should hold shape'],
      },
      {
        title: 'Prepare the Greens',
        body: 'Clean pumpkin leaves thoroughly, remove tough stems. Chop roughly. Blanch in boiling salted water for 3 minutes until bright green. Drain and set aside.',
        time: 8,
        tips: ['Don\'t overcook the greens - they should stay vibrant', 'Ice bath stops cooking and preserves color'],
      },
      {
        title: 'Sauté Aromatics',
        body: 'In a large pan, heat oil and 1 tbsp butter. Sauté onions until golden (5 minutes), then add garlic, ginger, and green chilies. Cook until fragrant.',
        time: 8,
        temperature: { value: 160, unit: 'C' },
        tips: ['This creates the flavor base', 'Golden onions add sweetness'],
      },
      {
        title: 'Drain and Mash',
        body: 'Drain boiled vegetables, reserve 1/4 cup cooking liquid. Add vegetables back to pot with remaining butter and warm milk. Mash to desired consistency.',
        time: 5,
        tips: ['KitchenBae\'s secret: Don\'t overmash!', 'Some texture makes it interesting'],
      },
      {
        title: 'Combine Everything',
        body: 'Fold in sautéed aromatics and blanched greens gently. Season with salt and black pepper. Mix until just combined, preserving the green color.',
        time: 3,
        tips: ['Gentle folding preserves the green color', 'Taste and adjust seasoning'],
      },
      {
        title: 'Final Touch',
        body: 'Transfer to serving dish, make decorative swirls with spoon. Dot with butter, garnish with fresh coriander. Serve immediately.',
        time: 2,
        tips: ['Presentation matters - make it Instagram-worthy!', 'Serve hot for best texture'],
      },
    ],
    
    details: {
      servings: 8,
      prepTime: 15,
      cookTime: 50,
      totalTime: 65,
      difficulty: 'easy',
      cost: 'budget',
      equipment: ['Large pot', 'Potato masher', 'Large pan', 'Colander'],
      allergens: ['Dairy'],
      dietTags: ['Vegetarian', 'Gluten-free'],
      cuisine: 'Kenyan',
      course: ['Side Dish', 'Main Course'],
      occasion: ['Family Dinner', 'Traditional Events', 'Sunday Lunch'],
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
      sugar: 4,
      sodium: 320,
      cholesterol: 15,
      saturatedFat: 3,
    },
    
    tips: [
      'Use a mix of vegetables for complex flavors',
      'Butter makes all the difference - don\'t skip it',
      'Serve with beef stew or chicken for complete meal',
      'Leftovers can be pan-fried for crispy mukimo cakes',
    ],
    variations: [
      'Add sweet potatoes for natural sweetness',
      'Include carrots for color and nutrition',
      'Try with butternut squash for creaminess',
    ],
    pairings: ['Beef stew', 'Grilled chicken', 'Sukuma wiki', 'Tomato salsa'],
    
    tags: ['mukimo', 'kenyan', 'tiktok-viral', 'kitchenbae', 'traditional', 'vegetables', 'comfort-food'],
    time: '1h 5min',
    difficulty: 'Easy',
    minutes: 65,
  },

  {
    id: createId('community', 5),
    title: 'Chef Mwangi\'s Perfect Githeri',
    summary: 'The viral githeri recipe that shows how to transform simple ingredients into a gourmet meal with 4M views.',
    description: 'Chef Mwangi proved that githeri doesn\'t have to be boring. His technique of layering flavors and using the right spice combinations creates a rich, hearty dish that\'s been recreated by thousands of TikTok followers worldwide. The secret is in the overnight soaking and his special spice blend.',
    
    image: require('@/assets/images/githeri.jpg'),
    images: [
      require('@/assets/images/githeri.jpg'),
      require('@/assets/images/githeri.jpg'),
    ],
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
      videoId: 'githeri-gourmet',
      likes: '345K',
      shares: '89K',
    },
    
    ingredients: [
      // Base
      { name: 'Maize (dried)', quantity: 1, unit: 'cup', group: 'Base', note: 'Soaked overnight' },
      { name: 'Kidney beans (dried)', quantity: 1, unit: 'cup', group: 'Base', note: 'Soaked overnight' },
      
      // Protein
      { name: 'Beef (cubed)', quantity: 300, unit: 'g', group: 'Protein', note: 'Optional but recommended' },
      
      // Vegetables
      { name: 'Onions (large)', quantity: 2, unit: 'whole', group: 'Vegetables', note: 'Diced' },
      { name: 'Tomatoes', quantity: 3, unit: 'medium', group: 'Vegetables', note: 'Chopped' },
      { name: 'Carrots', quantity: 2, unit: 'medium', group: 'Vegetables', note: 'Diced' },
      { name: 'Green bell pepper', quantity: 1, unit: 'whole', group: 'Vegetables', note: 'Diced' },
      { name: 'Potatoes', quantity: 2, unit: 'medium', group: 'Vegetables', note: 'Cubed', optional: true },
      
      // Aromatics & Seasonings
      { name: 'Garlic cloves', quantity: 4, unit: 'whole', group: 'Aromatics', note: 'Minced' },
      { name: 'Fresh ginger', quantity: 1, unit: 'inch piece', group: 'Aromatics', note: 'Grated' },
      { name: 'Beef stock cubes', quantity: 2, unit: 'whole', group: 'Seasoning' },
      { name: 'Tomato paste', quantity: 2, unit: 'tbsp', group: 'Sauce' },
      { name: 'Curry powder', quantity: 1, unit: 'tbsp', group: 'Spices', note: 'Mwangi\'s secret!' },
      { name: 'Cooking oil', quantity: 3, unit: 'tbsp', group: 'Fat' },
      { name: 'Coriander (dhania)', quantity: 2, unit: 'tbsp', group: 'Herbs', note: 'Fresh, chopped' },
      { name: 'Salt', quantity: 1, unit: 'tsp', group: 'Seasoning' },
      { name: 'Black pepper', quantity: 0.5, unit: 'tsp', group: 'Seasoning' },
    ],
    
    steps: [
      {
        title: 'Soak Overnight',
        body: 'Soak maize and kidney beans in separate bowls with plenty of water overnight (8-12 hours). This ensures even cooking.',
        time: 480,
        tips: ['Chef Mwangi\'s tip: This step is crucial for texture', 'Change water once if possible'],
      },
      {
        title: 'Boil the Base',
        body: 'Drain and rinse soaked maize and beans. Add to pot with fresh water, bring to boil. Cook for 45 minutes until tender but not mushy.',
        time: 45,
        temperature: { value: 100, unit: 'C' },
        tips: ['Add salt only in the last 10 minutes', 'Keep checking tenderness'],
      },
      {
        title: 'Brown the Beef',
        body: 'Season beef with salt and pepper. In a separate pan, brown beef cubes on all sides until caramelized. Set aside.',
        time: 8,
        temperature: { value: 200, unit: 'C' },
        tips: ['Searing locks in the juices', 'Don\'t overcrowd the pan'],
      },
      {
        title: 'Build Flavor Base',
        body: 'In the same pan, sauté onions until golden. Add garlic, ginger, and curry powder. Cook for 1 minute until fragrant.',
        time: 6,
        tips: ['This is where the magic happens', 'Don\'t burn the spices'],
      },
      {
        title: 'Add Tomatoes',
        body: 'Add tomatoes and tomato paste. Cook down for 5 minutes until thick and jammy. This creates the githeri\'s rich base.',
        time: 5,
        tips: ['Cook until oil separates from tomatoes', 'Mash tomatoes as they cook'],
      },
      {
        title: 'Combine Everything',
        body: 'Add browned beef, boiled maize and beans, carrots, bell pepper, and potatoes. Add stock cubes dissolved in 1 cup water. Simmer for 20 minutes.',
        time: 20,
        tips: ['Let everything marry together slowly', 'Stir gently to avoid breaking beans'],
      },
      {
        title: 'Final Seasoning',
        body: 'Taste and adjust seasoning. Add fresh coriander just before serving. Let rest for 5 minutes off heat.',
        time: 5,
        tips: ['Resting allows flavors to settle', 'Serve with ugali or chapati'],
      },
    ],
    
    details: {
      servings: 8,
      prepTime: 20,
      cookTime: 90,
      totalTime: 110,
      difficulty: 'easy',
      cost: 'budget',
      equipment: ['Large pot', 'Wooden spoon', 'Sharp knife', 'Frying pan'],
      allergens: [],
      dietTags: ['High-protein', 'High-fiber'],
      cuisine: 'Kenyan',
      course: ['Main Course'],
      occasion: ['Family Meal', 'Meal Prep', 'Traditional Feast'],
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
      sugar: 6,
      sodium: 450,
      cholesterol: 35,
      saturatedFat: 2,
    },
    
    tips: [
      'Soaking overnight is non-negotiable for perfect texture',
      'Add vegetables based on cooking time - hard vegetables first',
      'Makes great leftovers - flavors improve overnight',
      'Freeze portions for quick meals',
    ],
    variations: [
      'Vegetarian: Skip beef, use vegetable stock',
      'Coconut Githeri: Add coconut milk for coastal style',
      'Spicy Version: Add fresh chilies and cayenne pepper',
    ],
    pairings: ['Ugali', 'Chapati', 'Avocado slices', 'Kachumbari salad'],
    
    tags: ['githeri', 'kenyan', 'tiktok-viral', 'chef-mwangi', 'traditional', 'healthy', 'meal-prep'],
    time: '1h 50min',
    difficulty: 'Easy',
    minutes: 110,
  },

  {
    id: createId('community', 6),
    title: 'Mama Oliech\'s Legendary Fish Fry',
    summary: 'The crispy tilapia recipe that made Mama Oliech\'s restaurant famous, now viral on TikTok with her grandson\'s videos.',
    description: 'This is the exact recipe from the legendary Mama Oliech\'s restaurant in Nairobi, shared by her grandson on TikTok. The secret to the incredibly crispy coating that stays crunchy even when cold has finally been revealed. This technique has been perfected over 40 years and is now yours to master.',
    
    image: require('@/assets/images/herb-crusted-salmon.jpg'),
    images: [
      require('@/assets/images/herb-crusted-salmon.jpg'),
      require('@/assets/images/herb-crusted-salmon.jpg'),
    ],
    heroImage: require('@/assets/images/herb-crusted-salmon.jpg'),
    
    author: 'Mama Oliech Legacy',
    createdBy: 'community',
    source: 'TikTok',
    sourceUrl: 'https://www.tiktok.com/@oliechlegacy',
    
    videoUrl: 'https://www.tiktok.com/@oliechlegacy/video/legendary-fish-fry',
    socialMedia: {
      platform: 'TikTok',
      handle: '@oliechlegacy',
      followers: '890K',
      videoId: 'mama-oliech-fish',
      likes: '678K',
      shares: '156K',
    },
    
    ingredients: [
      // Fish
      { name: 'Whole tilapia', quantity: 2, unit: 'whole', group: 'Fish', note: 'Fresh, cleaned, scaled' },
      { name: 'Lemon juice', quantity: 2, unit: 'tbsp', group: 'Marinade' },
      { name: 'Salt', quantity: 1, unit: 'tsp', group: 'Marinade' },
      
      // Secret Coating
      { name: 'All-purpose flour', quantity: 1, unit: 'cup', group: 'Coating' },
      { name: 'Cornstarch', quantity: 0.5, unit: 'cup', group: 'Coating', note: 'The secret ingredient!' },
      { name: 'Turmeric powder', quantity: 1, unit: 'tsp', group: 'Coating', note: 'For color' },
      { name: 'Paprika', quantity: 1, unit: 'tbsp', group: 'Coating' },
      { name: 'Garlic powder', quantity: 1, unit: 'tsp', group: 'Coating' },
      { name: 'Ginger powder', quantity: 0.5, unit: 'tsp', group: 'Coating' },
      { name: 'Black pepper', quantity: 1, unit: 'tsp', group: 'Coating' },
      { name: 'Cayenne pepper', quantity: 0.5, unit: 'tsp', group: 'Coating', optional: true },
      
      // For Frying
      { name: 'Vegetable oil', quantity: 3, unit: 'cups', group: 'Frying', note: 'For deep frying' },
      
      // Garnish
      { name: 'Fresh coriander', quantity: 2, unit: 'tbsp', group: 'Garnish' },
      { name: 'Lemon wedges', quantity: 4, unit: 'pieces', group: 'Garnish' },
    ],
    
    steps: [
      {
        title: 'Prepare the Fish',
        body: 'Make 3 diagonal cuts on each side of the fish. Rub with lemon juice and salt, including inside the cavity. Let marinate for 30 minutes.',
        time: 30,
        tips: ['Cuts help seasoning penetrate and ensure even cooking', 'Fresh fish is key - no fishy smell'],
      },
      {
        title: 'Mix Secret Coating',
        body: 'Combine flour, cornstarch, and all spices in a wide dish. Mix thoroughly. The cornstarch is Mama Oliech\'s secret for extra crispiness!',
        time: 3,
        tips: ['Cornstarch creates the signature crunch', 'Mix spices evenly for consistent flavor'],
      },
      {
        title: 'Heat Oil Perfectly',
        body: 'Heat oil in a deep pan to exactly 180°C. Test with a pinch of flour - it should sizzle immediately but not burn.',
        time: 5,
        temperature: { value: 180, unit: 'C' },
        tips: ['Temperature is crucial - too hot burns, too cool makes soggy', 'Use enough oil for fish to float'],
      },
      {
        title: 'Coat the Fish',
        body: 'Pat fish completely dry. Dredge thoroughly in coating mixture, pressing gently to adhere. Shake off excess. Coat inside cuts too.',
        time: 3,
        tips: ['Dry fish = crispy coating', 'Don\'t skip coating the cuts'],
      },
      {
        title: 'First Fry',
        body: 'Carefully lower fish into oil. Fry for 5 minutes on first side without moving. Flip gently and fry 5 more minutes.',
        time: 10,
        tips: ['Don\'t move fish too early - let crust form', 'Oil should bubble steadily, not violently'],
      },
      {
        title: 'The Oliech Double-Fry',
        body: 'Remove fish, let rest 2 minutes. Increase oil to 190°C. Fry again for 2 minutes until deep golden and extra crispy.',
        time: 4,
        temperature: { value: 190, unit: 'C' },
        tips: ['Double frying is the secret to lasting crispiness', 'Second fry seals the coating'],
      },
      {
        title: 'Drain and Serve',
        body: 'Drain on paper towels for 1 minute. Transfer to plate, garnish with coriander and lemon wedges. Serve immediately.',
        time: 2,
        tips: ['Don\'t let it sit on paper too long - stays crispier', 'Squeeze lemon just before eating'],
      },
    ],
    
    details: {
      servings: 4,
      prepTime: 35,
      cookTime: 20,
      totalTime: 55,
      difficulty: 'medium',
      cost: 'moderate',
      equipment: ['Deep frying pan', 'Thermometer', 'Slotted spoon', 'Paper towels'],
      allergens: ['Fish', 'Gluten'],
      dietTags: ['Pescatarian'],
      cuisine: 'Kenyan',
      course: ['Main Course'],
      occasion: ['Special Dinner', 'Weekend Treat', 'Celebration'],
      rating: 4.9,
      ratingCount: 14567,
      favoriteCount: 11200,
    },
    
    nutrition: {
      calories: 320,
      carbs: 24,
      protein: 28,
      fat: 14,
      fiber: 1,
      sugar: 1,
      sodium: 480,
      cholesterol: 75,
      saturatedFat: 3,
    },
    
    tips: [
      'Fresh fish is essential - never use frozen for this recipe',
      'Maintain oil temperature for consistent results',
      'Serve with ugali and kachumbari for authentic experience',
      'Leftover coating mix can be stored for next time',
    ],
    variations: [
      'Use red snapper or sea bass instead of tilapia',
      'Add curry powder to coating for Indian fusion',
      'Shallow fry in less oil, turning more frequently',
    ],
    pairings: ['Ugali', 'Kachumbari salad', 'Sukuma wiki', 'Cold Tusker beer'],
    
    tags: ['fish', 'tilapia', 'kenyan', 'tiktok-viral', 'mama-oliech', 'crispy', 'legendary', 'nairobi'],
    time: '55min',
    difficulty: 'Medium',
    minutes: 55,
  },

  {
    id: createId('community', 7),
    title: 'Dennis Ombachi\'s Championship Ugali',
    summary: 'The rugby star turned chef shares his protein-packed ugali recipe that fueled his sports career.',
    description: 'Dennis Ombachi, former Kenya Rugby Sevens player turned TikTok chef sensation, shares the high-protein ugali variation that powered him through international tournaments. This isn\'t your regular ugali - it\'s enhanced with groundnut flour for extra protein and nutrition, perfect for athletes and fitness enthusiasts.',
    
    image: require('@/assets/images/ugalisukumabeef.jpeg'),
    images: [
      require('@/assets/images/ugalisukumabeef.jpeg'),
      require('@/assets/images/ugalisukumabeef.jpeg'),
    ],
    heroImage: require('@/assets/images/ugalisukumabeef.jpeg'),
    
    author: 'Dennis Ombachi',
    createdBy: 'community',
    source: 'TikTok',
    sourceUrl: 'https://www.tiktok.com/@theroamingchef',
    
    videoUrl: 'https://www.tiktok.com/@theroamingchef/video/championship-ugali',
    socialMedia: {
      platform: 'TikTok',
      handle: '@theroamingchef',
      followers: '2.3M',
      videoId: 'athlete-ugali',
      likes: '890K',
      shares: '234K',
    },
    
    ingredients: [
      // Ugali Mix
      { name: 'White maize flour', quantity: 1.5, unit: 'cups', group: 'Main' },
      { name: 'Groundnut flour', quantity: 0.5, unit: 'cup', group: 'Main', note: 'Ombachi\'s protein secret!' },
      { name: 'Water', quantity: 3, unit: 'cups', group: 'Liquid' },
      { name: 'Salt', quantity: 1, unit: 'tsp', group: 'Seasoning' },
      { name: 'Butter', quantity: 1, unit: 'tbsp', group: 'Fat', note: 'For richness', optional: true },
    ],
    
    steps: [
      {
        title: 'Mix the Flours',
        body: 'Combine maize flour and groundnut flour in a bowl. Mix well. This combination adds protein and a subtle nutty flavor.',
        time: 2,
        tips: ['Groundnut flour is Ombachi\'s game-changer', 'Mix dry ingredients first for even distribution'],
      },
      {
        title: 'Boil Water',
        body: 'Bring water to a rolling boil in a heavy-bottomed pot. Add salt and butter if using.',
        time: 5,
        temperature: { value: 100, unit: 'C' },
        tips: ['Heavy pot prevents sticking and burning', 'Salt enhances overall flavor'],
      },
      {
        title: 'Add Flour Gradually',
        body: 'Reduce heat to medium. Add flour mixture gradually while stirring continuously with a strong wooden spoon.',
        time: 3,
        tips: ['Ombachi\'s technique: Add flour in a steady stream', 'Keep stirring to prevent lumps'],
      },
      {
        title: 'The Power Stir',
        body: 'Stir vigorously for 5 minutes. This is your workout! The mixture will become thick and start pulling away from the sides.',
        time: 5,
        tips: ['Channel your inner athlete - this needs strength!', 'Consistency should be thick but smooth'],
      },
      {
        title: 'Cook and Turn',
        body: 'Reduce heat to low. Let cook for 3 minutes, then fold and turn the ugali. Repeat 3 times for even cooking.',
        time: 12,
        tips: ['Folding technique ensures even cooking', 'Listen for slight sizzling at the bottom'],
      },
      {
        title: 'Final Shape',
        body: 'Turn ugali onto a wet plate and shape into a mound. Let rest for 2 minutes before serving.',
        time: 2,
        tips: ['Wet plate prevents sticking', 'Resting makes it easier to serve'],
      },
    ],
    
    details: {
      servings: 6,
      prepTime: 5,
      cookTime: 25,
      totalTime: 30,
      difficulty: 'easy',
      cost: 'budget',
      equipment: ['Heavy-bottomed pot', 'Strong wooden spoon'],
      allergens: ['Peanuts'],
      dietTags: ['Vegetarian', 'High-protein', 'Athlete-friendly'],
      cuisine: 'Kenyan',
      course: ['Side Dish'],
      occasion: ['Sports Nutrition', 'Training Meals', 'Daily Meals'],
      rating: 4.7,
      ratingCount: 8934,
      favoriteCount: 6700,
    },
    
    nutrition: {
      calories: 180,
      carbs: 30,
      protein: 7,
      fat: 3,
      fiber: 3,
      sugar: 1,
      sodium: 200,
      cholesterol: 0,
      saturatedFat: 0.5,
    },
    
    tips: [
      'Groundnut flour adds 40% more protein than regular ugali',
      'Perfect for post-workout meals',
      'Keeps you fuller for longer',
      'Great for growing children and athletes',
    ],
    variations: [
      'Add millet flour for extra minerals',
      'Mix in chia seeds for omega-3s',
      'Use sorghum flour for gluten-free option',
    ],
    pairings: ['Beef stew', 'Sukuma wiki', 'Grilled chicken', 'Fish curry'],
    
    tags: ['ugali', 'kenyan', 'tiktok-viral', 'ombachi', 'protein', 'athlete', 'sports-nutrition'],
    time: '30min',
    difficulty: 'Easy',
    minutes: 30,
  },
];

// Export the enhanced community recipes
export const getCommunityRecipesEnhanced = (): Recipe[] => {
  return communityRecipesEnhanced;
};

// Get recipes by creator
export const getEnhancedRecipesByCreator = (creator: string): Recipe[] => {
  return communityRecipesEnhanced.filter(recipe => 
    recipe.author?.toLowerCase().includes(creator.toLowerCase())
  );
};

// Get viral recipes (high engagement)
export const getEnhancedViralRecipes = (): Recipe[] => {
  return communityRecipesEnhanced.filter(recipe => 
    (recipe.details?.favoriteCount ?? 0) > 5000
  );
};

// Get recipes by platform
export const getRecipesByPlatform = (platform: string): Recipe[] => {
  return communityRecipesEnhanced.filter(recipe =>
    recipe.socialMedia?.platform?.toLowerCase() === platform.toLowerCase()
  );
};

// Get trending recipes (high rating and recent)
export const getTrendingRecipes = (): Recipe[] => {
  return communityRecipesEnhanced
    .filter(recipe => (recipe.details?.rating ?? 0) >= 4.7)
    .sort((a, b) => (b.details?.favoriteCount ?? 0) - (a.details?.favoriteCount ?? 0))
    .slice(0, 5);
};
