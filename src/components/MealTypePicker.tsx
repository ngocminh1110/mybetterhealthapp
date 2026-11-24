import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { MEAL_LABELS } from '@/constants/defaults';
import { colors, radius, spacing } from '@/theme';
import { MEAL_TYPES, type MealType } from '@/types/models';

interface MealTypePickerProps {
    value: MealType;
    onChange: (mealType: MealType) => void;
}

export function MealTypePicker({ value, onChange }: MealTypePickerProps) {
    return (
        <View style={styles.row} accessibilityRole="radiogroup">
            {MEAL_TYPES.map((type) => {
                const selected = type === value;
                return (
                    <Pressable
                        key={type}
                        onPress={() => onChange(type)}
                        accessibilityRole="radio"
                        accessibilityState={{ selected }}
                        style={[styles.chip, selected && styles.chipSelected]}>
                        <AppText variant="caption" bold color={selected ? colors.white : colors.text}>
                            {MEAL_LABELS[type]}
                        </AppText>
                    </Pressable>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    row: { flexDirection: 'row', gap: spacing.sm },
    chip: {
        flex: 1,
        minHeight: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: radius.pill,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
    },
    chipSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
});