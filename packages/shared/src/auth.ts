import z from 'zod';

export const RegisterSchema = z.object({
  name: z.string().nonempty({
    error: 'Le nom est requis',
  }),
  email: z.email({
    error: "L'adresse email est invalide",
  }),
  phoneNumber: z.string().min(5, 'Le numéro de téléphone est requis'),
  password: z.string().min(8, 'Le mot de passe doit faire au moins 8 caractères'),
});

export type RegisterSchema = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
  email: z.email("L'adresse email est invalide"),
  password: z.string().min(8, 'Le mot de passe doit faire au moins 8 caractères'),
});

export type LoginSchema = z.infer<typeof LoginSchema>;
