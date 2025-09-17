/**
 * Demo: Post-Save Image Generation Workflow
 * This demonstrates how to generate images after a recipe has been saved
 */

import {
    generateAndAttachRecipeImages,
    generateEnhancedRecipe,
    updateRecipeWithImages
} from './utils/gemini';

// Simulated recipe save function (replace with your actual save logic)
async function saveRecipeToDatabase(recipe: any): Promise<any> {
  console.log(`💾 Saving recipe "${recipe.title}" to database...`);
  
  // Simulate database save delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const savedRecipe = {
    ...recipe,
    savedAt: new Date().toISOString(),
    status: 'saved'
  };
  
  console.log(`✅ Recipe saved with ID: ${savedRecipe.id}`);
  return savedRecipe;
}

// Simulated recipe update function (replace with your actual update logic)
async function updateRecipeInDatabase(recipeId: string, updates: any): Promise<any> {
  console.log(`🔄 Updating recipe ${recipeId} with image data...`);
  
  // Simulate database update delay
  await new Promise(resolve => setTimeout(resolve, 50));
  
  console.log(`✅ Recipe ${recipeId} updated successfully`);
  return { ...updates, updatedInDb: true };
}

/**
 * Workflow 1: Generate recipe → Save → Generate images → Update
 */
export async function workflowGenerateRecipeThenImages() {
  console.log('\n🚀 Starting Workflow 1: Recipe → Save → Images → Update\n');
  
  try {
    const ingredients = ['chicken', 'rice', 'onions', 'tomatoes'];
    const preferences = {
      cuisine: 'Kenyan',
      servings: 4,
      difficulty: 'medium' as const
    };

    // Step 1: Generate recipe (without images)
    console.log('📝 Step 1: Generating recipe...');
    const recipe = await generateEnhancedRecipe(ingredients, preferences);
    console.log(`✅ Recipe generated: "${recipe.title}"`);

    // Step 2: Save recipe to database
    console.log('\n💾 Step 2: Saving recipe...');
    const savedRecipe = await saveRecipeToDatabase(recipe);

    // Step 3: Generate images for the saved recipe
    console.log('\n🖼️ Step 3: Generating images...');
    const imageData = await generateAndAttachRecipeImages(savedRecipe, {
      generateMultiple: true,
      imageCount: 2
    });

    // Step 4: Update recipe with images
    console.log('\n🔄 Step 4: Updating recipe with images...');
    const finalRecipe = {
      ...savedRecipe,
      ...imageData
    };
    
    await updateRecipeInDatabase(savedRecipe.id, imageData);

    console.log('\n🎉 Workflow 1 completed successfully!');
    console.log('📊 Final result:', {
      title: finalRecipe.title,
      hasImage: !!finalRecipe.image,
      hasHeroImage: !!finalRecipe.heroImage,
      totalImages: finalRecipe.images?.length || 1,
      savedAt: finalRecipe.savedAt,
      imageGeneratedAt: finalRecipe.imageGeneratedAt
    });

    return finalRecipe;

  } catch (error) {
    console.error('❌ Workflow 1 failed:', error);
    throw error;
  }
}

/**
 * Workflow 2: Generate recipe → Save → Use convenience function
 */
export async function workflowWithConvenienceFunction() {
  console.log('\n🚀 Starting Workflow 2: Using convenience function\n');
  
  try {
    const ingredients = ['beef', 'potatoes', 'carrots', 'spices'];
    const preferences = {
      cuisine: 'Kenyan',
      servings: 6,
      difficulty: 'easy' as const
    };

    // Step 1: Generate and save recipe
    console.log('📝 Step 1: Generating recipe...');
    const recipe = await generateEnhancedRecipe(ingredients, preferences);
    const savedRecipe = await saveRecipeToDatabase(recipe);

    // Step 2: Use convenience function to add images
    console.log('\n🖼️ Step 2: Adding images with convenience function...');
    const updatedRecipe = await updateRecipeWithImages(savedRecipe, {
      generateMultiple: false,
      imageCount: 1
    });

    // Step 3: Save the updated recipe
    await updateRecipeInDatabase(savedRecipe.id, {
      image: updatedRecipe.image,
      heroImage: updatedRecipe.heroImage,
      imageGeneratedAt: updatedRecipe.imageGeneratedAt
    });

    console.log('\n🎉 Workflow 2 completed successfully!');
    console.log('📊 Final result:', {
      title: updatedRecipe.title,
      hasImage: !!updatedRecipe.image,
      imageUrl: updatedRecipe.image?.substring(0, 50) + '...'
    });

    return updatedRecipe;

  } catch (error) {
    console.error('❌ Workflow 2 failed:', error);
    throw error;
  }
}

/**
 * Workflow 3: Batch image generation for existing recipes
 */
export async function workflowBatchImageGeneration() {
  console.log('\n🚀 Starting Workflow 3: Batch image generation\n');
  
  try {
    // Simulate existing recipes without images
    const existingRecipes = [
      {
        id: 'recipe-1',
        title: 'Ugali with Sukuma Wiki',
        ingredients: [{ name: 'maize flour' }, { name: 'sukuma wiki' }],
        details: { cuisine: 'Kenyan' },
        description: 'Traditional Kenyan meal'
      },
      {
        id: 'recipe-2', 
        title: 'Chapati',
        ingredients: [{ name: 'flour' }, { name: 'oil' }],
        details: { cuisine: 'Kenyan' },
        description: 'Soft Kenyan flatbread'
      }
    ];

    console.log(`📚 Processing ${existingRecipes.length} existing recipes...`);

    const updatedRecipes = [];
    
    for (const recipe of existingRecipes) {
      console.log(`\n🖼️ Generating images for: "${recipe.title}"`);
      
      const imageData = await generateAndAttachRecipeImages(recipe, {
        generateMultiple: false,
        imageCount: 1
      });
      
      const updatedRecipe = { ...recipe, ...imageData };
      updatedRecipes.push(updatedRecipe);
      
      // Simulate saving to database
      await updateRecipeInDatabase(recipe.id, imageData);
    }

    console.log('\n🎉 Batch image generation completed!');
    console.log('📊 Results:', updatedRecipes.map(r => ({
      title: r.title,
      hasImage: !!r.image
    })));

    return updatedRecipes;

  } catch (error) {
    console.error('❌ Batch workflow failed:', error);
    throw error;
  }
}

// Export all workflows for testing
export const workflows = {
  generateRecipeThenImages: workflowGenerateRecipeThenImages,
  withConvenienceFunction: workflowWithConvenienceFunction,
  batchImageGeneration: workflowBatchImageGeneration
};

// Main demo function
export async function runImageGenerationDemo() {
  console.log('🎬 Starting Image Generation Demo\n');
  console.log('This demo shows different workflows for generating images after recipe creation.\n');

  try {
    // Run all workflows
    console.log('=' .repeat(60));
    await workflowGenerateRecipeThenImages();
    
    console.log('\n' + '='.repeat(60));
    await workflowWithConvenienceFunction();
    
    console.log('\n' + '='.repeat(60));
    await workflowBatchImageGeneration();
    
    console.log('\n' + '='.repeat(60));
    console.log('🎉 All demos completed successfully!');
    
  } catch (error) {
    console.error('❌ Demo failed:', error);
  }
}

// Run demo if this file is executed directly
if (require.main === module) {
  runImageGenerationDemo();
}
