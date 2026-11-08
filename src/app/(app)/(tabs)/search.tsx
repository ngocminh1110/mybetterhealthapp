import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet } from 'react-native';

import { Button, EmptyState, Screen, TextField } from '@/components/ui';
import { spacing } from '@/theme';

export default function SearchScreen() {
  const [query, setQuery] = useState('');

  return (
    <Screen edges={[]}>
      <TextField
        label="Search food"
        value={query}
        onChangeText={setQuery}
        placeholder="e.g. oat milk, banana, rye bread"
        returnKeyType="search"
      />
      <Button title="Scan barcode" variant="secondary" onPress={() => router.push('/scanner')} />
      <EmptyState
        icon="search-outline"
        title="Find a food"
        message="Search by name or scan a barcode to see nutrition facts."
      />
      {}
      <Button
        title="Open example product"
        variant="ghost"
        onPress={() => router.push({ pathname: '/food/[code]', params: { code: '6408430000012' } })}
        style={styles.test}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  test: { marginTop: spacing.sm },
});
