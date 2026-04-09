import { keys as authMutationKeys } from './features/auth/mutations';
import { keys as householdQueryKeys } from './features/households/queries';
import { keys as householdMutationKeys } from './features/households/mutations';
import { keys as expenseQueryKeys } from './features/expenses/queries';
import { keys as expenseMutationKeys } from './features/expenses/mutations';
import { keys as meQueryKeys } from './features/me/queries';

export const queryKeys = {
  households: householdQueryKeys,
  expenses: expenseQueryKeys,
  me: meQueryKeys,
};

export const mutationKeys = {
  auth: authMutationKeys,
  households: householdMutationKeys,
  expenses: expenseMutationKeys,
};
