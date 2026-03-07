import queries from '@/libs/queries';
import { removeMemberMutation } from '@/libs/features/households/mutations';
import { useMutation, useSuspenseQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import Icon from '@/components/Icon/Icon';
import Screen from '@/components/Screen/Screen';

export default function ManageMembers() {
  const queryClient = useQueryClient();
  const { data } = useSuspenseQuery(queries.households.getHouseholdsQuery());
  const { data: authData } = useAuth();
  const user = authData?.user;

  const { mutate, isPending } = useMutation({
    ...removeMemberMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries(queries.households.getHouseholdsQuery());
    },
    onError: (error: Error) => {
      Alert.alert('Erreur', error.message || 'Impossible de retirer le membre');
    },
  });

  const handleRemove = (memberId: string, memberName: string) => {
    Alert.alert('Retirer', `Veux-tu vraiment retirer ${memberName} de la colocation ?`, [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Retirer', style: 'destructive', onPress: () => mutate(memberId) },
    ]);
  };

  const isAdmin = data.adminId === user?.id;

  return (
    <Screen title="Gérer les membres">
      <View className="flex-1 p-4">
        {data.members?.map((item) => (
          <View
            key={item.id}
            className="mb-3 flex-row items-center rounded-xl bg-white dark:bg-slate-800 p-4 shadow-sm border border-transparent dark:border-slate-700">
            <View className="mr-4 relative">
              <View className="size-12 items-center justify-center rounded-full bg-primary/10">
                <Text className="text-lg font-bold text-primary">
                  {item.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              {data.adminId === item.id && (
                <View className="absolute -right-1 -top-1 rounded-full bg-white dark:bg-slate-700 p-0.5 shadow-sm">
                  <Icon as="FontAwesome5" name="crown" size="sm" color="#ca8a04" />
                </View>
              )}
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-gray-900 dark:text-gray-100">
                {item.name}
              </Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400">{item.email}</Text>
            </View>
            {isAdmin && item.id !== user?.id && (
              <Pressable
                disabled={isPending}
                onPress={() => handleRemove(item.id, item.name)}
                className="ml-2 rounded-lg bg-red-50 dark:bg-red-950/40 p-2 active:bg-red-100 dark:active:bg-red-900/40">
                <Icon as="Ionicons" name="trash-outline" size="sm" className="color-red-500" />
              </Pressable>
            )}
          </View>
        ))}
      </View>
    </Screen>
  );
}
