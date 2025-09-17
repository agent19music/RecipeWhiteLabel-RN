/**
 * Test script to verify the updated generateEnhancedRecipe function
 * This demonstrates the improved Royco product integration and post-save image generation
 */

import {
    generateAndAttachRecipeImages,
    generateEnhancedRecipe,
    generateRoycoSuggestions,
    updateRecipeWithImages
} from './utils/gemini';

async function testUpdatedGeminiFunction() {
  console.log('🧪 Testing updated Gemini AI recipe generation...\n');

  // Test ingredients that should trigger various Royco products
  const testIngredients = [
    'beef', 'onions', 'tomatoes', 'rice', 'garlic', 'ginger'
  ];

  const testPreferences = {
    cuisine: 'Kenyan',
    servings: 4,
    difficulty: 'medium' as const,
    dietaryRestrictions: []
  };

  try {
    // Test 1: Royco product suggestions
    console.log('📋 Testing Royco product suggestions...');
    const roycoSuggestions = await generateRoycoSuggestions(
      'Beef Pilau',
      testIngredients,
      'Kenyan'
    );
    
    console.log('✅ Royco Suggestions:', {
      products: roycoSuggestions.products.length,
      tips: roycoSuggestions.preparationTips.length,
      flavorProfile: roycoSuggestions.flavorProfile.substring(0, 50) + '...'
    });

    // Test 2: Enhanced recipe generation
    console.log('\n🍽️ Testing enhanced recipe generation...');
    const recipe = await generateEnhancedRecipe(testIngredients, testPreferences);
    
    console.log('✅ Generated Recipe:', {
      title: recipe.title,
      aiGenerated: recipe.aiGenerated,
      roycoEnhanced: recipe.roycoEnhanced,
      ingredients: recipe.ingredients?.length || 0,
      steps: recipe.steps?.length || 0,
      processingTime: recipe.processingTime + 'ms',
      hasImage: !!recipe.image
    });

    // Test 3: Verify Royco product integration
    const ingredientNames = recipe.ingredients?.map((ing: any) => ing.name) || [];
    const roycoProducts = ingredientNames.filter((name: string) => 
      name.toLowerCase().includes('royco')
    );
    
    console.log('\n🎯 Royco Integration Check:', {
      totalIngredients: ingredientNames.length,
      roycoProducts: roycoProducts.length,
      roycoProductNames: roycoProducts
    });

    if (roycoProducts.length > 0) {
      console.log('✅ SUCCESS: Royco products successfully integrated!');
    } else {
      console.log('⚠️  WARNING: No Royco products found in ingredients');
    }

    // Test 4: Post-save image generation
    console.log('\n🖼️ Testing post-save image generation...');
    const imageData = await generateAndAttachRecipeImages(recipe, {
      generateMultiple: true,
      imageCount: 2
    });
    
    console.log('✅ Post-save images generated:', {
      hasMainImage: !!imageData.image,
      hasHeroImage: !!imageData.heroImage,
      totalImages: imageData.images?.length || 1,
      imageUrls: [
        imageData.image?.substring(0, 50) + '...',
        ...(imageData.images?.slice(1).map(url => url.substring(0, 50) + '...') || [])
      ]
    });

    // Test 5: Convenience function
    console.log('\n🔄 Testing convenience update function...');
    const updatedRecipe = await updateRecipeWithImages(recipe, {
      forceRegenerate: true,
      imageCount: 1
    });
    
    console.log('✅ Recipe updated with convenience function:', {
      hasUpdatedAt: !!updatedRecipe.updatedAt,
      hasImageGeneratedAt: !!updatedRecipe.imageGeneratedAt,
      imageUrl: updatedRecipe.image?.substring(0, 50) + '...'
    });

    return {
      success: true,
      recipe: updatedRecipe,
      roycoSuggestions,
      roycoProductCount: roycoProducts.length,
      imageData
    };

  } catch (error) {
    console.error('❌ Test failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Export for potential use in other tests
export { testUpdatedGeminiFunction };

// Run test if this file is executed directly
if (require.main === module) {
  testUpdatedGeminiFunction()
    .then(result => {
      console.log('\n📊 Test Summary:', {
        success: result.success,
        roycoIntegration: result.success ? result.roycoProductCount > 0 : false,
        imageGeneration: result.success ? !!result.imageData?.image : false,
        totalImagesGenerated: result.success ? (result.imageData?.images?.length || 1) : 0
      });
    })
    .catch(console.error);
}
