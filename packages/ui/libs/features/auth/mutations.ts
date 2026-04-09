import { authClient } from '@/libs/auth';
import { mutationOptions } from '@tanstack/react-query';
export const keys = {
  login: () => ['auth', 'login'] as const,
  register: () => ['auth', 'register'] as const,
};

export const loginMutation = () =>
  mutationOptions({
    mutationKey: keys.login(),
    mutationFn: async (args: Parameters<typeof authClient.signIn.email>[0]) => {
      const result = await authClient.signIn.email(args);
      if (result.error) throw result.error;
      return result;
    },
  });

export const registerMutation = () =>
  mutationOptions({
    mutationKey: keys.register(),
    mutationFn: async (
      args: Parameters<typeof authClient.signUp.email>[0] & { phoneNumber: string },
    ) => {
      const { phoneNumber, ...rest } = args;
      const result = await authClient.signUp.email({
        ...rest,
        // @ts-expect-error
        phoneNumber,
      });
      if (result.error) throw result.error;
      return result;
    },
  });
