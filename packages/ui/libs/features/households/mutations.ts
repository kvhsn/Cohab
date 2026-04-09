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
export const keys = {
  create: () => ['households', 'create'] as const,
  invite: {
    create: () => ['households', 'invite', 'create'] as const,
    update: () => ['households', 'invite', 'update'] as const,
    revoke: () => ['households', 'invite', 'revoke'] as const,
  },
  join: () => ['households', 'join'] as const,
  update: () => ['households', 'update'] as const,
  removeMember: () => ['households', 'remove-member'] as const,
  leave: () => ['households', 'leave'] as const,
  invitations: {
    respond: () => ['households', 'invitations', 'respond'] as const,
  },
};

export const createHouseholdMutation = () =>
  mutationOptions({
    mutationKey: keys.create(),
    mutationFn: (data: CreateHouseHold) => createHousehold(data),
  });

export const createInviteCodeMutation = () =>
  mutationOptions({
    mutationKey: keys.invite.create(),
    mutationFn: ({ householdId, ...data }: { householdId: string } & CreateInviteCode) =>
      createInviteCode(householdId, data),
  });

export const updateInviteValidityMutation = () =>
  mutationOptions({
    mutationKey: keys.invite.update(),
    mutationFn: ({ householdId, ...data }: { householdId: string } & UpdateInviteValidity) =>
      updateInviteValidity(householdId, data),
  });

export const revokeInviteCodeMutation = () =>
  mutationOptions({
    mutationKey: keys.invite.revoke(),
    mutationFn: ({ householdId }: { householdId: string }) => revokeInviteCode(householdId),
  });

export const joinHouseholdMutation = () =>
  mutationOptions({
    mutationKey: keys.join(),
    mutationFn: (data: JoinHouseHold) => joinHousehold(data),
  });

export const updateHouseholdMutation = () =>
  mutationOptions({
    mutationKey: keys.update(),
    mutationFn: (data: UpdateHousehold) => updateHousehold(data),
  });

export const removeMemberMutation = () =>
  mutationOptions({
    mutationKey: keys.removeMember(),
    mutationFn: (memberId: string) => removeMember(memberId),
  });

export const leaveHouseholdMutation = () =>
  mutationOptions({
    mutationKey: keys.leave(),
    mutationFn: () => leaveHousehold(),
  });

export const respondToInvitationMutation = () =>
  mutationOptions({
    mutationKey: keys.invitations.respond(),
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
