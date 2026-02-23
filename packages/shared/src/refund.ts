import z from 'zod';

export const RefundSchema = z.object({
  fromMemberId: z.string(),
  toMemberId: z.string(),
  amount: z.number(),
});

export const RefundsSchema = z.object({ refunds: z.array(RefundSchema) });

export type Refund = z.infer<typeof RefundSchema>;
export type Refunds = z.infer<typeof RefundsSchema>;
