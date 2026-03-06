import { authClient } from '@/libs/auth';
import { mutationOptions } from '@tanstack/react-query';

export const loginMutation = () =>
  mutationOptions({
    mutationKey: ['auth', 'login'],
    mutationFn: async (args: Parameters<typeof authClient.signIn.email>[0]) => {
      const result = await authClient.signIn.email(args);
      if (result.error) throw result.error;
      return result;
    },
  });

export const registerMutation = () =>
  mutationOptions({
    mutationKey: ['auth', 'register'],
    mutationFn: async (args: Parameters<typeof authClient.signUp.email>[0]) => {
      const result = await authClient.signUp.email(args);
      if (result.error) throw result.error;
      return result;
    },
  });
