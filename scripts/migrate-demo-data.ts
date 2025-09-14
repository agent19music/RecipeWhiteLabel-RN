#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js';
import { recipes, communityRecipes, challenges, pantry, demoPlan } from '../data/seed';
import { getCommunityRecipes } from '../data/community-recipes';
import { getChallenges } from '../data/challenges';

// Initialize Supabase client
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables:');
  console.error('EXPO_PUBLIC_SUPABASE_URL:', !!supabaseUrl);
  console.error('SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface MigrationResult {
  table: string;
  total: number;
  success: number;
  errors: any[];
}

/**
 * Create a URL-friendly slug from a title
 */
function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
}

/**
 * Migrate basic recipes from seed data
 */
async function migrateBasicRecipes(): Promise<MigrationResult> {
  console.log('🍳 Migrating basic recipes...');
  const result: MigrationResult = {
    table: 'recipes',
    total: recipes.length,
    success: 0,
    errors: []
  };

  for (const recipe of recipes) {
    try {
      // Transform the recipe data to match our database schema
      const recipeData = {
        id: recipe.id,
        title: recipe.title,
        slug: createSlug(recipe.title),
        description: `A delicious ${recipe.title.toLowerCase()} recipe.`,
        total_time_minutes: recipe.minutes || 30,
        difficulty: 'easy' as const,
        servings: 4,
        cuisine: 'Kenyan',
        course: ['Main Course'],
        meal_type: ['dinner'],
        dietary_tags: recipe.tags || [],
        source: 'curated' as const,
        ai_generated: false,
        rating_average: 0,
        rating_count: 0,
        favorite_count: recipe.likes || 0,
        view_count: Math.floor(Math.random() * 1000),
        cook_count: Math.floor(Math.random() * 100),
        share_count: 0,
        is_published: true,
        is_featured: false,
        is_trending: false,
        original_author: recipe.by || 'Community',
        estimated_cost_kes: Math.floor(Math.random() * 800) + 200, // Random cost between 200-1000 KES
        nutrition: {
          calories: recipe.calories
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Insert recipe
      const { data: insertedRecipe, error } = await supabase
        .from('recipes')
        .insert(recipeData)
        .select()
        .single();

      if (error) throw error;

      // Insert ingredients
      if (recipe.ingredients && insertedRecipe) {
        for (let i = 0; i < recipe.ingredients.length; i++) {
          const ingredient = recipe.ingredients[i];
          await supabase
            .from('recipe_ingredients')
            .insert({
              recipe_id: insertedRecipe.id,
              name: ingredient.name,
              quantity: typeof ingredient.qty === 'number' ? ingredient.qty : parseFloat(ingredient.qty?.toString() || '0'),
              unit: ingredient.unit || '',
              is_optional: false,
              order_index: i + 1
            });
        }
      }

      // Insert steps
      if (recipe.steps && insertedRecipe) {
        for (let i = 0; i < recipe.steps.length; i++) {
          const step = recipe.steps[i];
          await supabase
            .from('recipe_steps')
            .insert({
              recipe_id: insertedRecipe.id,
              step_number: i + 1,
              instruction: step,
              time_minutes: Math.floor(Math.random() * 10) + 5 // Random time between 5-15 minutes
            });
        }
      }

      result.success++;
      console.log(`✅ Migrated: ${recipe.title}`);
    } catch (error) {
      result.errors.push({ recipe: recipe.title, error });
      console.error(`❌ Failed to migrate ${recipe.title}:`, error);
    }
  }

  return result;
}

/**
 * Migrate community recipes (TikTok viral recipes)
 */
async function migrateCommunityRecipes(): Promise<MigrationResult> {
  console.log('🌟 Migrating community recipes...');
  const communityData = getCommunityRecipes();
  const result: MigrationResult = {
    table: 'community_recipes',
    total: communityData.length,
    success: 0,
    errors: []
  };

  for (const recipe of communityData) {
    try {
      const recipeData = {
        id: recipe.id,
        title: recipe.title,
        slug: createSlug(recipe.title),
        summary: recipe.summary,
        description: recipe.description,
        hero_image: recipe.heroImage,
        thumbnail_image: recipe.image?.toString(),
        additional_images: recipe.images || [],
        prep_time_minutes: recipe.details?.prepTime || recipe.prepTime,
        cook_time_minutes: recipe.details?.cookTime || recipe.cookTime,
        total_time_minutes: recipe.details?.totalTime || recipe.totalTime || recipe.minutes || 60,
        difficulty: recipe.details?.difficulty || recipe.difficulty?.toLowerCase() || 'medium',
        servings: recipe.details?.servings || recipe.servings || 4,
        nutrition: recipe.nutrition,
        estimated_cost_kes: Math.floor(Math.random() * 1000) + 300,
        cuisine: recipe.details?.cuisine || recipe.cuisine || 'Kenyan',
        course: recipe.details?.course || ['Main Course'],
        meal_type: ['dinner'],
        dietary_tags: recipe.tags || [],
        source: 'community' as const,
        original_author: recipe.author,
        social_media: recipe.socialMedia,
        video_url: recipe.videoUrl,
        ai_generated: false,
        rating_average: recipe.details?.rating || 4.5,
        rating_count: recipe.details?.ratingCount || 100,
        favorite_count: recipe.details?.favoriteCount || 50,
        view_count: Math.floor(Math.random() * 10000) + 1000,
        cook_count: Math.floor(Math.random() * 500) + 50,
        share_count: Math.floor(Math.random() * 200) + 10,
        is_published: true,
        is_featured: true,
        is_trending: true,
        equipment: recipe.details?.equipment || [],
        tips: recipe.tips || [],
        variations: recipe.variations || [],
        allergens: recipe.allergens || [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Insert recipe
      const { data: insertedRecipe, error } = await supabase
        .from('recipes')
        .insert(recipeData)
        .select()
        .single();

      if (error) throw error;

      // Insert ingredients with enhanced data
      if (recipe.ingredients && insertedRecipe) {
        for (let i = 0; i < recipe.ingredients.length; i++) {
          const ingredient = recipe.ingredients[i];
          await supabase
            .from('recipe_ingredients')
            .insert({
              recipe_id: insertedRecipe.id,
              name: ingredient.name,
              quantity: ingredient.quantity || ingredient.qty,
              unit: ingredient.unit || '',
              notes: ingredient.note,
              is_optional: ingredient.optional || false,
              ingredient_group: ingredient.group,
              substitutions: ingredient.substitutions || [],
              order_index: i + 1
            });
        }
      }

      // Insert steps with enhanced data
      if (recipe.steps && insertedRecipe) {
        for (let i = 0; i < recipe.steps.length; i++) {
          const step = recipe.steps[i];
          await supabase
            .from('recipe_steps')
            .insert({
              recipe_id: insertedRecipe.id,
              step_number: i + 1,
              title: step.title,
              instruction: step.body || step.instruction || step,
              time_minutes: step.time,
              temperature: step.temperature,
              tips: step.tips || [],
              timer_seconds: step.timerSeconds
            });
        }
      }

      result.success++;
      console.log(`✅ Migrated: ${recipe.title} by ${recipe.author}`);
    } catch (error) {
      result.errors.push({ recipe: recipe.title, error });
      console.error(`❌ Failed to migrate ${recipe.title}:`, error);
    }
  }

  return result;
}

/**
 * Migrate challenges data
 */
async function migrateChallenges(): Promise<MigrationResult> {
  console.log('🏆 Migrating challenges...');
  const challengesData = getChallenges();
  const result: MigrationResult = {
    table: 'challenges',
    total: challengesData.length,
    success: 0,
    errors: []
  };

  // Create a supervisor user for challenges (you'll need to replace this with actual supervisor user ID)
  const supervisorUserId = '00000000-0000-0000-0000-000000000000'; // Placeholder

  for (const challenge of challengesData) {
    try {
      const challengeData = {
        id: challenge.id.toString(),
        title: challenge.name,
        description: challenge.description,
        rules: challenge.rules || [],
        judges_criteria: challenge.judgesCriteria || [],
        start_date: challenge.startDate,
        end_date: challenge.endDate,
        submission_deadline: challenge.submissionDeadline,
        winner_announcement_date: challenge.winnerAnnouncement,
        status: challenge.status,
        theme_color: challenge.themeColor,
        background_color: challenge.backgroundColor,
        tags: challenge.tags,
        prize_description: challenge.prize,
        total_prize_value_kes: challenge.totalPrizeValue,
        participants_count: challenge.participants,
        submissions_count: challenge.submissions,
        created_by_user_id: supervisorUserId, // You'll need to update this
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('challenges')
        .insert(challengeData);

      if (error) throw error;

      result.success++;
      console.log(`✅ Migrated challenge: ${challenge.name}`);
    } catch (error) {
      result.errors.push({ challenge: challenge.name, error });
      console.error(`❌ Failed to migrate challenge ${challenge.name}:`, error);
    }
  }

  return result;
}

/**
 * Create sample pantry data for testing
 */
async function migratePantryData(): Promise<MigrationResult> {
  console.log('🥬 Migrating pantry data...');
  const result: MigrationResult = {
    table: 'pantry_items',
    total: pantry.length,
    success: 0,
    errors: []
  };

  // Note: This will need actual user IDs from your auth system
  const sampleUserId = '00000000-0000-0000-0000-000000000000'; // Placeholder

  for (const item of pantry) {
    try {
      const pantryData = {
        id: item.id,
        user_id: sampleUserId, // You'll need to update this
        name: item.title,
        quantity: typeof item.qty === 'number' ? item.qty : parseFloat(item.qty?.toString() || '0'),
        unit: item.unit || 'pcs',
        category: mapPantryCategory(item.title),
        location: mapPantryLocation(item.title),
        expiry_date: item.expiresOn || null,
        is_low_stock: false,
        is_pinned: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('pantry_items')
        .insert(pantryData);

      if (error) throw error;

      result.success++;
      console.log(`✅ Migrated pantry item: ${item.title}`);
    } catch (error) {
      result.errors.push({ item: item.title, error });
      console.error(`❌ Failed to migrate pantry item ${item.title}:`, error);
    }
  }

  return result;
}

/**
 * Helper functions to map categories
 */
function mapPantryCategory(itemName: string): string {
  const name = itemName.toLowerCase();
  if (name.includes('tomato') || name.includes('onion') || name.includes('kale') || name.includes('carrot') || name.includes('spinach') || name.includes('lettuce')) return 'vegetables';
  if (name.includes('avocado') || name.includes('lemon')) return 'fruits';
  if (name.includes('beef') || name.includes('chicken') || name.includes('fish')) return 'meat';
  if (name.includes('milk') || name.includes('cheese')) return 'dairy';
  if (name.includes('rice') || name.includes('flour') || name.includes('beans') || name.includes('lentil') || name.includes('chapati')) return 'grains';
  if (name.includes('spice') || name.includes('garlic') || name.includes('ginger') || name.includes('chili') || name.includes('coriander')) return 'spices';
  if (name.includes('coconut')) return 'condiments';
  if (name.includes('egg')) return 'dairy';
  return 'other';
}

function mapPantryLocation(itemName: string): string {
  const name = itemName.toLowerCase();
  if (name.includes('milk') || name.includes('avocado') || name.includes('spinach') || name.includes('lettuce')) return 'fridge';
  if (name.includes('beef') || name.includes('chicken') || name.includes('fish')) return 'freezer';
  if (name.includes('spice') || name.includes('garlic') || name.includes('ginger') || name.includes('chili') || name.includes('coriander')) return 'spice_rack';
  return 'pantry';
}

/**
 * Main migration function
 */
async function main() {
  console.log('🚀 Starting data migration to Supabase...\n');
  
  const results: MigrationResult[] = [];
  
  try {
    // Migrate basic recipes
    results.push(await migrateBasicRecipes());
    
    // Migrate community recipes
    results.push(await migrateCommunityRecipes());
    
    // Migrate challenges
    results.push(await migrateChallenges());
    
    // Migrate pantry data
    results.push(await migratePantryData());
    
    // Print summary
    console.log('\n📊 Migration Summary:');
    console.log('='.repeat(50));
    
    let totalRecords = 0;
    let totalSuccess = 0;
    let totalErrors = 0;
    
    for (const result of results) {
      console.log(`${result.table}:`);
      console.log(`  Total: ${result.total}`);
      console.log(`  Success: ${result.success}`);
      console.log(`  Errors: ${result.errors.length}`);
      
      if (result.errors.length > 0) {
        console.log(`  Error details:`, result.errors);
      }
      console.log('');
      
      totalRecords += result.total;
      totalSuccess += result.success;
      totalErrors += result.errors.length;
    }
    
    console.log(`📈 Overall Stats:`);
    console.log(`Total Records: ${totalRecords}`);
    console.log(`Successful: ${totalSuccess}`);
    console.log(`Failed: ${totalErrors}`);
    console.log(`Success Rate: ${((totalSuccess / totalRecords) * 100).toFixed(1)}%`);
    
    if (totalErrors > 0) {
      console.log('\n⚠️  Some records failed to migrate. Check the error details above.');
      process.exit(1);
    } else {
      console.log('\n🎉 Migration completed successfully!');
      console.log('\n🔧 Next steps:');
      console.log('1. Create a supervisor user account');
      console.log('2. Update challenge creator IDs with actual supervisor user ID');
      console.log('3. Test the app with the new database');
      console.log('4. Remove demo data files when ready');
    }
    
  } catch (error) {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  }
}

// Run migration if called directly
if (require.main === module) {
  main();
}

export { main as migrateData };