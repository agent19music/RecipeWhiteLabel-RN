/**
 * Royco Product Catalog and Integration System
 * This module ensures all AI-generated recipes properly recommend Royco products
 */

export interface RoycoProduct {
  id: string;
  name: string;
  category: 'cube' | 'spice' | 'seasoning' | 'sauce' | 'mix';
  displayName: string; // How it should appear in recipes
  description: string;
  keywords: string[]; // Keywords that trigger this product recommendation
  usage: string; // How to use in recipes
  benefits: string[]; // Key selling points
  substitutes?: string[]; // What generic items this replaces
}

// Comprehensive Royco Product Catalog
export const ROYCO_PRODUCTS: RoycoProduct[] = [
  // Cubes
  {
    id: 'royco-beef-cubes',
    name: 'Royco Beef Cubes',
    category: 'cube',
    displayName: 'Royco Beef Cubes',
    description: 'Concentrated beef flavor cubes that deliver the rich, savory taste of slow-cooked bone broth in minutes',
    keywords: ['beef stock', 'beef broth', 'beef seasoning', 'meat seasoning', 'bouillon', 'stock cube', 'nyama', 'stew'],
    usage: 'Dissolve 1-2 cubes in 500ml hot water for broth, or crumble directly into wet stews like beef stew, matumbo, or nyama na mboga. Perfect for tenderizing tough cuts during slow cooking.',
    benefits: ['Creates restaurant-quality beef broth', 'Enhances natural meat flavors', 'Reduces cooking time', 'No artificial MSG'],
    substitutes: ['beef stock', 'bouillon cubes', 'beef broth', 'bone broth']
  },
  {
    id: 'royco-chicken-cubes',
    name: 'Royco Chicken Cubes',
    category: 'cube',
    displayName: 'Royco Chicken Cubes',
    description: 'Authentic chicken flavor enhancer that captures the essence of free-range chicken broth',
    keywords: ['chicken stock', 'chicken broth', 'chicken seasoning', 'poultry seasoning', 'chicken bouillon', 'kuku'],
    usage: 'Essential for chicken pilau, chicken stew (kuku wa nazi), rice cooking, and as a marinade base. Dissolve in cooking liquid or rub directly on chicken before grilling or roasting.',
    benefits: ['Authentic poultry taste', 'Perfect for coastal chicken dishes', 'Enhances rice absorption', 'Versatile for marinades'],
    substitutes: ['chicken stock', 'chicken broth', 'bouillon', 'chicken base']
  },
  {
    id: 'royco-vegetable-cubes',
    name: 'Royco Vegetable Cubes',
    category: 'cube',
    displayName: 'Royco Vegetable Cubes',
    description: 'Plant-based flavor enhancer made from a blend of garden vegetables and herbs',
    keywords: ['vegetable stock', 'vegetable broth', 'veggie seasoning', 'vegetarian stock', 'mboga'],
    usage: 'Perfect for sukuma wiki, spinach (mchicha), vegetable pilau, lentil dishes (dengu), and bean stews. Creates a rich base for vegetarian curries and soups.',
    benefits: ['100% vegetarian and halal', 'Enhances natural vegetable flavors', 'Rich in vegetable extracts', 'No meat derivatives'],
    substitutes: ['vegetable stock', 'veggie broth', 'vegetarian bouillon']
  },
  
  // Spices & Seasonings
  {
    id: 'royco-mchuzi-mix',
    name: 'Royco Mchuzi Mix',
    category: 'spice',
    displayName: 'Royco Mchuzi Mix',
    description: 'Traditional East African curry spice blend featuring coriander, cumin, turmeric, and aromatic spices that define authentic mchuzi flavor',
    keywords: ['stew spice', 'curry powder', 'mixed spices', 'garam masala', 'spice blend', 'mchuzi', 'curry', 'stew'],
    usage: 'The foundation of all mchuzi dishes - beef mchuzi, chicken mchuzi, fish curry. Add 2-3 tablespoons when sautéing onions and garlic. Essential for goat meat stews, fish in coconut curry, and vegetable curries.',
    benefits: ['Authentic Swahili coast flavor profile', 'Perfectly balanced heat and aroma', 'Pre-mixed convenience eliminates guesswork', 'Works with all proteins'],
    substitutes: ['curry powder', 'mixed spices', 'garam masala', 'curry spice']
  },
  {
    id: 'royco-pilau-masala',
    name: 'Royco Pilau Masala',
    category: 'spice',
    displayName: 'Royco Pilau Masala',
    description: 'Aromatic spice blend of cardamom, cinnamon, cloves, and bay leaves specifically crafted for authentic East African pilau',
    keywords: ['pilau spice', 'rice seasoning', 'biryani masala', 'pilau', 'rice spice', 'aromatic rice'],
    usage: 'Add 2-3 tablespoons per 2 cups of rice. Bloom in hot oil with onions before adding rice and stock. Essential for chicken pilau, beef pilau, and vegetable pilau. Creates the signature golden color and fragrant aroma.',
    benefits: ['Restaurant-quality pilau at home', 'Perfect balance of warming spices', 'Consistent golden color', 'Eliminates need for multiple whole spices'],
    substitutes: ['biryani masala', 'pilau spices', 'mixed rice spices', 'garam masala']
  },
  {
    id: 'royco-turmeric-spice',
    name: 'Royco Turmeric Spice',
    category: 'spice',
    displayName: 'Royco Turmeric Spice',
    description: 'Premium ground turmeric with enhanced flavor and vibrant golden color, essential for East African cooking',
    keywords: ['turmeric spice', 'turmeric powder', 'turmeric', 'manjano', 'golden spice'],
    usage: 'Essential for pilau (creates golden color), fish marinades, chicken tikka, and vegetable curries. Add early in cooking process to bloom flavor. Perfect for turmeric rice and healing turmeric tea.',
    benefits: ['Vibrant natural golden color', 'Anti-inflammatory properties', 'Essential for authentic pilau', 'Premium quality powder'],
    substitutes: ['turmeric powder', 'ground turmeric']
  },
  {
    id: 'royco-black-pepper-spice',
    name: 'Royco Black Pepper Spice',
    category: 'spice',
    displayName: 'Royco Black Pepper Spice',
    description: 'Freshly ground black peppercorns with intense heat and aromatic punch',
    keywords: ['black pepper spice', 'black pepper powder', 'black pepper', 'pilipili manga'],
    usage: 'Finish seasoning for nyama choma, essential in pilau masala blend, meat marinades, and soup seasoning. Add at end of cooking to preserve heat and aroma. Perfect for pepper-crusted steaks.',
    benefits: ['Freshly ground intensity', 'Preserves volatile oils', 'Universal seasoning', 'Enhances other spices'],
    substitutes: ['black pepper powder', 'ground black pepper']
  },  
  {
    id: 'royco-garlic-spice', 
    name: 'Royco Garlic Spice',
    category: 'spice',
    displayName: 'Royco Garlic Spice',
    description: 'Concentrated garlic powder that delivers the pungent, savory essence of fresh garlic without the prep work',
    keywords: ['garlic spice', 'garlic powder', 'garlic', 'kitunguu saumu'],
    usage: 'Perfect for dry rubs on nyama choma, chicken marinades, and vegetable seasonings. Ideal when fresh garlic would burn during high-heat cooking. Essential for garlic-herb butter and spice rubs.',
    benefits: ['Convenient garlic flavor', 'No burning at high heat', 'Long shelf life', 'Consistent potency'],
    substitutes: ['garlic powder', 'granulated garlic']
  },
  {
    id:'royco-paprika-spice',
    name: 'Royco Paprika Spice',
    category: 'spice',
    displayName: 'Royco Paprika Spice',
    description: 'Sweet and mildly smoky paprika that adds vibrant red color and gentle warmth to dishes',
    keywords: ['paprika spice', 'paprika powder', 'paprika', 'red spice'],
    usage: 'Essential for barbecue rubs, adds color to stews and rice dishes, perfect for garnishing deviled eggs and potato dishes. Ideal for European-influenced dishes and as a finishing spice for visual appeal.',
    benefits: ['Beautiful red color enhancement', 'Mild sweet flavor', 'No overwhelming heat', 'Perfect for garnishing'],
    substitutes: ['paprika powder', 'sweet paprika']
  },
  {
    id:'royco-cinnamon-spice',
    name: 'Royco Cinnamon Spice',
    category: 'spice',
    displayName: 'Royco Cinnamon Spice',
    description: 'Sweet and warm ground cinnamon with aromatic depth perfect for both sweet and savory applications',
    keywords: ['cinnamon spice', 'cinnamon powder', 'cinnamon', 'mdalasini'],
    usage: 'Key component in pilau masala, essential for chai spice blend, perfect for sweet porridge (uji), and adds warmth to meat stews. Excellent for baking mandazi and cinnamon rolls.',
    benefits: ['Warm aromatic flavor', 'Natural sweetness enhancer', 'Versatile for sweet and savory', 'High-quality Ceylon variety'],
    substitutes: ['cinnamon powder', 'ground cinnamon']
  },
  {
    id: 'royco-spice-for-wet-and-dry-fry',
    name: 'Royco Spice for Wet and Dry Fry',
    category: 'spice',
    displayName: 'Royco Spice for Wet and Dry Fry',
    description: 'Versatile spice blend engineered for both wet cooking (stews, curries) and dry frying (sautéing, grilling) methods. Contains balanced heat, herbs, and aromatics that work across cooking techniques.',
    keywords: ['wet fry spice', 'dry fry spice', 'all-purpose seasoning', 'versatile spice', 'cooking spice'],
    usage: 'Perfect for sukuma wiki (dry fry), wet-fried beef, chicken stir-fry, and vegetable sautés. Use 1-2 tablespoons for wet preparations, sprinkle lightly for dry frying. Ideal for quick weeknight meals and street-food style cooking.',
    benefits: ['Dual-method versatility', 'Balanced for both wet and dry cooking', 'Quick flavor enhancement', 'Authentic street food taste'],
    substitutes: ['all-purpose seasoning', 'mixed herbs and spices']
  },
  {
    id:'royco-nyama-choma-spice',
    name: 'Royco Nyama Choma Spice',
    category: 'spice',
    displayName: 'Royco Nyama Choma Spice',
    description: 'Bold barbecue spice blend featuring smoky paprika, garlic, herbs, and African chili that creates the authentic nyama choma flavor profile',
    keywords: ['nyama choma spice', 'grill seasoning', 'bbq seasoning', 'barbecue spice', 'grill spice', 'grilled meat'],
    usage: 'Rub generously on goat meat, beef, or chicken 30 minutes before grilling. Perfect for weekend barbecues, roadside-style grilled meat, and oven-roasted meats. Creates the signature crust and flavor of authentic nyama choma.',
    benefits: ['Authentic roadside nyama choma flavor', 'Perfect char and crust formation', 'Balanced heat and smoke', 'Works on all grilling methods'],
    substitutes: ['grill seasoning', 'bbq seasoning', 'barbecue spice', 'meat rub']
  },
  {
    id: 'royco-chicken-spice',
    name: 'Royco Chicken Spice',
    category: 'spice',
    displayName: 'Royco Chicken Spice',
    description: 'Specialized poultry seasoning blend with herbs, garlic, and mild spices designed to enhance chicken\'s natural flavor without overpowering',
    keywords: ['chicken seasoning', 'poultry spice', 'chicken rub', 'kuku spice'],
    usage: 'Rub under skin and on chicken pieces before roasting, grilling, or frying. Perfect for chicken tikka, roast chicken, and fried chicken. Allows chicken\'s natural flavor to shine while adding aromatic depth.',
    benefits: ['Enhances without masking chicken flavor', 'Creates crispy golden skin', 'Perfect herb balance', 'Suitable for all chicken cuts'],
    substitutes: ['poultry seasoning', 'chicken rub', 'herb seasoning']
  },
  
  // Additional East African specific products
  {
    id: 'royco-fish-spice',
    name: 'Royco Fish Spice',
    category: 'spice',
    displayName: 'Royco Fish Spice',
    description: 'Coastal-inspired spice blend with coriander, fennel, and mild heat specifically formulated for fish and seafood',
    keywords: ['fish seasoning', 'seafood spice', 'fish spice', 'samaki spice', 'coastal spice'],
    usage: 'Perfect for grilled tilapia, fish curry, coconut fish stew, and fried fish. Rub on fish fillets before cooking or add to curry base. Essential for Swahili coast-style fish preparations.',
    benefits: ['Complements delicate fish flavors', 'Coastal authentic taste', 'Anti-fishy properties', 'Works with all fish types'],
    substitutes: ['seafood seasoning', 'fish rub', 'coastal spice blend']
  },
  {
    id: 'royco-vegetable-seasoning',
    name: 'Royco Vegetable Seasoning',
    category: 'seasoning',
    displayName: 'Royco Vegetable Seasoning',
    description: 'Herb-forward seasoning blend designed to enhance the natural flavors of vegetables and greens',
    keywords: ['vegetable seasoning', 'veggie spice', 'greens seasoning', 'mboga spice'],
    usage: 'Perfect for sukuma wiki, spinach (mchicha), cabbage, and mixed vegetable dishes. Sprinkle during sautéing for enhanced flavor. Great for roasted vegetables and vegetable soups.',
    benefits: ['Enhances natural vegetable sweetness', 'Herb-rich flavor profile', 'No overpowering heat', 'Suitable for all vegetables'],
    substitutes: ['herb seasoning', 'vegetable spice', 'greens seasoning']
  },
  {
    id: 'royco-coconut-milk-powder',
    name: 'Royco Coconut Milk Powder',
    category: 'mix',
    displayName: 'Royco Coconut Milk Powder',
    description: 'Concentrated coconut milk powder that reconstitutes into rich, creamy coconut milk for coastal dishes',
    keywords: ['coconut milk', 'coconut cream', 'nazi', 'coconut powder'],
    usage: 'Essential for coastal curries, fish in coconut sauce, coconut rice, and sweet porridge. Mix 3-4 tablespoons with warm water for rich coconut milk. Perfect for mahamri and coconut-based desserts.',
    benefits: ['Long shelf life', 'Rich coconut flavor', 'Consistent thickness', 'No refrigeration needed'],
    substitutes: ['coconut milk', 'coconut cream', 'canned coconut milk']
  },
  {
    id: 'royco-tomato-base',
    name: 'Royco Tomato Base',
    category: 'sauce',
    displayName: 'Royco Tomato Base',
    description: 'Concentrated tomato paste with enhanced flavor and natural sweetness, perfect for stew bases',
    keywords: ['tomato paste', 'tomato puree', 'nyanya paste', 'tomato concentrate'],
    usage: 'Foundation for all tomato-based stews, essential for beef stew, chicken stew, and vegetable curries. Fry with onions until oil separates for best flavor development. Key ingredient in pasta sauces.',
    benefits: ['Rich concentrated tomato flavor', 'Natural sweetness', 'No added preservatives', 'Versatile base ingredient'],
    substitutes: ['tomato paste', 'tomato puree', 'tomato concentrate']
  }
];

