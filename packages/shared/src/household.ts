import z from 'zod';

export const CreateHouseHoldSchema = z.object({
  name: z.string(),
});

export type CreateHouseHold = z.infer<typeof CreateHouseHoldSchema>;

export const JoinHouseHoldSchema = z.object({
  code: z
    .string()
    .length(6, 'Le code doit faire 6 chiffres')
    .regex(/^[0-9]+$/, 'Le code doit contenir uniquement des chiffres'),
});

export type JoinHouseHold = z.infer<typeof JoinHouseHoldSchema>;

export const GetHouseholdDetailsSchema = z.object({
  id: z.string().optional(),
});

export type GetHouseholdDetails = z.infer<typeof GetHouseholdDetailsSchema>;
