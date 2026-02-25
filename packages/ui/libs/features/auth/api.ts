import { API_URL } from '@/constants/Config';

export const login = async (form: { email: string; password: any }) => {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(form),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Login failed');
  }

  return data;
};
