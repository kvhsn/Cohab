import { mutationOptions } from '@tanstack/react-query';
import { login } from './api';

export const loginMutation = (form: { email: string; password: any }) =>
  mutationOptions({
    mutationKey: ['auth', 'login'],
    mutationFn: () => login(form),
  });
