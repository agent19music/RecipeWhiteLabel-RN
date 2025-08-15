export type Diet = 'omnivore' | 'vegetarian' | 'vegan' | 'pescatarian' | 'halal' | 'kosher' | 'gluten_free' | 'lactose_free';

export type Goal = 'weight_loss' | 'muscle_gain' | 'heart_health' | 'diabetes_management' | 'general_health';

export interface UserPrefs {
  diets?: Diet[];
  allergies?: string[];
  goals?: Goal[];
  unitSystem?: string;
  householdSize?: number;
  weeklyBudgetKES?: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
  category?: string;
}

export interface PantryItem {
  id: string;
  productId: string;
  quantity: number;
  expiryDate?: string;
}

export interface Ingredient {
  name: string;
  qty?: number | string;
  unit?: string;
}

export interface Recipe {
  id: string;
  title: string;
  minutes: number;
  ingredients: Ingredient[];
  likes?: number;
  by?: string;
}

export interface Meal {
  id: string;
  name: string;
  recipeId?: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

export interface Day {
  date: string;
  meals: Meal[];
}

export interface MealPlan {
  id: string;
  name: string;
  days: Day[];
}
