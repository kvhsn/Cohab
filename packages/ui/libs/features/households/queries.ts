import { queryOptions } from '@tanstack/react-query';
import { getHouseholds, getHouseholdBalance, getRefunds } from './api';

export const getHouseholdsQuery = () =>
  queryOptions({
    queryKey: ['households'],
    queryFn: () => getHouseholds(),
  });

export const getHouseholdBalanceQuery = (householdId: string) =>
  queryOptions({
    queryKey: ['households', householdId, 'balance'],
    queryFn: () => getHouseholdBalance(householdId),
  });

export const getRefundsQuery = (householdId: string) =>
  queryOptions({
    queryKey: ['households', householdId, 'refunds'],
    queryFn: () => getRefunds(householdId),
  });
