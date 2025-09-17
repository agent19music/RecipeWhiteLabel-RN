import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  ensureRoycoProducts,
  generateRoycoEnhancedPrompt,
  suggestRoycoProducts,
  type RoycoProduct
} from './royco-products';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY || '');

// Gemini models - using correct model names
const textModel = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
const visionModel = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

interface RecipeImagePrompt {
  recipeName: string;
  ingredients: string[];
  cuisine: string;
  description?: string;
}

interface LegacyRoycoSuggestion {
  name: string;
  usage: string;
  benefit: string;
  amount: string;
}

interface EnhancedRoycoSuggestion {
  products: LegacyRoycoSuggestion[];
  preparationTips: string[];
  flavorProfile: string;
  servingSuggestion: string;
}

/**
 * Generate actual recipe image using Gemini's image generation capabilities
 */
export async function generateRecipeImage(recipe: RecipeImagePrompt): Promise<string> {
  try {
    // First generate a detailed prompt using Gemini
    const imagePrompt = await generateDetailedImagePrompt(recipe);
    
    // Note: Direct Gemini image generation would go here when available
    // For now, we use the smart image URL generation with the detailed prompt
    return await generateSmartImageUrl(recipe, imagePrompt);
    
  } catch (error) {
    console.error('Error generating Gemini image:', error);
    // Fallback to smart URL generation
    return generateSmartImageUrl(recipe, `professional ${recipe.recipeName} food photography`);
  }
}

/**
 * Generate a detailed image prompt using Gemini
 */
async function generateDetailedImagePrompt(recipe: RecipeImagePrompt): Promise<string> {
  try {
    const prompt = `
      Create a hyper-detailed, professional food photography description for "${recipe.recipeName}".
      
      Ingredients: ${recipe.ingredients.join(', ')}
      Cuisine: ${recipe.cuisine}
      ${recipe.description ? `Description: ${recipe.description}` : ''}
      
      Provide a detailed description covering:
      1. Exact plating and presentation style
      2. Color palette and visual textures
      3. Lighting setup and photography angle
      4. Background and styling elements
      5. Garnishes and finishing touches
      
      Make it sound appetizing and visually appealing for ${recipe.cuisine} cuisine.
      Keep it concise but detailed (2-3 sentences max).
    `;

    const result = await textModel.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Error generating detailed prompt:', error);
    return `Professional ${recipe.cuisine} ${recipe.recipeName} food photography`;
  }
}

/**
 * Generate smart image URL using multiple image services with fallbacks
 */
