import { useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import mutations from '@/libs/mutations';
import { router } from 'expo-router';

export default function CreateHousehold() {
  const [name, setName] = useState('');
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    ...mutations.households.createHouseholdMutation(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['households'] });
      router.push('/households');
    },
  });

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
        <Button title="Submit" onPress={() => mutate()} disabled={isPending || !name} />
      </View>
    </SafeAreaView>
  );
}
