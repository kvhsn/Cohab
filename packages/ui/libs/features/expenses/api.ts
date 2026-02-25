import { API_URL } from '@/constants/Config';
import { getAuthHeaders } from '@/libs/secureStorage';
import { GetExpenses, GetExpensesSchema } from '@colocapp/shared/src/expense';

export const getExpenses = async (householdId: string): Promise<GetExpenses> => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/api/households/${householdId}/expenses`, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    throw new Error('Failed to fetch household expenses');
  }
  const body = await response.json();
  return GetExpensesSchema.parse(body);
};

export const createExpense = async (
  householdId: string,
  form: { name: string; amount: number },
) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/api/households/${householdId}/expenses`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      name: form.name,
      amount: Number(form.amount),
    }),
  });

  if (!response.ok) {
    throw new Error('Something went wrong');
  }

  return response.json();
};
