import { queryOptions } from '@tanstack/react-query';
import { getExpense, getExpenses } from './api';
import { GetExpense, GetExpenses } from '@cohab/shared/src/expense';

export const keys = {
  all: (householdId: string) => ['households', householdId, 'expenses'] as const,
  detail: (householdId: string, expenseId: string) =>
    ['households', householdId, 'expenses', expenseId] as const,
};

export const getExpensesQuery = (householdId: string) =>
  queryOptions<GetExpenses>({
    queryKey: keys.all(householdId),
    queryFn: () => getExpenses(householdId),
  });

export const getExpenseQuery = (householdId: string, expenseId: string) =>
  queryOptions<GetExpense>({
    queryKey: keys.detail(householdId, expenseId),
    queryFn: () => getExpense(householdId, expenseId),
  });
