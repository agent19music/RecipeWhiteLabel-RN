import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import {
    DetectedIngredient,
    IngredientDetectionResponse,
    Recipe,
    RecipeGenerationRequest,
    RecipeGenerationResponse
} from '../data/types';

// Configuration
const AI_CONFIG = {
  openaiApiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY || '',
  openaiModel: 'gpt-4-turbo-preview',
  visionModel: 'gpt-4-vision-preview',
  imageModel: 'dall-e-3',
  maxRetries: 3,
  retryDelay: 1000,
  cacheExpiry: 24 * 60 * 60 * 1000, // 24 hours
};

// Cache keys
const CACHE_KEYS = {
  VISION_ANALYSIS: 'ai_vision_cache_',
  RECIPE_GENERATION: 'ai_recipe_cache_',
  IMAGE_GENERATION: 'ai_image_cache_',
};

// Helper: Generate cache key
function generateCacheKey(prefix: string, data: any): string {
  const hash = JSON.stringify(data)
    .split('')
    .reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
  return `${prefix}${Math.abs(hash)}`;
}

// Helper: Get from cache
async function getFromCache<T>(key: string): Promise<T | null> {
  try {
    const cached = await AsyncStorage.getItem(key);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < AI_CONFIG.cacheExpiry) {
        return data;
      }
    }
  } catch (error) {
    console.error('Cache read error:', error);
  }
  return null;
}

// Helper: Save to cache
async function saveToCache(key: string, data: any): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify({
      data,
      timestamp: Date.now(),
    }));
  } catch (error) {
    console.error('Cache write error:', error);
  }
}

// Helper: Retry with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  retries = AI_CONFIG.maxRetries
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, AI_CONFIG.retryDelay));
      return retryWithBackoff(fn, retries - 1);
    }
    throw error;
  }
}

/**
 * Analyze ingredients from an image using vision AI
 */
