import { API_URL } from '@/constants/Config';
import { router } from 'expo-router';
import { getValueForSecureStorage } from '@/libs/secureStorage';
import { useState } from 'react';
import { Alert, Button, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CreateHousehold() {
  const [name, setName] = useState('');
  const handleCreate = async () => {
    try {
      const token = await getValueForSecureStorage('token');
      const response = await fetch(`${API_URL}/api/households`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
        }),
      });

      if (response.ok) {
        Alert.alert('Success', 'Household created!');
        router.push('/households');
      } else {
        const data = await response.json();
        Alert.alert('Error', data.message || 'Create household failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not connect to server');
    }
  };

  return (
    <SafeAreaView>
      <View>
        <Text>Create Household</Text>
        <TextInput
          placeholder="Household name"
          autoCapitalize="none"
          value={name}
          onChangeText={(text) => setName(text)}
        />
        <Button title="Submit" onPress={handleCreate} />
      </View>
    </SafeAreaView>
  );
}
