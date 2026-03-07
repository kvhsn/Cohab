import { API_URL } from '@/constants/Config';
import { getAuthHeaders } from '@/libs/secureStorage';
import { Balance, BalanceSchema } from '@cohab/shared/src/balance';
import {
  CreateHouseHold,
  CreateInviteCode,
  GetHouseholdDetails,
  GetHouseholdDetailsSchema,
  GetPendingInvites,
  GetPendingInvitesSchema,
  InvitationCode,
  InvitationCodeSchema,
  JoinHouseHold,
  RespondToInvitation,
  UpdateHousehold,
  UpdateInviteValidity,
} from '@cohab/shared/src/household';

import { Refunds, RefundsSchema } from '@cohab/shared/src/refund';

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

export const getRefunds = async (householdId: string): Promise<Refunds> => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/api/households/${householdId}/refunds`, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    throw new Error('Failed to fetch household refunds');
  }
  const body = await response.json();
  return RefundsSchema.parse(body);
};

export const createHousehold = async (data: CreateHouseHold): Promise<GetHouseholdDetails> => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/api/households`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Create household failed: ${errorData.message || ''}`);
  }

  const body = await response.json();
  return GetHouseholdDetailsSchema.parse(body);
};

export const getInviteCode = async (householdId: string): Promise<InvitationCode | null> => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/api/households/${householdId}/invite`, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || 'Failed to fetch invite code');
  }

  const body = await response.json();
  if (body === null) return null;
  return InvitationCodeSchema.parse(body);
};

export const createInviteCode = async (
  householdId: string,
  data: CreateInviteCode,
): Promise<InvitationCode> => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/api/households/${householdId}/invite`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Invite household failed');
  }

  const body = await response.json();
  return InvitationCodeSchema.parse(body);
};

export const updateInviteValidity = async (
  householdId: string,
  data: UpdateInviteValidity,
): Promise<InvitationCode> => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/api/households/${householdId}/invite`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to update invite validity');
  }

  const body = await response.json();
  return InvitationCodeSchema.parse(body);
};

export const revokeInviteCode = async (householdId: string): Promise<{ status: string }> => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/api/households/${householdId}/invite`, {
    method: 'DELETE',
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to revoke invite code');
  }

  return response.json();
};

export const joinHousehold = async (data: JoinHouseHold): Promise<{ status: string }> => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/api/households/join`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || 'Join household failed');
  }

  return response.json();
};

export const updateHousehold = async (data: UpdateHousehold): Promise<GetHouseholdDetails> => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/api/households`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || 'Update household failed');
  }

  const body = await response.json();
  return GetHouseholdDetailsSchema.parse(body);
};

export const removeMember = async (memberId: string): Promise<{ status: string }> => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/api/households/members/${memberId}`, {
    method: 'DELETE',
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to remove member');
  }

  return response.json();
};

export const leaveHousehold = async (): Promise<{ status: string }> => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/api/households/leave`, {
    method: 'POST',
    headers,
  });

  if (!response.ok) {
    throw new Error('Failed to leave household');
  }

  return response.json();
};

export const getPendingInvitations = async (): Promise<GetPendingInvites> => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/api/households/invitations/pending`, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `Failed to fetch pending invitations: ${response.status} ${errorData.message || ''}`,
    );
  }

  const body = await response.json();
  return GetPendingInvitesSchema.parse(body);
};

export const respondToInvitation = async (
  invitationId: string,
  action: RespondToInvitation['action'],
): Promise<{ status: string }> => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/api/households/invitations/${invitationId}/respond`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ action }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `Failed to respond to invitation: ${response.status} ${errorData.message || ''}`,
    );
  }

  return response.json();
};
