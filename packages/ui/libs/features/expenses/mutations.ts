import { mutationOptions } from '@tanstack/react-query';
import { createExpense, deleteExpense } from './api';
import { CreateExpense } from '@cohab/shared/src/expense';

export const keys = {
  create: (householdId: string) => ['households', householdId, 'expenses'] as const,
  delete: (householdId: string) => ['households', householdId, 'expenses', 'delete'] as const,
};

export const createExpenseMutation = (householdId: string) =>
  mutationOptions({
    mutationKey: keys.create(householdId),
    mutationFn: (form: CreateExpense) => createExpense(householdId, form),
  });

export const deleteExpenseMutation = (householdId: string) =>
  mutationOptions({
    mutationKey: keys.delete(householdId),
    mutationFn: (expenseId: string) => deleteExpense(householdId, expenseId),
  });
