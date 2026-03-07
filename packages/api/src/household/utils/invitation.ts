import { InvitationValidity } from '@cohab/shared/src/household';

const isExpiredInvitation = (validity: InvitationValidity, createdAt: Date): boolean => {
  if (validity === 'PERMANENT') return false;
  const ms = validity === 'HOURS_24' ? 24 * 60 * 60 * 1000 : 48 * 60 * 60 * 1000;
  return Date.now() - createdAt.getTime() > ms;
};

export const isValidInvitation = (invitation: {
  revokedAt: Date | null;
  validity: InvitationValidity;
  createdAt: Date;
}): boolean => {
  if (invitation.revokedAt !== null) return false;
  return !isExpiredInvitation(invitation.validity, invitation.createdAt);
};
