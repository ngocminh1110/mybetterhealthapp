import { Stack } from 'expo-router';

import { colors } from '@/theme';

export const unstable_settings = { anchor: '(tabs)' };

export default function AppLayout() {
  return (
    <Stack
      screenOptions={{
        headerTintColor: colors.primary,
        headerTitleStyle: { color: colors.text },
        contentStyle: { backgroundColor: colors.background },
      }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="food/[code]" options={{ title: 'Food details' }} />
      <Stack.Screen name="scanner" options={{ title: 'Scan barcode', presentation: 'modal' }} />
    </Stack>
  );
}
