import { useLocalSearchParams } from 'expo-router';

import { EmptyState, Screen } from '@/components/ui';

export default function FoodDetailScreen() {
  const { code } = useLocalSearchParams<{ code: string }>();

  return (
    <Screen edges={['bottom']}>
      <EmptyState
        icon="fast-food-outline"
        title={`Product ${code}`}
        message=""
      />
    </Screen>
  );
}
