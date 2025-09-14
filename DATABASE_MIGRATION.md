# Royco Recipe App - Database Migration Guide

This guide will help you migrate from demo data to a production-ready Supabase database.

## 📋 Prerequisites

1. **Supabase Account**: Create an account at [supabase.com](https://supabase.com)
2. **Project Setup**: Create a new Supabase project
3. **Environment Variables**: Configure your environment
4. **Node.js**: Version 18+ with npm/yarn

## 🔧 Environment Setup

Create a `.env.local` file (or update your existing one):

```bash
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Optional: OpenAI API Key (for AI features)
EXPO_PUBLIC_OPENAI_API_KEY=your_openai_api_key
```

### Finding Your Supabase Keys

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Copy the following:
   - **Project URL** → `EXPO_PUBLIC_SUPABASE_URL`
   - **anon public key** → `EXPO_PUBLIC_SUPABASE_ANON_KEY`  
   - **service_role secret key** → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ **Keep this secret!**

## 🚀 Migration Steps

### Step 1: Install Dependencies

```bash
npm install @supabase/supabase-js
# or
yarn add @supabase/supabase-js
```

### Step 2: Add Package.json Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "db:test": "tsx scripts/test-database.ts",
    "db:migrate": "tsx scripts/migrate-demo-data.ts",
    "db:setup": "npm run db:test && npm run db:migrate"
  },
  "devDependencies": {
    "tsx": "^4.7.0"
  }
}
```

### Step 3: Test Database Connection

```bash
npm run db:test
```

This will:
- ✅ Verify all tables exist
- ✅ Check RLS policies are working
- ✅ Test basic CRUD operations
- ✅ Validate relationships

### Step 4: Run Data Migration

```bash
npm run db:migrate
```

This will migrate:
- 🍳 **Basic recipes** from `data/seed.ts`
- 🌟 **Community recipes** (TikTok viral recipes)
- 🏆 **Challenges** data
- 🥬 **Sample pantry items**

### Step 5: Create Your First Users

#### Option A: Via Supabase Dashboard
1. Go to **Authentication** → **Users** in your Supabase dashboard
2. Click **Add user**
3. Create a supervisor account with role `supervisor`
4. Create test user accounts with role `user`

#### Option B: Via Your App
1. Update your app's authentication flow
2. Sign up normally - users will be created with `user` role by default
3. Manually update supervisor accounts in the database

## 🗃️ Database Schema Overview

### Core Tables

| Table | Purpose | Key Features |
|-------|---------|--------------|
| `profiles` | User profiles & preferences | RLS enabled, auto-created on signup |
| `recipes` | Recipe data with ingredients & steps | Full-text search, ratings, social features |
| `pantry_items` | User pantry management | Expiration tracking, categorization |
| `challenges` | Community challenges | Supervisor-only creation, voting system |
| `meal_plans` | Weekly meal planning | Shopping list generation, cost tracking |

### Key Features Implemented

- ✅ **Row Level Security (RLS)** - Users can only access their own data
- ✅ **Automatic Triggers** - Update counters, timestamps, calculations
- ✅ **Foreign Key Constraints** - Data integrity and referential constraints
- ✅ **Full-text Search** - Search recipes by title, ingredients, cuisine
- ✅ **Social Features** - Following, favorites, ratings, comments
- ✅ **Analytics** - Track views, cooks, shares, user engagement

## 🔐 Authentication Setup

The database includes a trigger that automatically creates user profiles when new accounts are created via Supabase Auth.

### User Roles
- **`user`** (default): Regular app users
- **`supervisor`**: Can create/manage challenges, view analytics

### Default User Preferences
New users get these default preferences:
```json
{
  "diets": ["omnivore"],
  "allergies": [],
  "goals": ["general_health"],
  "unit_system": "metric",
  "language": "en",
  "theme": "auto",
  "household_size": 2,
  "weekly_budget_kes": 5000,
  "cooking_skill_level": "beginner",
  "meal_planning_enabled": true,
  "smart_suggestions_enabled": true,
  "cuisine_preferences": ["Kenyan", "International"],
  "spice_tolerance": "medium"
}
```

## 📱 Updating Your App Code

### 1. Update Supabase Client

Replace your demo data imports with Supabase queries:

```typescript
// Before (demo data)
import { recipes } from './data/seed';

// After (Supabase)
import { supabase } from './lib/supabase';

const { data: recipes } = await supabase
  .from('recipes')
  .select(`
    *,
    recipe_ingredients (*),
    recipe_steps (*)
  `)
  .eq('is_published', true);
```

### 2. Type Safety

Import the comprehensive types:

```typescript
import type { 
  Recipe, 
  UserProfile, 
  Challenge, 
  PantryItem,
  MealPlan 
} from './types/database';
```

### 3. Authentication Integration

```typescript
// Get current user profile
const { data: profile } = await supabase
  .from('profiles')
  .select('*')
  .eq('user_id', user.id)
  .single();

// Create user-specific queries
const { data: userRecipes } = await supabase
  .from('recipes')
  .select('*')
  .eq('author_id', user.id);
```

## 🧹 Cleanup Demo Data

After successful migration and testing, you can remove demo data files:

```bash
# ⚠️ Only do this after confirming everything works!
rm -rf data/seed.ts
rm -rf data/challenges.ts  
rm -rf data/community-recipes.ts
rm -rf data/recipes.ts
# Keep types.ts and enhanced-recipes.ts if still needed
```

## 🎯 Next Steps

1. **Test Your App**: Run your app and verify all features work with the new database
2. **Add Real Content**: Replace placeholder data with real recipes and challenges
3. **Setup Analytics**: Implement user activity tracking
4. **Performance Optimization**: Add indexes for commonly queried fields
5. **Backup Strategy**: Setup automated backups for your production data

## 🆘 Troubleshooting

### Common Issues

**RLS Policy Errors**: If you get permission denied errors, check:
- User is properly authenticated
- RLS policies match your query patterns
- Service role is used for admin operations

**Migration Fails**: Check:
- Environment variables are correct
- Database connection is working
- Table schemas match your data structure

**Performance Issues**: Consider:
- Adding database indexes for slow queries
- Implementing pagination for large datasets
- Using select filters to reduce data transfer

### Getting Help

1. Check the [Supabase Documentation](https://supabase.com/docs)
2. Review your database logs in the Supabase dashboard
3. Use the test script to isolate issues: `npm run db:test`

## 🎉 You're Done!

Your Royco Recipe app is now powered by a production-ready Supabase database with:

- 🔐 Secure authentication and authorization
- 📊 Rich relational data with proper constraints
- 🚀 Scalable architecture for growth
- 🔍 Full-text search and analytics
- 👥 Social features and community engagement
- 🍳 Complete recipe management system
- 🥬 Smart pantry and meal planning
- 🏆 Community challenges and gamification

Happy cooking! 🍳✨