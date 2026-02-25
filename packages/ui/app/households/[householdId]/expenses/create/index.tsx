import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Button, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import mutations from '@/libs/mutations';

type Form = {
  name: string;
  amount: number | undefined;
};

export default function CreateExpense() {
  const { householdId } = useLocalSearchParams<{ householdId: string }>();
  const [form, setForm] = useState<Form>({
    name: '',
    amount: undefined,
  });
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    ...mutations.expenses.createExpenseMutation(householdId!, {
      name: form.name,
      amount: form.amount || 0,
    }),
    onSuccess: () => {
      Alert.alert('Success', 'Expense created!');
      queryClient.invalidateQueries({ queryKey: ['households', householdId, 'expenses'] });
      queryClient.invalidateQueries({ queryKey: ['households', householdId, 'balance'] });
      router.back();
    },
    onError: (error) => {
      Alert.alert('Error', error.message || 'Create expense failed');
    },
  });

  return (
    <SafeAreaView>
      <View>
        <Text>Create Expense</Text>
        <TextInput
          placeholder="Name (e.g., Groceries)"
          value={form.name}
          onChangeText={(name) => setForm({ ...form, name })}
        />
        <TextInput
          placeholder="Amount"
          keyboardType="decimal-pad"
          value={form.amount ? String(form.amount) : ''}
          onChangeText={(amount) =>
            setForm({ ...form, amount: amount ? Number(amount) : undefined })
          }
        />
        <Button
          title="Submit Expense"
          onPress={() => mutate()}
          disabled={isPending || !form.name || !form.amount}
        />
      </View>
    </SafeAreaView>
  );
}
