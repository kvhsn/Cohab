import { SafeAreaView } from 'react-native-safe-area-context';
import { Alert, Button, TextInput, View, Text } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import mutations from '@/libs/mutations';
import { createFormHook, createFormHookContexts } from '@tanstack/react-form';

export default function InviteHousehold() {
  const { householdId } = useLocalSearchParams<{ householdId: string }>();
  const { fieldContext, formContext } = createFormHookContexts();

  const { useAppForm } = createFormHook({
    fieldComponents: { TextInput },
    formComponents: { Button },
    fieldContext,
    formContext,
  });

  const form = useAppForm({
    defaultValues: {
      householdId,
    },
    onSubmit: ({ value }) => {
      mutate(value);
    },
  });

  const { mutate, isPending } = useMutation({
    ...mutations.households.createInviteCodeMutation(),
    onSuccess: (data) => {
      Alert.alert(
        'Success',
        `Household Invitation created for ${householdId} with code = ${data.code}`,
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
        <View>
          <form.Button
            title="Create code"
            disabled={isPending}
            onPress={() => form.handleSubmit()}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
