import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { FoodListItem } from '@/components/FoodListItem';
import { AppText, EmptyState, ErrorView, LoadingView, Screen } from '@/components/ui';
import { useFoodSearch } from '@/hooks/useFoodSearch';
import { colors, radius, spacing } from '@/theme';

/**
 * Food Search screen ("Add food" tab).
 * The user types a food name and presses Search, or opens the barcode scanner.
 * All search logic is in the useFoodSearch hook; this screen only shows the UI.
 */
export default function SearchScreen() {
  const [query, setQuery] = useState(''); // text in the search box
  const { status, results, error, lastQuery, search, retry } = useFoodSearch();

  const submit = () => search(query);

  /** Chooses what to show under the search bar, based on the search status. */
  const renderContent = () => {
    switch (status) {
      // 1. Before the first search: short help text
      case 'idle':
        return (
          <EmptyState
            icon="search-outline"
            title="Find a food"
            message="Type a food name and press Search, or scan a barcode."
          />
        );

      // 2. Waiting for the server
      case 'loading':
        return <LoadingView message="Searching foods..." />;

      // 3. Something went wrong: show the message and a "Try again" button
      case 'error':
        return (
          <ErrorView message={error ?? 'Something went wrong.'} onRetry={lastQuery ? retry : undefined} />
        );

      // 4. We have an answer: show the list, or a message when the list is empty
      case 'success':
        if (results.length === 0) {
          return (
            <EmptyState
              icon="sad-outline"
              title="No results"
              message={`We could not find "${lastQuery}". Try another word, e.g. in Finnish.`}
            />
          );
        }
        return (
          <FlatList
            data={results}
            keyExtractor={(item) => item.code} // the barcode is unique
            contentContainerStyle={styles.list}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            keyboardShouldPersistTaps="handled" // a tap on a row works even when the keyboard is open
            ListHeaderComponent={
              <AppText variant="caption" muted style={styles.count}>
                {results.length} results for &quot;{lastQuery}&quot;
              </AppText>
            }
            renderItem={({ item }) => (
              <FoodListItem
                product={item}
                // Open the details screen of this product 
                onPress={() => router.push({ pathname: '/food/[code]', params: { code: item.code } })}
              />
            )}
          />
        );
    }
  };

  return (
    <Screen edges={[]}>
      {/* Search bar: text box + Search button + Scan button */}
      <View style={styles.searchRow}>
        <View style={styles.inputWrapper}>
          <Ionicons name="search" size={18} color={colors.textMuted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={submit} // the "search" key on the keyboard also starts the search
            placeholder="e.g. banana, oat milk, ruisleipä"
            placeholderTextColor={colors.textMuted}
            returnKeyType="search"
            autoCorrect={false}
            style={styles.input}
            accessibilityLabel="Search food"
            testID="search-input"
          />
          {/* Clear button (x), only when there is text */}
          {query ? (
            <Pressable onPress={() => setQuery('')} accessibilityLabel="Clear search" hitSlop={8}>
              <Ionicons name="close-circle" size={18} color={colors.textMuted} />
            </Pressable>
          ) : null}
        </View>

        <Pressable
          onPress={submit}
          style={({ pressed }) => [styles.iconButton, styles.searchButton, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel="Search">
          <Ionicons name="arrow-forward" size={22} color={colors.white} />
        </Pressable>

        <Pressable
          onPress={() => router.push('/scanner')}
          style={({ pressed }) => [styles.iconButton, styles.scanButton, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel="Scan barcode">
          <Ionicons name="barcode-outline" size={22} color={colors.primary} />
        </Pressable>
      </View>

      {/* Results area */}
      <View style={styles.content}>{renderContent()}</View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  searchRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 48,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },

  input: { flex: 1, minWidth: 0, fontSize: 15, color: colors.text, paddingVertical: spacing.sm },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButton: { backgroundColor: colors.primary },
  scanButton: { backgroundColor: colors.primaryLight },
  pressed: { opacity: 0.7 },
  content: { flex: 1 },
  list: { paddingBottom: spacing.lg },
  separator: { height: spacing.sm },
  count: { marginBottom: spacing.sm },
});