export async function analyzeIngredientsFromImage(
  imageUri: string,
  options: {
    enhanceWithNutrition?: boolean;
    suggestQuantities?: boolean;
    language?: string;
  } = {}
): Promise<IngredientDetectionResponse> {
  const startTime = Date.now();
  
  // Check cache
  const cacheKey = generateCacheKey(CACHE_KEYS.VISION_ANALYSIS, { imageUri, options });
  const cached = await getFromCache<IngredientDetectionResponse>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    // Read image as base64
    let base64Image: string;
    if (Platform.OS === 'web') {
      // For web, assume imageUri is already a data URL or fetch it
      const response = await fetch(imageUri);
      const blob = await response.blob();
      base64Image = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } else {
      // For mobile, use FileSystem
      base64Image = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      base64Image = `data:image/jpeg;base64,${base64Image}`;
    }

    // Call OpenAI Vision API
    const response = await retryWithBackoff(async () => {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AI_CONFIG.openaiApiKey}`,
        },
        body: JSON.stringify({
          model: AI_CONFIG.visionModel,
          messages: [
            {
              role: 'system',
              content: `You are a helpful kitchen assistant that identifies ingredients from images. 
                Respond with a JSON object containing an array of detected ingredients.
                ${options.suggestQuantities ? 'Include estimated quantities when visible.' : ''}
                ${options.enhanceWithNutrition ? 'Include nutritional category for each ingredient.' : ''}
                Format: { "ingredients": [...], "suggestions": [...], "warnings": [...], "imageQuality": "..." }`
            },
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Identify all food ingredients in this image. Be specific about types and varieties when visible.',
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: base64Image,
                    detail: 'high',
                  },
                },
              ],
            },
          ],
          max_tokens: 1000,
          temperature: 0.3,
        }),
      });

      if (!res.ok) {
        throw new Error(`Vision API error: ${res.status}`);
      }

      return res.json();
    });

    // Parse response
    const content = response.choices[0]?.message?.content;
    let result: IngredientDetectionResponse;
    
    try {
      const parsed = JSON.parse(content);
      result = {
        ingredients: parsed.ingredients.map((ing: any) => ({
          name: ing.name,
          confidence: ing.confidence || 0.9,
          quantity: ing.quantity,
          category: ing.category,
          freshness: ing.freshness || 'good',
        } as DetectedIngredient)),
        suggestions: parsed.suggestions || [],
        warnings: parsed.warnings || [],
        imageQuality: parsed.imageQuality || 'good',
        processingTime: Date.now() - startTime,
      };
    } catch (parseError) {
      // Fallback parsing if JSON fails
      result = {
        ingredients: [],
        suggestions: ['Could not parse ingredients from image'],
        warnings: ['Image analysis had parsing issues'],
        imageQuality: 'poor',
        processingTime: Date.now() - startTime,
      };
    }

    // Cache result
    await saveToCache(cacheKey, result);
    
    return result;
  } catch (error) {
    console.error('Vision analysis error:', error);
    throw error;
  }
}

/**
 * Generate a recipe from ingredients using AI
 */
export async function generateRecipeFromIngredients(
  request: RecipeGenerationRequest
): Promise<RecipeGenerationResponse> {
  const startTime = Date.now();
  
  // Check cache
  const cacheKey = generateCacheKey(CACHE_KEYS.RECIPE_GENERATION, request);
  const cached = await getFromCache<RecipeGenerationResponse>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const systemPrompt = `You are a professional chef and recipe creator. Generate detailed, practical recipes based on provided ingredients.
    Your recipes should be:
    - Clear and easy to follow
    - Culturally appropriate (consider East African cuisine when relevant)
    - Nutritionally balanced
    - Time-efficient
    
    Respond with a JSON object that matches this structure:
    {
      "id": "unique-id",
      "title": "Recipe Name",
      "summary": "Brief description",
      "ingredients": [{"name": "...", "quantity": ..., "unit": "...", "note": "..."}],
      "steps": [{"title": "...", "body": "...", "time": ...}],
      "details": {
        "servings": ...,
        "prepTime": ...,
        "cookTime": ...,
        "difficulty": "easy|medium|hard",
        "cuisine": "...",
        "dietTags": [...],
        "equipment": [...]
      },
      "nutrition": {
        "calories": ...,
        "protein": ...,
        "carbs": ...,
        "fat": ...
      },
      "tips": [...],
      "tags": [...]
    }`;

    const userPrompt = `Create a recipe using these ingredients: ${request.ingredients.join(', ')}.
    ${request.preferences ? `Preferences: ${JSON.stringify(request.preferences)}` : ''}
    ${request.style ? `Style: ${request.style}` : ''}`;

    const response = await retryWithBackoff(async () => {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AI_CONFIG.openaiApiKey}`,
        },
        body: JSON.stringify({
          model: AI_CONFIG.openaiModel,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          max_tokens: 2000,
          temperature: 0.7,
          response_format: { type: 'json_object' },
        }),
      });

      if (!res.ok) {
        throw new Error(`Recipe generation API error: ${res.status}`);
      }

      return res.json();
    });

    // Parse response
    const content = response.choices[0]?.message?.content;
    const recipeData = JSON.parse(content);
    
    // Create Recipe object
    const recipe: Recipe = {
      id: `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: recipeData.title,
      summary: recipeData.summary,
      ingredients: recipeData.ingredients,
      steps: recipeData.steps,
      details: recipeData.details,
      nutrition: recipeData.nutrition,
      tips: recipeData.tips,
      tags: recipeData.tags,
      createdBy: 'ai',
      aiGenerated: true,
      aiModel: AI_CONFIG.openaiModel,
      createdAt: new Date().toISOString(),
      
      // Calculate display time
      time: `${(recipeData.details?.totalTime || recipeData.details?.cookTime || 30)} min`,
      difficulty: recipeData.details?.difficulty || 'medium',
    };

    // Generate images if requested
    if (request.generateImages) {
      const images = await generateRecipeImages(
        `${recipe.title}: ${recipe.summary}`,
        request.imageCount || 2
      );
      recipe.images = images;
      recipe.heroImage = images[0];
    }

    const result: RecipeGenerationResponse = {
      recipe,
      generationTime: Date.now() - startTime,
      cost: 0.02, // Estimate based on token usage
    };

    // Cache result
    await saveToCache(cacheKey, result);
    
    return result;
  } catch (error) {
    console.error('Recipe generation error:', error);
    throw error;
  }
}

/**
 * Generate images for a recipe
 */
export async function generateRecipeImages(
  prompt: string,
  count: number = 2
): Promise<string[]> {
  const images: string[] = [];
  
  // Check cache
  const cacheKey = generateCacheKey(CACHE_KEYS.IMAGE_GENERATION, { prompt, count });
  const cached = await getFromCache<string[]>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    for (let i = 0; i < count; i++) {
      const enhancedPrompt = `Professional food photography of ${prompt}. 
        Beautiful plating, natural lighting, appetizing, high-quality, 
        shallow depth of field, garnished, on elegant dinnerware.`;

      const response = await retryWithBackoff(async () => {
        const res = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${AI_CONFIG.openaiApiKey}`,
          },
          body: JSON.stringify({
            model: AI_CONFIG.imageModel,
            prompt: enhancedPrompt,
            n: 1,
            size: '1024x1024',
            quality: 'standard',
            style: 'natural',
          }),
        });

        if (!res.ok) {
          throw new Error(`Image generation API error: ${res.status}`);
        }

        return res.json();
      });

      if (response.data && response.data[0]) {
        images.push(response.data[0].url);
      }
    }

    // Cache result
    await saveToCache(cacheKey, images);
    
    return images;
  } catch (error) {
    console.error('Image generation error:', error);
    // Return placeholder images on error
    return Array(count).fill('https://via.placeholder.com/1024x1024.png?text=Recipe+Image');
  }
}

