import { mutationOptions } from '@tanstack/react-query';
import { createHousehold, createInviteCode, joinHousehold } from './api';

export const createHouseholdMutation = (name: string) =>
  mutationOptions({
    mutationKey: ['households', 'create'],
    mutationFn: () => createHousehold(name),
  });

export const createInviteCodeMutation = (householdId: string) =>
  mutationOptions({
    mutationKey: ['households', householdId, 'invite'],
    mutationFn: () => createInviteCode(householdId),
  });

export const joinHouseholdMutation = (code: string) =>
  mutationOptions({
    mutationKey: ['households', 'join'],
    mutationFn: () => joinHousehold(code),
  });
