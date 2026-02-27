import { mutationOptions } from '@tanstack/react-query';
import { createExpense } from './api';
import { CreateExpense } from '@cohab/shared/src/expense';

export const createExpenseMutation = (householdId: string) =>
  mutationOptions({
    mutationKey: ['households', householdId, 'expenses'],
    mutationFn: (form: CreateExpense) => createExpense(householdId, form),
  });
