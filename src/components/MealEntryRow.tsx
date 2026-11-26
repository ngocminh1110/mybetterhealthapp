import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { colors, spacing } from '@/theme';
import type { MealEntry } from '@/types/models';

interface MealEntryRowProps {
    meal: MealEntry;
    onPress: () => void;
}

/** One food in the diary: name, amount and calories. Tap to edit or delete. */
export function MealEntryRow({ meal, onPress }: MealEntryRowProps) {
    return (
        <Pressable
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel={`${meal.foodName}, ${meal.grams} grams, ${meal.nutrients.calories} kcal. Tap to edit.`}
            style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
            <View style={styles.info}>
                <AppText numberOfLines={1}>{meal.foodName}</AppText>
                <AppText variant="caption" muted>
                    {meal.grams} g{meal.brand ? ` · ${meal.brand}` : ''}
                </AppText>
            </View>
            <AppText bold>{meal.nutrients.calories} kcal</AppText>
            <Ionicons name="create-outline" size={18} color={colors.textMuted} />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        paddingVertical: spacing.sm,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: colors.border,
    },
    pressed: { opacity: 0.6 },
    info: { flex: 1, gap: 2 },
});