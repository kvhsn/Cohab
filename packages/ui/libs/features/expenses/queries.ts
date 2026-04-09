import { queryOptions } from '@tanstack/react-query';
import { getExpenses } from './api';
import { GetExpenses } from '@cohab/shared/src/expense';
export const keys = {
  all: (householdId: string) => ['households', householdId, 'expenses'] as const,
};

export const getExpensesQuery = (householdId: string) =>
  queryOptions<GetExpenses>({
    queryKey: keys.all(householdId),
    queryFn: () => getExpenses(householdId),
  });
