import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppText, Button, Card, ProgressBar, Screen } from '@/components/ui';
import { DEFAULT_GOALS } from '@/constants/defaults';
import { useAuth } from '@/providers/AuthProvider';
import { colors, spacing } from '@/theme';
import { EMPTY_NUTRIENTS, progress } from '@/utils/nutrition';

export default function DashboardScreen() {
  const { user } = useAuth();
  const totals = EMPTY_NUTRIENTS;
  const goals = DEFAULT_GOALS;
  const remaining = goals.calories - totals.calories;

  const macros = [
    { label: 'Protein', value: totals.protein, goal: goals.protein, color: colors.protein },
    { label: 'Carbs', value: totals.carbs, goal: goals.carbs, color: colors.carbs },
    { label: 'Fat', value: totals.fat, goal: goals.fat, color: colors.fat },
  ];

  return (
    <Screen scroll edges={[]}>
      <AppText muted>Hello{user?.displayName ? `, ${user.displayName}` : ''} 👋</AppText>

      <Card style={styles.card}>
        <AppText variant="subtitle">Calories</AppText>
        <View style={styles.calorieRow}>
          <AppText variant="display" color={colors.secondary}>
            {totals.calories}
          </AppText>
          <AppText muted> / {goals.calories} kcal</AppText>
        </View>
        <ProgressBar value={progress(totals.calories, goals.calories)} color={colors.secondary} height={12} />
        <AppText variant="caption" muted style={styles.remaining}>
          {remaining >= 0 ? `${remaining} kcal left` : `${-remaining} kcal over goal`}
        </AppText>
      </Card>

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

      <View style={styles.actions}>
        <Button title="Add food" onPress={() => router.push('/search')} style={styles.flex} />
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
  actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg },
  flex: { flex: 1 },
});
