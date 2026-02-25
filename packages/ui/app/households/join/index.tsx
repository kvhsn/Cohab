import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Button, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import mutations from '@/libs/mutations';

export default function JoinHousehold() {
  const [code, setCode] = useState('');
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    ...mutations.households.joinHouseholdMutation(code),
    onSuccess: () => {
      Alert.alert('Success', 'Household joined!');
      queryClient.invalidateQueries({ queryKey: ['households'] });
      router.push('/households');
    },
    onError: (error) => {
      Alert.alert('Error', error.message || 'Join household failed');
    },
  });

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
        <Button title="Submit" onPress={() => mutate()} disabled={isPending || !code} />
      </View>
    </SafeAreaView>
  );
}
