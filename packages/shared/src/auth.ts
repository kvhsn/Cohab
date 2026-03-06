import z from 'zod';

export const RegisterSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string(),
});

export type RegisterSchema = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
  email: z.email("L'adresse email est invalide"),
  password: z.string().min(6, 'Le mot de passe doit faire au moins 6 caractères'),
});

export type LoginSchema = z.infer<typeof LoginSchema>;
