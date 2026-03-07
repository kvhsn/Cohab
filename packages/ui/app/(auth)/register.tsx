import CustomButton from '@/components/Button/Button';
import Input from '@/components/Input/Input';
import { Logo } from '@/components/Logo/Logo';
import Screen from '@/components/Screen/Screen';
import Typography from '@/components/Typography/Typography';
import { formatErrors } from '@/libs/form';
import mutations from '@/libs/mutations';
import { RegisterSchema } from '@cohab/shared/src/auth';
import { createFormHook, createFormHookContexts } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { Link, useRouter } from 'expo-router';
import React from 'react';
import { Alert, View } from 'react-native';
import { z } from 'zod';

export default function Register() {
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

  const registerValidationSchema = RegisterSchema.extend({
    confirmPassword: z.string().min(1, 'Veuillez confirmer votre mot de passe'),
  }).refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });

  const form = useAppForm({
    defaultValues: {
      name: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
    },
    validators: {
      onChange: registerValidationSchema,
      onMount: registerValidationSchema,
    },
    onSubmit: ({ value }) => {
      mutate({
        name: value.name,
        email: value.email,
        phoneNumber: value.phoneNumber,
        password: value.password,
      });
    },
  });

  const { mutate, isPending } = useMutation({
    ...mutations.auth.registerMutation(),
    onSuccess: () => {
      Alert.alert('Succès', 'Inscription réussie ! Connectez-vous.');
      router.replace('/login');
    },
    onError: (error) => {
      Alert.alert('Erreur', error.message || "L'inscription a échoué");
    },
  });

  return (
    <Screen>
      <View className="flex-1 gap-10">
        <View className="flex flex-col items-center gap-4">
          <Logo />
          <View className="gap-1 items-center">
            <Typography variant="h1">Cohab</Typography>
            <Typography variant="bodySmall">Rejoignez l&apos;aventure de la colocation</Typography>
          </View>
        </View>
        <View className="gap-6">
          <View className="gap-1">
            <form.AppField name="name">
              {(field) => (
                <field.Input
                  iconName="man"
                  placeholder="Nom complet"
                  autoCapitalize="words"
                  value={field.state.value}
                  onChangeText={field.handleChange}
                  onBlur={field.handleBlur}
                  error={
                    field.state.meta.isTouched ? formatErrors(field.state.meta.errors) : undefined
                  }
                />
              )}
            </form.AppField>

            <form.AppField name="email">
              {(field) => (
                <field.Input
                  placeholder="Adresse email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={field.state.value}
                  onChangeText={field.handleChange}
                  onBlur={field.handleBlur}
                  error={
                    field.state.meta.isTouched ? formatErrors(field.state.meta.errors) : undefined
                  }
                />
              )}
            </form.AppField>

            <form.AppField name="phoneNumber">
              {(field) => (
                <field.Input
                  placeholder="Numéro de téléphone"
                  keyboardType="phone-pad"
                  autoCapitalize="none"
                  value={field.state.value}
                  onChangeText={field.handleChange}
                  onBlur={field.handleBlur}
                  error={
                    field.state.meta.isTouched ? formatErrors(field.state.meta.errors) : undefined
                  }
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
                  error={
                    field.state.meta.isTouched ? formatErrors(field.state.meta.errors) : undefined
                  }
                />
              )}
            </form.AppField>

            <form.AppField name="confirmPassword">
              {(field) => (
                <field.Input
                  placeholder="Confirmer le mot de passe"
                  autoCapitalize="none"
                  secureTextEntry
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
          <form.Subscribe selector={(state) => ({ canSubmit: state.canSubmit })}>
            {({ canSubmit }) => (
              <form.CustomButton
                variant="primary"
                size="lg"
                title="S'inscrire"
                disabled={isPending || !canSubmit}
                onPress={form.handleSubmit}
              />
            )}
          </form.Subscribe>
        </View>
      </View>
      <View className="flex-1 flex-row items-center justify-center pt-8 pb-2 gap-2">
        <Typography variant="bodySmall">Déjà un compte ?</Typography>
        <Link href="/login" replace>
          <Typography variant="bodySmall" size="xs" className="text-primary dark:text-primary">
            Se connecter
          </Typography>
        </Link>
      </View>
    </Screen>
  );
}
