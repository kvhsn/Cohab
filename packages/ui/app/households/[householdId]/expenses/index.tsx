import { Link, useLocalSearchParams } from 'expo-router';
import { FlatList, SafeAreaView, SafeAreaViewBase, Text, View } from 'react-native';
import { GetExpenses, GetExpensesSchema } from '@colocapp/shared/src/expense';
import { Suspense, use } from 'react';
import { getValueForSecureStorage } from '@/libs/secureStorage';
import { API_URL } from '@/constants/Config';

const dataLoader = async (householdId: string): Promise<GetExpenses> => {
  const token = await getValueForSecureStorage('token');
  const response = await fetch(`${API_URL}/api/households/${householdId}/expenses`, {
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
  return GetExpensesSchema.parse(body);
};

function ExpenseList({ dataLoader }: { dataLoader: Promise<GetExpenses> }) {
  const { expenses } = use(dataLoader);

  return (
    <FlatList
      data={expenses}
      renderItem={({ item }) => {
        return (
          <View>
            <Text>Name: {item.name}</Text>
            <Text>Amount: {item.amount}</Text>
          </View>
        );
      }}
    />
  );
}

export default function Expenses() {
  const { householdId } = useLocalSearchParams<{ householdId: string }>();
  return (
    <SafeAreaView>
      <View>
        <Text>Expenses</Text>
        <Suspense fallback="Loading expenses...">
          <ExpenseList dataLoader={dataLoader(householdId)} />
        </Suspense>
        <Link
          href={{
            pathname: '/households/[householdId]/expenses/create',
            params: { householdId },
          }}>
          Add Expense
        </Link>
      </View>
    </SafeAreaView>
  );
}
