import { useEffect, useState } from 'react';

import { useAuth } from '@/providers/AuthProvider';
import { subscribeToMeals } from '@/services/mealService';
import type { MealEntry } from '@/types/models';

export type MealsStatus = 'loading' | 'success' | 'error';

interface MealsResult {
    key: string;
    meals: MealEntry[];
    error?: string;
}

/**
 * Real-time list of the logged-in user's meals between two days (YYYY-MM-DD).
 * The list updates by itself when a meal is added, edited or deleted.
 */
export function useMeals(startDate: string, endDate: string) {
    const { user } = useAuth();
    const uid = user?.uid;
    const [result, setResult] = useState<MealsResult | null>(null);

    const requestKey = `${uid}:${startDate}:${endDate}`;

    useEffect(() => {
        if (!uid) return;

        const unsubscribe = subscribeToMeals(
            uid,
            startDate,
            endDate,
            (meals) => setResult({ key: requestKey, meals }),
            () =>
                setResult({
                    key: requestKey,
                    meals: [],
                    error: 'Could not load your meals. Please check your internet connection.',
                }),
        );

        // Stop listening when the screen closes or the dates change
        return unsubscribe;
    }, [uid, startDate, endDate, requestKey]);

    const isCurrent = result?.key === requestKey;
    const status: MealsStatus = !isCurrent ? 'loading' : result.error ? 'error' : 'success';

    return {
        status,
        meals: isCurrent ? result.meals : [],
        error: isCurrent ? result.error : undefined,
    };
}