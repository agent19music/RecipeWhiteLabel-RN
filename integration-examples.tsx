/**
 * Integration Example: Using post-save image generation in your app
 * This shows how to integrate the new image generation workflow into your React Native components
 */

import React, { useState } from 'react';
import { ActivityIndicator, Alert, Button, Image, Text, View } from 'react-native';
import {
    generateAndAttachRecipeImages,
    generateEnhancedRecipe
} from '../utils/gemini';

// Example: Recipe Creation Component
export const RecipeCreationScreen = () => {
  const [recipe, setRecipe] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);
  const [images, setImages] = useState([]);

  const handleCreateRecipe = async () => {
    setIsGenerating(true);
    try {
      const ingredients = ['chicken', 'rice', 'spices'];
      const preferences = { cuisine: 'Kenyan', servings: 4 };
      
      // Step 1: Generate recipe without images (fast)
      const newRecipe = await generateEnhancedRecipe(ingredients, preferences);
      setRecipe(newRecipe);
      
      // Step 2: Save recipe to your database/storage
      await saveRecipeToYourDatabase(newRecipe);
      
      Alert.alert('Success', 'Recipe created! Generating images...');
      
      // Step 3: Generate images in background
      handleGenerateImages(newRecipe);
      
    } catch (error) {
      Alert.alert('Error', 'Failed to create recipe');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateImages = async (recipeToUpdate = recipe) => {
    if (!recipeToUpdate) return;
    
    setIsGeneratingImages(true);
    try {
      // Generate images after recipe is saved
      const imageData = await generateAndAttachRecipeImages(recipeToUpdate, {
        generateMultiple: true,
        imageCount: 3
      });
      
      // Update recipe with images
      const updatedRecipe = {
        ...recipeToUpdate,
        ...imageData,
        imageGeneratedAt: new Date().toISOString()
      };
      
      setRecipe(updatedRecipe);
      setImages(imageData.images || [imageData.image]);
      
      // Update in database
      await updateRecipeInYourDatabase(recipeToUpdate.id, imageData);
      
      Alert.alert('Success', 'Images generated successfully!');
      
    } catch (error) {
      Alert.alert('Error', 'Failed to generate images');
    } finally {
      setIsGeneratingImages(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        Recipe Creator
      </Text>

      <Button
        title={isGenerating ? "Creating Recipe..." : "Create Recipe"}
        onPress={handleCreateRecipe}
        disabled={isGenerating}
      />

      {recipe && (
        <View style={{ marginTop: 20, padding: 15, backgroundColor: '#f5f5f5' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{recipe.title}</Text>
          <Text style={{ marginTop: 10 }}>{recipe.description}</Text>
          
          {/* Image generation section */}
          <View style={{ marginTop: 15 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Images:</Text>
            
            {isGeneratingImages && (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                <ActivityIndicator size="small" />
                <Text style={{ marginLeft: 10 }}>Generating images...</Text>
              </View>
            )}
            
            {images.length > 0 && (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 }}>
                {images.map((imageUrl, index) => (
                  <Image
                    key={index}
                    source={{ uri: imageUrl }}
                    style={{ 
                      width: 80, 
                      height: 80, 
                      marginRight: 10, 
                      marginBottom: 10,
                      borderRadius: 8 
                    }}
                  />
                ))}
              </View>
            )}
            
            {recipe && !isGeneratingImages && images.length === 0 && (
              <Button
                title="Generate Images"
                onPress={() => handleGenerateImages()}
                color="#007AFF"
              />
            )}
          </View>
        </View>
      )}
    </View>
  );
};

// Example: Background Image Generation Service
export class ImageGenerationService {
  private queue: Array<{ recipe: any; options: any; resolve: Function; reject: Function }> = [];
  private processing = false;

  async addToQueue(recipe: any, options = {}) {
    return new Promise((resolve, reject) => {
      this.queue.push({ recipe, options, resolve, reject });
      this.processQueue();
    });
  }

  private async processQueue() {
    if (this.processing || this.queue.length === 0) return;
    
    this.processing = true;
    
    while (this.queue.length > 0) {
      const { recipe, options, resolve, reject } = this.queue.shift()!;
      
      try {
        console.log(`🖼️ Processing image generation for: ${recipe.title}`);
        
        const imageData = await generateAndAttachRecipeImages(recipe, {
          generateMultiple: false,
          imageCount: 1,
          ...options
        });
        
        // Update recipe in database
        await updateRecipeInYourDatabase(recipe.id, imageData);
        
        resolve(imageData);
        console.log(`✅ Images generated for: ${recipe.title}`);
        
      } catch (error) {
        console.error(`❌ Failed to generate images for: ${recipe.title}`, error);
        reject(error);
      }
      
      // Add delay between generations to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    this.processing = false;
  }
}

// Example: Batch Processing for Existing Recipes
export const BatchImageGenerator = () => {
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const handleBatchGenerate = async () => {
    setProcessing(true);
    
    try {
      // Get recipes without images from your database
      const recipesWithoutImages = await getRecipesWithoutImages();
      setProgress({ current: 0, total: recipesWithoutImages.length });
      
      for (let i = 0; i < recipesWithoutImages.length; i++) {
        const recipe = recipesWithoutImages[i];
        
        try {
          const imageData = await generateAndAttachRecipeImages(recipe, {
            generateMultiple: false,
            imageCount: 1
          });
          
          await updateRecipeInYourDatabase(recipe.id, imageData);
          setProgress({ current: i + 1, total: recipesWithoutImages.length });
          
        } catch (error) {
          console.error(`Failed to generate image for recipe ${recipe.id}:`, error);
        }
        
        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      Alert.alert('Complete', 'Batch image generation completed!');
      
    } catch (error) {
      Alert.alert('Error', 'Batch processing failed');
    } finally {
      setProcessing(false);
      setProgress({ current: 0, total: 0 });
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>
        Batch Image Generator
      </Text>
      
      {processing ? (
        <View>
          <Text>Processing: {progress.current} / {progress.total}</Text>
          <ActivityIndicator size="large" style={{ marginTop: 10 }} />
        </View>
      ) : (
        <Button
          title="Generate Images for All Recipes"
          onPress={handleBatchGenerate}
        />
      )}
    </View>
  );
};

// Utility functions (implement these based on your database/storage solution)
async function saveRecipeToYourDatabase(recipe: any) {
  // Implement your recipe save logic here
  console.log('Saving recipe to database:', recipe.id);
}

async function updateRecipeInYourDatabase(recipeId: string, imageData: any) {
  // Implement your recipe update logic here
  console.log('Updating recipe with images:', recipeId);
}

async function getRecipesWithoutImages() {
  // Implement your query to get recipes without images
  return [];
}

export default {
  RecipeCreationScreen,
  ImageGenerationService,
  BatchImageGenerator
};
