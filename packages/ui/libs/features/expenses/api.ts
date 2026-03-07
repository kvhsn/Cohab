import { API_URL } from '@/constants/Config';
import { getAuthHeaders } from '@/libs/secureStorage';
import { CreateExpense, GetExpenses, GetExpensesSchema } from '@cohab/shared/src/expense';

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

export const createExpense = async (householdId: string, form: CreateExpense) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/api/households/${householdId}/expenses`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      name: form.name,
      amount: form.amount,
      category: form.category,
      note: form.note,
    }),
  });

  if (!response.ok) {
    throw new Error('Something went wrong');
  }

  return response.json();
};