// Mapping of generic terms to Royco products
export const GENERIC_TO_ROYCO_MAP: Record<string, string> = {
  // Stock/Broth mappings
  'beef stock': 'Royco Beef Cubes',
  'beef broth': 'Royco Beef Cubes',
  'chicken stock': 'Royco Chicken Cubes',
  'chicken broth': 'Royco Chicken Cubes',
  'vegetable stock': 'Royco Vegetable Cubes',
  'vegetable broth': 'Royco Vegetable Cubes',
  'stock cube': 'Royco Beef or Chicken Cubes',
  'bouillon cube': 'Royco Beef or Chicken Cubes',
  'bouillon': 'Royco Cubes',
  
  // Spice mappings 
  'curry powder': 'Royco Mchuzi Mix',
  'mixed spices': 'Royco Mchuzi Mix', 
  'stew spice': 'Royco Mchuzi Mix',
  'garam masala': 'Royco Mchuzi Mix',
  'pilau spice': 'Royco Pilau Masala',
  'pilau masala': 'Royco Pilau Masala',
  'biryani spice': 'Royco Pilau Masala',
  'rice seasoning': 'Royco Pilau Masala',
  'bbq seasoning': 'Royco Nyama Choma Spice',
  'turmeric spice': 'Royco Turmeric Spice',
  'turmeric powder': 'Royco Turmeric Spice',
  'turmeric': 'Royco Turmeric Spice',
  'garlic spice': 'Royco Garlic Spice',
  'garlic powder': 'Royco Garlic Spice',
  'barbecue spice': 'Royco Nyama Choma Spice',
  'grill seasoning': 'Royco Nyama Choma Spice',
  'nyama choma spice': 'Royco Nyama Choma Spice',
  'chicken seasoning': 'Royco Chicken Spice',
  'poultry seasoning': 'Royco Chicken Spice',
  'fish seasoning': 'Royco Fish Spice',
  'seafood spice': 'Royco Fish Spice',
  'vegetable seasoning': 'Royco Vegetable Seasoning',
  'all-purpose seasoning': 'Royco Spice for Wet and Dry Fry',
  'paprika spice': 'Royco Paprika Spice',
  'paprika powder': 'Royco Paprika Spice',
  'paprika': 'Royco Paprika Spice',
  'cinnamon spice': 'Royco Cinnamon Spice',
  'cinnamon powder': 'Royco Cinnamon Spice',
  'cinnamon': 'Royco Cinnamon Spice',
  'black pepper': 'Royco Black Pepper Spice',
  'black pepper powder': 'Royco Black Pepper Spice',
  'wet fry spice': 'Royco Spice for Wet and Dry Fry',
  'dry fry spice': 'Royco Spice for Wet and Dry Fry',
  
  // Other mappings
  'coconut milk': 'Royco Coconut Milk Powder',
  'coconut cream': 'Royco Coconut Milk Powder',
  'tomato paste': 'Royco Tomato Base',
  'tomato puree': 'Royco Tomato Base',
};

