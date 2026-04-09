import { mutationOptions } from '@tanstack/react-query';
import { createExpense } from './api';
import { CreateExpense } from '@cohab/shared/src/expense';
export const keys = {
  create: (householdId: string) => ['households', householdId, 'expenses'] as const,
};

export const createExpenseMutation = (householdId: string) =>
  mutationOptions({
    mutationKey: keys.create(householdId),
    mutationFn: (form: CreateExpense) => createExpense(householdId, form),
  });
