import { useLocalSearchParams } from 'expo-router';
import { Suspense } from 'react';
import { Text, View } from 'react-native';
import { useSuspenseQuery } from '@tanstack/react-query';
import queries from '@/libs/queries';

function BalanceContent({ householdId }: { householdId: string }) {
  const { data } = useSuspenseQuery(queries.households.getHouseholdBalanceQuery(householdId));
  const { total, shares } = data;
  return (
    <View>
      <Text>Total: {total}</Text>
      {Object.entries(shares).map(([memberId, amount]) => (
        <Text key={memberId}>
          {memberId}: {amount}
        </Text>
      ))}
    </View>
  );
}

export default function BalanceRoot() {
  const { householdId } = useLocalSearchParams<{ householdId: string }>();

  if (!householdId) return null;

  return (
    <Suspense fallback={<Text>Loading balance...</Text>}>
      <BalanceContent householdId={householdId} />
    </Suspense>
  );
}
