import type { Nutrients } from '@/types/models';

export const EMPTY_NUTRIENTS: Nutrients = { calories: 0, protein: 0, carbs: 0, fat: 0 };

/** Round to 1 decimal place (e.g. 12.345 -> 12.3). */
export function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

export function scaleNutrients(per100g: Nutrients, grams: number): Nutrients {
  const factor = grams / 100;
  return {
    calories: Math.round(per100g.calories * factor),
    protein: round1(per100g.protein * factor),
    carbs: round1(per100g.carbs * factor),
    fat: round1(per100g.fat * factor),
  };
}

/** Add up the nutrients of many items (e.g. all entries of one day). */
export function sumNutrients(items: Nutrients[]): Nutrients {
  const total = items.reduce<Nutrients>(
    (acc, n) => ({
      calories: acc.calories + n.calories,
      protein: acc.protein + n.protein,
      carbs: acc.carbs + n.carbs,
      fat: acc.fat + n.fat,
    }),
    EMPTY_NUTRIENTS,
  );
  return {
    calories: Math.round(total.calories),
    protein: round1(total.protein),
    carbs: round1(total.carbs),
    fat: round1(total.fat),
  };
}

/** Progress from 0 to 1 for a progress bar. Never below 0 or above 1. */
export function progress(value: number, goal: number): number {
  if (goal <= 0) return 0;
  return Math.min(Math.max(value / goal, 0), 1);
}
