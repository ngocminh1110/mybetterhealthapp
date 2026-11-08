export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export const MEAL_TYPES: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];

export interface Nutrients {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export type NutritionGoals = Nutrients;

export interface FoodProduct {
  code: string; 
  name: string;
  brand?: string;
  imageUrl?: string;
  per100g: Nutrients;
}

export interface MealEntry {
  id: string;
  date: string; 
  mealType: MealType;
  foodCode: string;
  foodName: string;
  brand?: string;
  grams: number; 
  nutrients: Nutrients; 
  createdAt: number;
}

export interface ReminderSettings {
  enabled: boolean;
  times: { hour: number; minute: number }[];
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  goals: NutritionGoals;
  reminders: ReminderSettings;
  createdAt: number;
}
