import { useState } from 'react';
import { Modal, Pressable, StyleSheet } from 'react-native';

import { NutritionFacts } from '@/components/NutritionFacts';
import { AppText, Button, Card, TextField } from '@/components/ui';
import { colors, spacing } from '@/theme';
import type { MealEntry } from '@/types/models';
import { scaleNutrients } from '@/utils/nutrition';
import { validateNumber } from '@/utils/validation';

interface EditMealModalProps {
    meal: MealEntry;
    onClose: () => void;
    onSave: (grams: number) => Promise<void>;
    onDelete: () => Promise<void>;
}

/**
 * Pop-up to change the amount of a meal entry or delete it.
 */
export function EditMealModal({ meal, onClose, onSave, onDelete }: EditMealModalProps) {
    const [amount, setAmount] = useState(String(meal.grams));
    const [error, setError] = useState<string>();
    const [busy, setBusy] = useState<'save' | 'delete' | null>(null);
    const [confirmDelete, setConfirmDelete] = useState(false);

    const grams = Number(amount.replace(',', '.'));
    const amountIsValid = !validateNumber(amount, { max: 5000 });
    const preview = scaleNutrients(meal.per100g, amountIsValid ? grams : meal.grams);

    /** Runs save or delete, shows a message if it fails, and closes the pop-up when done. */
    const run = async (action: 'save' | 'delete', task: () => Promise<void>) => {
        setBusy(action);
        setError(undefined);
        try {
            await task();
            onClose();
        } catch {
            setError('Could not update. Please check your internet connection.');
            setBusy(null);
        }
    };

    const handleSave = () => {
        const validationError = validateNumber(amount, { max: 5000, label: 'Amount' });
        if (validationError) {
            setError(validationError);
            return;
        }
        run('save', () => onSave(grams));
    };

    const handleDelete = () => {
        if (!confirmDelete) {
            setConfirmDelete(true);
            return;
        }
        run('delete', onDelete);
    };

    return (
        <Modal visible transparent animationType="fade" onRequestClose={onClose}>
            { }
            <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close">
                { }
                <Pressable onPress={() => { }} style={styles.cardWrapper}>
                    <Card style={styles.card}>
                        <AppText variant="subtitle" numberOfLines={2}>
                            {meal.foodName}
                        </AppText>

                        <TextField
                            label="Amount (g)"
                            value={amount}
                            onChangeText={(text) => {
                                setAmount(text);
                                setError(undefined);
                            }}
                            keyboardType="decimal-pad"
                            testID="edit-amount-input"
                        />

                        <NutritionFacts nutrients={preview} />

                        {error ? <AppText color={colors.danger}>{error}</AppText> : null}

                        <Button title="Save" onPress={handleSave} loading={busy === 'save'} disabled={busy !== null} />
                        <Button
                            title={confirmDelete ? 'Tap again to delete' : 'Delete'}
                            variant="danger"
                            onPress={handleDelete}
                            loading={busy === 'delete'}
                            disabled={busy !== null}
                        />
                        <Button title="Cancel" variant="ghost" onPress={onClose} disabled={busy !== null} />
                    </Card>
                </Pressable>
            </Pressable>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center',
        padding: spacing.lg,
    },
    cardWrapper: { width: '100%', maxWidth: 420, alignSelf: 'center' },
    card: { gap: spacing.md },
});