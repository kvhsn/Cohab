import { Balance } from '@cohab/shared/src/balance';
import { GetPendingInvites } from '@cohab/shared/src/household';
import { Refunds } from '@cohab/shared/src/refund';
import { queryOptions } from '@tanstack/react-query';
import { getHouseholdBalance, getPendingInvitations, getRefunds } from './api';

export const getPendingInvitationsQuery = () =>
  queryOptions<GetPendingInvites>({
    queryKey: ['households', 'invitations', 'pending'],
    queryFn: () => getPendingInvitations(),
  });

export const getHouseholdBalanceQuery = (householdId: string) =>
  queryOptions<Balance>({
    queryKey: ['households', householdId, 'balance'],
    queryFn: () => getHouseholdBalance(householdId),
  });

export const getRefundsQuery = (householdId: string) =>
  queryOptions<Refunds>({
    queryKey: ['households', householdId, 'refunds'],
    queryFn: () => getRefunds(householdId),
  });
