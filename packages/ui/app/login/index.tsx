import React from 'react';
import { View, Alert, ScrollView } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import mutations from '@/libs/mutations';
import { createFormHook, createFormHookContexts } from '@tanstack/react-form';
import { LoginSchema } from '@cohab/shared/src/auth';
import Screen from '@/components/Screen/Screen';
import { Logo } from '@/components/Logo/Logo';
import Typography from '@/components/Typography/Typography';
import Input from '@/components/Input/Input';
import CustomButton from '@/components/Button/Button';

export default function Login() {
  const router = useRouter();
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

  const form = useAppForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onChange: LoginSchema,
    },
    onSubmit: ({ value }) => {
      mutate(value);
    },
  });

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    ...mutations.auth.loginMutation(),
    onSuccess: () => {
      queryClient.clear();
      Alert.alert('Success', 'Logged in!');
      router.replace('/');
    },
    onError: (error) => {
      Alert.alert('Error', error.message || 'Login failed');
    },
  });

  return (
    <Screen>
      <ScrollView
        contentContainerClassName="grow space-between px-6 py-4"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View className="flex-1 gap-10">
          <View className="flex flex-col items-center gap-4">
            <Logo />
            <View className="gap-1 items-center">
              <Typography variant="h1">Cohab</Typography>
              <Typography variant="bodySmall">
                Gérer votre collocation en toute simplicité
              </Typography>
            </View>
          </View>
          <View className="gap-6">
            <View className="gap-5">
              <form.AppField name="email">
                {(field) => (
                  <field.Input
                    placeholder="Adresse email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={field.state.value}
                    onChangeText={field.handleChange}
                    onBlur={field.handleBlur}
                  />
                )}
              </form.AppField>

              <form.AppField name="password">
                {(field) => (
                  <field.Input
                    placeholder="Mot de passe"
                    autoCapitalize="none"
                    secureTextEntry
                    value={field.state.value}
                    onChangeText={field.handleChange}
                    onBlur={field.handleBlur}
                  />
                )}
              </form.AppField>
            </View>
            <View className="items-end">
              <Link href="/register">
                <Typography variant="bodySmall" className="text-primary">
                  Mot de passe oublié ?
                </Typography>
              </Link>
            </View>
            <form.CustomButton
              variant="primary"
              size="lg"
              title="Se connecter"
              disabled={isPending}
              onPress={form.handleSubmit}
            />
          </View>
        </View>
        <View className="flex-1 flex-row items-end justify-center gap-2 pt-8 pb-2">
          <Typography variant="bodySmall">Pas encore de compte ?</Typography>
          <Link href="/register" replace>
            <Typography variant="bodySmall" className="text-primary">
              Créer un compte
            </Typography>
          </Link>
        </View>
      </ScrollView>
    </Screen>
  );
}
