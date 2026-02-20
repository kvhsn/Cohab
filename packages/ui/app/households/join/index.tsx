import { API_URL } from '@/constants/Config';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Button, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getValueForSecureStorage } from '@/libs/secureStorage';

export default function JoinHousehold() {
  const [code, setCode] = useState('');

  const handleJoin = async () => {
    try {
      const token = await getValueForSecureStorage('token');
      const response = await fetch(`${API_URL}/api/households/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          code,
        }),
      });

      if (response.ok) {
        Alert.alert('Success', 'Household joined!');
        router.push('/households');
      } else {
        const data = await response.json();
        Alert.alert('Error', data.message || 'Join household failed');
      }
    } catch (error) {
      console.log({ error });
      Alert.alert('Error', 'Could not connect to server');
    }
  };

  return (
    <SafeAreaView>
      <View>
        <Text>Join Household</Text>
        <TextInput
          placeholder="join code"
          autoCapitalize="none"
          value={code}
          keyboardType="numeric"
          onChangeText={(text) => setCode(text)}
        />
        <Button title="Submit" onPress={handleJoin} />
      </View>
    </SafeAreaView>
  );
}
