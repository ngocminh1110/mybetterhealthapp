import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { colors, spacing } from '@/theme';
import { getPasswordChecks } from '@/utils/validation';

export function PasswordChecklist({ password }: { password: string }) {
  return (
    <View style={styles.list} accessibilityLabel="Password rules">
      {getPasswordChecks(password).map((check) => (
        <View key={check.label} style={styles.row}>
          <Ionicons
            name={check.passed ? 'checkmark-circle' : 'ellipse-outline'}
            size={16}
            color={check.passed ? colors.primary : colors.textMuted}
          />
          <AppText variant="caption" color={check.passed ? colors.primary : colors.textMuted}>
            {check.label}
          </AppText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.xs, marginTop: -spacing.sm, marginBottom: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
});