async function generateSmartImageUrl(recipe: RecipeImagePrompt, detailedPrompt: string): Promise<string> {
  // Create search terms from recipe data
  const searchTerms = [
    recipe.recipeName.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-'),
    recipe.cuisine.toLowerCase(),
    'food'
  ];
  
  // Add primary ingredients
  if (recipe.ingredients.length > 0) {
    const mainIngredient = recipe.ingredients[0].toLowerCase().replace(/[^a-z0-9\s]/g, '');
    if (mainIngredient) {
      searchTerms.unshift(mainIngredient);
    }
  }
  
  const query = searchTerms.filter(Boolean).join(',');
  
  // Use Unsplash Source API which is more reliable
  // This will return a random food image matching our query
  const imageUrl = `https://source.unsplash.com/800x600/?${encodeURIComponent(query)}`;
  
  console.log(`Generated image URL for "${recipe.recipeName}": ${imageUrl}`);
  
  return imageUrl;
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
 * Now uses the comprehensive royco-products.ts catalog
 */
export async function generateRoycoSuggestions(
  recipeName: string,
  ingredients: string[],
  cuisine: string
): Promise<EnhancedRoycoSuggestion> {
  try {
    // First get AI-powered product suggestions from our catalog
    const suggestedProducts = suggestRoycoProducts(ingredients);
    const availableProducts = suggestedProducts.map(p => `${p.displayName} - ${p.description}`).join('\n');
    
    const prompt = `
      You are a Kenyan chef expert in using Royco products. For the recipe "${recipeName}" 
      with ingredients [${ingredients.join(', ')}] in ${cuisine} cuisine:
      
      AVAILABLE ROYCO PRODUCTS:
      ${availableProducts}
      
      Based on the available products above, recommend the most suitable ones for this recipe. For each recommended product provide:
      1. Exact Royco product name from the list above
      2. Precise usage instructions with timing and quantity
      3. Specific flavor benefit it adds
      4. Amount needed for 4 servings
      
      Also provide:
      - Step-by-step preparation tips using Royco products
      - How Royco enhances the authentic flavor profile
      - Best serving suggestions with Royco garnish
      
      Focus on authentic Kenyan cooking methods and the specific Royco products listed above.
      Format as JSON with products array, preparationTips array, flavorProfile string, and servingSuggestion string.
    `;

    const result = await textModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the JSON response (same robust parsing as before)
    try {
      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch {
        const jsonMatch = text.match(/```json\s*([\s\S]*?)```/) || text.match(/```\s*([\s\S]*?)```/);
        if (jsonMatch) {
          parsed = JSON.parse(jsonMatch[1]);
        } else {
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
      // Fallback to default suggestions based on our product catalog
      return getDefaultRoycoSuggestionsFromCatalog(cuisine, suggestedProducts);
    }
  } catch (error) {
    console.error('Error generating Royco suggestions:', error);
    // Fallback using our product catalog
    const suggestedProducts = suggestRoycoProducts(ingredients);
    return getDefaultRoycoSuggestionsFromCatalog(cuisine, suggestedProducts);
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
 * Inspired by the structured approach from ai.ts
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
  const startTime = Date.now();

  try {
    // Generate enhanced system prompt using royco-products integration
    const baseSystemPrompt = `You are a professional chef and recipe creator specializing in East African cuisine. Generate detailed, practical recipes based on provided ingredients.
    Your recipes should be:
    - Clear and easy to follow with precise measurements
    - Culturally appropriate (emphasize East African/Kenyan cuisine)
    - Nutritionally balanced
    - Time-efficient
    - Include specific Royco product recommendations
    
    Respond with a JSON object that matches this structure:
    {
      "id": "unique-id",
      "title": "Recipe Name",
      "summary": "Brief description mentioning key Royco products used",
      "description": "Detailed description highlighting how Royco products enhance the dish",
      "ingredients": [{"name": "...", "quantity": ..., "unit": "...", "note": "...", "group": "..."}],
      "steps": [{
        "title": "...",
        "body": "Detailed instructions mentioning Royco products by full name",
        "time": ...,
        "tips": ["Pro tips mentioning Royco product benefits"],
        "temperature": {"value": ..., "unit": "C"}
      }],
      "details": {
        "servings": ...,
        "prepTime": ...,
        "cookTime": ...,
        "totalTime": ...,
        "difficulty": "easy|medium|hard",
        "cuisine": "Kenyan/East African",
        "dietTags": [...],
        "equipment": [...],
        "cost": "budget|moderate|premium"
      },
      "nutrition": {
        "calories": ...,
        "protein": ...,
        "carbs": ...,
        "fat": ...,
        "fiber": ...,
        "sodium": ...
      },
      "tips": ["Tips highlighting Royco product advantages"],
      "variations": ["Variations using different Royco products"],
      "tags": [...]
    }`;

    // Generate Royco-enhanced system prompt
    const systemPrompt = generateRoycoEnhancedPrompt(baseSystemPrompt);

    // Suggest Royco products based on ingredients
    const roycoSuggestions = suggestRoycoProducts(ingredients);
    const roycoProductList = roycoSuggestions.map(p => p.displayName).join(', ');
    
    const userPrompt = `Create an authentic East African recipe using these ingredients: ${ingredients.join(', ')}.
    
    MANDATORY: You MUST incorporate these Royco products where appropriate: ${roycoProductList || 'Royco Beef Cubes, Royco Mchuzi Mix, Royco Pilau Masala'}
    
    ${preferences?.cuisine ? `Cuisine preference: ${preferences.cuisine}` : 'Focus on Kenyan/East African cuisine'}
    ${preferences?.dietaryRestrictions ? `Dietary restrictions: ${preferences.dietaryRestrictions.join(', ')}` : ''}
    Servings: ${preferences?.servings || 4}
    Difficulty: ${preferences?.difficulty || 'medium'}
    
    Remember to:
    1. Use full Royco product names (e.g., "Royco Beef Cubes" not "beef cubes")
    2. Explain how each Royco product enhances the dish
    3. Include Royco products in ingredient list with proper formatting
    4. Mention Royco products naturally in cooking steps`;

    const combinedPrompt = `${systemPrompt}\n\nUser Request:\n${userPrompt}`;
    const result = await textModel.generateContent(combinedPrompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      // Try to extract JSON from the response (same robust parsing as ai.ts)
      let recipeData;
      try {
        // First try direct parsing
        recipeData = JSON.parse(text);
      } catch {
        // If that fails, try to extract JSON from markdown code blocks
        const jsonMatch = text.match(/```json\s*([\s\S]*?)```/) || text.match(/```\s*([\s\S]*?)```/);
        if (jsonMatch) {
          recipeData = JSON.parse(jsonMatch[1]);
        } else {
          // Try to find JSON-like content
          const jsonStart = text.indexOf('{');
          const jsonEnd = text.lastIndexOf('}');
          if (jsonStart !== -1 && jsonEnd !== -1) {
            recipeData = JSON.parse(text.substring(jsonStart, jsonEnd + 1));
          } else {
            // If all parsing fails, create a basic recipe structure
            recipeData = createFallbackRecipe(ingredients, preferences);
          }
        }
      }
      
      // Ensure Royco products are properly integrated using royco-products.ts
      recipeData = ensureRoycoProducts(recipeData);
      
      // Create Recipe object with proper structure (without image initially)
      const recipe = {
        id: `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: recipeData.title,
        summary: recipeData.summary,
        description: recipeData.description || recipeData.summary,
        ingredients: recipeData.ingredients,
        steps: recipeData.steps,
        details: {
          ...recipeData.details,
          cuisine: recipeData.details?.cuisine || 'Kenyan',
        },
        nutrition: recipeData.nutrition,
        tips: recipeData.tips || [],
        variations: recipeData.variations || [],
        tags: [...(recipeData.tags || []), 'royco-enhanced', 'ai-generated'],
        createdBy: 'ai',
        aiGenerated: true,
        roycoEnhanced: true,
        sponsoredProducts: recipeData.sponsoredProducts || [],
        aiModel: 'gemini-1.5-pro',
        createdAt: new Date().toISOString(),
        generatedAt: new Date().toISOString(),
        isAIGenerated: true,
        
        // Calculate display time
        time: `${(recipeData.details?.totalTime || recipeData.details?.cookTime || 30)} min`,
        difficulty: recipeData.details?.difficulty || 'medium',
        processingTime: Date.now() - startTime,
      };

      return recipe;
    } catch (parseError) {
      console.warn('Gemini parse/enhancement failed, using safe fallback recipe:', parseError);
      const fallbackRecipe = createFallbackRecipe(ingredients, preferences);
      
      // Ensure Royco products in fallback
      const enhancedFallback = ensureRoycoProducts(fallbackRecipe);

      return {
        ...enhancedFallback,
        id: `ai-fallback-${Date.now()}`,
        aiGenerated: true,
        roycoEnhanced: true,
        aiModel: 'gemini-1.5-pro',
        createdAt: new Date().toISOString(),
        generatedAt: new Date().toISOString(),
        isAIGenerated: true,
        processingTime: Date.now() - startTime,
      };
    }
  } catch (error) {
    console.error('Error generating enhanced recipe:', error);
    throw error;
  }
}

/**
 * Helper function to create fallback recipe structure
 */
function createFallbackRecipe(
  ingredients: string[], 
  preferences?: {
    cuisine?: string;
    dietaryRestrictions?: string[];
    servings?: number;
    difficulty?: 'easy' | 'medium' | 'hard';
  }
) {
  return {
    title: `AI Recipe with ${ingredients.slice(0, 3).join(', ')}`,
    summary: 'A delicious recipe enhanced with Royco products',
    description: 'A delicious recipe created by AI with authentic Royco flavor enhancement',
    ingredients: ingredients.map(ing => ({ 
      name: ing, 
      quantity: '1', 
      unit: 'piece',
      note: 'adjust to taste'
    })),
    steps: [
      {
        title: 'Preparation',
        body: 'Prepare all ingredients and dissolve Royco Beef Cubes in warm water for stock',
        time: 10,
        tips: ['Use Royco products for authentic flavor'],
        temperature: { value: 25, unit: 'C' }
      },
      {
        title: 'Cooking',
        body: 'Cook according to standard method, adding Royco Mchuzi Mix for rich flavor',
        time: 20,
        tips: ['Add Royco spices gradually to taste'],
        temperature: { value: 180, unit: 'C' }
      },
      {
        title: 'Final touches',
        body: 'Season with Royco products to taste and serve hot',
        time: 5,
        tips: ['Garnish with fresh herbs'],
        temperature: { value: 60, unit: 'C' }
      }
    ],
    details: {
      servings: preferences?.servings || 4,
      prepTime: 15,
      cookTime: 30,
      totalTime: 45,
      difficulty: preferences?.difficulty || 'medium',
      cuisine: 'Kenyan',
      dietTags: preferences?.dietaryRestrictions || [],
      equipment: ['Cooking pot', 'Wooden spoon'],
      cost: 'budget'
    },
    nutrition: {
      calories: 450,
      protein: 25,
      carbs: 45,
      fat: 18,
      fiber: 8,
      sodium: 800
    },
    tips: ['Use Royco products for authentic Kenyan flavor'],
    variations: ['Try different Royco spice combinations'],
    tags: ['kenyan', 'easy', 'budget-friendly']
  };
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

function getDefaultRoycoSuggestionsFromCatalog(cuisine: string, suggestedProducts: RoycoProduct[]): EnhancedRoycoSuggestion {
  // Use products from our catalog if available, otherwise fallback to default
  const products = suggestedProducts.length > 0 ? suggestedProducts.slice(0, 3) : [
    {
      id: 'royco-beef-cubes',
      name: 'Royco Beef Cubes',
      category: 'cube' as const,
      displayName: 'Royco Beef Cubes',
      description: 'Rich beef flavor cubes for enhanced taste',
      keywords: ['beef stock', 'beef broth'],
      usage: 'Dissolve 1-2 cubes in cooking liquid',
      benefits: ['Rich umami flavor', 'Instant beef taste'],
    },
    {
      id: 'royco-mchuzi-mix',
      name: 'Royco Mchuzi Mix',
      category: 'spice' as const,
      displayName: 'Royco Mchuzi Mix',
      description: 'Traditional East African stew spice blend',
      keywords: ['stew spice', 'curry powder'],
      usage: 'Add 1-2 tablespoons to stews',
      benefits: ['Authentic Kenyan flavor', 'Pre-mixed convenience'],
    },
  ];

  return {
    products: products.map(p => ({
      name: p.displayName,
      usage: p.usage,
      benefit: Array.isArray(p.benefits) ? p.benefits[0] : p.benefits || 'Enhances authentic flavor',
      amount: '2 tbsp',
    })),
    preparationTips: [
      'Always dissolve Royco cubes in warm water before adding to the dish',
      'Add Royco spices after browning onions for best flavor release',
      'Taste before adding salt as Royco products contain seasoning',
    ],
    flavorProfile: 'Rich, savory, and authentically Kenyan with balanced spices',
    servingSuggestion: 'Garnish with fresh dhania (coriander) and serve with ugali or chapati',
  };
}

/**
 * Generate and attach images to a saved recipe
 * This function should be called after the recipe has been saved
 */
export async function generateAndAttachRecipeImages(
  recipe: any,
  options: {
    generateMultiple?: boolean;
    imageCount?: number;
    forceRegenerate?: boolean;
  } = {}
): Promise<{ image: string; heroImage: string; images?: string[] }> {
  const startTime = Date.now();
  
  try {
    console.log(`🖼️ Generating images for recipe: ${recipe.title}`);
    
    // Skip if images already exist and not forcing regeneration
    if (recipe.image && !options.forceRegenerate) {
      console.log('⏭️ Images already exist, skipping generation');
      return {
        image: recipe.image,
        heroImage: recipe.heroImage || recipe.image,
        images: recipe.images
      };
    }

    const imageCount = options.imageCount || (options.generateMultiple ? 3 : 1);
    const images: string[] = [];

    // Extract ingredients for image generation
    const ingredients = recipe.ingredients?.map((ing: any) => 
      typeof ing === 'string' ? ing : ing.name
    ) || [];

    // Generate multiple images if requested
    for (let i = 0; i < imageCount; i++) {
      try {
        console.log(`🎨 Generating image ${i + 1}/${imageCount}...`);
        
        const imageUrl = await generateRecipeImagePrompt({
          recipeName: recipe.title,
          ingredients,
          cuisine: recipe.details?.cuisine || 'Kenyan',
          description: recipe.description,
        });
        
        images.push(imageUrl);
        console.log(`✅ Generated image ${i + 1}: ${imageUrl.substring(0, 50)}...`);
        
        // Add small delay between requests to be respectful to image services
        if (i < imageCount - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } catch (imageError) {
        console.warn(`⚠️ Failed to generate image ${i + 1}:`, imageError);
        // Add a fallback image if generation fails
        const fallbackUrl = getDefaultRecipeImage(recipe.details?.cuisine || 'Kenyan');
        images.push(fallbackUrl);
      }
    }

    const result = {
      image: images[0],
      heroImage: images[0],
      ...(images.length > 1 && { images })
    };

    const processingTime = Date.now() - startTime;
    console.log(`🎉 Image generation completed in ${processingTime}ms`);
    console.log(`📊 Generated ${images.length} images for "${recipe.title}"`);

    return result;

  } catch (error) {
    console.error('❌ Error in generateAndAttachRecipeImages:', error);
    
    // Return fallback images on error
    const fallbackUrl = getDefaultRecipeImage(recipe.details?.cuisine || 'Kenyan');
    return {
      image: fallbackUrl,
      heroImage: fallbackUrl
    };
  }
}

/**
 * Update a recipe with generated images
 * This is a convenience function that combines image generation with recipe updating
 */
export async function updateRecipeWithImages(
  recipe: any,
  options: {
    generateMultiple?: boolean;
    imageCount?: number;
    forceRegenerate?: boolean;
  } = {}
): Promise<any> {
  try {
    console.log(`🔄 Updating recipe "${recipe.title}" with new images...`);
    
    const imageData = await generateAndAttachRecipeImages(recipe, options);
    
    const updatedRecipe = {
      ...recipe,
      ...imageData,
      updatedAt: new Date().toISOString(),
      imageGeneratedAt: new Date().toISOString()
    };

    console.log(`✅ Recipe "${recipe.title}" updated with images`);
    return updatedRecipe;

  } catch (error) {
    console.error('❌ Error updating recipe with images:', error);
    return recipe; // Return original recipe on error
  }
}

export default {
  generateRecipeImagePrompt,
  generateRoycoSuggestions,
  analyzeIngredientImage,
  generateEnhancedRecipe,
  generateAndAttachRecipeImages,
  updateRecipeWithImages,
};