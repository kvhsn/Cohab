import CustomButton from '@/components/Button/Button';
import Card from '@/components/Card/Card';
import Divider from '@/components/Divider/Divider';
import Icon from '@/components/Icon/Icon';
import OTPInput from '@/components/OTPInput/OTPInput';
import Screen from '@/components/Screen/Screen';
import Typography from '@/components/Typography/Typography';
import { formatErrors } from '@/libs/form';
import { JoinHouseHoldSchema } from '@cohab/shared/src/household';
import { createFormHook, createFormHookContexts } from '@tanstack/react-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Image, View } from 'react-native';
import { joinHouseholdMutation } from '../../libs/features/households/mutations';

export default function HouseholdChoiceScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { fieldContext, formContext } = createFormHookContexts();

  const { useAppForm } = createFormHook({
    fieldComponents: {
      OTPInput,
    },
    formComponents: {
      CustomButton,
    },
    fieldContext,
    formContext,
  });

  const { mutate, isPending } = useMutation({
    ...joinHouseholdMutation(),
    onSuccess: () => {
      Alert.alert('Success', 'Household joined!');
      queryClient.invalidateQueries({ queryKey: ['households'] });
    },
    onError: (error: Error) => {
      console.error(error);
      Alert.alert('Error', 'Code invalide');
    },
  });

  const form = useAppForm({
    defaultValues: {
      code: '',
    },
    validators: {
      onChange: JoinHouseHoldSchema,
      onMount: JoinHouseHoldSchema,
    },
    onSubmit: ({ value }) => {
      mutate(value);
    },
  });

  const handleCreate = () => {
    router.push('/households/create');
  };

  return (
    <Screen>
      <View className="flex-row justify-between items-center mt-4">
        <View className="w-10 h-10 items-center justify-center rounded-full bg-white/50 dark:bg-white/10"></View>
        <Typography variant="bodySmall" className="text-gray-500 font-bold">
          Aide
        </Typography>
      </View>

      <View className="mt-8 gap-2">
        <Typography variant="h1" className="text-center">
          Bienvenue chez vous
        </Typography>
        <Typography variant="subtitle" className="text-center px-4">
          Prêt à t&apos;installer ? Choisis comment tu veux commencer l&apos;aventure.
        </Typography>
      </View>

      <View className="mt-8 items-center">
        <View className="w-full aspect-4/3 rounded-3xl overflow-hidden bg-white/30 dark:bg-white/5 shadow-sm border border-white/50 dark:border-white/10">
          <Image
            source={require('@/assets/images/onboarding-house.png')}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>
      </View>

      <Card className="mt-8">
        <View className="flex-row items-center gap-4 mb-4">
          <View className="w-12 h-12 rounded-2xl bg-primary/10 items-center justify-center">
            <Icon as="Ionicons" name="key-outline" size="md" className="text-primary" />
          </View>
          <View className="flex-1">
            <Typography variant="body" className="font-bold">
              J&apos;ai un code d&apos;invitation
            </Typography>
            <Typography variant="bodySmall">Rejoins ta coloc existante</Typography>
          </View>
        </View>

        <form.AppField name="code">
          {(field) => (
            <field.OTPInput
              length={6}
              value={field.state.value}
              onChange={field.handleChange}
              error={formatErrors(field.state.meta.errors)}
              className="mb-6"
            />
          )}
        </form.AppField>

        <form.Subscribe selector={(state) => [state.canSubmit]}>
          {([canSubmit]) => (
            <form.CustomButton
              title="Valider le code"
              variant="primary"
              size="lg"
              onPress={form.handleSubmit}
              disabled={!canSubmit || isPending}
              RightIcon={({ color: iconColor, size: iconSize }) => (
                <Icon as="Ionicons" name="arrow-forward" size={iconSize} color={iconColor} />
              )}
            />
          )}
        </form.Subscribe>
      </Card>

      <Divider title="ou" />

      <Card>
        <View className="flex-row items-center gap-4 mb-4">
          <View className="w-12 h-12 rounded-2xl bg-secondary/10 items-center justify-center">
            <Icon as="Ionicons" name="add-circle-outline" size="md" className="text-secondary" />
          </View>
          <View className="flex-1">
            <Typography variant="body" className="font-bold">
              Je crée ma coloc
            </Typography>
            <Typography variant="bodySmall">
              Démarre l&apos;aventure de zéro et invite tes futurs colocs.
            </Typography>
          </View>
        </View>

        <CustomButton
          title="Créer un espace"
          variant="secondary"
          size="lg"
          onPress={handleCreate}
          LeftIcon={({ color: iconColor, size: iconSize }) => (
            <Icon as="Ionicons" name="add" size={iconSize} color={iconColor} />
          )}
        />
      </Card>
    </Screen>
  );
}
