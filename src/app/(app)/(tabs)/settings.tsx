import { StyleSheet, View } from 'react-native';

import { AppText, Button, Card, Screen } from '@/components/ui';
import { DEFAULT_GOALS } from '@/constants/defaults';
import { useAuth } from '@/providers/AuthProvider';
import { spacing } from '@/theme';

export default function SettingsScreen() {
  const { user, signOut } = useAuth();
  const goals = DEFAULT_GOALS;

  return (
    <Screen scroll edges={[]}>
      <Card>
        <AppText variant="subtitle">Account</AppText>
        <AppText muted style={styles.line}>
          {user?.email}
        </AppText>
      </Card>

      <Card style={styles.card}>
        <AppText variant="subtitle">Daily goals</AppText>
        <View style={styles.line}>
          <AppText>Calories: {goals.calories} kcal</AppText>
          <AppText>Protein: {goals.protein} g</AppText>
          <AppText>Carbs: {goals.carbs} g</AppText>
          <AppText>Fat: {goals.fat} g</AppText>
        </View>
      </Card>

      <Button title="Log out" variant="danger" onPress={signOut} style={styles.card} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { marginTop: spacing.md },
  line: { marginTop: spacing.xs },
});
