import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateEnhancedRecipe, analyzeIngredientImage, generateRoycoSuggestions } from './gemini';
import { generateRecipeFromIngredientsList, detectIngredients } from './ai';

interface DetectionResult {
  success: boolean;
  ingredients?: Array<{
    name: string;
    confidence: number;
  }>;
  error?: string;
}

interface RecipeGenerationResult {
  success: boolean;
  recipe?: any;
  error?: string;
}

/**
 * Enhanced recipe generation with Gemini and improved Royco integration
 */


export async function generateAIRecipe(
  ingredients: string[],
  preferences?: {
    cuisine?: string;
    dietaryRestrictions?: string[];
    servings?: number;
    difficulty?: 'easy' | 'medium' | 'hard';
  }
): Promise<RecipeGenerationResult> {
  let recipe: any;
  let source = 'gemini';
  
  // Try Gemini first if API key is available
  if (process.env.EXPO_PUBLIC_GEMINI_API_KEY) {
    try {
      console.log('Attempting to generate recipe with Gemini...');
      recipe = await generateEnhancedRecipe(ingredients, preferences);
    } catch (geminiError) {
      console.log('Gemini failed, falling back to OpenAI:', geminiError);
      source = 'openai';
    }
  } else {
    console.log('No Gemini API key, using OpenAI');
    source = 'openai';
  }
  
  // Fallback to OpenAI if Gemini failed or not available
  if (!recipe && process.env.EXPO_PUBLIC_OPENAI_API_KEY) {
    try {
      const openAIResult = await generateRecipeFromIngredientsList(ingredients);
      if (openAIResult.success && openAIResult.recipe) {
        recipe = openAIResult.recipe;
      }
    } catch (openAIError) {
      console.error('OpenAI also failed:', openAIError);
      throw new Error('Both AI services failed. Please try again later.');
    }
  }
  
  if (!recipe) {
    // If both fail, create a basic recipe
    console.log('Creating fallback recipe...');
    recipe = createFallbackRecipe(ingredients, preferences);
    source = 'fallback';
  }
  
  try {
    // Generate a photo prompt and request image if recipe is from OpenAI
    if (source === 'openai') {
      try {
        const photoPrompt = await generateRecipeImagePrompt({ 
          recipeName: recipe.name || recipe.title,
          ingredients: recipe.ingredients.map((ing: any) => ing.name || ing),
          cuisine: preferences?.cuisine || 'Kenyan',
          description: recipe.description
        });
        recipe.image = photoPrompt; // This will be used to generate the actual image
      } catch (error) {
        console.error('Error generating photo prompt:', error);
        // Fallback to default image if photo generation fails
        recipe.image = getDefaultRecipeImage(preferences?.cuisine || 'Kenyan');
      }
    }
    
    // Generate a unique ID
    const recipeId = `ai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Format the recipe for our app
    const formattedRecipe = {
      id: recipeId,
      title: recipe.name || recipe.title,
      description: recipe.description,
      image: recipe.image,
      cuisine: preferences?.cuisine || 'Kenyan',
      time: `${recipe.prepTime + recipe.cookTime} min`,
      servings: recipe.servings || 4,
      difficulty: recipe.difficulty || 'medium',
      calories: recipe.nutrition?.calories || 450,
      
      // Ingredients with Royco products highlighted
      ingredients: recipe.ingredients.map((ing: any) => ({
        name: ing.name || ing,
        quantity: ing.quantity || ing.amount,
        unit: ing.unit,
        isRoycoProduct: ing.name?.toLowerCase().includes('royco'),
      })),
      
      // Steps with Royco integration points
      steps: recipe.steps || recipe.instructions,
      
      // Nutrition information
      nutrition: recipe.nutrition || {
        calories: 450,
        protein: 25,
        carbs: 45,
        fat: 18,
        fiber: 8,
      },
      
      // Enhanced Royco products section
      roycoProducts: recipe.roycoProducts || {
        products: [
          {
            name: 'Royco Beef Cubes',
            usage: 'Dissolve 2 cubes in the cooking liquid for rich flavor',
            benefit: 'Adds authentic Kenyan beef flavor and aroma',
            amount: '2 cubes',
          },
          {
            name: 'Royco Mchuzi Mix',
            usage: 'Sprinkle 1 tablespoon while sautéing onions',
            benefit: 'Creates the perfect thick, flavorful gravy',
            amount: '1 tablespoon',
          },
        ],
        preparationTips: [
          'Dissolve Royco cubes in warm water before adding to prevent lumps',
          'Add Royco Mchuzi Mix gradually for better flavor distribution',
          'Taste before adding salt as Royco products contain seasoning',
        ],
        flavorProfile: 'Rich, savory, and authentically Kenyan',
        servingSuggestion: 'Serve hot with ugali or chapati for an authentic experience',
      },
      
      // Chef tips
      chefTips: recipe.chefTips || [
        'Use Royco products at the right stage for maximum flavor',
        'Don\'t overcook after adding Royco to preserve the aromatic compounds',
        'Adjust Royco quantities based on your taste preference',
      ],
      
      // Cultural context
      culturalContext: recipe.culturalContext || 
        'This recipe combines traditional Kenyan cooking with modern convenience using Royco products.',
      
      // Metadata
      generatedAt: new Date().toISOString(),
      isAIGenerated: true,
      source,
      createdBy: 'ai',
      
      // Tags for searching
      tags: [
        'AI Generated',
        'Royco Enhanced',
        preferences?.cuisine || 'Kenyan',
        recipe.difficulty || 'medium',
        ...ingredients.slice(0, 3),
      ],
    };
    
    // Save to AI recipes collection
    await saveAIRecipe(formattedRecipe);
    
    return {
      success: true,
      recipe: formattedRecipe,
    };
  } catch (error) {
    console.error('Recipe generation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate recipe',
    };
  }
}

/**
 * Detect ingredients from image using Gemini Vision
 */
export async function detectIngredientsFromImage(imageBase64: string): Promise<DetectionResult> {
  let ingredients: string[] = [];
  
  // Try Gemini first if API key is available
  if (process.env.EXPO_PUBLIC_GEMINI_API_KEY) {
    try {
      console.log('Attempting ingredient detection with Gemini...');
      ingredients = await analyzeIngredientImage(imageBase64);
    } catch (geminiError) {
      console.log('Gemini Vision failed, falling back to OpenAI:', geminiError);
    }
  }
  
  // Fallback to OpenAI if Gemini failed
  if (ingredients.length === 0 && process.env.EXPO_PUBLIC_OPENAI_API_KEY) {
    try {
      const openAIResult = await detectIngredients(imageBase64);
      if (openAIResult.success && openAIResult.ingredients) {
        ingredients = openAIResult.ingredients.map(i => i.name);
      }
    } catch (openAIError) {
      console.error('OpenAI Vision also failed:', openAIError);
    }
  }
  
  try {
    
    if (ingredients.length > 0) {
      return {
        success: true,
        ingredients: ingredients.map(name => ({
          name,
          confidence: 0.9, // Gemini doesn't provide confidence scores, so we use a default
        })),
      };
    }
    
    return {
      success: false,
      error: 'No ingredients detected in the image',
    };
  } catch (error) {
    console.error('Ingredient detection error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to detect ingredients',
    };
  }
}

/**
 * Save AI-generated recipe to storage
 */
export async function saveAIRecipe(recipe: any): Promise<void> {
  try {
    // Get existing AI recipes
    const existingRecipes = await getAIRecipes();
    
    // Add new recipe at the beginning
    const updatedRecipes = [recipe, ...existingRecipes];
    
    // Limit to 100 recipes to prevent storage issues
    const limitedRecipes = updatedRecipes.slice(0, 100);
    
    // Save to storage
    await AsyncStorage.setItem('ai_generated_recipes', JSON.stringify(limitedRecipes));
  } catch (error) {
    console.error('Error saving AI recipe:', error);
  }
}

/**
 * Get all AI-generated recipes
 */
export async function getAIRecipes(): Promise<any[]> {
  try {
    const storedRecipes = await AsyncStorage.getItem('ai_generated_recipes');
    return storedRecipes ? JSON.parse(storedRecipes) : [];
  } catch (error) {
    console.error('Error loading AI recipes:', error);
    return [];
  }
}

/**
 * Get AI recipe by ID
 */
export async function getAIRecipeById(id: string): Promise<any | null> {
  try {
    const recipes = await getAIRecipes();
    return recipes.find(r => r.id === id) || null;
  } catch (error) {
    console.error('Error loading AI recipe:', error);
    return null;
  }
}

/**
 * Generate multiple recipe variations
 */
export async function generateRecipeVariations(
  baseIngredients: string[],
  count: number = 3
): Promise<RecipeGenerationResult[]> {
  const cuisines = ['Kenyan', 'Swahili', 'Ethiopian', 'Indian'];
  const difficulties = ['easy', 'medium', 'hard'];
  
  const variations = await Promise.all(
    Array.from({ length: count }, async (_, i) => {
      return generateAIRecipe(baseIngredients, {
        cuisine: cuisines[i % cuisines.length],
        difficulty: difficulties[i % difficulties.length] as 'easy' | 'medium' | 'hard',
      });
    })
  );
  
  return variations;
}

/**
 * Generate shopping list from recipe
 */
export function generateShoppingList(recipe: any): string[] {
  const shoppingList: string[] = [];
  
  // Add regular ingredients
  recipe.ingredients?.forEach((ing: any) => {
    if (!ing.isRoycoProduct) {
      shoppingList.push(`${ing.quantity} ${ing.unit} ${ing.name}`);
    }
  });
  
  // Add Royco products
  recipe.roycoProducts?.products?.forEach((product: any) => {
    shoppingList.push(`${product.amount} ${product.name}`);
  });
  
  return shoppingList;
}

/**
 * Calculate recipe cost estimate (in KES)
 */
export function estimateRecipeCost(recipe: any): number {
  // Basic cost estimation (would need real pricing data in production)
  const baseCostPerServing = 150; // KES
  const roycoProductCost = 50; // KES per product
  
  const servings = recipe.servings || 4;
  const roycoCount = recipe.roycoProducts?.products?.length || 0;
  
  return (baseCostPerServing * servings) + (roycoProductCost * roycoCount);
}

// Helper function to create a fallback recipe
function createFallbackRecipe(ingredients: string[], preferences?: any) {
  const cuisineRecipes = {
    'Kenyan': {
      name: `Kenyan Stew with ${ingredients[0] || 'Vegetables'}`,
      description: 'A hearty Kenyan-style stew enhanced with Royco products',
      prepTime: 20,
      cookTime: 40,
      steps: [
        'Heat oil in a large pot',
        'Sauté onions until golden brown',
        'Add Royco Beef Cubes dissolved in water',
        `Add ${ingredients.join(', ')}`,
        'Add Royco Mchuzi Mix for thickness',
        'Simmer for 30 minutes',
        'Serve hot with ugali or rice'
      ]
    },
    'default': {
      name: `Recipe with ${ingredients.slice(0, 2).join(' and ')}`,
      description: 'A delicious recipe created with your ingredients',
      prepTime: 15,
      cookTime: 30,
      steps: [
        'Prepare all ingredients',
        'Cook according to preference',
        'Season with Royco products',
        'Serve hot'
      ]
    }
  };
  
  const template = cuisineRecipes[preferences?.cuisine as string] || cuisineRecipes.default;
  
  return {
    ...template,
    servings: preferences?.servings || 4,
    ingredients: ingredients.map(ing => ({
      name: ing,
      quantity: '1',
      unit: 'cup'
    })),
    nutrition: {
      calories: 350,
      protein: 20,
      carbs: 40,
      fat: 15,
      fiber: 5
    }
  };
}

export default {
  generateAIRecipe,
  detectIngredientsFromImage,
  saveAIRecipe,
  getAIRecipes,
  getAIRecipeById,
  generateRecipeVariations,
  generateShoppingList,
  estimateRecipeCost,
};