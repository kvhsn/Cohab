import MemberCard from '@/components/MemberCard/MemberCard';
import Screen from '@/components/Screen/Screen';
import { removeMemberMutation } from '@/libs/features/households/mutations';
import queries from '@/libs/queries';
import { GetHouseholdMember } from '@cohab/shared/src/household';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import React from 'react';
import { Alert, View } from 'react-native';

export default function ManageMembers() {
  const queryClient = useQueryClient();
  const { data } = useSuspenseQuery(queries.me.getMeQuery());

  const { mutate } = useMutation({
    ...removeMemberMutation(),
    onSuccess: () => {
      return queryClient.invalidateQueries(queries.me.getMeQuery());
    },
    onError: (error: Error) => {
      Alert.alert('Erreur', error.message || 'Impossible de retirer le membre');
    },
  });

  const handleRemove = (member: GetHouseholdMember) => {
    Alert.alert('Retirer', `Veux-tu vraiment retirer ${member.name} de la colocation ?`, [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Retirer',
        style: 'destructive',
        onPress: () =>
          data.household && mutate({ householdId: data.household.id, memberId: member.id }),
      },
    ]);
  };

  const isCurrentUserAdmin = data.household?.adminId === data.id;

  return (
    <Screen title="Gérer les membres">
      <View className="flex-1 p-4 gap-4">
        {data.household?.members?.map((item) => (
          <MemberCard
            key={item.id}
            member={item}
            isMemberAdmin={data.household?.adminId === item.id}
            onRemove={isCurrentUserAdmin ? handleRemove : undefined}
          />
        ))}
      </View>
    </Screen>
  );
}
