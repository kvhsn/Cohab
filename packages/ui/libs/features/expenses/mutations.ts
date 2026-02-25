import { mutationOptions } from '@tanstack/react-query';
import { createExpense } from './api';

export const createExpenseMutation = (
  householdId: string,
  form: { name: string; amount: number },
) =>
  mutationOptions({
    mutationKey: ['households', householdId, 'expenses'],
    mutationFn: () => createExpense(householdId, form),
  });
