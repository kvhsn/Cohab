import { authClient } from '@/libs/auth';
import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';

export const useAuth = () => {
  const { data, isPending } = authClient.useSession();
  const queryClient = useQueryClient();
  const isAuthenticated = !!data?.session;

  const logout = async () => {
    await authClient.signOut();
    queryClient.clear();
    router.replace('/login');
  };
  return { data, isPending, logout, isAuthenticated };
};
