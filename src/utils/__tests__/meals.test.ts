import type { FoodProduct, MealEntry } from '@/types/models';
import { buildMealEntry, changeMealAmount, groupMealsByType, suggestMealType } from '../meals';

const oatDrink: FoodProduct = {
    code: '6408430000012',
    name: 'Oat drink',
    brand: 'Oatly',
    per100g: { calories: 46, protein: 1, carbs: 6.6, fat: 1.5 },
};

function meal(partial: Partial<MealEntry>): MealEntry {
    return {
        id: 'id',
        date: '2026-11-23',
        mealType: 'breakfast',
        foodCode: '1',
        foodName: 'Food',
        grams: 100,
        per100g: { calories: 100, protein: 0, carbs: 0, fat: 0 },
        nutrients: { calories: 100, protein: 0, carbs: 0, fat: 0 },
        createdAt: 0,
        ...partial,
    };
}

describe('buildMealEntry', () => {
    it('calculates nutrients for the amount in grams', () => {
        const entry = buildMealEntry(oatDrink, 250, 'breakfast', '2026-11-23', 1000);

        expect(entry).toEqual({
            date: '2026-11-23',
            mealType: 'breakfast',
            foodCode: '6408430000012',
            foodName: 'Oat drink',
            brand: 'Oatly',
            grams: 250,
            per100g: oatDrink.per100g,
            nutrients: { calories: 115, protein: 2.5, carbs: 16.5, fat: 3.8 },
            createdAt: 1000,
        });
    });

    it('does not add an undefined brand (Firestore does not accept undefined)', () => {
        const entry = buildMealEntry({ ...oatDrink, brand: undefined }, 100, 'snack', '2026-11-23');
        expect('brand' in entry).toBe(false);
    });
});

describe('changeMealAmount', () => {
    it('recalculates nutrients for the new amount', () => {
        expect(changeMealAmount({ per100g: oatDrink.per100g }, 50)).toEqual({
            grams: 50,
            nutrients: { calories: 23, protein: 0.5, carbs: 3.3, fat: 0.8 },
        });
    });
});

describe('groupMealsByType', () => {
    it('puts every entry in its meal group, oldest first', () => {
        const groups = groupMealsByType([
            meal({ id: 'b', mealType: 'lunch', createdAt: 20 }),
            meal({ id: 'a', mealType: 'lunch', createdAt: 10 }),
            meal({ id: 'c', mealType: 'snack', createdAt: 5 }),
        ]);

        expect(groups.lunch.map((m) => m.id)).toEqual(['a', 'b']);
        expect(groups.snack.map((m) => m.id)).toEqual(['c']);
        expect(groups.breakfast).toEqual([]);
        expect(groups.dinner).toEqual([]);
    });
});

describe('suggestMealType', () => {
    it('suggests a meal type from the time of day', () => {
        expect(suggestMealType(8)).toBe('breakfast');
        expect(suggestMealType(12)).toBe('lunch');
        expect(suggestMealType(18)).toBe('dinner');
        expect(suggestMealType(22)).toBe('snack');
    });
});