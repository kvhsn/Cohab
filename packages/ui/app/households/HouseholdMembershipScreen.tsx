import Screen from '@/components/Screen/Screen';
import queries from '@/libs/queries';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Link, Stack } from 'expo-router';
import { View } from 'react-native';
import HouseholdChoiceScreen from './HouseholdChoiceScreen';

function HouseholdDashboard({ householdId }: { householdId: string }) {
  return (
    <Screen>
      <Stack.Screen options={{ title: 'Ma Coloc' }} />
      <View>
        <Link
          href={{
            pathname: '/households/[householdId]',
            params: { householdId },
          }}>
          Show details
        </Link>
      </View>
    </Screen>
  );
}

export default function HouseholdMembershipView() {
  const { data } = useSuspenseQuery(queries.households.getHouseholdsQuery());
  const householdId = data?.id;

  if (householdId) {
    return <HouseholdDashboard householdId={householdId} />;
  }

  return <HouseholdChoiceScreen />;
}
