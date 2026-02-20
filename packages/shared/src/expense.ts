import { z } from 'zod';

export const CreateHouseholdExpenseSchema = z.object({
  name: z.string().min(1),
  amount: z.number().positive(),
});

export type CreateHouseholdExpense = z.infer<typeof CreateHouseholdExpenseSchema>;
