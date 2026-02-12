import { z } from 'zod';

export const RegisterSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string(),
});

export type RegisterSchema = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export type LoginSchema = z.infer<typeof LoginSchema>;
