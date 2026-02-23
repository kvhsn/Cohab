import z from 'zod';

export const BalanceSchema = z.object({
  total: z.number(),
  shares: z.record(z.string(), z.number()),
});

export type Balance = z.infer<typeof BalanceSchema>;
