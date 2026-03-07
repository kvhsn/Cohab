import CustomButton from '@/components/Button/Button';
import Input from '@/components/Input/Input';
import Screen from '@/components/Screen/Screen';
import Typography from '@/components/Typography/Typography';
import { formatErrors } from '@/libs/form';
import queries from '@/libs/queries';
import { updateHouseholdMutation } from '@/libs/features/households/mutations';
import { UpdateHouseholdSchema } from '@cohab/shared/src/household';
import { createFormHook, createFormHookContexts } from '@tanstack/react-form';
import { useMutation, useSuspenseQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, View } from 'react-native';

export default function EditName() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data } = useSuspenseQuery(queries.me.getMeQuery());

  const { fieldContext, formContext } = createFormHookContexts();

  const { useAppForm } = createFormHook({
    fieldComponents: {
      Input,
    },
    formComponents: {
      CustomButton,
    },
    fieldContext,
    formContext,
  });

  const { mutate, isPending } = useMutation({
    ...updateHouseholdMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries(queries.me.getMeQuery());
      router.back();
    },
    onError: (error: Error) => {
      Alert.alert('Erreur', error.message || 'La modification a échoué');
    },
  });

  const form = useAppForm({
    defaultValues: {
      name: data.household?.name || '',
    },
    validators: {
      onChange: UpdateHouseholdSchema,
      onMount: UpdateHouseholdSchema,
    },
    onSubmit: ({ value }) => {
      mutate(value);
    },
    canSubmitWhenInvalid: false,
  });

  return (
    <Screen title="Nom de la coloc">
      <View className="flex-1 gap-6 pt-4">
        <View className="gap-2">
          <Typography variant="body" className="text-gray-600 dark:text-gray-400">
            Choisis un nom pour ta colocation.
          </Typography>
        </View>

        <form.AppField name="name">
          {(field) => (
            <field.Input
              placeholder="Nom de la colocation"
              autoCapitalize="words"
              value={field.state.value}
              onChangeText={field.handleChange}
              onBlur={field.handleBlur}
              error={field.state.meta.isTouched ? formatErrors(field.state.meta.errors) : undefined}
            />
          )}
        </form.AppField>

        <form.Subscribe>
          {({ canSubmit }) => (
            <form.CustomButton
              variant="primary"
              size="lg"
              title="Enregistrer"
              disabled={isPending || !canSubmit}
              onPress={form.handleSubmit}
            />
          )}
        </form.Subscribe>
      </View>
    </Screen>
  );
}
