import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText, Button, Screen, TextField } from '@/components/ui';
import { useAuth } from '@/providers/AuthProvider';
import { colors, spacing } from '@/theme';
import { validateEmail, validatePassword } from '@/utils/validation';

export default function SignInScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    const newErrors = { email: validateEmail(email), password: validatePassword(password) };
    setErrors(newErrors);
    if (newErrors.email || newErrors.password) return;

    setLoading(true);
    try {
      await signIn(email.trim(), password);

    } catch {
      setErrors({ form: 'Sign in failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen scroll edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Image
          source={require('@/assets/images/logoMyBetterHealth.png')}
          style={styles.logo}
          contentFit="contain"
          accessibilityLabel="My Better Health logo"
        />
        <AppText variant="title">My Better Health</AppText>
        <AppText muted>Track your meals for better health</AppText>
      </View>

      <TextField
        label="Email"
        value={email}
        onChangeText={setEmail}
        error={errors.email}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        placeholder="you@example.com"
        testID="signin-email"
      />
      <TextField
        label="Password"
        value={password}
        onChangeText={setPassword}
        error={errors.password}
        secureTextEntry
        autoComplete="password"
        placeholder="Your password"
        testID="signin-password"
      />

      <Link href="/forgot-password" style={styles.forgot}>
        <AppText color={colors.primary}>Forgot password?</AppText>
      </Link>

      {errors.form ? (
        <AppText color={colors.danger} style={styles.formError}>
          {errors.form}
        </AppText>
      ) : null}

      <Button
        title="Sign in"
        onPress={handleSignIn}
        loading={loading}
        testID="signin-submit"
      />

      <View style={styles.footer}>
        <AppText muted>No account yet? </AppText>
        <Link href="/sign-up">
          <AppText bold color={colors.primary}>
            Create one
          </AppText>
        </Link>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', marginTop: spacing.xl, marginBottom: spacing.xl, gap: spacing.xs },
  logo: { width: 182, height: 182 },
  forgot: { alignSelf: 'flex-end', marginBottom: spacing.lg },
  formError: { marginBottom: spacing.md, textAlign: 'center' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.xl },
});