/**
 * Enhanced recipe with AI suggestions
 */
export async function enhanceRecipe(recipe: Recipe): Promise<Recipe> {
  try {
    const prompt = `Enhance this recipe with additional tips, variations, and pairings:
    Title: ${recipe.title}
    Ingredients: ${recipe.ingredients.map(i => i.name).join(', ')}`;

    const response = await retryWithBackoff(async () => {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AI_CONFIG.openaiApiKey}`,
        },
        body: JSON.stringify({
          model: AI_CONFIG.openaiModel,
          messages: [
            {
              role: 'system',
              content: 'Provide brief, practical enhancements for recipes. Return JSON with tips, variations, and pairings arrays.',
            },
            { role: 'user', content: prompt },
          ],
          max_tokens: 500,
          temperature: 0.7,
          response_format: { type: 'json_object' },
        }),
      });

      if (!res.ok) {
        throw new Error(`Enhancement API error: ${res.status}`);
      }

      return res.json();
    });

    const enhancements = JSON.parse(response.choices[0]?.message?.content);
    
    return {
      ...recipe,
      tips: [...(recipe.tips || []), ...(enhancements.tips || [])],
      variations: enhancements.variations || recipe.variations,
      pairings: enhancements.pairings || recipe.pairings,
    };
  } catch (error) {
    console.error('Recipe enhancement error:', error);
    return recipe; // Return original on error
  }
}

/**
 * Get recipe suggestions based on available ingredients
 */
export async function getRecipeSuggestions(
  ingredients: string[],
  limit: number = 5
): Promise<{ title: string; match: number }[]> {
  try {
    const prompt = `Given these ingredients: ${ingredients.join(', ')}, 
    suggest ${limit} recipes that can be made. 
    Return JSON array with title and match percentage.`;

    const response = await retryWithBackoff(async () => {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AI_CONFIG.openaiApiKey}`,
        },
        body: JSON.stringify({
          model: AI_CONFIG.openaiModel,
          messages: [
            {
              role: 'system',
              content: 'Suggest recipes based on available ingredients. Return JSON array.',
            },
            { role: 'user', content: prompt },
          ],
          max_tokens: 300,
          temperature: 0.8,
          response_format: { type: 'json_object' },
        }),
      });

      if (!res.ok) {
        throw new Error(`Suggestions API error: ${res.status}`);
      }

      return res.json();
    });

    const suggestions = JSON.parse(response.choices[0]?.message?.content);
    return suggestions.recipes || [];
  } catch (error) {
    console.error('Recipe suggestions error:', error);
    return [];
  }
}

