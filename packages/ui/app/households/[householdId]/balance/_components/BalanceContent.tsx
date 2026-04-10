import CustomButton from '@/components/Button/Button';
import Card from '@/components/Card/Card';
import Divider from '@/components/Divider/Divider';
import EmptyState from '@/components/EmptyState/EmptyState';
import ExpenseItem from '@/components/ExpenseItem/ExpenseItem';
import Icon from '@/components/Icon/Icon';
import Typography from '@/components/Typography/Typography';
import { useAuth } from '@/hooks/useAuth';
import { formatAmount } from '@/libs/format';
import queries from '@/libs/queries';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Link, router } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import BalanceSummaryCard, { type DebtSummaryItem } from './BalanceSummaryCard';

interface BalanceContentProps {
  householdId: string;
}

export default function BalanceContent({ householdId }: BalanceContentProps) {
  const { data: session } = useAuth();
  const { data: balance } = useSuspenseQuery(
    queries.households.getHouseholdBalanceQuery(householdId),
  );
  const { data: me } = useSuspenseQuery(queries.me.getMeQuery());
  const { data: expensesData } = useSuspenseQuery(queries.expenses.getExpensesQuery(householdId));

  const currentUserId = session?.user?.id;
  const othersBalances = Object.entries(balance.shares).filter(([id]) => id !== currentUserId);
  const isAlone = othersBalances.length === 0;

  const peopleWhoOwe = othersBalances
    .filter(([, amount]) => amount < 0)
    .map(([id, amount]) => ({
      id,
      amount: Math.abs(amount),
      member: me.household?.members?.find((m) => m.id === id),
    }));

  const peopleIOwe = othersBalances
    .filter(([, amount]) => amount > 0)
    .map(([id, amount]) => ({
      id,
      amount: Math.abs(amount),
      member: me.household?.members?.find((m) => m.id === id),
    }));

  const displayShare = isAlone
    ? balance.total
    : currentUserId
      ? balance.shares[currentUserId] || 0
      : 0;

  const expenses = expensesData.expenses;
  const expenseTotal = expenses.reduce((sum, e) => sum + e.amount, 0);

  const debtItems: DebtSummaryItem[] = [
    ...peopleWhoOwe.map((p) => {
      const lastExpense = expenses.find((e) => e.member.name === p.member?.name);
      return {
        memberId: p.id,
        memberName: p.member?.name ?? 'Inconnu',
        amount: p.amount,
        type: 'owe-me' as const,
        lastExpenseLabel: lastExpense ? `Dernier : ${lastExpense.name}` : undefined,
      };
    }),
    ...peopleIOwe.map((p) => {
      const lastExpense = expenses.find((e) => e.member.name === p.member?.name);
      return {
        memberId: p.id,
        memberName: p.member?.name ?? 'Inconnu',
        amount: p.amount,
        type: 'i-owe' as const,
        lastExpenseLabel: lastExpense ? `Dernier : ${lastExpense.name}` : undefined,
      };
    }),
  ];

  return (
    <View className="gap-2">
      {/* ── Balance overview with expandable debts ── */}
      <BalanceSummaryCard
        share={displayShare}
        isAlone={isAlone}
        debts={debtItems}
        className="mt-2"
      />

      {/* ── Expenses ── */}
      <Divider title="Dépenses" />

      {expenses.length === 0 ? (
        <Card>
          <EmptyState
            iconName="receipt-outline"
            title="Aucune dépense"
            description="Ajoutez votre première dépense pour commencer à suivre les frais de la coloc."
          />
        </Card>
      ) : (
        <Card className="gap-0">
          {/* Inline header: count + total */}
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center gap-2">
              <View className="size-8 items-center justify-center rounded-xl bg-primary/10 dark:bg-primary/20">
                <Icon as="Ionicons" name="receipt" size="sm" className="text-primary" />
              </View>
              <Typography variant="body" className="font-bold">
                {expenses.length} dépense{expenses.length > 1 ? 's' : ''}
              </Typography>
            </View>
            <Typography variant="body" weight="bold">
              {formatAmount(expenseTotal)} €
            </Typography>
          </View>

          {/* Expense rows */}
          {expenses.map((expense, index) => (
            <View key={expense.id}>
              <ExpenseItem
                name={expense.name}
                amount={expense.amount}
                category={expense.category}
                memberName={expense.member.name}
                createdAt={expense.createdAt}
                isMine={expense.isMine}
                onPress={() =>
                  router.push({
                    pathname: '/households/[householdId]/expenses/[expenseId]',
                    params: { householdId, expenseId: expense.id },
                  })
                }
              />
              {index < expenses.length - 1 && (
                <View className="h-px bg-gray-100/50 dark:bg-white/5" />
              )}
            </View>
          ))}
        </Card>
      )}

      {/* ── CTA ── */}
      <View className="mt-4">
        <Link
          href={{
            pathname: '/households/[householdId]/expenses/create',
            params: { householdId },
          }}
          asChild>
          <CustomButton title="Ajouter une dépense" variant="primary" size="lg" />
        </Link>
      </View>
    </View>
  );
}
