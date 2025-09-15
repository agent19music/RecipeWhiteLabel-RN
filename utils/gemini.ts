import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY || '');

// Gemini models - using correct model names
const textModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
const visionModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

interface RecipeImagePrompt {
  recipeName: string;
  ingredients: string[];
  cuisine: string;
  description?: string;
}

interface RoycoProduct {
  name: string;
  usage: string;
  benefit: string;
  amount: string;
}

interface EnhancedRoycoSuggestion {
  products: RoycoProduct[];
  preparationTips: string[];
  flavorProfile: string;
  servingSuggestion: string;
}

/**
 * Generate a highly detailed, professional food photography prompt using Gemini.
 * This creates prompts optimized for photo-realistic image generation.
 */
export async function generateRecipeImagePrompt(recipe: RecipeImagePrompt): Promise<string> {
  try {
    const prompt = `
      Create a hyper-realistic, professional food photography prompt for ${recipe.recipeName}.
      
      Focus on:
      1. Primary ingredients: ${recipe.ingredients.slice(0, 5).join(', ')}
      2. Cuisine style: ${recipe.cuisine} cuisine
      ${recipe.description ? `3. Context: ${recipe.description}` : ''}
      
      Describe in detail:
      1. Plating & Presentation:
         - Specific plate/bowl type and color
         - Food arrangement and layering
         - Textures and visual elements
      
      2. Photography Elements:
         - Camera angle (specify exact degrees and distance)
         - Lighting setup (direction, intensity, quality)
         - Depth of field and focus points
      
      3. Styling:
         - Garnishes and finishing touches
         - Complementary props and tableware
         - Background texture and color
      
      4. Atmosphere:
         - Steam or temperature indicators
         - Action elements (e.g., drizzling sauce)
         - Mood and time of day
      
      Requirements:
      - Must look appetizing and mouth-watering
      - Professional food photography aesthetics
      - High-resolution, sharp details
      - Natural, believable food styling
      - Proper cultural authenticity for ${recipe.cuisine} cuisine
      
      Format as a cohesive, detailed prompt optimized for photorealistic image generation.
    `;

    const result = await textModel.generateContent(prompt);
    const response = await result.response;
    const imagePrompt = response.text();
    
    // For now, we'll use a placeholder service or return the prompt
    // In production, you'd integrate with an actual image generation API
    return generatePlaceholderImage(recipe.recipeName, imagePrompt);
  } catch (error) {
    console.error('Error generating image prompt:', error);
    return getDefaultRecipeImage(recipe.cuisine);
  }
}

/**
 * Generate enhanced Royco product suggestions with detailed usage instructions
 */
export async function generateRoycoSuggestions(
  recipeName: string,
  ingredients: string[],
  cuisine: string
): Promise<EnhancedRoycoSuggestion> {
  try {
    const prompt = `
      You are a Kenyan chef expert in using Royco products. For the recipe "${recipeName}" 
      with ingredients [${ingredients.join(', ')}] in ${cuisine} cuisine:
      
      Recommend specific Royco products that would enhance this dish. For each product provide:
      1. Exact Royco product name (e.g., "Royco Beef Cubes", "Royco Mchuzi Mix")
      2. Precise usage instructions with timing and quantity
      3. Specific flavor benefit it adds
      4. Amount needed for 4 servings
      
      Also provide:
      - Step-by-step preparation tips using Royco products
      - How Royco enhances the authentic flavor profile
      - Best serving suggestions with Royco garnish
      
      Focus on authentic Kenyan cooking methods and real Royco products available in Kenya.
      Format as JSON with products array, preparationTips array, flavorProfile string, and servingSuggestion string.
    `;

    const result = await textModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the JSON response
    try {
      // Try to extract JSON from the response
      let parsed;
      try {
        // First try direct parsing
        parsed = JSON.parse(text);
      } catch {
        // If that fails, try to extract JSON from markdown code blocks
        const jsonMatch = text.match(/```json\s*([\s\S]*?)```/) || text.match(/```\s*([\s\S]*?)```/);
        if (jsonMatch) {
          parsed = JSON.parse(jsonMatch[1]);
        } else {
          // Try to find JSON-like content
          const jsonStart = text.indexOf('{');
          const jsonEnd = text.lastIndexOf('}');
          if (jsonStart !== -1 && jsonEnd !== -1) {
            parsed = JSON.parse(text.substring(jsonStart, jsonEnd + 1));
          } else {
            throw new Error('Could not extract JSON from response');
          }
        }
      }
      return parsed as EnhancedRoycoSuggestion;
    } catch {
      // Fallback to default suggestions if parsing fails
      return getDefaultRoycoSuggestions(cuisine);
    }
  } catch (error) {
    console.error('Error generating Royco suggestions:', error);
    return getDefaultRoycoSuggestions(cuisine);
  }
}

/**
 * Analyze an image to detect ingredients (for camera feature)
 */
