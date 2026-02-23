import { API_URL } from '@/constants/Config';
import { getValueForSecureStorage } from '@/libs/secureStorage';
import { Link } from 'expo-router';
import React, { Suspense, use } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  GetHouseholdDetailsSchema,
  type GetHouseholdDetails,
} from '@colocapp/shared/src/household';

const dataLoader = async (): Promise<GetHouseholdDetails> => {
  const token = await getValueForSecureStorage('token');
  const response = await fetch(`${API_URL}/api/households`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch household details');
  }
  const body = await response.json();
  return GetHouseholdDetailsSchema.parse(body);
};

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

function HouseholdMembershipView({ dataLoader }: { dataLoader: Promise<GetHouseholdDetails> }) {
  const { id: householdId } = use(dataLoader);

  if (householdId) {
    return <HouseholdDashboard householdId={householdId} />;
  }

  return (
    <>
      <Link href="/households/create">Create</Link>
      <Link href="/households/invite">Invite</Link>
      <Link href="/households/join">Join</Link>
    </>
  );
}

export default function Households() {
  return (
    <SafeAreaView>
      <Text>Households</Text>
      <Suspense fallback={<Text>Loading household info...</Text>}>
        <HouseholdMembershipView dataLoader={dataLoader()} />
      </Suspense>
    </SafeAreaView>
  );
}
