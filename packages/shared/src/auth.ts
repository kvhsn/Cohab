import z from 'zod';

export const RegisterSchema = z.object({
  name: z.string().nonempty({
    error: 'Le nom est requis',
  }),
  email: z.email({
    error: "L'adresse email est invalide",
  }),
  password: z.string().min(6, 'Le mot de passe doit faire au moins 6 caractères'),
});

export type RegisterSchema = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
  email: z.email("L'adresse email est invalide"),
  password: z.string().min(6, 'Le mot de passe doit faire au moins 6 caractères'),
});

export type LoginSchema = z.infer<typeof LoginSchema>;
