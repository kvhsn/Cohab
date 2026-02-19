import { SafeAreaView } from 'react-native-safe-area-context';
import { Alert, Button, TextInput, View, Text } from 'react-native';
import { getValueForSecureStorage } from '@/libs/secureStorage';
import { API_URL } from '@/constants/Config';
import { router } from 'expo-router';
import { useState } from 'react';

export default function InviteHousehold() {
  const [householdId, setHouseholdId] = useState('');
  const handleCreateInviteCode = async () => {
    try {
      const token = await getValueForSecureStorage('token');
      const response = await fetch(`${API_URL}/api/households/${householdId}/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        Alert.alert(
          'Success',
          `Household Invitation created for ${householdId} with code ${data.code}`,
        );
        router.push('/households');
      } else {
        const data = await response.json();
        Alert.alert('Error', data.message || 'Invite household failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not connect to server');
    }
  };

  return (
    <SafeAreaView>
      <View>
        <Text>Create invite :</Text>
        <TextInput
          placeholder="Household id"
          autoCapitalize="none"
          value={householdId}
          onChangeText={(text) => setHouseholdId(text)}
        />
        <Button title="Create code" onPress={handleCreateInviteCode}></Button>
      </View>
    </SafeAreaView>
  );
}
