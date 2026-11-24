import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { colors, spacing } from '@/theme';
import type { Nutrients } from '@/types/models';

interface NutritionFactsProps {
    nutrients: Nutrients;
}

/** A small table: calories, protein, carbs and fat, each with its own color. */
export function NutritionFacts({ nutrients }: NutritionFactsProps) {
    const rows = [
        { label: 'Calories', value: `${nutrients.calories} kcal`, color: colors.secondary },
        { label: 'Protein', value: `${nutrients.protein} g`, color: colors.protein },
        { label: 'Carbs', value: `${nutrients.carbs} g`, color: colors.carbs },
        { label: 'Fat', value: `${nutrients.fat} g`, color: colors.fat },
    ];

    return (
        <View style={styles.table}>
            {rows.map((row) => (
                <View key={row.label} style={styles.row}>
                    { }
                    <View style={[styles.dot, { backgroundColor: row.color }]} />
                    <AppText style={styles.label}>{row.label}</AppText>
                    <AppText bold>{row.value}</AppText>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    table: { gap: spacing.sm },
    row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    dot: { width: 10, height: 10, borderRadius: 5 },
    label: { flex: 1 },
});