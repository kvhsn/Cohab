import { Balance } from '@cohab/shared/src/balance';
import { GetPendingInvites, InvitationCode } from '@cohab/shared/src/household';
import { Refunds } from '@cohab/shared/src/refund';
import { queryOptions } from '@tanstack/react-query';
import { getHouseholdBalance, getInviteCode, getPendingInvitations, getRefunds } from './api';
export const keys = {
  all: ['households'] as const,
  balance: (householdId: string) => [...keys.all, householdId, 'balance'] as const,
  refunds: (householdId: string) => [...keys.all, householdId, 'refunds'] as const,
  invite: (householdId: string) => [...keys.all, householdId, 'invite'] as const,
  invitations: {
    all: () => [...keys.all, 'invitations'] as const,
    pending: () => [...keys.all, 'invitations', 'pending'] as const,
  },
};

export const getPendingInvitationsQuery = () =>
  queryOptions<GetPendingInvites>({
    queryKey: keys.invitations.pending(),
    queryFn: () => getPendingInvitations(),
  });

export const getHouseholdBalanceQuery = (householdId: string) =>
  queryOptions<Balance>({
    queryKey: keys.balance(householdId),
    queryFn: () => getHouseholdBalance(householdId),
  });

export const getRefundsQuery = (householdId: string) =>
  queryOptions<Refunds>({
    queryKey: keys.refunds(householdId),
    queryFn: () => getRefunds(householdId),
  });

export const getInviteCodeQuery = (householdId: string) =>
  queryOptions<InvitationCode | null>({
    queryKey: keys.invite(householdId),
    queryFn: () => getInviteCode(householdId),
  });
