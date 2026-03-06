import CustomButton from '@/components/Button/Button';
import Icon from '@/components/Icon/Icon';
import Input from '@/components/Input/Input';
import Screen from '@/components/Screen/Screen';
import Typography from '@/components/Typography/Typography';
import { formatErrors } from '@/libs/form';
import mutations from '@/libs/mutations';
import { CreateHouseHoldSchema } from '@cohab/shared/src/household';
import { createFormHook, createFormHookContexts } from '@tanstack/react-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, View } from 'react-native';

export default function CreateHousehold() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { fieldContext, formContext } = createFormHookContexts();

  const { useAppForm } = createFormHook({
    fieldComponents: { Input },
    formComponents: { CustomButton },
    fieldContext,
    formContext,
  });

  const { mutate, isPending } = useMutation({
    ...mutations.households.createHouseholdMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['households'] });
      router.replace('/');
    },
    onError: (error: Error) => {
      console.error(error);
      Alert.alert('Erreur', 'La création a échoué');
    },
  });

  const form = useAppForm({
    defaultValues: {
      name: '',
    },
    validators: {
      onChange: CreateHouseHoldSchema,
      onMount: CreateHouseHoldSchema,
    },
    onSubmit: ({ value }) => {
      mutate(value);
    },
  });

  return (
    <View className="flex-1">
      <Screen headerTitle="Creation de la colocation">
        <View className="flex-1 py-4">
          <View className="mt-2 mb-8 gap-3">
            <Typography variant="h1">Créez votre coloc</Typography>
            <Typography variant="subtitle">
              Donnez un nom à votre cocon pour commencer l&apos;aventure.
            </Typography>
          </View>

          <View className="gap-2 mb-8">
            <Typography variant="bodySmall" className="font-bold text-gray-700 ml-1">
              Nom de la colocation
            </Typography>
            <form.AppField name="name">
              {(field) => (
                <field.Input
                  iconName="home-outline"
                  placeholder="L'Appart du Bonheur"
                  autoCapitalize="sentences"
                  value={field.state.value}
                  onChangeText={field.handleChange}
                  onBlur={field.handleBlur}
                  error={
                    field.state.meta.isTouched ? formatErrors(field.state.meta.errors) : undefined
                  }
                />
              )}
            </form.AppField>
          </View>

          <View className="flex-1 justify-end mt-12 pb-8">
            <form.Subscribe selector={(state) => [state.canSubmit]}>
              {([canSubmit]) => (
                <form.CustomButton
                  variant="primary"
                  size="lg"
                  title="Suivant"
                  disabled={isPending || !canSubmit}
                  onPress={form.handleSubmit}
                  RightIcon={({ color: iconColor, size: iconSize }) => (
                    <Icon as="Ionicons" name="arrow-forward" size={iconSize} color={iconColor} />
                  )}
                />
              )}
            </form.Subscribe>
          </View>
        </View>
      </Screen>
    </View>
  );
}
