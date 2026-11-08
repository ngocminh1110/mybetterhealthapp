import { EmptyState, Screen } from '@/components/ui';

export default function ScannerScreen() {
  return (
    <Screen edges={['bottom']}>
      <EmptyState
        icon="barcode-outline"
        title="Barcode scanner"
        message=""
      />
    </Screen>
  );
}
