import { API_URL } from '@/constants/Config';
import {
  CreateHouseHold,
  GetHouseholdDetails,
  GetHouseholdDetailsSchema,
  JoinHouseHold,
} from '@cohab/shared/src/household';
import { getAuthHeaders } from '@/libs/secureStorage';
import { Balance, BalanceSchema } from '@cohab/shared/src/balance';
import { RefundsSchema } from '@cohab/shared/src/refund';

export const getHouseholds = async (): Promise<GetHouseholdDetails> => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/api/households`, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    throw new Error('Failed to fetch household details');
  }
  const body = await response.json();
  return GetHouseholdDetailsSchema.parse(body);
};

export const getHouseholdBalance = async (householdId: string): Promise<Balance> => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/api/households/${householdId}/balance`, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    throw new Error('Failed to fetch household balance');
  }
  const body = await response.json();
  return BalanceSchema.parse(body);
};

export const getRefunds = async (householdId: string) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/api/households/${householdId}/refunds`, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    throw new Error('Failed to fetch household refunds');
  }
  const body = await response.json();
  return RefundsSchema.parse(body).refunds;
};

export const createHousehold = async (data: CreateHouseHold) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/api/households`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Something goes wrong');
  }

  return response.json();
};

export const createInviteCode = async (householdId: string) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/api/households/${householdId}/invite`, {
    method: 'POST',
    headers,
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Invite household failed');
  }

  return response.json();
};

export const joinHousehold = async (data: JoinHouseHold) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/api/households/join`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Join household failed');
  }

  return response.json();
};
