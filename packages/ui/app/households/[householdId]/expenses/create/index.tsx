import CustomButton from '@/components/Button/Button';
import Card from '@/components/Card/Card';
import Divider from '@/components/Divider/Divider';
import Icon from '@/components/Icon/Icon';
import Input from '@/components/Input/Input';
import Screen from '@/components/Screen/Screen';
import Typography from '@/components/Typography/Typography';
import { CATEGORY_ICONS } from '@/libs/features/expenses/constants';
import mutations from '@/libs/mutations';
import queries from '@/libs/queries';
import {
  CreateExpenseSchema,
  EXPENSE_CATEGORY_LABELS,
  ExpenseCategory,
} from '@cohab/shared/src/expense';
import { createFormHook, createFormHookContexts } from '@tanstack/react-form';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { Suspense, useState } from 'react';
import { Alert, Pressable, TextInput, View } from 'react-native';

const CATEGORIES: ExpenseCategory[] = ['GROCERIES', 'RENT', 'ELECTRICITY', 'OTHER'];

function HouseholdMemberCount() {
  const { data } = useSuspenseQuery(queries.me.getMeQuery());
  const memberCount = data.household?.members?.length ?? 0;
  return (
    <Typography variant="body" className="font-bold">
      Tous les colocs ({memberCount})
    </Typography>
  );
}

export default function CreateExpense() {
  const { householdId } = useLocalSearchParams<{ householdId: string }>();
  const queryClient = useQueryClient();
  const { fieldContext, formContext } = createFormHookContexts();

  const { mutate } = useMutation({
    ...mutations.expenses.createExpenseMutation(householdId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['households', householdId, 'expenses'] });
      queryClient.invalidateQueries({ queryKey: ['households', householdId, 'balance'] });
      router.back();
    },
    onError: (error) => {
      Alert.alert('Erreur', error.message || 'Échec de la création');
    },
  });

  const [amountText, setAmountText] = useState('0');

  const { useAppForm } = createFormHook({
    fieldComponents: {
      Input,
      TextInput,
    },
    formComponents: {
      CustomButton,
    },
    fieldContext,
    formContext,
  });

  const form = useAppForm({
    validators: {
      onChange: CreateExpenseSchema,
      onMount: CreateExpenseSchema,
    },
    defaultValues: {
      name: '',
      amount: 0,
      note: '',
      category: Object.keys(EXPENSE_CATEGORY_LABELS)[0] as ExpenseCategory,
    },
    onSubmit: ({ value }) => {
      mutate(value);
    },
    canSubmitWhenInvalid: false,
  });

  return (
    <Screen title="Ajouter une dépense">
      <Card className="gap-4 p-0 overflow-hidden">
        <View className="items-center px-6 pb-4 pt-8">
          <Typography variant="caption" className="mb-3">
            MONTANT
          </Typography>
          <View className="flex-row items-baseline gap-2">
            <form.AppField name="amount">
              {(field) => (
                <field.TextInput
                  className="text-[52px] font-bold text-gray-900 dark:text-gray-50"
                  keyboardType="decimal-pad"
                  selectTextOnFocus
                  placeholder="0"
                  placeholderTextColor="#d1d5db"
                  style={{ minWidth: 60 }}
                  value={amountText}
                  onChangeText={(text) => {
                    // Allow only numbers and one decimal separator
                    const sanitized = text.replace(',', '.').replace(/[^0-9.]/g, '');
                    const parts = sanitized.split('.');
                    const final =
                      parts.length > 2 ? `${parts[0]}.${parts.slice(1).join('')}` : sanitized;

                    setAmountText(final);
                    const numericValue = parseFloat(final) || 0;
                    field.handleChange(numericValue);
                  }}
                  onBlur={() => {
                    field.handleBlur();
                    // Cleanup trailing dot or format
                    const numeric = parseFloat(amountText) || 0;
                    setAmountText(numeric.toString());
                  }}
                />
              )}
            </form.AppField>
            <Typography
              variant="h1"
              className="text-3xl font-light text-gray-400 dark:text-gray-500">
              €
            </Typography>
          </View>
        </View>

        <View className="mx-5 gap-3">
          <View className="flex-row items-center rounded-2xl bg-gray-50 dark:bg-white/5 px-4 py-3">
            <View className="mr-3 size-10 items-center justify-center rounded-full bg-primary/10">
              <Icon as="Ionicons" name="person" size="md" className="text-primary" />
            </View>
            <View className="flex-1">
              <Typography variant="caption">Payé par</Typography>
              <Typography variant="body" className="font-bold">
                Moi
              </Typography>
            </View>
          </View>

          <View className="flex-row items-center rounded-2xl bg-gray-50 dark:bg-white/5 px-4 py-3">
            <View className="mr-3 size-10 items-center justify-center rounded-full bg-secondary/10">
              <Icon as="Ionicons" name="people" size="md" className="text-secondary" />
            </View>
            <View className="flex-1">
              <Typography variant="caption">Pour</Typography>
              <Suspense
                fallback={
                  <Typography variant="body" className="font-bold">
                    Tous les colocs
                  </Typography>
                }>
                <HouseholdMemberCount />
              </Suspense>
            </View>
          </View>
        </View>

        <View className="mx-5">
          <Divider />
        </View>

        <View className="mx-5">
          <Typography variant="subtitle" className="mb-3 font-bold text-base">
            Catégorie
          </Typography>
          <form.AppField name="category">
            {(field) => (
              <View className="flex-row gap-2">
                {CATEGORIES.map((cat) => {
                  const isSelected = field.state.value === cat;
                  return (
                    <Pressable
                      key={cat}
                      onPress={() => field.handleChange(cat)}
                      className="flex-1 items-center gap-1.5 active:opacity-75">
                      <View
                        className={`size-14 items-center justify-center rounded-2xl ${
                          isSelected
                            ? 'bg-primary'
                            : 'border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5'
                        }`}>
                        <Icon
                          as="Ionicons"
                          name={CATEGORY_ICONS[cat]}
                          size="lg"
                          className={isSelected ? 'text-white' : 'text-gray-400 dark:text-gray-500'}
                        />
                      </View>
                      <Typography variant="caption">{EXPENSE_CATEGORY_LABELS[cat]}</Typography>
                    </Pressable>
                  );
                })}
              </View>
            )}
          </form.AppField>
        </View>

        <View className="mx-5">
          <Divider />
        </View>

        <View className="mx-5">
          <form.AppField name="name">
            {(field) => (
              <Input
                iconName="receipt-outline"
                placeholder="Ajouter un nom"
                value={field.state.value}
                onChangeText={field.handleChange}
                onBlur={field.handleBlur}
                returnKeyType="next"
              />
            )}
          </form.AppField>
        </View>

        <View className="mx-5">
          <form.AppField name="note">
            {(field) => (
              <Input
                iconName="create-outline"
                placeholder="Ajouter une note (optionnel)"
                value={field.state.value}
                onChangeText={field.handleChange}
                onBlur={field.handleBlur}
                multiline
                returnKeyType="done"
              />
            )}
          </form.AppField>
        </View>

        <View className="mx-5 mb-6 mt-2">
          <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
            {([canSubmit, isSubmitting]) => (
              <CustomButton
                title={isSubmitting ? 'Enregistrement...' : 'Enregistrer la dépense'}
                variant="primary"
                size="lg"
                disabled={!canSubmit || isSubmitting}
                onPress={form.handleSubmit}
              />
            )}
          </form.Subscribe>
        </View>
      </Card>
    </Screen>
  );
}
