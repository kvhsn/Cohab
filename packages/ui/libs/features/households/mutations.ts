import { mutationOptions } from '@tanstack/react-query';
import { createHousehold, createInviteCode, joinHousehold } from './api';
import { CreateHouseHold, JoinHouseHold } from '@cohab/shared/src/household';

export const createHouseholdMutation = () =>
  mutationOptions({
    mutationKey: ['households', 'create'],
    mutationFn: (data: CreateHouseHold) => createHousehold(data),
  });

export const createInviteCodeMutation = () =>
  mutationOptions({
    mutationKey: ['households', 'invite'],
    mutationFn: ({ householdId }: { householdId: string }) => createInviteCode(householdId),
  });

export const joinHouseholdMutation = () =>
  mutationOptions({
    mutationKey: ['households', 'join'],
    mutationFn: (data: JoinHouseHold) => joinHousehold(data),
  });
