import { INVITATION_EXPIRATION_TIME } from '../constants';

export const isOutdatedInvitation = (nowTime: number, invitationCreationTime: number) =>
  nowTime - invitationCreationTime > INVITATION_EXPIRATION_TIME;
