import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { MealTypePicker } from '@/components/MealTypePicker';
import { NutritionFacts } from '@/components/NutritionFacts';
import {
  AppText,
  Button,
  Card,
  EmptyState,
  ErrorView,
  LoadingView,
  Screen,
  TextField,
} from '@/components/ui';
import { MEAL_LABELS } from '@/constants/defaults';
import { useProduct } from '@/hooks/useProduct';
import { useAuth } from '@/providers/AuthProvider';
import { hasNutritionData } from '@/services/foodApi';
import { addMeal } from '@/services/mealService';
import { colors, radius, spacing } from '@/theme';
import type { MealType } from '@/types/models';
import { todayKey } from '@/utils/date';
import { buildMealEntry, suggestMealType } from '@/utils/meals';
import { scaleNutrients } from '@/utils/nutrition';
import { validateNumber } from '@/utils/validation';

/**
 * Food details screen.
 * Shows the nutrition facts of one product and lets the user add it to today's diary.
 * Opened from the search results with the barcode in the URL.
 */
export default function FoodDetailScreen() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const { user } = useAuth();
  const { status, product, error, retry } = useProduct(code);

  // Form state
  const [amount, setAmount] = useState('100'); // grams, as text from the input
  const [mealType, setMealType] = useState<MealType>(suggestMealType()); // e.g. "lunch" at 12:00
  const [amountError, setAmountError] = useState<string>();
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string>();
  const [savedTo, setSavedTo] = useState<MealType | null>(null); // shows the success message

  // 1. Loading / error / not found
  if (status === 'loading') return <LoadingView message="Loading product..." />;
  if (status === 'error') return <ErrorView message={error ?? 'Something went wrong.'} onRetry={retry} />;
  if (status === 'not-found' || !product) {
    return (
      <EmptyState
        icon="help-circle-outline"
        title="Product not found"
        message="This product is not in the Open Food Facts database yet."
        actionTitle="Back to search"
        onAction={() => router.back()}
      />
    );
  }

  // 2. Live preview: nutrients for the amount the user typed (or per 100 g if the input is invalid)
  const grams = Number(amount.replace(',', '.'));
  const amountIsValid = !validateNumber(amount, { max: 5000 });
  const preview = scaleNutrients(product.per100g, amountIsValid ? grams : 100);

  /** Validates the form and saves the meal entry to Firestore. */
  const handleAdd = async () => {
    const validationError = validateNumber(amount, { max: 5000, label: 'Amount' });
    setAmountError(validationError);
    if (validationError || !user) return;

    setSaving(true);
    setSaveError(undefined);
    try {
      await addMeal(user.uid, buildMealEntry(product, grams, mealType, todayKey()));
      setSavedTo(mealType);
    } catch {
      setSaveError('Could not save. Please check your internet connection and try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen scroll edges={['bottom']}>
      { }
      <View style={styles.header}>
        {product.imageUrl ? (
          <Image source={product.imageUrl} style={styles.image} contentFit="contain" />
        ) : (
          <View style={[styles.image, styles.placeholder]}>
            <Ionicons name="fast-food-outline" size={36} color={colors.textMuted} />
          </View>
        )}
        <View style={styles.headerText}>
          <AppText variant="subtitle">{product.name}</AppText>
          {product.brand ? <AppText muted>{product.brand}</AppText> : null}
        </View>
      </View>

      {/* Some products in Open Food Facts have no nutrition values */}
      {!hasNutritionData(product) ? (
        <Card style={styles.warning}>
          <AppText color={colors.danger}>
            This product has no nutrition data. It will be saved with 0 kcal.
          </AppText>
        </Card>
      ) : null}

      {/* Success message after saving */}
      {savedTo ? (
        <Card style={styles.success}>
          <View style={styles.successTitle}>
            <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
            <AppText bold color={colors.primary}>
              Added to {MEAL_LABELS[savedTo]}
            </AppText>
          </View>
          <AppText muted>
            {grams} g of {product.name} ({preview.calories} kcal)
          </AppText>
          <View style={styles.successButtons}>
            <Button title="Back to search" variant="secondary" onPress={() => router.back()} style={styles.flex} />
            <Button title="Go to diary" onPress={() => router.navigate('/diary')} style={styles.flex} />
          </View>
        </Card>
      ) : (
        // The form: amount + meal type + live nutrition preview + Add button
        <>
          <Card style={styles.card}>
            <TextField
              label="Amount (g)"
              value={amount}
              onChangeText={(text) => {
                setAmount(text);
                setAmountError(undefined);
              }}
              error={amountError}
              keyboardType="decimal-pad"
              placeholder="100"
              testID="amount-input"
            />
            <AppText variant="caption" bold style={styles.fieldLabel}>
              Meal
            </AppText>
            <MealTypePicker value={mealType} onChange={setMealType} />
          </Card>

          <Card style={styles.card}>
            <AppText variant="subtitle" style={styles.cardTitle}>
              Nutrition for {amountIsValid ? grams : 100} g
            </AppText>
            <NutritionFacts nutrients={preview} />
          </Card>

          {saveError ? (
            <AppText color={colors.danger} style={styles.saveError}>
              {saveError}
            </AppText>
          ) : null}

          <Button
            title={`Add to ${MEAL_LABELS[mealType]}`}
            onPress={handleAdd}
            loading={saving}
            style={styles.addButton}
            testID="add-meal-button"
          />
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  image: { width: 88, height: 88, borderRadius: radius.md, backgroundColor: colors.surface },
  placeholder: { alignItems: 'center', justifyContent: 'center' },
  headerText: { flex: 1, gap: spacing.xs },
  card: { marginTop: spacing.md },
  cardTitle: { marginBottom: spacing.md },
  fieldLabel: { marginBottom: spacing.sm },
  warning: { marginTop: spacing.md, backgroundColor: colors.dangerLight },
  success: { marginTop: spacing.md, gap: spacing.sm, backgroundColor: colors.primaryLight },
  successTitle: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  successButtons: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  flex: { flex: 1 },
  saveError: { marginTop: spacing.md, textAlign: 'center' },
  addButton: { marginTop: spacing.lg },
});