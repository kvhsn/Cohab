import { router, useLocalSearchParams } from 'expo-router';
import { Alert, Button, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import mutations from '@/libs/mutations';
import { createFormHook, createFormHookContexts } from '@tanstack/react-form';
import { CreateExpenseSchema } from '@cohab/shared/src/expense';

export default function CreateExpense() {
  const { householdId } = useLocalSearchParams<{ householdId: string }>();
  const queryClient = useQueryClient();
  const { fieldContext, formContext } = createFormHookContexts();

  const { useAppForm } = createFormHook({
    fieldComponents: {
      TextInput,
    },
    formComponents: {
      Button,
    },
    fieldContext,
    formContext,
  });

  const form = useAppForm({
    defaultValues: {
      name: '',
      amount: 0,
    },
    validators: {
      onChange: CreateExpenseSchema,
    },
    onSubmit: ({ value }) => {
      mutate(value);
    },
  });

  const { mutate, isPending } = useMutation({
    ...mutations.expenses.createExpenseMutation(householdId),
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
        <View>
          <form.AppField name="name">
            {(field) => (
              <field.TextInput
                placeholder="Name (e.g., Groceries)"
                value={field.state.value}
                onChangeText={field.handleChange}
                onBlur={field.handleBlur}
                keyboardType="default"
              />
            )}
          </form.AppField>
          <form.AppField name="amount">
            {(field) => (
              <field.TextInput
                placeholder="Amount"
                value={field.state.value.toString()}
                onChangeText={(text) => field.handleChange(Number(text))}
                onBlur={field.handleBlur}
              />
            )}
          </form.AppField>
          <form.Button
            title="Submit Expense"
            disabled={isPending}
            onPress={() => form.handleSubmit()}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
