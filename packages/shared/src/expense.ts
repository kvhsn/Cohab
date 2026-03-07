import { z } from 'zod';

export const ExpenseCategorySchema = z.enum(['GROCERIES', 'RENT', 'ELECTRICITY', 'OTHER']);
export type ExpenseCategory = z.infer<typeof ExpenseCategorySchema>;

export const EXPENSE_CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  GROCERIES: 'Courses',
  RENT: 'Loyer',
  ELECTRICITY: 'Élec.',
  OTHER: 'Divers',
};

export const CreateExpenseSchema = z.object({
  name: z.string().min(1),
  amount: z.number().positive(),
  note: z.string(),
  category: ExpenseCategorySchema,
});

export type CreateExpense = z.infer<typeof CreateExpenseSchema>;

export const GetExpenseSchema = z.object({
  name: z.string(),
  amount: z.number().positive(),
  category: ExpenseCategorySchema,
  note: z.string().nullable().optional(),
  createdAt: z.string(),
  id: z.string(),
  member: z.object({
    name: z.string(),
  }),
});

export type GetExpense = z.infer<typeof GetExpenseSchema>;

export const GetExpensesSchema = z.object({ expenses: z.array(GetExpenseSchema) });
export type GetExpenses = z.infer<typeof GetExpensesSchema>;
