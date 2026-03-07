import { z } from 'zod';
import { GetHouseholdMemberSchema } from './household';

export const GetMeHouseholdSchema = z.object({
  id: z.string(),
  name: z.string(),
  adminId: z.string(),
  members: z.array(GetHouseholdMemberSchema),
});

export const GetMeSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  image: z.string().nullable().optional(),
  household: GetMeHouseholdSchema.nullable(),
});

export type GetMeHousehold = z.infer<typeof GetMeHouseholdSchema>;
export type GetMe = z.infer<typeof GetMeSchema>;
