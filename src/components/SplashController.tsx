import { SplashScreen } from 'expo-router';

import { useAuth } from '@/providers/AuthProvider';

SplashScreen.preventAutoHideAsync();

export function SplashController() {
  const { initializing } = useAuth();
  if (!initializing) {
    SplashScreen.hide();
  }
  return null;
}
