import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';

export default function Register() {
  const [form, setForm] = useState({
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
  });

  const handleRegister = async () => {
    if (form.password !== form.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Register</Text>

      <TextInput
        placeholder="Name"
        autoCapitalize="none"
        value={form.name}
        onChangeText={(text) => setForm({ ...form, name: text })}
      />

      <TextInput
        placeholder="Email"
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

      <TextInput
        placeholder="Confirm Password"
        autoCapitalize="none"
        secureTextEntry
        value={form.confirmPassword}
        onChangeText={(text) => setForm({ ...form, confirmPassword: text })}
      />

      <Button title="Register" onPress={handleRegister} />
    </View>
  );
}