/**
 * Simple wrapper for camera ingredient detection
 */
export async function detectIngredients(base64Image: string): Promise<IngredientDetectionResponse> {
  const imageUri = `data:image/jpeg;base64,${base64Image}`;
  return analyzeIngredientsFromImage(imageUri, {
    suggestQuantities: true,
    enhanceWithNutrition: true,
  });
}

/**
 * Simple wrapper for recipe generation from ingredient names
 */
export async function generateRecipeFromIngredientsList(
  ingredients: string[]
): Promise<RecipeGenerationResponse> {
  const request: RecipeGenerationRequest = {
    ingredients,
    preferences: {
      cuisine: 'East African',
      difficulty: 'easy',
      servings: 4,
      maxCookTime: 60,
    },
    style: 'traditional',
    generateImages: false, // Disable for faster generation
  };
  
  return generateRecipeFromIngredients(request);
}

/**
 * Save generated recipe to local storage
 */
export async function saveGeneratedRecipe(recipe: Recipe): Promise<void> {
  try {
    const key = `user_recipe_${recipe.id}`;
    await AsyncStorage.setItem(key, JSON.stringify(recipe));
    
    // Also add to user recipes list
    const userRecipesKey = 'user_recipes_list';
    const existing = await AsyncStorage.getItem(userRecipesKey);
    const recipesList = existing ? JSON.parse(existing) : [];
    
    if (!recipesList.find((r: Recipe) => r.id === recipe.id)) {
      recipesList.unshift(recipe); // Add to beginning
      await AsyncStorage.setItem(userRecipesKey, JSON.stringify(recipesList));
    }
  } catch (error) {
    console.error('Save recipe error:', error);
  }
}

/**
 * Get all user-generated recipes
 */
export async function getUserRecipes(): Promise<Recipe[]> {
  try {
    const userRecipesKey = 'user_recipes_list';
    const existing = await AsyncStorage.getItem(userRecipesKey);
    return existing ? JSON.parse(existing) : [];
  } catch (error) {
    console.error('Get user recipes error:', error);
    return [];
  }
}

/**
 * Delete user-generated recipe
 */
export async function deleteUserRecipe(recipeId: string): Promise<void> {
  try {
    // Remove from individual storage
    await AsyncStorage.removeItem(`user_recipe_${recipeId}`);
    
    // Remove from user recipes list
    const userRecipesKey = 'user_recipes_list';
    const existing = await AsyncStorage.getItem(userRecipesKey);
    if (existing) {
      const recipesList = JSON.parse(existing);
      const filtered = recipesList.filter((r: Recipe) => r.id !== recipeId);
      await AsyncStorage.setItem(userRecipesKey, JSON.stringify(filtered));
    }
  } catch (error) {
    console.error('Delete recipe error:', error);
  }
}

/**
 * Clear AI cache
 */
export async function clearAICache(): Promise<void> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const aiKeys = keys.filter(key => 
      key.startsWith(CACHE_KEYS.VISION_ANALYSIS) ||
      key.startsWith(CACHE_KEYS.RECIPE_GENERATION) ||
      key.startsWith(CACHE_KEYS.IMAGE_GENERATION)
    );
    await AsyncStorage.multiRemove(aiKeys);
  } catch (error) {
    console.error('Clear cache error:', error);
  }
}
