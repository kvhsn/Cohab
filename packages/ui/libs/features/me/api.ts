import { API_URL } from '@/constants/Config';
import { getAuthHeaders } from '@/libs/secureStorage';
import { GetMe, GetMeSchema } from '@cohab/shared/src/me';

export const getMe = async (): Promise<GetMe> => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/api/me`, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    throw new Error('Failed to fetch current user');
  }

  const body = await response.json();
  return GetMeSchema.parse(body);
};
