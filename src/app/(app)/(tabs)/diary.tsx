import { router } from 'expo-router';

import { EmptyState, Screen } from '@/components/ui';

export default function DiaryScreen() {
  return (
    <Screen edges={[]}>
      <EmptyState
        icon="book-outline"
        title="No meals logged today"
        message=""
        actionTitle="Add food"
        onAction={() => router.push('/search')}
      />
    </Screen>
  );
}
