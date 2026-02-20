import { z } from 'zod';

export const CreateExpenseSchema = z.object({
  name: z.string().min(1),
  amount: z.number().positive(),
});

export type CreateExpense = z.infer<typeof CreateExpenseSchema>;

export const GetExpenseSchema = z.object({
  name: z.string(),
  amount: z.number().positive(),
  createdAt: z.string(),
  id: z.string(),
  member: z.object({
    name: z.string(),
  }),
});

export type GetExpense = z.infer<typeof GetExpenseSchema>;

export const GetExpensesSchema = z.object({ expenses: z.array(GetExpenseSchema) });
export type GetExpenses = z.infer<typeof GetExpensesSchema>;
