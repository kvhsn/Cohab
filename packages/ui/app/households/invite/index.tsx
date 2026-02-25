import { SafeAreaView } from 'react-native-safe-area-context';
import { Alert, Button, TextInput, View, Text } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import mutations from '@/libs/mutations';

export default function InviteHousehold() {
  const [householdId, setHouseholdId] = useState('');

  const { mutate, isPending } = useMutation({
    ...mutations.households.createInviteCodeMutation(householdId),
    onSuccess: (data) => {
      Alert.alert(
        'Success',
        `Household Invitation created for ${householdId} with code ${data.code}`,
      );
      router.push('/households');
    },
    onError: (error) => {
      Alert.alert('Error', error.message || 'Invite household failed');
    },
  });

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
        <Button
          title="Create code"
          onPress={() => mutate()}
          disabled={isPending || !householdId}></Button>
      </View>
    </SafeAreaView>
  );
}
