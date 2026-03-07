import { mutationOptions } from '@tanstack/react-query';
import {
  createHousehold,
  createInviteCode,
  joinHousehold,
  leaveHousehold,
  removeMember,
  respondToInvitation,
  updateHousehold,
} from './api';
import { CreateHouseHold, JoinHouseHold, UpdateHousehold } from '@cohab/shared/src/household';

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

export const updateHouseholdMutation = () =>
  mutationOptions({
    mutationKey: ['households', 'update'],
    mutationFn: (data: UpdateHousehold) => updateHousehold(data),
  });

export const removeMemberMutation = () =>
  mutationOptions({
    mutationKey: ['households', 'remove-member'],
    mutationFn: (memberId: string) => removeMember(memberId),
  });

export const leaveHouseholdMutation = () =>
  mutationOptions({
    mutationKey: ['households', 'leave'],
    mutationFn: () => leaveHousehold(),
  });

export const respondToInvitationMutation = () =>
  mutationOptions({
    mutationKey: ['households', 'invitations', 'respond'],
    mutationFn: ({
      invitationId,
      action,
    }: {
      invitationId: string;
      action: 'ACCEPT' | 'DECLINE';
    }) => respondToInvitation(invitationId, action),
  });
