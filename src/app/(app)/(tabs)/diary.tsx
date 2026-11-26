import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { DateNavigator } from '@/components/DateNavigator';
import { EditMealModal } from '@/components/EditMealModal';
import { MealEntryRow } from '@/components/MealEntryRow';
import { AppText, Button, Card, EmptyState, ErrorView, LoadingView, Screen } from '@/components/ui';
import { MEAL_LABELS } from '@/constants/defaults';
import { useMeals } from '@/hooks/useMeals';
import { useAuth } from '@/providers/AuthProvider';
import { deleteMeal, updateMealAmount } from '@/services/mealService';
import { colors, spacing } from '@/theme';
import { MEAL_TYPES, type MealEntry } from '@/types/models';
import { todayKey } from '@/utils/date';
import { groupMealsByType } from '@/utils/meals';
import { sumNutrients } from '@/utils/nutrition';

export default function DiaryScreen() {
  const { user } = useAuth();
  const [date, setDate] = useState(todayKey());
  const [editing, setEditing] = useState<MealEntry | null>(null); // meal shown in the pop-up
  const { status, meals, error } = useMeals(date, date); // one day

  const groups = groupMealsByType(meals);
  const total = sumNutrients(meals.map((m) => m.nutrients));

  const renderContent = () => {
    if (status === 'loading') return <LoadingView message="Loading your diary..." />;
    if (status === 'error') return <ErrorView message={error ?? 'Something went wrong.'} />;
    if (meals.length === 0) {
      return (
        <EmptyState
          icon="book-outline"
          title="No meals logged"
          message="Search for a food and add it to your diary."
          actionTitle="Add food"
          onAction={() => router.navigate('/search')}
        />
      );
    }

    return (
      <>
        { }
        <Card style={styles.card}>
          <AppText variant="caption" muted>
            Total
          </AppText>
          <AppText variant="title" color={colors.secondary}>
            {total.calories} kcal
          </AppText>
          <AppText variant="caption" muted>
            Protein {total.protein} g · Carbs {total.carbs} g · Fat {total.fat} g
          </AppText>
        </Card>

        { }
        {MEAL_TYPES.filter((type) => groups[type].length > 0).map((type) => {
          const mealCalories = sumNutrients(groups[type].map((m) => m.nutrients)).calories;
          return (
            <Card key={type} style={styles.card}>
              <View style={styles.mealHeader}>
                <AppText variant="subtitle">{MEAL_LABELS[type]}</AppText>
                <AppText muted>{mealCalories} kcal</AppText>
              </View>
              {groups[type].map((meal) => (
                <MealEntryRow key={meal.id} meal={meal} onPress={() => setEditing(meal)} />
              ))}
            </Card>
          );
        })}

        <Button
          title="Add food"
          variant="secondary"
          onPress={() => router.navigate('/search')}
          style={styles.card}
        />
      </>
    );
  };

  return (
    <Screen scroll edges={[]}>
      <DateNavigator date={date} onChange={setDate} />
      <View style={styles.content}>{renderContent()}</View>

      {/* Edit pop-up. key={id} gives a fresh form for every meal. */}
      {editing && user ? (
        <EditMealModal
          key={editing.id}
          meal={editing}
          onClose={() => setEditing(null)}
          onSave={(grams) => updateMealAmount(user.uid, editing, grams)}
          onDelete={() => deleteMeal(user.uid, editing.id)}
        />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1 },
  card: { marginTop: spacing.md },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: spacing.xs,
  },
});