import { Link } from 'expo-router';
import React, { Suspense } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSuspenseQuery } from '@tanstack/react-query';
import queries from '@/libs/queries';

function HouseholdDashboard({ householdId }: { householdId: string }) {
  return (
    <View>
      <View>
        <Link
          href={{
            pathname: '/households/[householdId]',
            params: { householdId },
          }}>
          Show details
        </Link>
      </View>
    </View>
  );
}

function HouseholdMembershipView() {
  const { data } = useSuspenseQuery(queries.households.getHouseholdsQuery());
  const { id: householdId } = data;

  if (householdId) {
    return <HouseholdDashboard householdId={householdId} />;
  }

  return (
    <>
      <Link href="/households/create">Create</Link>
      <Link href="/households/join">Join</Link>
    </>
  );
}

export default function Households() {
  return (
    <SafeAreaView>
      <Text>Households</Text>
      <Suspense fallback={<Text>Loading household info...</Text>}>
        <HouseholdMembershipView />
      </Suspense>
    </SafeAreaView>
  );
}
