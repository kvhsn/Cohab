import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { saveSecureStorage } from '@/libs/secureStorage';
import { useMutation } from '@tanstack/react-query';
import mutations from '@/libs/mutations';

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const { mutate, isPending } = useMutation({
    ...mutations.auth.loginMutation(form),
    onSuccess: async (data) => {
      Alert.alert('Success', 'Logged in!');
      await saveSecureStorage('token', data.token);
      router.replace('/');
    },
    onError: (error) => {
      Alert.alert('Error', error.message || 'Login failed');
    },
  });

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Login</Text>

      <TextInput
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={form.email}
        onChangeText={(text) => setForm({ ...form, email: text })}
      />

      <TextInput
        placeholder="Password"
        autoCapitalize="none"
        secureTextEntry
        value={form.password}
        onChangeText={(text) => setForm({ ...form, password: text })}
      />

      <Button title="Login" onPress={() => mutate()} disabled={isPending} />
    </View>
  );
}