export async function analyzeIngredientImage(base64Image: string): Promise<string[]> {
  try {
    const prompt = 'Identify all the food ingredients visible in this image. List them as a simple comma-separated list.';
    
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: 'image/jpeg',
      },
    };

    const result = await visionModel.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();
    
    // Parse the ingredients from the response
    const ingredients = text.split(',').map(item => item.trim()).filter(Boolean);
    return ingredients;
  } catch (error) {
    console.error('Error analyzing image:', error);
    return [];
  }
}

/**
 * Generate a complete recipe with Royco integration
 */
export async function generateEnhancedRecipe(
  ingredients: string[],
  preferences?: {
    cuisine?: string;
    dietaryRestrictions?: string[];
    servings?: number;
    difficulty?: 'easy' | 'medium' | 'hard';
  }
): Promise<any> {
  try {
    const prompt = `
      Create an authentic Kenyan recipe using these ingredients: ${ingredients.join(', ')}.
      ${preferences?.cuisine ? `Cuisine preference: ${preferences.cuisine}` : 'Focus on Kenyan/East African cuisine'}
      ${preferences?.dietaryRestrictions ? `Dietary restrictions: ${preferences.dietaryRestrictions.join(', ')}` : ''}
      Servings: ${preferences?.servings || 4}
      Difficulty: ${preferences?.difficulty || 'medium'}
      
      IMPORTANT: Integrate Royco products naturally into the recipe.
      
      Provide a complete recipe with:
      1. Recipe name (Swahili and English)
      2. Description (emphasizing Royco's flavor enhancement)
      3. Prep time and cook time
      4. Detailed ingredients list with measurements
      5. Step-by-step instructions incorporating Royco products
      6. Nutritional information per serving
      7. Chef tips for using Royco products
      8. Cultural context and serving suggestions
      
      Format as JSON with all fields clearly structured.
    `;

    const result = await textModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      // Try to extract JSON from the response
      let recipe;
      try {
        // First try direct parsing
        recipe = JSON.parse(text);
      } catch {
        // If that fails, try to extract JSON from markdown code blocks
        const jsonMatch = text.match(/```json\s*([\s\S]*?)```/) || text.match(/```\s*([\s\S]*?)```/);
        if (jsonMatch) {
          recipe = JSON.parse(jsonMatch[1]);
        } else {
          // Try to find JSON-like content
          const jsonStart = text.indexOf('{');
          const jsonEnd = text.lastIndexOf('}');
          if (jsonStart !== -1 && jsonEnd !== -1) {
            recipe = JSON.parse(text.substring(jsonStart, jsonEnd + 1));
          } else {
            // If all parsing fails, create a basic recipe structure
            recipe = {
              name: `AI Recipe with ${ingredients.slice(0, 3).join(', ')}`,
              title: `AI Recipe with ${ingredients.slice(0, 3).join(', ')}`,
              description: 'A delicious recipe created by AI',
              prepTime: 15,
              cookTime: 30,
              servings: preferences?.servings || 4,
              ingredients: ingredients.map(ing => ({ name: ing, quantity: '1', unit: 'piece' })),
              steps: [
                'Prepare all ingredients',
                'Cook according to standard method',
                'Season with Royco products to taste',
                'Serve hot'
              ],
              nutrition: {
                calories: 450,
                protein: 25,
                carbs: 45,
                fat: 18
              }
            };
          }
        }
      }
      
      // Add Royco suggestions
      const roycoSuggestions = await generateRoycoSuggestions(
        recipe.name,
        ingredients,
        preferences?.cuisine || 'Kenyan'
      );
      
      // Generate image prompt
      const imageUrl = await generateRecipeImagePrompt({
        recipeName: recipe.name,
        ingredients,
        cuisine: preferences?.cuisine || 'Kenyan',
        description: recipe.description,
      });
      
      return {
        ...recipe,
        roycoProducts: roycoSuggestions,
        image: imageUrl,
        generatedAt: new Date().toISOString(),
        isAIGenerated: true,
      };
    } catch (err) {
      console.warn('Gemini parse/enhancement failed, using safe fallback recipe:', err);
      const fallbackRecipe = {
        name: `AI Recipe with ${ingredients.slice(0, 3).join(', ')}`,
        title: `AI Recipe with ${ingredients.slice(0, 3).join(', ')}`,
        description: 'A delicious recipe created by AI',
        prepTime: 15,
        cookTime: 30,
        servings: preferences?.servings || 4,
        ingredients: ingredients.map(ing => ({ name: ing, quantity: '1', unit: 'piece' })),
        steps: [
          'Prepare all ingredients',
          'Cook according to standard method',
          'Season with Royco products to taste',
          'Serve hot'
        ],
        nutrition: {
          calories: 450,
          protein: 25,
          carbs: 45,
          fat: 18
        }
      };

      const roycoSuggestions = await generateRoycoSuggestions(
        fallbackRecipe.name,
        ingredients,
        preferences?.cuisine || 'Kenyan'
      );

      const imageUrl = await generateRecipeImagePrompt({
        recipeName: fallbackRecipe.name,
        ingredients,
        cuisine: preferences?.cuisine || 'Kenyan',
        description: fallbackRecipe.description,
      });

      return {
        ...fallbackRecipe,
        roycoProducts: roycoSuggestions,
        image: imageUrl,
        generatedAt: new Date().toISOString(),
        isAIGenerated: true,
      };
    }
  } catch (error) {
    console.error('Error generating enhanced recipe:', error);
    throw error;
  }
}

