import { MEAL_TYPES, type FoodProduct, type MealEntry, type MealType } from '@/types/models';
import { scaleNutrients } from '@/utils/nutrition';

export type NewMealEntry = Omit<MealEntry, 'id'>;

/**
 * Creates a meal entry from a product and an amount in grams.
 * Example: 150 g of a product with 100 kcal / 100 g -> 150 kcal.
 */
export function buildMealEntry(
    product: FoodProduct,
    grams: number,
    mealType: MealType,
    date: string,
    now: number = Date.now(),
): NewMealEntry {
    const entry: NewMealEntry = {
        date,
        mealType,
        foodCode: product.code,
        foodName: product.name,
        grams,
        per100g: product.per100g,
        nutrients: scaleNutrients(product.per100g, grams),
        createdAt: now,
    };
    if (product.brand) entry.brand = product.brand;
    return entry;
}

export function changeMealAmount(meal: Pick<MealEntry, 'per100g'>, grams: number) {
    return { grams, nutrients: scaleNutrients(meal.per100g, grams) };
}

export function groupMealsByType(meals: MealEntry[]): Record<MealType, MealEntry[]> {
    const groups = Object.fromEntries(MEAL_TYPES.map((type) => [type, []])) as unknown as Record<
        MealType,
        MealEntry[]
    >;
    [...meals]
        .sort((a, b) => a.createdAt - b.createdAt)
        .forEach((meal) => groups[meal.mealType]?.push(meal));
    return groups;
}

/** Suggests a meal type from the time of day. */
export function suggestMealType(hour: number = new Date().getHours()): MealType {
    if (hour < 11) return 'breakfast';
    if (hour < 15) return 'lunch';
    if (hour < 21) return 'dinner';
    return 'snack';
}