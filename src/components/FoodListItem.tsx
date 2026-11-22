import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { hasNutritionData } from '@/services/foodApi';
import { colors, radius, spacing } from '@/theme';
import type { FoodProduct } from '@/types/models';

interface FoodListItemProps {
    product: FoodProduct;
    onPress: () => void;
}

/** One row in the search results: picture, name, brand and calories per 100 g. */
export function FoodListItem({ product, onPress }: FoodListItemProps) {
    const hasData = hasNutritionData(product);

    return (
        <Pressable
            onPress={onPress}
            accessibilityRole="button"
            // Screen readers read the name and the brand
            accessibilityLabel={`${product.name}${product.brand ? `, ${product.brand}` : ''}`}
            style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
            {/* Product picture, or a food icon when there is no picture */}
            {product.imageUrl ? (
                <Image source={product.imageUrl} style={styles.image} contentFit="contain" transition={150} />
            ) : (
                <View style={[styles.image, styles.placeholder]}>
                    <Ionicons name="fast-food-outline" size={24} color={colors.textMuted} />
                </View>
            )}

            {/* Name (max 2 lines) and brand (1 line) */}
            <View style={styles.info}>
                <AppText bold numberOfLines={2}>
                    {product.name}
                </AppText>
                {product.brand ? (
                    <AppText variant="caption" muted numberOfLines={1}>
                        {product.brand}
                    </AppText>
                ) : null}
            </View>

            {/* Calories per 100 g, or "No data" when the product has no nutrition values */}
            <View style={styles.kcal}>
                {hasData ? (
                    <>
                        <AppText bold color={colors.secondary}>
                            {product.per100g.calories}
                        </AppText>
                        <AppText variant="caption" muted>
                            kcal/100g
                        </AppText>
                    </>
                ) : (
                    <AppText variant="caption" muted>
                        No data
                    </AppText>
                )}
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        padding: spacing.sm,
        backgroundColor: colors.surface,
        borderRadius: radius.md,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: colors.border,
    },
    pressed: { opacity: 0.7 }, // small feedback when the user taps the row
    image: { width: 56, height: 56, borderRadius: radius.sm, backgroundColor: colors.background },
    placeholder: { alignItems: 'center', justifyContent: 'center' },
    info: { flex: 1, gap: 2 },
    kcal: { alignItems: 'flex-end', minWidth: 64 },
});