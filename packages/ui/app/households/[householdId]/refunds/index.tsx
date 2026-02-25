import { useLocalSearchParams } from 'expo-router';
import { Suspense } from 'react';
import { Text, View } from 'react-native';
import { useSuspenseQuery } from '@tanstack/react-query';
import queries from '@/libs/queries';

function RefundContent({ householdId }: { householdId: string }) {
  const { data: refunds } = useSuspenseQuery(queries.households.getRefundsQuery(householdId));

  return (
    <View>
      {refunds.map(({ fromMemberId, toMemberId, amount }) => (
        <Text key={fromMemberId + toMemberId}>
          {fromMemberId} owes {toMemberId} {amount}
        </Text>
      ))}
    </View>
  );
}

export default function RefundRoot() {
  const { householdId } = useLocalSearchParams<{ householdId: string }>();

  if (!householdId) return null;

  return (
    <Suspense fallback={<Text>Loading refund...</Text>}>
      <RefundContent householdId={householdId} />
    </Suspense>
  );
}
