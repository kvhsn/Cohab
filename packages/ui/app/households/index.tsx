import { Logo } from '@/components/Logo/Logo';
import Screen from '@/components/Screen/Screen';
import Typography from '@/components/Typography/Typography';
import queries from '@/libs/queries';
import { useQuery } from '@tanstack/react-query';
import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import HouseholdChoiceScreen from './HouseholdChoiceScreen';
import PendingInvitationsView from './PendingInvitationsView';

export default function Households() {
  const { data: me, isPending: isMePending } = useQuery(queries.me.getMeQuery());

  const { data: pendingInvites, isPending: isInvitesPending } = useQuery(
    queries.households.getPendingInvitationsQuery(),
  );

  if (isMePending || isInvitesPending) {
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

  if (me?.household?.id) {
    return (
      <Redirect
        href={{
          pathname: '/households/[householdId]',
          params: { householdId: me.household.id },
        }}
      />
    );
  }

  if (pendingInvites && pendingInvites.length > 0) {
    return <PendingInvitationsView invitations={pendingInvites} />;
  }

  return <HouseholdChoiceScreen />;
}
