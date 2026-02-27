import React from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import mutations from '@/libs/mutations';
import { createFormHook, createFormHookContexts } from '@tanstack/react-form';
import { RegisterSchema } from '@colocapp/shared/src/auth';

export default function Register() {
  const router = useRouter();
  const { fieldContext, formContext } = createFormHookContexts();

  const { useAppForm } = createFormHook({
    fieldComponents: { TextInput },
    formComponents: { Button },
    fieldContext,
    formContext,
  });

  const form = useAppForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validators: {
      onChange: ({ value }) => {
        if (value.password !== value.confirmPassword) {
          return 'Passwords do not match';
        }
        const res = RegisterSchema.safeParse(value);
        if (!res.success) {
          return 'Invalid form data';
        }
        return undefined;
      },
    },
    onSubmit: ({ value }) => {
      mutate({
        name: value.name,
        email: value.email,
        password: value.password,
      });
    },
  });

  const { mutate, isPending } = useMutation({
    ...mutations.auth.registerMutation(),
    onSuccess: () => {
      Alert.alert('Success', 'Registered! Please login.');
      router.replace('/login');
    },
    onError: (error) => {
      console.log({ error });
      Alert.alert('Error', error.message || 'Registration failed');
    },
  });

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Register</Text>
      <View>
        <form.AppField name="name">
          {(field) => (
            <field.TextInput
              placeholder="Name"
              autoCapitalize="none"
              value={field.state.value}
              onChangeText={field.handleChange}
              onBlur={field.handleBlur}
            />
          )}
        </form.AppField>
        <form.AppField name="email">
          {(field) => (
            <field.TextInput
              placeholder="Email"
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
        <form.AppField name="confirmPassword">
          {(field) => (
            <field.TextInput
              placeholder="Confirm Password"
              autoCapitalize="none"
              secureTextEntry
              value={field.state.value}
              onChangeText={field.handleChange}
              onBlur={field.handleBlur}
            />
          )}
        </form.AppField>
        <form.Button title="Register" disabled={isPending} onPress={() => form.handleSubmit()} />
      </View>
    </View>
  );
}
