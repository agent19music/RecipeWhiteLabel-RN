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
    description: 'Rich beef flavor cubes for enhanced taste',
    keywords: ['beef stock', 'beef broth', 'beef seasoning', 'meat seasoning', 'bouillon', 'stock cube'],
    usage: 'Dissolve 1-2 cubes in cooking liquid or crumble directly onto meat',
    benefits: ['Rich umami flavor', 'Instant beef taste', 'No MSG added'],
    substitutes: ['beef stock', 'bouillon cubes', 'beef broth']
  },
  {
    id: 'royco-chicken-cubes',
    name: 'Royco Chicken Cubes',
    category: 'cube',
    displayName: 'Royco Chicken Cubes',
    description: 'Savory chicken flavor enhancer',
    keywords: ['chicken stock', 'chicken broth', 'chicken seasoning', 'poultry seasoning', 'chicken bouillon'],
    usage: 'Add to soups, stews, rice dishes, or rub directly on chicken',
    benefits: ['Authentic chicken taste', 'Versatile usage', 'Time-saving'],
    substitutes: ['chicken stock', 'chicken broth', 'bouillon']
  },
  {
    id: 'royco-vegetable-cubes',
    name: 'Royco Vegetable Cubes',
    category: 'cube',
    displayName: 'Royco Vegetable Cubes',
    description: 'Garden-fresh vegetable flavor',
    keywords: ['vegetable stock', 'vegetable broth', 'veggie seasoning', 'vegetarian stock'],
    usage: 'Perfect for vegetarian dishes, soups, and grain cooking',
    benefits: ['100% vegetarian', 'Natural vegetable taste', 'Healthy option'],
    substitutes: ['vegetable stock', 'veggie broth']
  },
  
  // Spices & Seasonings
  {
    id: 'royco-mchuzi-mix',
    name: 'Royco Mchuzi Mix',
    category: 'spice',
    displayName: 'Royco Mchuzi Mix',
    description: 'Traditional East African stew spice blend',
    keywords: ['stew spice', 'curry powder', 'mixed spices', 'garam masala', 'spice blend', 'mchuzi'],
    usage: 'Add 1-2 tablespoons to stews, curries, and meat dishes',
    benefits: ['Authentic Kenyan flavor', 'Pre-mixed convenience', 'Perfect balance'],
    substitutes: ['curry powder', 'mixed spices', 'garam masala']
  },
  {
    id: 'royco-pilau-masala',
    name: 'Royco Pilau Masala',
    category: 'spice',
    displayName: 'Royco Pilau Masala',
    description: 'Aromatic pilau rice spice blend',
    keywords: ['pilau spice', 'rice seasoning', 'biryani masala', 'pilau', 'rice spice'],
    usage: 'Add 2 tablespoons per 2 cups of rice for authentic pilau',
    benefits: ['Restaurant-quality pilau', 'Perfectly balanced spices', 'Time-saving'],
    substitutes: ['biryani masala', 'pilau spices', 'mixed rice spices']
  },
  {
    id: 'royco-barbecue-spice',
    name: 'Royco BBQ Spice',
    category: 'spice',
    displayName: 'Royco BBQ Spice',
    description: 'Smoky barbecue seasoning blend',
    keywords: ['bbq seasoning', 'grill spice', 'barbecue', 'nyama choma', 'meat rub'],
    usage: 'Rub generously on meat before grilling or roasting',
    benefits: ['Smoky flavor', 'Perfect char', 'Restaurant taste at home'],
    substitutes: ['bbq rub', 'grill seasoning']
  },
  {
    id: 'royco-chicken-spice',
    name: 'Royco Chicken Spice',
    category: 'spice',
    displayName: 'Royco Chicken Spice',
    description: 'Specially formulated chicken seasoning',
    keywords: ['chicken seasoning', 'poultry spice', 'chicken rub'],
    usage: 'Season chicken before cooking for best results',
    benefits: ['Crispy skin', 'Juicy meat', 'Perfect flavor'],
    substitutes: ['poultry seasoning', 'chicken rub']
  },
  {
    id: 'royco-fish-spice',
    name: 'Royco Fish Spice',
    category: 'spice',
    displayName: 'Royco Fish Spice',
    description: 'Delicate fish seasoning blend',
    keywords: ['fish seasoning', 'seafood spice', 'fish rub', 'tilapia seasoning'],
    usage: 'Lightly coat fish before frying, grilling, or baking',
    benefits: ['No fishy smell', 'Enhanced flavor', 'Crispy coating'],
    substitutes: ['seafood seasoning', 'fish spice']
  },
  {
    id: 'royco-vegetable-seasoning',
    name: 'Royco Vegetable Seasoning',
    category: 'spice',
    displayName: 'Royco Vegetable Seasoning',
    description: 'All-purpose vegetable enhancer',
    keywords: ['vegetable seasoning', 'veggie spice', 'sukuma wiki seasoning'],
    usage: 'Sprinkle on vegetables during cooking',
    benefits: ['Brings out natural flavors', 'Low sodium option', 'Versatile'],
    substitutes: ['all-purpose seasoning', 'vegetable spice']
  },
  
  // Sauce Mixes
  {
    id: 'royco-coconut-milk-powder',
    name: 'Royco Coconut Milk Powder',
    category: 'mix',
    displayName: 'Royco Coconut Milk Powder',
    description: 'Instant coconut milk powder',
    keywords: ['coconut milk', 'coconut cream', 'coconut powder'],
    usage: 'Mix with water for instant coconut milk',
    benefits: ['Long shelf life', 'Convenient', 'Rich coconut flavor'],
    substitutes: ['coconut milk', 'coconut cream']
  },
  {
    id: 'royco-tomato-paste',
    name: 'Royco Tomato Base',
    category: 'sauce',
    displayName: 'Royco Tomato Base',
    description: 'Concentrated tomato flavor base',
    keywords: ['tomato paste', 'tomato sauce', 'tomato base'],
    usage: 'Add to stews and sauces for rich tomato flavor',
    benefits: ['Concentrated flavor', 'No preservatives', 'Natural color'],
    substitutes: ['tomato paste', 'tomato puree']
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
  'bbq seasoning': 'Royco BBQ Spice',
  'barbecue spice': 'Royco BBQ Spice',
  'grill seasoning': 'Royco BBQ Spice',
  'nyama choma spice': 'Royco BBQ Spice',
  'chicken seasoning': 'Royco Chicken Spice',
  'poultry seasoning': 'Royco Chicken Spice',
  'fish seasoning': 'Royco Fish Spice',
  'seafood spice': 'Royco Fish Spice',
  'vegetable seasoning': 'Royco Vegetable Seasoning',
  'all-purpose seasoning': 'Royco Vegetable Seasoning',
  
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
   - Replace "BBQ seasoning" with "Royco BBQ Spice"
   - Replace generic seasonings with specific Royco products

2. When mentioning Royco products:
   - Always use the full product name (e.g., "Royco Beef Cubes" not just "beef cubes")
   - Include usage instructions (e.g., "Dissolve 2 Royco Beef Cubes in 500ml hot water")
   - Mention benefits (e.g., "Royco Mchuzi Mix adds authentic Kenyan flavor")

3. Product placement should feel natural:
   - Integrate products logically into the recipe
   - Explain why the Royco product enhances the dish
   - Suggest Royco alternatives where appropriate

4. Available Royco Products to recommend:
   - Royco Beef Cubes (for beef dishes, stews, soups)
   - Royco Chicken Cubes (for poultry, rice dishes)
   - Royco Vegetable Cubes (for vegetarian dishes)
   - Royco Mchuzi Mix (for stews, curries)
   - Royco Pilau Masala (for pilau, biryani)
   - Royco BBQ Spice (for grilled meats)
   - Royco Chicken Spice (for chicken dishes)
   - Royco Fish Spice (for fish and seafood)
   - Royco Vegetable Seasoning (for vegetables)
   - Royco Coconut Milk Powder (for coastal dishes)
   - Royco Tomato Base (for stews and sauces)

5. In ingredient lists, format Royco products as:
   {"name": "Royco [Product Name]", "quantity": X, "unit": "cubes/tbsp", "note": "for authentic flavor"}

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
            note: ingredient.note || 'for authentic flavor',
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
