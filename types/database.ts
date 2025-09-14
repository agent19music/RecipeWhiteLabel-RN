// ==============================================
// ROYCO RECIPE APP - COMPREHENSIVE TYPE DEFINITIONS
// ==============================================

// ==============================================
// AUTHENTICATION & USER MANAGEMENT
// ==============================================

export type UserRole = 'supervisor' | 'user';

export interface UserProfile {
  id: string;
  user_id: string; // References auth.users
  email: string;
  full_name: string;
  avatar_url?: string;
  role: UserRole;
  bio?: string;
  location?: string;
  phone?: string;
  preferences: UserPreferences;
  created_at: string;
  updated_at: string;
  last_seen_at?: string;
  is_active: boolean;
  
  // Social features
  followers_count?: number;
  following_count?: number;
  recipes_count?: number;
  total_likes_received?: number;
}

export interface UserPreferences {
  // Dietary preferences
  diets: Diet[];
  allergies: string[];
  goals: Goal[];
  
  // System preferences
  unit_system: 'metric' | 'imperial';
  language: 'en' | 'sw';
  theme: 'light' | 'dark' | 'auto';
  
  // Kitchen setup
  household_size: number;
  weekly_budget_kes: number;
  cooking_skill_level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  kitchen_equipment: string[];
  
  // Feature preferences
  meal_planning_enabled: boolean;
  smart_suggestions_enabled: boolean;
  nutrition_tracking_enabled: boolean;
  notifications_enabled: boolean;
  
  // Cuisine preferences
  cuisine_preferences: string[];
  spice_tolerance: 'mild' | 'medium' | 'spicy' | 'very_spicy';
}

export type Diet = 'omnivore' | 'vegetarian' | 'vegan' | 'pescatarian' | 'halal' | 'kosher' | 'gluten_free' | 'lactose_free';
export type Goal = 'weight_loss' | 'muscle_gain' | 'heart_health' | 'diabetes_management' | 'general_health';

// ==============================================
// RECIPE SYSTEM
// ==============================================

export interface Recipe {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  description?: string;
  
  // Images
  hero_image?: string;
  thumbnail_image?: string;
  additional_images?: string[];
  
  // Core recipe data
  ingredients: RecipeIngredient[];
  instructions: RecipeStep[];
  
  // Timing & difficulty
  prep_time_minutes?: number;
  cook_time_minutes?: number;
  total_time_minutes: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  
  // Serving & nutrition
  servings: number;
  serving_size?: string;
  nutrition?: NutritionInfo;
  estimated_cost_kes?: number;
  
  // Classification
  cuisine: string;
  course: string[];
  meal_type: string[]; // breakfast, lunch, dinner, snack
  occasion?: string[]; // casual, special, celebration
  dietary_tags: string[];
  
  // Recipe metadata  
  author_id?: string; // null for curated recipes
  source?: 'curated' | 'ai' | 'user' | 'community';
  source_url?: string;
  original_author?: string;
  
  // Social media integration (for viral TikTok recipes)
  social_media?: SocialMediaInfo;
  video_url?: string;
  
  // AI generation info
  ai_generated: boolean;
  ai_model?: string;
  ai_prompt?: string;
  
  // Engagement metrics
  rating_average: number;
  rating_count: number;
  favorite_count: number;
  view_count: number;
  cook_count: number;
  share_count: number;
  
  // Status & visibility
  is_published: boolean;
  is_featured: boolean;
  is_trending: boolean;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  published_at?: string;
  
  // Equipment needed
  equipment?: string[];
  
  // Additional info
  tips?: string[];
  variations?: string[];
  storage_instructions?: string;
  allergens?: string[];
}

export interface RecipeIngredient {
  id: string;
  recipe_id: string;
  name: string;
  quantity?: number;
  unit?: string;
  notes?: string;
  is_optional: boolean;
  ingredient_group?: string; // for organizing ingredients (e.g., "For marinade")
  substitutions?: string[];
  order_index: number;
}

