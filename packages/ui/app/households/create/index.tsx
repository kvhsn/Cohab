import CustomButton from '@/components/Button/Button';
import Card from '@/components/Card/Card';
import Icon from '@/components/Icon/Icon';
import IconButton from '@/components/IconButton/IconButton';
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
import { Alert, Pressable, View } from 'react-native';

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
      Alert.alert('Erreur', error.message || 'La création a échoué');
    },
  });

  const form = useAppForm({
    defaultValues: {
      name: '',
      invites: [''],
    },
    validators: {
      onChange: CreateHouseHoldSchema as any,
    },
    onSubmit: ({ value }) => {
      const data = {
        name: value.name,
        invites: value.invites?.filter((i) => i && i.trim() !== '') || [],
      };
      mutate(data);
    },
  });

  return (
    <Screen title="Nouvelle Coloc">
      <View className="flex-1 pb-10">
        {/* Header Progress */}
        <View className="mb-8 flex-row justify-center gap-2">
          <View className="h-1.5 w-12 rounded-full bg-primary" />
          <View className="h-1.5 w-12 rounded-full bg-primary/30" />
        </View>

        <View className="mb-8 gap-2">
          <Typography variant="h1" className="text-3xl">
            Créez votre cocon
          </Typography>
          <Typography variant="subtitle">
            Donnez un nom à votre colocation et invitez vos futurs colocs.
          </Typography>
        </View>

        <Card className="mb-6 gap-6 border-white/20 bg-white/40 dark:bg-slate-900/40">
          {/* Household Name */}
          <View className="gap-2">
            <Typography variant="caption">NOM DE LA COLOCATION</Typography>
            <form.AppField name="name">
              {(field) => (
                <field.Input
                  iconName="home-outline"
                  placeholder="Ex: L'Appart' de Jo"
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

          {/* Invites Section */}
          <View className="gap-4">
            <form.Field name="invites" mode="array">
              {(field) => (
                <View className="gap-3">
                  {field.state.value.map((_, i) => (
                    <form.Field key={i} name={`invites[${i}]`}>
                      {(subField) => {
                        const val = subField.state.value as string;
                        const isEmail = val?.includes('@');
                        const isPhone = val?.match(/[0-9]{3,}/);

                        return (
                          <View className="flex-row items-center gap-2">
                            <View className="flex-1">
                              <Input
                                iconName={
                                  isEmail
                                    ? 'mail-outline'
                                    : isPhone
                                      ? 'phone-portrait-outline'
                                      : 'person-outline'
                                }
                                placeholder="Email ou téléphone"
                                value={val}
                                onChangeText={subField.handleChange}
                                onBlur={subField.handleBlur}
                                error={
                                  subField.state.meta.isTouched
                                    ? formatErrors(subField.state.meta.errors)
                                    : undefined
                                }
                              />
                            </View>
                            {field.state.value.length > 1 && (
                              <IconButton
                                as="Ionicons"
                                name="trash-outline"
                                variant="ghost"
                                size="sm"
                                className="text-red-400"
                                onPress={() => field.removeValue(i)}
                              />
                            )}
                          </View>
                        );
                      }}
                    </form.Field>
                  ))}

                  <Pressable
                    onPress={() => field.pushValue('')}
                    className="flex-row items-center justify-center gap-2 rounded-2xl border border-dashed border-primary/40 py-4 active:bg-primary/5">
                    <Icon
                      as="Ionicons"
                      name="add-circle-outline"
                      size="md"
                      className="text-primary"
                    />
                    <Typography variant="body" className="font-bold text-primary">
                      Ajouter un autre membre
                    </Typography>
                  </Pressable>
                </View>
              )}
            </form.Field>
          </View>
        </Card>

        {/* Info Box */}
        <View className="mb-8 flex-row items-start gap-3 rounded-2xl bg-secondary/10 p-4">
          <Icon
            as="Ionicons"
            name="information-circle-outline"
            size="md"
            className="text-secondary"
          />
          <Typography variant="bodySmall" className="flex-1 text-secondary">
            Seuls les utilisateurs qui ne sont pas déjà rattachés à une colocation recevront
            l&apos;invitation.
          </Typography>
        </View>

        {/* Submit */}
        <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <CustomButton
              title={isSubmitting ? 'Création...' : 'Créer ma colocation'}
              variant="primary"
              size="lg"
              disabled={!canSubmit || isSubmitting || isPending}
              onPress={form.handleSubmit}
              RightIcon={({ color, size }) => (
                <Icon as="Ionicons" name="sparkles-outline" color={color} size={size} />
              )}
            />
          )}
        </form.Subscribe>
      </View>
    </Screen>
  );
}
