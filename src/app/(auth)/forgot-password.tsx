import { useState } from 'react';
import { StyleSheet } from 'react-native';

import { AppText, Button, Card, Screen, TextField } from '@/components/ui';
import { useAuth } from '@/providers/AuthProvider';
import { colors, spacing } from '@/theme';
import { getAuthErrorMessage } from '@/utils/authErrors';
import { validateEmail } from '@/utils/validation';

export default function ForgotPasswordScreen() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async () => {
    const emailError = validateEmail(email);
    setError(emailError);
    if (emailError) return;

    setLoading(true);
    try {
      await resetPassword(email.trim());
      setSent(true);
    } catch (error) {
      setError(getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen scroll edges={['bottom']}>
      <AppText variant="title">Reset password</AppText>
      <AppText muted style={styles.subtitle}>
        Enter your email and we will send you a link to reset your password.
      </AppText>

      {sent ? (
        <Card style={styles.success}>
          <AppText color={colors.primary} bold>
            Check your inbox
          </AppText>
          <AppText muted>If you haved registered with this email before, you will receive our reset link. Please check your spam as well.</AppText>
        </Card>
      ) : (
        <>
          <TextField
            label="Email"
            value={email}
            onChangeText={setEmail}
            error={error}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="you@example.com"
          />
          <Button title="Send reset link" onPress={handleReset} loading={loading} />
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  subtitle: { marginTop: spacing.xs, marginBottom: spacing.lg },
  success: { gap: spacing.xs, backgroundColor: colors.primaryLight },
});