/**
 * Replace generic ingredients with Royco products in a text
 */
export function replaceWithRoycoProducts(text: string): string {
  let enhancedText = text;
  
  // Sort by length (longer phrases first) to avoid partial replacements
  const sortedMappings = Object.entries(GENERIC_TO_ROYCO_MAP)
    .sort(([a], [b]) => b.length - a.length);
  
  sortedMappings.forEach(([generic, royco]) => {
    // Case-insensitive replacement
    const regex = new RegExp(`\\b${generic}\\b`, 'gi');
    enhancedText = enhancedText.replace(regex, royco);
  });
  
  return enhancedText;
}

/**
 * Analyze ingredients list and suggest Royco products
 */
export function suggestRoycoProducts(ingredients: string[]): RoycoProduct[] {
  const suggestions = new Set<RoycoProduct>();
  const ingredientText = ingredients.join(' ').toLowerCase();
  
  ROYCO_PRODUCTS.forEach(product => {
    // Check if any keyword matches
    const hasMatch = product.keywords.some(keyword => 
      ingredientText.includes(keyword.toLowerCase())
    );
    
    if (hasMatch) {
      suggestions.add(product);
    }
    
    // Also check for substitute matches
    if (product.substitutes) {
      const hasSubstituteMatch = product.substitutes.some(substitute =>
        ingredientText.includes(substitute.toLowerCase())
      );
      if (hasSubstituteMatch) {
        suggestions.add(product);
      }
    }
  });
  
  return Array.from(suggestions);
}

