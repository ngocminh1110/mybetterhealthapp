import { EmptyState, Screen } from '@/components/ui';

export default function HistoryScreen() {
  return (
    <Screen edges={[]}>
      <EmptyState
        icon="stats-chart-outline"
        title="No history yet"
        message=""
      />
    </Screen>
  );
}
