import { API_URL } from '@/constants/Config';
import { getValueForSecureStorage } from '@/libs/secureStorage';
import { useLocalSearchParams } from 'expo-router';
import { Suspense, use } from 'react';
import { Text, View } from 'react-native';
import { Refund, Refunds, RefundsSchema } from '@colocapp/shared/src/refund';

const dataLoader = async (householdId: string): Promise<Refund[]> => {
  const token = await getValueForSecureStorage('token');
  const response = await fetch(`${API_URL}/api/households/${householdId}/refunds`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch household refunds');
  }
  const body = await response.json();
  return RefundsSchema.parse(body).refunds;
};

function RefundContent({ dataLoader }: { dataLoader: Promise<Refund[]> }) {
  const refunds = use(dataLoader);
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
  return (
    <Suspense fallback={'Loading refund...'}>
      <RefundContent dataLoader={dataLoader(householdId)} />
    </Suspense>
  );
}
