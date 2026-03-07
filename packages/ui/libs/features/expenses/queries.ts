import { queryOptions } from '@tanstack/react-query';
import { getExpenses } from './api';
import { GetExpenses } from '@cohab/shared/src/expense';

export const getExpensesQuery = (householdId: string) =>
  queryOptions<GetExpenses>({
    queryKey: ['households', householdId, 'expenses'],
    queryFn: () => getExpenses(householdId),
  });
