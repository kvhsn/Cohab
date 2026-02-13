import { deleteValueForSecureStorage, getValueForSecureStorage } from '@/libs/secureStorage';
import { useEffect, useState } from 'react';

export const useAuth = () => {
  const [isLogged, setIsLogged] = useState<boolean | null>(null);

  const checkAuth = async () => {
    try {
      const token = await getValueForSecureStorage('token');
      setIsLogged(!!token);
    } catch (error) {
      console.error('Failed to check auth status:', error);
      setIsLogged(false);
    }
  };

  const logout = async () => {
    await deleteValueForSecureStorage('token');
    setIsLogged(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return { isLogged, logout };
};
