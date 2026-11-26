import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { colors, radius, spacing } from '@/theme';
import { addDays, formatDayLabel, todayKey } from '@/utils/date';

interface DateNavigatorProps {
    date: string; // YYYY-MM-DD
    onChange: (date: string) => void;
}

export function DateNavigator({ date, onChange }: DateNavigatorProps) {
    const isToday = date >= todayKey();

    return (
        <View style={styles.row}>
            <Pressable
                onPress={() => onChange(addDays(date, -1))}
                accessibilityRole="button"
                accessibilityLabel="Previous day"
                hitSlop={8}
                style={styles.arrow}>
                <Ionicons name="chevron-back" size={22} color={colors.primary} />
            </Pressable>

            { }
            <Pressable onPress={() => onChange(todayKey())} accessibilityLabel="Go to today">
                <AppText variant="subtitle">{formatDayLabel(date)}</AppText>
            </Pressable>

            <Pressable
                onPress={() => onChange(addDays(date, 1))}
                disabled={isToday}
                accessibilityRole="button"
                accessibilityLabel="Next day"
                accessibilityState={{ disabled: isToday }}
                hitSlop={8}
                style={[styles.arrow, isToday && styles.disabled]}>
                <Ionicons name="chevron-forward" size={22} color={colors.primary} />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.surface,
        borderRadius: radius.md,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: colors.border,
    },
    arrow: { padding: spacing.sm },
    disabled: { opacity: 0.3 },
});