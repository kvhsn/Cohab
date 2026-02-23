import { API_URL } from '@/constants/Config';
import { getValueForSecureStorage } from '@/libs/secureStorage';
import { Balance, BalanceSchema } from '@colocapp/shared/src/balance';
import { useLocalSearchParams } from 'expo-router';
import { Suspense, use } from 'react';
import { Text, View } from 'react-native';

const dataLoader = async (householdId: string): Promise<Balance> => {
  const token = await getValueForSecureStorage('token');
  const response = await fetch(`${API_URL}/api/households/${householdId}/balance`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch household balance');
  }
  const body = await response.json();
  return BalanceSchema.parse(body);
};

function BalanceContent({ dataLoader }: { dataLoader: Promise<Balance> }) {
  const { total, shares } = use(dataLoader);
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
  return (
    <Suspense fallback={'Loading balance...'}>
      <BalanceContent dataLoader={dataLoader(householdId)} />
    </Suspense>
  );
}
