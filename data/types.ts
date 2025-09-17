// Legacy types preserved for backward compatibility
export type Diet = 'omnivore' | 'vegetarian' | 'vegan' | 'pescatarian' | 'halal' | 'kosher' | 'gluten_free' | 'lactose_free';
export type Goal = 'weight_loss' | 'muscle_gain' | 'heart_health' | 'diabetes_management' | 'general_health';

// Enhanced Nutrition Information
export interface Nutrition {
  calories?: number;
  carbs?: number;
  protein?: number;
  fat?: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  cholesterol?: number;
  saturatedFat?: number;
  transFat?: number;
}

// Enhanced Recipe Step
export interface RecipeStep {
  id?: string;
  title?: string;
  body: string;
  time?: number; // in minutes
  temperature?: {
    value: number;
    unit: 'C' | 'F';
  };
  tips?: string[];
  imageUrl?: string;
  videoUrl?: string;
  timerSeconds?: number; // For exact timer functionality
}

// Simplified Step for legacy compatibility
export interface Step extends RecipeStep {}

// Enhanced Ingredient
export interface Ingredient {
  id?: string;
  name: string;
  qty?: number | string; // Legacy support
  quantity?: number;
  unit?: string;
  note?: string;
  optional?: boolean;
  group?: string;
  substitutions?: string[];
}

// Recipe Details
export interface RecipeDetails {
  servings?: number;
  servingSize?: string;
  prepTime?: number;
  cookTime?: number;
  totalTime?: number;
  difficulty?: 'easy' | 'medium' | 'hard' | 'expert';
  cost?: 'budget' | 'moderate' | 'expensive';
  equipment?: string[];
  allergens?: string[];
  dietTags?: string[];
  cuisine?: string;
  course?: string[];
  occasion?: string[];
  season?: string[];
  rating?: number;
  ratingCount?: number;
  favoriteCount?: number;
  viewCount?: number;
}

// Enhanced Recipe
export interface Recipe {
  id: string;
  title: string;
  summary?: string;
  description?: string;
  
  // Images
  image?: string | number; // Legacy support
  images?: string[]; // Multiple images
  heroImage?: string;
  thumbnailImage?: string;
  
  // Core recipe data
  ingredients: Ingredient[];
  instructions?: string[]; // Legacy support
  steps?: RecipeStep[]; // Enhanced steps
  
  // Timing
  minutes?: number; // Legacy support
  prepTime?: number;
  cookTime?: number;
  totalTime?: number;
  
  // Metadata
  details?: RecipeDetails;
  nutrition?: Nutrition;
  
  // Legacy fields
  likes?: number;
  by?: string;
  servings?: number;
  difficulty?: string;
  cuisine?: string;
  course?: string;
  
  // Additional info
  notes?: string;
  tips?: string[];
  variations?: string[];
  pairings?: string[];
  
  // Source
  source?: string;
  sourceUrl?: string;
  author?: string;
  createdBy?: 'curated' | 'ai' | 'user' | 'community';
  createdAt?: string;
  updatedAt?: string;
  
  // Video and Social Media
  videoUrl?: string;
  socialMedia?: {
    platform: 'TikTok' | 'Instagram' | 'YouTube' | 'Facebook';
    handle: string;
    followers?: string;
    videoId?: string;
    embedUrl?: string;
  };
  
  // AI fields
  aiGenerated?: boolean;
  aiModel?: string;
  aiPrompt?: string;
  generated?: boolean; // Simplified flag for generated recipes
  
  // Tags
  tags?: string[];
  collections?: string[];
  
  // User interaction
  userRating?: number;
  isFavorite?: boolean;
  hasCooked?: boolean;
  cookCount?: number;
  
  // For display
  time?: string; // "30 min" format
}

// Enhanced User Preferences
export interface UserPrefs {
  diets?: Diet[];
  allergies?: string[];
  goals?: Goal[];
  unitSystem?: string;
  householdSize?: number;
  weeklyBudgetKES?: number;
  
  // New preferences
  cuisinePreferences?: string[];
  cookingSkillLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  kitchenEquipment?: string[];
  mealPlanningEnabled?: boolean;
  smartSuggestionsEnabled?: boolean;
  nutritionTrackingEnabled?: boolean;
}

// Product (preserved)
export interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
  category?: string;
  brand?: string;
  barcode?: string;
  imageUrl?: string;
}

// Enhanced Pantry Item
export interface PantryItem {
  id: string;
  productId?: string; // Legacy support
  name?: string; // Direct name support
  title?: string; // Alternative name field
  quantity?: number;
  qty?: number | string; // Legacy support
  unit?: string;
  expiryDate?: string;
  expiresOn?: string; // Alternative expiry field
  addedDate?: string;
  location?: 'fridge' | 'freezer' | 'pantry' | 'spice-rack';
  notes?: string;
  category?: string;
  imageUrl?: string;
  isLowStock?: boolean;
  isPinned?: boolean;
}

// AI Types
export interface RecipeGenerationRequest {
  ingredients: string[];
  preferences?: {
    cuisine?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
    dietaryRestrictions?: string[];
    servings?: number;
    maxCookTime?: number;
    equipment?: string[];
  };
  style?: 'traditional' | 'fusion' | 'modern' | 'comfort';
  generateImages?: boolean;
  imageCount?: number;
}

export interface RecipeGenerationResponse {
  recipe: Recipe;
  generationTime: number;
  cost?: number;
  debug?: any;
  success: boolean;
  error?: string;
  source?: string;
}

// Vision Analysis
export interface DetectedIngredient {
  name: string;
  confidence: number;
  quantity?: {
    value: number;
    unit: string;
    estimated: boolean;
  };
  category?: string;
  freshness?: 'fresh' | 'good' | 'use-soon' | 'expired';
}

export interface IngredientDetectionResponse {
  ingredients: DetectedIngredient[];
  suggestions?: string[];
  warnings?: string[];
  imageQuality?: 'excellent' | 'good' | 'fair' | 'poor';
  processingTime: number;
}

// Meal Planning (preserved with enhancements)
export interface Meal {
  id: string;
  name: string;
  recipeId?: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  
  // New fields
  servings?: number;
  notes?: string;
  preparedAt?: string;
  rating?: number;
}

export interface Day {
  date: string;
  meals: Meal[];
  
  // New fields
  notes?: string;
  totalCalories?: number;
  totalCost?: number;
}

export interface MealPlan {
  id: string;
  name: string;
  days: Day[];
  
  // New fields
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  shoppingListGenerated?: boolean;
  isActive?: boolean;
  tags?: string[];
}
