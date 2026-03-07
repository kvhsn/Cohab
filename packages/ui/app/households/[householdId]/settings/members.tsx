import Screen from '@/components/Screen/Screen';
import { useAuth } from '@/hooks/useAuth';
import { removeMemberMutation } from '@/libs/features/households/mutations';
import queries from '@/libs/queries';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import React from 'react';
import { Alert, View } from 'react-native';
import { HouseholdMember } from '../balance/_components/types';
import MemberCard from './_components/MemberCard';

export default function ManageMembers() {
  const queryClient = useQueryClient();
  const { data } = useSuspenseQuery(queries.households.getHouseholdsQuery());
  const { data: authData } = useAuth();
  const user = authData?.user;

  const { mutate } = useMutation({
    ...removeMemberMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries(queries.households.getHouseholdsQuery());
    },
    onError: (error: Error) => {
      Alert.alert('Erreur', error.message || 'Impossible de retirer le membre');
    },
  });

  const handleRemove = (member: HouseholdMember) => {
    Alert.alert('Retirer', `Veux-tu vraiment retirer ${member.name} de la colocation ?`, [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Retirer', style: 'destructive', onPress: () => mutate(member.id) },
    ]);
  };

  const isAdmin = data.adminId === user?.id;

  return (
    <Screen title="Gérer les membres">
      <View className="flex-1 p-4">
        {data.members?.map((item) => (
          <MemberCard
            key={item.id}
            member={item}
            isMemberAdmin={data.adminId === item.id}
            canRemove={isAdmin && item.id !== user?.id}
            onRemove={handleRemove}
          />
        ))}
      </View>
    </Screen>
  );
}
