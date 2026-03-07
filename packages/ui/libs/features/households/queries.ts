import { queryOptions } from '@tanstack/react-query';
import { getHouseholds, getHouseholdBalance, getRefunds, getPendingInvitations } from './api';
import { GetHouseholdDetails, GetPendingInvites } from '@cohab/shared/src/household';
import { Balance } from '@cohab/shared/src/balance';
import { Refunds } from '@cohab/shared/src/refund';

export const getHouseholdsQuery = () =>
  queryOptions<GetHouseholdDetails>({
    queryKey: ['households', 'details'],
    queryFn: () => getHouseholds(),
  });

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

const queries = {
  households: {
    getHouseholdsQuery,
    getPendingInvitationsQuery,
    getHouseholdBalanceQuery,
    getRefundsQuery,
  },
};

export default queries;
