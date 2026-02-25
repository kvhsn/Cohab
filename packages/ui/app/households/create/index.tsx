import { Button, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import mutations from '@/libs/mutations';
import { router } from 'expo-router';
import { createFormHook, createFormHookContexts } from '@tanstack/react-form';
import { CreateHouseHoldSchema } from '@colocapp/shared/src/household';

export default function CreateHousehold() {
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
      name: '',
    },
    validators: {
      onChange: CreateHouseHoldSchema,
    },
    onSubmit: ({ value }) => {
      mutate(value);
    },
  });

  const { mutate, isPending } = useMutation({
    ...mutations.households.createHouseholdMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['households'] });
      router.push('/households');
    },
  });

  return (
    <SafeAreaView>
      <View>
        <Text>Create Household</Text>
        <View>
          <form.AppField
            name="name"
            children={(field) => (
              <field.TextInput
                placeholder="Household name"
                autoCapitalize="none"
                value={field.state.value}
                onChangeText={field.handleChange}
                onBlur={field.handleBlur}
              />
            )}
          />
          <form.Button title="Submit" disabled={isPending} onPress={() => form.handleSubmit()} />
        </View>
      </View>
    </SafeAreaView>
  );
}
