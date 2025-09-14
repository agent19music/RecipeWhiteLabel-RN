#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface TestResult {
  test: string;
  status: 'PASS' | 'FAIL';
  message?: string;
  data?: any;
}

async function runTests() {
  console.log('🧪 Running database tests...\n');
  
  const results: TestResult[] = [];

  // Test 1: Check if all tables exist
  try {
    const tables = [
      'profiles', 'recipes', 'recipe_ingredients', 'recipe_steps',
      'recipe_ratings', 'recipe_favorites', 'recipe_cook_logs',
      'pantry_items', 'shopping_lists', 'shopping_list_items',
      'challenges', 'challenge_submissions', 'challenge_votes',
      'challenge_comments', 'challenge_comment_likes',
      'meal_plans', 'meal_plan_days', 'meal_plan_meals',
      'user_follows', 'recipe_shares', 'user_activities',
      'recipe_collections', 'recipe_collection_items',
      'recipe_generation_requests', 'ingredient_detections',
      'user_stats', 'recipe_analytics', 'app_settings'
    ];

    for (const table of tables) {
      const { error } = await supabase.from(table).select('*').limit(1);
      if (error && error.code === 'PGRST116') {
        results.push({
          test: `Table ${table} exists`,
          status: 'FAIL',
          message: `Table ${table} does not exist`
        });
      } else {
        results.push({
          test: `Table ${table} exists`,
          status: 'PASS'
        });
      }
    }
  } catch (error) {
    results.push({
      test: 'Table existence check',
      status: 'FAIL',
      message: `Error checking tables: ${error}`
    });
  }

  // Test 2: Check recipes data
  try {
    const { data: recipes, error } = await supabase
      .from('recipes')
      .select('*')
      .limit(5);

    if (error) throw error;

    results.push({
      test: 'Recipes data retrieval',
      status: 'PASS',
      data: `Found ${recipes.length} recipes`
    });
  } catch (error) {
    results.push({
      test: 'Recipes data retrieval',
      status: 'FAIL',
      message: `Error: ${error}`
    });
  }

  // Test 3: Check recipe relationships
  try {
    const { data: recipesWithIngredients, error } = await supabase
      .from('recipes')
      .select(`
        *,
        recipe_ingredients (*),
        recipe_steps (*)
      `)
      .limit(1);

    if (error) throw error;

    const recipe = recipesWithIngredients[0];
    if (recipe && recipe.recipe_ingredients?.length > 0 && recipe.recipe_steps?.length > 0) {
      results.push({
        test: 'Recipe relationships (ingredients & steps)',
        status: 'PASS',
        data: `Recipe has ${recipe.recipe_ingredients.length} ingredients and ${recipe.recipe_steps.length} steps`
      });
    } else {
      results.push({
        test: 'Recipe relationships (ingredients & steps)',
        status: 'FAIL',
        message: 'Recipe missing ingredients or steps'
      });
    }
  } catch (error) {
    results.push({
      test: 'Recipe relationships',
      status: 'FAIL',
      message: `Error: ${error}`
    });
  }

  // Test 4: Check challenges data
  try {
    const { data: challenges, error } = await supabase
      .from('challenges')
      .select('*')
      .limit(5);

    if (error) throw error;

    results.push({
      test: 'Challenges data retrieval',
      status: 'PASS',
      data: `Found ${challenges.length} challenges`
    });
  } catch (error) {
    results.push({
      test: 'Challenges data retrieval',
      status: 'FAIL',
      message: `Error: ${error}`
    });
  }

  // Test 5: Check RLS policies (should fail without auth)
  try {
    const { data: pantryItems, error } = await supabase
      .from('pantry_items')
      .select('*')
      .limit(1);

    // This should fail due to RLS since we're not authenticated
    if (error && error.code === 'PGRST301') {
      results.push({
        test: 'RLS policies working',
        status: 'PASS',
        message: 'RLS correctly blocking unauthorized access to pantry items'
      });
    } else {
      results.push({
        test: 'RLS policies working',
        status: 'FAIL',
        message: 'RLS not properly configured - unauthorized access allowed'
      });
    }
  } catch (error) {
    results.push({
      test: 'RLS policies working',
      status: 'FAIL',
      message: `Unexpected error: ${error}`
    });
  }

  // Test 6: Check database functions and triggers
  try {
    // Test the slug generation by looking for properly formatted slugs
    const { data: recipesWithSlugs, error } = await supabase
      .from('recipes')
      .select('title, slug')
      .limit(5);

    if (error) throw error;

    const hasValidSlugs = recipesWithSlugs.every(recipe => 
      recipe.slug && 
      recipe.slug.includes('-') && 
      !recipe.slug.includes(' ')
    );

    results.push({
      test: 'Recipe slugs properly generated',
      status: hasValidSlugs ? 'PASS' : 'FAIL',
      message: hasValidSlugs ? 'All recipes have valid slugs' : 'Some recipes have invalid slugs'
    });
  } catch (error) {
    results.push({
      test: 'Slug generation',
      status: 'FAIL',
      message: `Error: ${error}`
    });
  }

  // Print results
  console.log('📊 Test Results:');
  console.log('='.repeat(60));

  let passed = 0;
  let failed = 0;

  results.forEach((result, index) => {
    const status = result.status === 'PASS' ? '✅' : '❌';
    console.log(`${status} ${result.test}`);
    
    if (result.message) {
      console.log(`   ${result.message}`);
    }
    
    if (result.data) {
      console.log(`   📋 ${result.data}`);
    }
    
    if (result.status === 'PASS') {
      passed++;
    } else {
      failed++;
    }
    
    console.log('');
  });

  console.log('='.repeat(60));
  console.log(`📈 Summary: ${passed} passed, ${failed} failed`);
  console.log(`Success rate: ${((passed / results.length) * 100).toFixed(1)}%`);

  if (failed === 0) {
    console.log('\n🎉 All tests passed! Your database is ready to go.');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the errors above.');
    if (failed > passed) {
      console.log('🔧 Consider running the migration script first if you haven\'t already.');
    }
  }

  return { passed, failed, total: results.length };
}

