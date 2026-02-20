import { API_URL } from '@/constants/Config';
import { getValueForSecureStorage } from '@/libs/secureStorage';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Button, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Form = {
  name: string;
  amount: number | undefined;
};

export default function CreateExpense() {
  const { householdId } = useLocalSearchParams<{ householdId: string }>();
  const [form, setForm] = useState<Form>({
    name: '',
    amount: undefined,
  });

  const handleOnCreateExpense = async () => {
    if (!form.name || !form.amount) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const token = await getValueForSecureStorage('token');
      const response = await fetch(`${API_URL}/api/households/${householdId}/expenses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          amount: Number(form.amount),
        }),
      });

      if (response.ok) {
        Alert.alert('Success', 'Expense created!');
        router.push({
          pathname: '/households/[householdId]',
          params: { householdId },
        });
      } else {
        const data = await response.json();
        Alert.alert('Error', data.message || 'Expense creation failed');
      }
    } catch (error) {
      console.log({ error });
      Alert.alert('Error', 'Could not connect to server');
    }
  };

  return (
    <SafeAreaView>
      <View>
        <Text>Create Expense</Text>
        <TextInput
          placeholder="Name (e.g., Groceries)"
          value={form.name}
          onChangeText={(name) => setForm({ ...form, name })}
        />
        <TextInput
          placeholder="Amount"
          keyboardType="decimal-pad"
          value={form.amount ? String(form.amount) : ''}
          onChangeText={(amount) =>
            setForm({ ...form, amount: amount ? Number(amount) : undefined })
          }
        />
        <Button title="Submit Expense" onPress={handleOnCreateExpense} />
      </View>
    </SafeAreaView>
  );
}
