import Screen from '@/components/Screen/Screen';
import Typography from '@/components/Typography/Typography';
import queries from '@/libs/queries';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Link, useLocalSearchParams } from 'expo-router';
import { Suspense } from 'react';
import { FlatList, View } from 'react-native';

function ExpenseList({ householdId }: { householdId: string }) {
  const { data } = useSuspenseQuery(queries.expenses.getExpensesQuery(householdId));

  return (
    <FlatList
      data={data.expenses}
      ListEmptyComponent={
        <Typography variant="bodySmall" className="text-center">
          Aucune dépense pour l&apos;instant
        </Typography>
      }
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => {
        return (
          <View>
            <Typography variant="body">{item.name}</Typography>
            <Typography variant="bodySmall">{item.amount} €</Typography>
            <Typography variant="caption">{item.createdAt}</Typography>
            <Typography variant="bodySmall">{item.member.name}</Typography>
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
    <Screen title="Dépenses">
      <Suspense fallback={<Typography variant="body">Chargement...</Typography>}>
        <ExpenseList householdId={householdId} />
      </Suspense>
      <Link
        href={{
          pathname: '/households/[householdId]/expenses/create',
          params: { householdId },
        }}>
        <Typography variant="bodySmall">Ajouter les dépenses</Typography>
      </Link>
    </Screen>
  );
}
