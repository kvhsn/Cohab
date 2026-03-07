import Screen from '@/components/Screen/Screen';
import Typography from '@/components/Typography/Typography';
import { Logo } from '@/components/Logo/Logo';
import queries from '@/libs/queries';
import { useQuery } from '@tanstack/react-query';
import { Redirect } from 'expo-router';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import HouseholdChoiceScreen from './HouseholdChoiceScreen';
import PendingInvitationsView from './PendingInvitationsView';

export default function HouseholdMembershipView() {
  const { data: household, isPending: isHouseholdPending } = useQuery(
    queries.households.getHouseholdsQuery(),
  );

  const { data: pendingInvites, isPending: isInvitesPending } = useQuery(
    queries.households.getPendingInvitationsQuery(),
  );

  if (isHouseholdPending || isInvitesPending) {
    return (
      <Screen>
        <View className="flex-1 justify-center items-center gap-6">
          <Logo size={120} />
          <View className="items-center gap-2">
            <ActivityIndicator size="large" className="text-primary" color="#3b82f6" />
            <Typography variant="bodySmall" className="text-gray-500 font-medium">
              Chargement de votre espace...
            </Typography>
          </View>
        </View>
      </Screen>
    );
  }

  if (household?.id) {
    return (
      <Redirect
        href={{
          pathname: '/households/[householdId]',
          params: { householdId: household.id },
        }}
      />
    );
  }

  if (pendingInvites && pendingInvites.length > 0) {
    return <PendingInvitationsView invitations={pendingInvites} />;
  }

  return <HouseholdChoiceScreen />;
}