// Test individual CRUD operations
async function testCRUDOperations() {
  console.log('\n🔧 Testing basic CRUD operations...\n');
  
  try {
    // Test creating a test recipe (as service role, bypassing RLS)
    const testRecipe = {
      title: 'Test Recipe for Database Validation',
      slug: 'test-recipe-for-database-validation',
      description: 'This is a test recipe to validate our database setup',
      total_time_minutes: 30,
      difficulty: 'easy' as const,
      servings: 2,
      cuisine: 'Test',
      course: ['Test'],
      meal_type: ['test'],
      dietary_tags: ['test'],
      source: 'curated' as const,
      ai_generated: false,
      rating_average: 0,
      rating_count: 0,
      favorite_count: 0,
      view_count: 0,
      cook_count: 0,
      share_count: 0,
      is_published: true,
      is_featured: false,
      is_trending: false
    };

    console.log('🔹 Creating test recipe...');
    const { data: createdRecipe, error: createError } = await supabase
      .from('recipes')
      .insert(testRecipe)
      .select()
      .single();

    if (createError) {
      console.log('❌ Failed to create test recipe:', createError);
      return;
    }
    console.log('✅ Test recipe created successfully');

    // Test reading the recipe
    console.log('🔹 Reading test recipe...');
    const { data: readRecipe, error: readError } = await supabase
      .from('recipes')
      .select('*')
      .eq('id', createdRecipe.id)
      .single();

    if (readError) {
      console.log('❌ Failed to read test recipe:', readError);
      return;
    }
    console.log('✅ Test recipe read successfully');

    // Test updating the recipe
    console.log('🔹 Updating test recipe...');
    const { error: updateError } = await supabase
      .from('recipes')
      .update({ description: 'Updated test recipe description' })
      .eq('id', createdRecipe.id);

    if (updateError) {
      console.log('❌ Failed to update test recipe:', updateError);
      return;
    }
    console.log('✅ Test recipe updated successfully');

    // Test adding ingredients
    console.log('🔹 Adding test ingredients...');
    const testIngredients = [
      {
        recipe_id: createdRecipe.id,
        name: 'Test Ingredient 1',
        quantity: 1,
        unit: 'cup',
        is_optional: false,
        order_index: 1
      },
      {
        recipe_id: createdRecipe.id,
        name: 'Test Ingredient 2',
        quantity: 2,
        unit: 'tbsp',
        is_optional: true,
        order_index: 2
      }
    ];

    const { error: ingredientsError } = await supabase
      .from('recipe_ingredients')
      .insert(testIngredients);

    if (ingredientsError) {
      console.log('❌ Failed to add test ingredients:', ingredientsError);
      return;
    }
    console.log('✅ Test ingredients added successfully');

    // Test adding steps
    console.log('🔹 Adding test steps...');
    const testSteps = [
      {
        recipe_id: createdRecipe.id,
        step_number: 1,
        instruction: 'This is the first test step',
        time_minutes: 10
      },
      {
        recipe_id: createdRecipe.id,
        step_number: 2,
        instruction: 'This is the second test step',
        time_minutes: 20
      }
    ];

    const { error: stepsError } = await supabase
      .from('recipe_steps')
      .insert(testSteps);

    if (stepsError) {
      console.log('❌ Failed to add test steps:', stepsError);
      return;
    }
    console.log('✅ Test steps added successfully');

    // Test reading recipe with relationships
    console.log('🔹 Reading recipe with relationships...');
    const { data: fullRecipe, error: fullRecipeError } = await supabase
      .from('recipes')
      .select(`
        *,
        recipe_ingredients (*),
        recipe_steps (*)
      `)
      .eq('id', createdRecipe.id)
      .single();

    if (fullRecipeError) {
      console.log('❌ Failed to read full recipe:', fullRecipeError);
      return;
    }

    console.log(`✅ Full recipe retrieved with ${fullRecipe.recipe_ingredients.length} ingredients and ${fullRecipe.recipe_steps.length} steps`);

    // Clean up - delete the test recipe (cascade will delete ingredients and steps)
    console.log('🔹 Cleaning up test data...');
    const { error: deleteError } = await supabase
      .from('recipes')
      .delete()
      .eq('id', createdRecipe.id);

    if (deleteError) {
      console.log('❌ Failed to delete test recipe:', deleteError);
      return;
    }
    console.log('✅ Test data cleaned up successfully');

    console.log('\n🎉 All CRUD operations completed successfully!');

  } catch (error) {
    console.error('💥 CRUD test failed:', error);
  }
}

async function main() {
  const testResults = await runTests();
  await testCRUDOperations();
  
  console.log('\n🏁 Database testing complete!');
  
  if (testResults.failed > 0) {
    process.exit(1);
  }
}

// Run tests if called directly
if (require.main === module) {
  main();
}

export { runTests, testCRUDOperations };