import React from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import mutations from '@/libs/mutations';
import { createFormHook, createFormHookContexts } from '@tanstack/react-form';
import { LoginSchema } from '@colocapp/shared/src/auth';

export default function Login() {
  const router = useRouter();
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
    <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Login</Text>

      <View>
        <form.AppField name="email">
          {(field) => (
            <field.TextInput
              placeholder="Email"
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
            <field.TextInput
              placeholder="Password"
              autoCapitalize="none"
              secureTextEntry
              value={field.state.value}
              onChangeText={field.handleChange}
              onBlur={field.handleBlur}
            />
          )}
        </form.AppField>

        <form.Button title="Login" disabled={isPending} onPress={() => form.handleSubmit()} />
      </View>

      <View style={{ marginTop: 20 }}>
        <Text>Don&apos;t have an account?</Text>
        <Link href="/register">Register here</Link>
      </View>
    </View>
  );
}
