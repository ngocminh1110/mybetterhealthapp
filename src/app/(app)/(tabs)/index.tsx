import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, Button, Card, ErrorView, LoadingView, ProgressBar, Screen } from '@/components/ui';
import { DEFAULT_GOALS, MEAL_LABELS } from '@/constants/defaults';
import { useMeals } from '@/hooks/useMeals';
import { useAuth } from '@/providers/AuthProvider';
import { colors, spacing } from '@/theme';
import { MEAL_TYPES } from '@/types/models';
import { todayKey } from '@/utils/date';
import { groupMealsByType } from '@/utils/meals';
import { progress, sumNutrients } from '@/utils/nutrition';

export default function DashboardScreen() {
  const { user } = useAuth();
  const today = todayKey();
  const { status, meals, error } = useMeals(today, today);

  if (status === 'loading') return <LoadingView message="Loading today..." />;
  if (status === 'error') return <ErrorView message={error ?? 'Something went wrong.'} />;

  // Totals for today
  const totals = sumNutrients(meals.map((m) => m.nutrients));
  const goals = DEFAULT_GOALS;
  const remaining = goals.calories - totals.calories;
  const isOverGoal = remaining < 0;

  // Calories per meal (breakfast, lunch, ...)
  const groups = groupMealsByType(meals);

  const macros = [
    { label: 'Protein', value: totals.protein, goal: goals.protein, color: colors.protein },
    { label: 'Carbs', value: totals.carbs, goal: goals.carbs, color: colors.carbs },
    { label: 'Fat', value: totals.fat, goal: goals.fat, color: colors.fat },
  ];

  return (
    <Screen scroll edges={[]}>
      <AppText muted>Hello{user?.displayName ? `, ${user.displayName}` : ''} 👋</AppText>

      {/* Calories: big number, progress bar, kcal left (or over the goal) */}
      <Card style={styles.card}>
        <AppText variant="subtitle">Calories</AppText>
        <View style={styles.calorieRow}>
          <AppText variant="display" color={isOverGoal ? colors.danger : colors.secondary}>
            {totals.calories}
          </AppText>
          <AppText muted> / {goals.calories} kcal</AppText>
        </View>
        <ProgressBar
          value={progress(totals.calories, goals.calories)}
          color={isOverGoal ? colors.danger : colors.secondary}
          height={12}
        />
        <AppText variant="caption" color={isOverGoal ? colors.danger : colors.textMuted} style={styles.remaining}>
          {isOverGoal ? `${-remaining} kcal over your goal` : `${remaining} kcal left`}
        </AppText>
      </Card>

      {/* Protein, carbs and fat with their own progress bars */}
      <Card style={styles.card}>
        <AppText variant="subtitle" style={styles.cardTitle}>
          Macronutrients
        </AppText>
        {macros.map((m) => (
          <View key={m.label} style={styles.macro}>
            <View style={styles.macroHeader}>
              <AppText bold>{m.label}</AppText>
              <AppText muted>
                {m.value} / {m.goal} g
              </AppText>
            </View>
            <ProgressBar value={progress(m.value, m.goal)} color={m.color} />
          </View>
        ))}
      </Card>

      {/* Short summary of each meal. Tapping it opens the diary. */}
      <Card style={styles.card}>
        <AppText variant="subtitle" style={styles.cardTitle}>
          Today&apos;s meals
        </AppText>
        {MEAL_TYPES.map((type) => {
          const count = groups[type].length;
          const kcal = sumNutrients(groups[type].map((m) => m.nutrients)).calories;
          return (
            <Pressable
              key={type}
              onPress={() => router.navigate('/diary')}
              accessibilityRole="button"
              accessibilityLabel={`${MEAL_LABELS[type]}: ${count} foods, ${kcal} kcal. Open diary.`}
              style={({ pressed }) => [styles.mealRow, pressed && styles.pressed]}>
              <AppText style={styles.flex}>{MEAL_LABELS[type]}</AppText>
              <AppText muted>{count === 0 ? 'Not logged' : `${kcal} kcal`}</AppText>
              <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
            </Pressable>
          );
        })}
      </Card>

      <View style={styles.actions}>
        <Button title="Add food" onPress={() => router.navigate('/search')} style={styles.flex} />
        <Button
          title="Scan barcode"
          variant="secondary"
          onPress={() => router.push('/scanner')}
          style={styles.flex}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { marginTop: spacing.md },
  cardTitle: { marginBottom: spacing.sm },
  calorieRow: { flexDirection: 'row', alignItems: 'baseline', marginVertical: spacing.sm },
  remaining: { marginTop: spacing.sm },
  macro: { marginTop: spacing.sm, gap: spacing.xs },
  macroHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  mealRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  pressed: { opacity: 0.6 },
  actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg },
  flex: { flex: 1 },
});