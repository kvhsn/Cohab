import Screen from '@/components/Screen/Screen';
import { useLocalSearchParams } from 'expo-router';
import { Suspense } from 'react';
import { View } from 'react-native';
import Typography from '@/components/Typography/Typography';
import { useSuspenseQuery } from '@tanstack/react-query';
import queries from '@/libs/queries';

function BalanceContent({ householdId }: { householdId: string }) {
  const { data } = useSuspenseQuery(queries.households.getHouseholdBalanceQuery(householdId));
  const { total, shares } = data;
  return (
    <View>
      <Typography variant="body">Total: {total}</Typography>
      {Object.entries(shares).map(([memberId, amount]) => (
        <Typography variant="bodySmall" key={memberId}>
          {memberId}: {amount}
        </Typography>
      ))}
    </View>
  );
}

export default function BalanceRoot() {
  const { householdId } = useLocalSearchParams<{ householdId: string }>();

  if (!householdId) return null;

  return (
    <Screen title="Balance">
      <Suspense fallback={<Typography variant="body">Chargement...</Typography>}>
        <BalanceContent householdId={householdId} />
      </Suspense>
    </Screen>
  );
}
