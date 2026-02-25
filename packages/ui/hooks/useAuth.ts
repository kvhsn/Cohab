import { authClient } from '@/libs/auth';
import { router } from 'expo-router';
import { useEffect } from 'react';

export const useAuth = () => {
  const { data, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !data) {
      router.replace('/login');
    }
  }, [data, isPending]);

  const logout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.replace('/login');
        },
      },
    });
  };
  return { data, isPending, logout };
};
