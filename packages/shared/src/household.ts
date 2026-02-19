import z from 'zod';

export const CreateHouseHoldSchema = z.object({
  name: z.string(),
});

export type CreateHouseHoldSchema = z.infer<typeof CreateHouseHoldSchema>;

export const JoinHouseHoldSchema = z.object({
  code: z.number().gte(99999),
});

export type JoinHouseHoldSchema = z.infer<typeof JoinHouseHoldSchema>;
