import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { PasswordChecklist } from '@/components/PasswordChecklist';
import { AppText, Button, Screen, TextField } from '@/components/ui';
import { useAuth } from '@/providers/AuthProvider';
import { colors, spacing } from '@/theme';
import { validateEmail, validateNewPassword, validatePasswordMatch } from '@/utils/validation';

type FormErrors = { email?: string; password?: string; confirm?: string; form?: string };

export default function SignUpScreen() {
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    const newErrors: FormErrors = {
      email: validateEmail(email),
      password: validateNewPassword(password),
      confirm: validatePasswordMatch(password, confirm),
    };
    setErrors(newErrors);
    if (newErrors.email || newErrors.password || newErrors.confirm) return;

    setLoading(true);
    try {
      await signUp(email.trim(), password, name.trim() || undefined);
    } catch {
      setErrors({ form: 'Could not create the account. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen scroll edges={['bottom']}>
      <AppText variant="title">Create an account</AppText>
      <AppText muted style={styles.subtitle}>
        Start tracking your nutrition today.
      </AppText>

      <TextField label="Name (optional)" value={name} onChangeText={setName} placeholder="Your name" />
      <TextField
        label="Email"
        value={email}
        onChangeText={setEmail}
        error={errors.email}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="you@example.com"
      />
      <TextField
        label="Password"
        value={password}
        onChangeText={setPassword}
        error={errors.password}
        secureTextEntry
        placeholder="At least 8 characters included an uppercase, a number, a special character"
      />
      <PasswordChecklist password={password} />
      <TextField
        label="Confirm password"
        value={confirm}
        onChangeText={setConfirm}
        error={errors.confirm}
        secureTextEntry
        placeholder="Type the password again"
      />

      {errors.form ? (
        <AppText color={colors.danger} style={styles.formError}>
          {errors.form}
        </AppText>
      ) : null}

      <Button title="Create account" onPress={handleSignUp} loading={loading} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  subtitle: { marginTop: spacing.xs, marginBottom: spacing.lg },
  formError: { marginBottom: spacing.md, textAlign: 'center' },
});