export interface RecipeStep {
  id: string;
  recipe_id: string;
  step_number: number;
  title?: string;
  instruction: string;
  time_minutes?: number;
  temperature?: TemperatureInfo;
  image_url?: string;
  video_url?: string;
  tips?: string[];
  timer_seconds?: number;
}

export interface TemperatureInfo {
  value: number;
  unit: 'C' | 'F';
}

export interface NutritionInfo {
  calories?: number;
  protein_g?: number;
  carbs_g?: number;
  fat_g?: number;
  fiber_g?: number;
  sugar_g?: number;
  sodium_mg?: number;
  cholesterol_mg?: number;
  saturated_fat_g?: number;
  trans_fat_g?: number;
  vitamin_a_mcg?: number;
  vitamin_c_mg?: number;
  calcium_mg?: number;
  iron_mg?: number;
}

export interface SocialMediaInfo {
  platform: 'TikTok' | 'Instagram' | 'YouTube' | 'Facebook';
  handle: string;
  followers?: string;
  video_id?: string;
  embed_url?: string;
}

// Recipe interactions
export interface RecipeRating {
  id: string;
  recipe_id: string;
  user_id: string;
  rating: number; // 1-5 stars
  review?: string;
  helpful_count: number;
  created_at: string;
  updated_at: string;
}

export interface RecipeFavorite {
  id: string;
  recipe_id: string;
  user_id: string;
  created_at: string;
}

export interface RecipeCookLog {
  id: string;
  recipe_id: string;
  user_id: string;
  rating?: number;
  notes?: string;
  modifications?: string[];
  cooking_time_actual_minutes?: number;
  would_make_again: boolean;
  photos?: string[];
  created_at: string;
}

// Recipe collections
export interface RecipeCollection {
  id: string;
  name: string;
  description?: string;
  user_id: string;
  is_public: boolean;
  cover_image?: string;
  recipe_count: number;
  created_at: string;
  updated_at: string;
}

export interface RecipeCollectionItem {
  id: string;
  collection_id: string;
  recipe_id: string;
  order_index: number;
  added_at: string;
}

// ==============================================
// PANTRY MANAGEMENT
// ==============================================

export interface PantryItem {
  id: string;
  user_id: string;
  name: string;
  quantity: number;
  unit: string;
  category: PantryCategory;
  location: PantryLocation;
  
  // Expiration tracking
  expiry_date?: string;
  days_until_expiry?: number;
  is_expired: boolean;
  
  // Purchase info
  purchase_date?: string;
  cost_kes?: number;
  store?: string;
  brand?: string;
  barcode?: string;
  
  // Storage
  notes?: string;
  image_url?: string;
  is_low_stock: boolean;
  is_pinned: boolean;
  minimum_quantity?: number;
  
  created_at: string;
  updated_at: string;
}

export type PantryCategory = 
  | 'vegetables' 
  | 'fruits' 
  | 'meat' 
  | 'dairy' 
  | 'grains' 
  | 'spices' 
  | 'condiments' 
  | 'beverages' 
  | 'snacks' 
  | 'frozen' 
  | 'canned' 
  | 'other';

export type PantryLocation = 
  | 'fridge' 
  | 'freezer' 
  | 'pantry' 
  | 'spice_rack' 
  | 'counter' 
  | 'cabinet';

// Shopping list integration
export interface ShoppingList {
  id: string;
  user_id: string;
  name: string;
  is_active: boolean;
  estimated_cost_kes?: number;
  store?: string;
  shopping_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ShoppingListItem {
  id: string;
  shopping_list_id: string;
  name: string;
  quantity: number;
  unit: string;
  category: PantryCategory;
  estimated_cost_kes?: number;
  is_purchased: boolean;
  actual_cost_kes?: number;
  notes?: string;
  recipe_id?: string; // if item is for a specific recipe
  order_index: number;
  created_at: string;
}

// ==============================================
// COMMUNITY & CHALLENGES
// ==============================================

export interface Challenge {
  id: string;
  title: string;
  description: string;
  rules?: string[];
  judges_criteria?: string[];
  
