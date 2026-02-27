import { router } from 'expo-router';
import { Alert, Button, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import mutations from '@/libs/mutations';
import { createFormHook, createFormHookContexts } from '@tanstack/react-form';
import { JoinHouseHoldSchema } from '@colocapp/shared/src/household';

export default function JoinHousehold() {
  const queryClient = useQueryClient();
  const { fieldContext, formContext } = createFormHookContexts();

  const { useAppForm } = createFormHook({
    fieldComponents: { TextInput },
    formComponents: { Button },
    fieldContext,
    formContext,
  });

  const form = useAppForm({
    defaultValues: {
      code: '',
    },
    validators: {
      onChange: JoinHouseHoldSchema,
    },
    onSubmit: ({ value }) => {
      mutate(value);
    },
  });

  const { mutate, isPending } = useMutation({
    ...mutations.households.joinHouseholdMutation(),
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
        <View>
          <form.AppField name="code">
            {(field) => (
              <field.TextInput
                placeholder="join code"
                autoCapitalize="none"
                keyboardType="numeric"
                value={field.state.value}
                onChangeText={field.handleChange}
                onBlur={field.handleBlur}
              />
            )}
          </form.AppField>
          <form.Button title="Submit" disabled={isPending} onPress={() => form.handleSubmit()} />
        </View>
      </View>
    </SafeAreaView>
  );
}
