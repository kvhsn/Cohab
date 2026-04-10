import CustomButton from '@/components/Button/Button';
import Card from '@/components/Card/Card';
import Divider from '@/components/Divider/Divider';
import Icon from '@/components/Icon/Icon';
import Screen from '@/components/Screen/Screen';
import Typography from '@/components/Typography/Typography';
import { CATEGORY_ICONS } from '@/libs/features/expenses/constants';
import { formatAmount, formatDate } from '@/libs/format';
import { queryKeys } from '@/libs/keys';
import mutations from '@/libs/mutations';
import queries from '@/libs/queries';
import { EXPENSE_CATEGORY_LABELS } from '@cohab/shared/src/expense';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { Alert, View } from 'react-native';

export default function ExpenseDetail() {
  const { householdId, expenseId } = useLocalSearchParams<{
    householdId: string;
    expenseId: string;
  }>();
  const queryClient = useQueryClient();

  const { data: expense } = useSuspenseQuery(
    queries.expenses.getExpenseQuery(householdId, expenseId),
  );

  const { mutate: deleteMutate, isPending } = useMutation({
    ...mutations.expenses.deleteExpenseMutation(householdId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.expenses.all(householdId) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.households.balance(householdId) }),
      ]);
      router.back();
    },
    onError: (error) => {
      Alert.alert('Erreur', error.message || 'Échec de la suppression');
    },
  });

  const handleDelete = () => {
    Alert.alert('Supprimer la dépense', 'Êtes-vous sûr de vouloir supprimer cette dépense ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: () => deleteMutate(expenseId),
      },
    ]);
  };

  const categoryIcon = CATEGORY_ICONS[expense.category];
  const categoryLabel = EXPENSE_CATEGORY_LABELS[expense.category];

  return (
    <Screen title="Détail de la dépense">
      {/* Amount header */}
      <Card className="items-center py-8">
        <Typography variant="caption" className="mb-2">
          MONTANT
        </Typography>
        <Typography variant="h1" className="text-5xl font-bold">
          {formatAmount(expense.amount)} €
        </Typography>
        <Typography variant="bodySmall" className="mt-2 opacity-60">
          {formatDate(expense.createdAt)}
        </Typography>
      </Card>

      {/* Details */}
      <Card className="gap-0 mt-2">
        {/* Name */}
        <View className="flex-row items-center gap-3 py-4">
          <View className="size-10 items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20">
            <Icon as="Ionicons" name="receipt" size="md" className="text-primary" />
          </View>
          <View className="flex-1">
            <Typography variant="caption">Nom</Typography>
            <Typography variant="body" weight="semibold">
              {expense.name}
            </Typography>
          </View>
        </View>

        <Divider />

        {/* Category */}
        <View className="flex-row items-center gap-3 py-4">
          <View className="size-10 items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20">
            <Icon as="Ionicons" name={categoryIcon} size="md" className="text-primary" />
          </View>
          <View className="flex-1">
            <Typography variant="caption">Catégorie</Typography>
            <Typography variant="body" weight="semibold">
              {categoryLabel}
            </Typography>
          </View>
        </View>

        <Divider />

        {/* Paid by */}
        <View className="flex-row items-center gap-3 py-4">
          <View className="size-10 items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20">
            <Icon as="Ionicons" name="person" size="md" className="text-primary" />
          </View>
          <View className="flex-1">
            <Typography variant="caption">Payé par</Typography>
            <Typography variant="body" weight="semibold">
              {expense.member.name}
            </Typography>
          </View>
        </View>

        {/* Note (conditional) */}
        {expense.note ? (
          <>
            <Divider />
            <View className="flex-row items-center gap-3 py-4">
              <View className="size-10 items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20">
                <Icon as="Ionicons" name="create" size="md" className="text-primary" />
              </View>
              <View className="flex-1">
                <Typography variant="caption">Note</Typography>
                <Typography variant="body">{expense.note}</Typography>
              </View>
            </View>
          </>
        ) : null}
      </Card>

      {/* Delete button (only for own expenses) */}
      {expense.isMine && (
        <View className="mt-6">
          <CustomButton
            title={isPending ? 'Suppression...' : 'Supprimer la dépense'}
            variant="danger"
            size="lg"
            disabled={isPending}
            onPress={handleDelete}
          />
        </View>
      )}
    </Screen>
  );
}
