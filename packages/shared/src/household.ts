import z from 'zod';

export const CreateHouseHoldSchema = z.object({
  name: z.string(),
});

export type CreateHouseHoldSchema = z.infer<typeof CreateHouseHoldSchema>;
