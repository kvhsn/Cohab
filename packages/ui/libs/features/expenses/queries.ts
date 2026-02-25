import { queryOptions } from '@tanstack/react-query';
import { getExpenses } from './api';

export const getExpensesQuery = (householdId: string) =>
  queryOptions({
    queryKey: ['households', householdId, 'expenses'],
    queryFn: () => getExpenses(householdId),
  });
