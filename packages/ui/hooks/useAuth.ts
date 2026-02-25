import { authClient } from '@/libs/auth';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export const useAuth = () => {
  const { data, isPending } = authClient.useSession();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isPending && !data) {
      router.replace('/login');
    }
  }, [data, isPending]);

  const logout = async () => {
    await authClient.signOut();
    queryClient.clear();
    router.replace('/login');
  };
  return { data, isPending, logout };
};