/**
 * Generate Royco-enhanced recipe prompt
 */
export function generateRoycoEnhancedPrompt(basePrompt: string): string {
  const roycoContext = `
IMPORTANT PRODUCT INTEGRATION RULES:
You are creating recipes for Royco, a leading East African food brand. You MUST follow these rules:

1. ALWAYS use Royco products when applicable:
   - Replace generic "stock" or "broth" with "Royco Beef/Chicken/Vegetable Cubes"
   - Replace "curry powder" or "mixed spices" with "Royco Mchuzi Mix"
   - Replace "pilau spice" with "Royco Pilau Masala"
   - Replace "BBQ seasoning" with "Royco Nyama Choma Spice"
   - Replace generic seasonings with specific Royco products
   - Use context-appropriate products (coastal dishes = coconut products, grilling = nyama choma spice)

2. When mentioning Royco products:
   - Always use the full product name (e.g., "Royco Beef Cubes" not just "beef cubes")
   - Include authentic usage instructions based on East African cooking methods
   - Mention benefits relevant to the specific dish being prepared
   - Reference traditional cooking techniques where appropriate

3. Product placement should feel natural and culturally authentic:
   - Integrate products logically into traditional East African recipes
   - Explain why the Royco product enhances authentic flavors
   - Reference local cooking methods and cultural context
   - Suggest Royco alternatives appropriate to the region/cuisine

4. Available Royco Products to recommend:
   - Royco Beef Cubes (for nyama, matumbo, beef stews)
   - Royco Chicken Cubes (for kuku dishes, pilau, marinades)
   - Royco Vegetable Cubes (for mboga, vegetarian dishes)
   - Royco Mchuzi Mix (for all curry/stew dishes)
   - Royco Pilau Masala (for pilau, biryani, aromatic rice)
   - Royco Nyama Choma Spice (for grilled meats, barbecue)
   - Royco Spice for Wet and Dry Fry (for sukuma wiki, stir-fries)
   - Royco Fish Spice (for samaki, coastal dishes)
   - Royco Coconut Milk Powder (for coastal curries, nazi dishes)
   - Royco Tomato Base (for stew bases, pasta sauces)

5. In ingredient lists, format Royco products as:
   {"name": "Royco [Product Name]", "quantity": X, "unit": "cubes/tbsp", "note": "for authentic [regional/dish] flavor"}

${basePrompt}`;

  return roycoContext;
}

