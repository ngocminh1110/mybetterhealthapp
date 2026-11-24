import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    updateDoc,
    where,
    type DocumentData,
    type QueryDocumentSnapshot,
    type Unsubscribe,
} from 'firebase/firestore';

import { db } from '@/services/firebase';
import type { MealEntry } from '@/types/models';
import { changeMealAmount, type NewMealEntry } from '@/utils/meals';

/** The "meals" collection of one user. */
function mealsCollection(uid: string) {
    return collection(db, 'users', uid, 'meals');
}

function toMealEntry(snapshot: QueryDocumentSnapshot<DocumentData>): MealEntry {
    return { id: snapshot.id, ...(snapshot.data() as Omit<MealEntry, 'id'>) };
}

/** Saves a new meal entry. Returns the new id. */
export async function addMeal(uid: string, entry: NewMealEntry): Promise<string> {
    const ref = await addDoc(mealsCollection(uid), entry);
    return ref.id;
}

/** Changes the amount (grams) of a meal entry and recalculates its nutrients. */
export async function updateMealAmount(uid: string, meal: MealEntry, grams: number): Promise<void> {
    await updateDoc(doc(db, 'users', uid, 'meals', meal.id), changeMealAmount(meal, grams));
}

/** Deletes a meal entry. */
export async function deleteMeal(uid: string, mealId: string): Promise<void> {
    await deleteDoc(doc(db, 'users', uid, 'meals', mealId));
}

/**
 * `onChange` runs now and again every time the data changes (real-time updates), so the screens update by themselves after add / edit / delete.
 */
export function subscribeToMeals(
    uid: string,
    startDate: string,
    endDate: string,
    onChange: (meals: MealEntry[]) => void,
    onError: (error: Error) => void,
): Unsubscribe {
    const q = query(
        mealsCollection(uid),
        where('date', '>=', startDate),
        where('date', '<=', endDate),
    );
    return onSnapshot(
        q,
        (snapshot) => onChange(snapshot.docs.map(toMealEntry)),
        (error) => onError(error),
    );
}