// Helper functions
async function generatePlaceholderImage(recipeName: string, prompt: string): Promise<string> {
  // In a real implementation, you would call Gemini to generate the image
  // For now, use a food-related placeholder that matches the recipe theme
  const encodedName = encodeURIComponent(recipeName?.toLowerCase());
  const keywords = prompt
    .toLowerCase()
    .split(/[\s,]+/)
    .filter(word => [
      'plate', 'bowl', 'dish', 'food', 'meal', 'cuisine', 'fresh',
      'hot', 'traditional', 'homemade', 'gourmet', 'delicious'
    ].includes(word))
    .slice(0, 3)
    .join(',');
  
  return `https://source.unsplash.com/1200x800/?food,${encodedName},${keywords}`;
}

function getDefaultRecipeImage(cuisine: string): string {
  const cuisineImages: Record<string, string> = {
    'Kenyan': 'https://source.unsplash.com/800x600/?ugali,kenyan,food',
    'Swahili': 'https://source.unsplash.com/800x600/?pilau,swahili,food',
    'Ethiopian': 'https://source.unsplash.com/800x600/?injera,ethiopian,food',
    'Indian': 'https://source.unsplash.com/800x600/?curry,indian,food',
    'default': 'https://source.unsplash.com/800x600/?food,cooking',
  };
  
  return cuisineImages[cuisine] || cuisineImages.default;
}

// Helper function to extract key visual elements from recipe description
function extractVisualElements(description: string): string[] {
  const visualCues = [
    'steaming', 'sizzling', 'golden', 'brown', 'crispy', 'tender',
    'juicy', 'colorful', 'fresh', 'garnished', 'plated', 'served'
  ];
  
  return description
    .toLowerCase()
    .split(/[\s,.]+/)
    .filter(word => visualCues.some(cue => word.includes(cue)));
}

// Helper function to determine optimal camera angle based on dish type
function suggestCameraAngle(recipeName: string, ingredients: string[]): string {
  const flatDishes = ['rice', 'curry', 'stew', 'soup', 'sauce'];
  const layeredDishes = ['sandwich', 'burger', 'cake', 'lasagna'];
  const smallDishes = ['appetizer', 'snack', 'cookie', 'pastry'];
  
  const dishType = [
    ...recipeName.toLowerCase().split(' '),
    ...ingredients.map(i => i.toLowerCase())
  ];
  
  if (dishType.some(word => flatDishes.includes(word))) {
    return '45-degree angle to show depth and texture';
  } else if (dishType.some(word => layeredDishes.includes(word))) {
    return 'straight-on angle to highlight layers';
  } else if (dishType.some(word => smallDishes.includes(word))) {
    return 'close-up shot with shallow depth of field';
  }
  
  return 'overhead shot for complete presentation';
}

// Helper function to suggest props based on cuisine
function suggestProps(cuisine: string): string[] {
  const propSuggestions: Record<string, string[]> = {
    'Kenyan': [
      'traditional clay pot',
      'wooden spoon',
      'sisal placemat',
      'calabash',
      'authentic Kenyan fabric'
    ],
    'Swahili': [
      'brass tray',
      'ornate spice containers',
      'traditional coffee pot',
      'coastal-inspired tablecloth'
    ],
    'Ethiopian': [
      'mesob basket',
      'traditional coffee pot',
      'handwoven table runner',
      'clay dishes'
    ],
    'Indian': [
      'brass thali',
      'copper vessels',
      'colorful silk fabric',
      'traditional spice box'
    ],
    'default': [
      'white ceramic plate',
      'linen napkin',
      'wooden cutting board',
      'fresh herbs'
    ]
  };
  
  return propSuggestions[cuisine] || propSuggestions.default;
}

function getDefaultRoycoSuggestions(cuisine: string): EnhancedRoycoSuggestion {
  return {
    products: [
      {
        name: 'Royco Beef Cubes',
        usage: 'Dissolve 2 cubes in 500ml warm water to create a rich beef stock',
        benefit: 'Adds deep umami flavor and enhances the natural meat taste',
        amount: '2 cubes',
      },
      {
        name: 'Royco Mchuzi Mix',
        usage: 'Add 2 tablespoons during the sautéing stage for rich color and flavor',
        benefit: 'Creates authentic Kenyan stew consistency and taste',
        amount: '2 tablespoons',
      },
    ],
    preparationTips: [
      'Always dissolve Royco cubes in warm water before adding to the dish',
      'Add Royco Mchuzi Mix after browning the onions for best flavor release',
      'Taste before adding salt as Royco products contain seasoning',
    ],
    flavorProfile: 'Rich, savory, and authentically Kenyan with balanced spices',
    servingSuggestion: 'Garnish with fresh dhania (coriander) and serve with ugali or chapati',
  };
}

export default {
  generateRecipeImagePrompt,
  generateRoycoSuggestions,
  analyzeIngredientImage,
  generateEnhancedRecipe,
};