  // Timing
  start_date: string;
  end_date: string;
  submission_deadline: string;
  winner_announcement_date?: string;
  
  // Challenge details
  status: 'upcoming' | 'active' | 'judging' | 'completed';
  theme_color?: string;
  background_color?: string;
  cover_image?: string;
  tags: string[];
  
  // Prizes
  prize_description: string;
  total_prize_value_kes?: number;
  
  // Stats
  participants_count: number;
  submissions_count: number;
  
  // Organization
  created_by_user_id: string; // supervisor who created it
  
  created_at: string;
  updated_at: string;
}

export interface ChallengeSubmission {
  id: string;
  challenge_id: string;
  user_id: string;
  
  // Submission content
  title: string;
  description: string;
  recipe_id?: string; // link to actual recipe if applicable
  images: string[];
  video_url?: string;
  
  // Recipe details (if not linked to recipe table)
  ingredients?: string[];
  cooking_time_minutes?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  
  // Engagement
  votes_count: number;
  comments_count: number;
  
  // Status
  status: 'pending' | 'approved' | 'rejected';
  is_winner: boolean;
  is_featured: boolean;
  
  // Location
  location?: string;
  
  created_at: string;
  updated_at: string;
}

export interface ChallengeVote {
  id: string;
  submission_id: string;
  user_id: string;
  created_at: string;
}

export interface ChallengeComment {
  id: string;
  submission_id: string;
  user_id: string;
  content: string;
  likes_count: number;
  created_at: string;
  updated_at: string;
}

export interface ChallengeCommentLike {
  id: string;
  comment_id: string;
  user_id: string;
  created_at: string;
}

// ==============================================
// MEAL PLANNING
// ==============================================

export interface MealPlan {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  
  // Week info
  start_date: string; // YYYY-MM-DD format
  end_date: string;
  week_of_year: number;
  year: number;
  
  // Planning details
  estimated_cost_kes: number;
  actual_cost_kes?: number;
  estimated_calories_per_day: number;
  
  // Status
  is_active: boolean;
  is_template: boolean;
  shopping_list_generated: boolean;
  
  // Sharing
  is_public: boolean;
  shared_with_family: boolean;
  
  created_at: string;
  updated_at: string;
}

export interface MealPlanDay {
  id: string;
  meal_plan_id: string;
  date: string; // YYYY-MM-DD
  day_of_week: number; // 0-6 (Sunday = 0)
  notes?: string;
  estimated_cost_kes: number;
  actual_cost_kes?: number;
  total_calories: number;
  created_at: string;
}

export interface MealPlanMeal {
  id: string;
  meal_plan_day_id: string;
  recipe_id?: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  meal_name?: string; // for custom meals not from recipes
  servings: number;
  notes?: string;
  estimated_cost_kes?: number;
  actual_cost_kes?: number;
  calories?: number;
  is_prepared: boolean;
  prepared_at?: string;
  rating?: number; // how much they liked it
  order_index: number;
  created_at: string;
}

// ==============================================
// AI & SMART FEATURES
// ==============================================

export interface RecipeGenerationRequest {
  id: string;
  user_id: string;
  
  // Input parameters
  detected_ingredients: string[];
  additional_ingredients?: string[];
  cuisine_preference?: string;
  difficulty_preference?: 'easy' | 'medium' | 'hard';
  dietary_restrictions: string[];
  max_cooking_time_minutes?: number;
  servings: number;
  equipment_available: string[];
  style_preference?: 'traditional' | 'fusion' | 'modern' | 'comfort';
  
  // Generation settings
  generate_images: boolean;
  image_count: number;
  
  // Results
  generated_recipe_id?: string;
  generation_time_seconds?: number;
  ai_model_used?: string;
  cost_kes?: number;
  
