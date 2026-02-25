import { Link, useLocalSearchParams } from 'expo-router';
import { FlatList, SafeAreaView, Text, View } from 'react-native';
import { Suspense } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import queries from '@/libs/queries';

function ExpenseList({ householdId }: { householdId: string }) {
  const { data } = useSuspenseQuery(queries.expenses.getExpensesQuery(householdId));

  return (
    <FlatList
      data={data.expenses}
      ListEmptyComponent={<Text>No expenses found</Text>}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => {
        return (
          <View>
            <Text>Name: {item.name}</Text>
            <Text>Amount: {item.amount}</Text>
            <Text>Created At: {item.createdAt}</Text>
            <Text>Member: {item.member.name}</Text>
          </View>
        );
      }}
    />
  );
}

export default function Expenses() {
  const { householdId } = useLocalSearchParams<{ householdId: string }>();

  if (!householdId) return null;

  return (
    <SafeAreaView>
      <View>
        <Text>Expenses</Text>
        <Suspense fallback={<Text>Loading expenses...</Text>}>
          <ExpenseList householdId={householdId} />
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
