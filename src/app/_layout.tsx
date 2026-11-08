import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { SplashController } from '@/components/SplashController';
import { AuthProvider, useAuth } from '@/providers/AuthProvider';

export default function RootLayout() {
  return (
    <AuthProvider>
      <SplashController />
      <StatusBar style="dark" />
      <RootNavigator />
    </AuthProvider>
  );
}

function RootNavigator() {
  const { user } = useAuth();
  const isLoggedIn = !!user;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={isLoggedIn} redirectTo="/sign-in">
        <Stack.Screen name="(app)" />
      </Stack.Protected>

      <Stack.Protected guard={!isLoggedIn} redirectTo="/">
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
    </Stack>
  );
}