  // Status
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error_message?: string;
  
  created_at: string;
  updated_at: string;
}

export interface IngredientDetection {
  id: string;
  user_id: string;
  image_url: string;
  
  // Detection results
  detected_ingredients: DetectedIngredient[];
  image_quality: 'excellent' | 'good' | 'fair' | 'poor';
  processing_time_seconds: number;
  suggestions?: string[];
  warnings?: string[];
  
  // AI model info
  ai_model_used: string;
  confidence_threshold: number;
  
  created_at: string;
}

export interface DetectedIngredient {
  name: string;
  confidence: number;
  quantity?: {
    value: number;
    unit: string;
    estimated: boolean;
  };
  category?: string;
  freshness?: 'fresh' | 'good' | 'use_soon' | 'expired';
  bounding_box?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

// ==============================================
// SOCIAL FEATURES
// ==============================================

export interface UserFollow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

export interface RecipeShare {
  id: string;
  recipe_id: string;
  user_id: string;
  platform: 'whatsapp' | 'facebook' | 'twitter' | 'instagram' | 'copy_link' | 'email';
  created_at: string;
}

export interface UserActivity {
  id: string;
  user_id: string;
  activity_type: 'recipe_created' | 'recipe_cooked' | 'recipe_rated' | 'challenge_entered' | 'followed_user';
  related_recipe_id?: string;
  related_user_id?: string;
  related_challenge_id?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

// ==============================================
// ANALYTICS & INSIGHTS
// ==============================================

export interface UserStats {
  user_id: string;
  total_recipes_created: number;
  total_recipes_cooked: number;
  total_favorites: number;
  total_followers: number;
  total_following: number;
  average_recipe_rating: number;
  total_cooking_time_minutes: number;
  favorite_cuisine: string;
  cooking_streak_days: number;
  last_cooking_date?: string;
  total_money_saved_kes: number;
  calculated_at: string;
}

export interface RecipeAnalytics {
  recipe_id: string;
  views_total: number;
  views_this_week: number;
  views_this_month: number;
  favorites_total: number;
  favorites_this_week: number;
  cooks_total: number;
  cooks_this_week: number;
  average_rating: number;
  rating_distribution: Record<string, number>; // {"1": 2, "2": 5, "3": 15, "4": 45, "5": 78}
  most_active_regions: string[];
  peak_viewing_hours: number[];
  calculated_at: string;
}

// ==============================================
// SYSTEM & CONFIGURATION
// ==============================================

export interface AppSettings {
  id: string;
  setting_key: string;
  setting_value: string | number | boolean;
  description?: string;
  is_public: boolean;
  updated_by_user_id: string;
  updated_at: string;
}

// Common utility types
export type ApiResponse<T> = {
  data: T;
  error?: string;
  message?: string;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
};

export type PaginationParams = {
  page: number;
  limit: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
};

export type FilterParams = {
  search?: string;
  cuisine?: string[];
  difficulty?: string[];
  meal_type?: string[];
  dietary_tags?: string[];
  max_time?: number;
  max_cost?: number;
};

// ==============================================
// DATABASE QUERY TYPES
// ==============================================

// For complex joins and aggregated data
export interface RecipeWithAuthor extends Recipe {
  author?: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
}

export interface RecipeWithInteractions extends Recipe {
  user_rating?: number;
  user_has_favorited: boolean;
  user_has_cooked: boolean;
  user_cook_count: number;
}

export interface MealPlanWithMeals extends MealPlan {
  days: (MealPlanDay & {
    meals: (MealPlanMeal & {
      recipe?: Recipe;
    })[];
  })[];
}

export interface ChallengeWithSubmissions extends Challenge {
  submissions: (ChallengeSubmission & {
    user: {
      id: string;
      full_name: string;
      avatar_url?: string;
    };
  })[];
  user_has_submitted: boolean;
  user_submission?: ChallengeSubmission;
}