import type { MealType, NutritionGoals, ReminderSettings } from '@/types/models';

export const DEFAULT_GOALS: NutritionGoals = {
  calories: 2000,
  protein: 100,
  carbs: 250,
  fat: 70,
};

export const DEFAULT_REMINDERS: ReminderSettings = {
  enabled: false,
  times: [
    { hour: 8, minute: 0 },
    { hour: 12, minute: 0 },
    { hour: 18, minute: 0 },
  ],
};

export const MEAL_LABELS: Record<MealType, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snacks',
};