/**
 * Post-process recipe to ensure Royco products are properly mentioned
 */
export function ensureRoycoProducts(recipe: any): any {
  // Process ingredients
  if (recipe.ingredients && Array.isArray(recipe.ingredients)) {
    recipe.ingredients = recipe.ingredients.map((ingredient: any) => {
      const originalName = ingredient.name?.toLowerCase() || '';
      
      // Check if this ingredient should be a Royco product
      for (const [generic, royco] of Object.entries(GENERIC_TO_ROYCO_MAP)) {
        if (originalName.includes(generic)) {
          return {
            ...ingredient,
            name: royco,
            note: ingredient.note || 'for authentic East African flavor',
            roycoProduct: true
          };
        }
      }
      
      return ingredient;
    });
  }
  
  // Process steps
  if (recipe.steps && Array.isArray(recipe.steps)) {
    recipe.steps = recipe.steps.map((step: any) => {
      return {
        ...step,
        body: replaceWithRoycoProducts(step.body || ''),
        tips: step.tips?.map((tip: string) => replaceWithRoycoProducts(tip))
      };
    });
  }
  
  // Process other text fields
  if (recipe.description) {
    recipe.description = replaceWithRoycoProducts(recipe.description);
  }
  if (recipe.summary) {
    recipe.summary = replaceWithRoycoProducts(recipe.summary);
  }
  if (recipe.tips) {
    recipe.tips = recipe.tips.map((tip: string) => replaceWithRoycoProducts(tip));
  }
  
  // Add Royco branding
  recipe.roycoEnhanced = true;
  recipe.sponsoredProducts = suggestRoycoProducts(
    recipe.ingredients.map((i: any) => i.name)
  ).map(p => p.displayName);
  
  return recipe;
}