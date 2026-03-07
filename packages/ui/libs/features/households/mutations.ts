import { mutationOptions } from '@tanstack/react-query';
import {
  createHousehold,
  createInviteCode,
  joinHousehold,
  leaveHousehold,
  removeMember,
  respondToInvitation,
  revokeInviteCode,
  updateHousehold,
  updateInviteValidity,
} from './api';
import {
  CreateHouseHold,
  CreateInviteCode,
  JoinHouseHold,
  UpdateHousehold,
  UpdateInviteValidity,
} from '@cohab/shared/src/household';

export const createHouseholdMutation = () =>
  mutationOptions({
    mutationKey: ['households', 'create'],
    mutationFn: (data: CreateHouseHold) => createHousehold(data),
  });

export const createInviteCodeMutation = () =>
  mutationOptions({
    mutationKey: ['households', 'invite', 'create'],
    mutationFn: ({ householdId, ...data }: { householdId: string } & CreateInviteCode) =>
      createInviteCode(householdId, data),
  });

export const updateInviteValidityMutation = () =>
  mutationOptions({
    mutationKey: ['households', 'invite', 'update'],
    mutationFn: ({ householdId, ...data }: { householdId: string } & UpdateInviteValidity) =>
      updateInviteValidity(householdId, data),
  });

export const revokeInviteCodeMutation = () =>
  mutationOptions({
    mutationKey: ['households', 'invite', 'revoke'],
    mutationFn: ({ householdId }: { householdId: string }) => revokeInviteCode(householdId),
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

const mutations = {
  households: {
    createHouseholdMutation,
    createInviteCodeMutation,
    updateInviteValidityMutation,
    revokeInviteCodeMutation,
    joinHouseholdMutation,
    updateHouseholdMutation,
    removeMemberMutation,
    leaveHouseholdMutation,
    respondToInvitationMutation,
  },
};

export default mutations;
