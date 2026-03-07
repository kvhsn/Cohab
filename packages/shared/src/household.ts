import { z } from 'zod';

export const CreateHouseHoldSchema = z.object({
  name: z.string().min(3, {
    message: 'Le nom de votre colocation doit contenir au moins 3 caractères',
  }),
  invites: z.string().array().optional(),
});

export type CreateHouseHold = z.infer<typeof CreateHouseHoldSchema>;

export const JoinHouseHoldSchema = z.object({
  code: z
    .string()
    .length(6, 'Le code doit faire 6 chiffres')
    .regex(/^[0-9]+$/, 'Le code doit contenir uniquement des chiffres'),
});

export type JoinHouseHold = z.infer<typeof JoinHouseHoldSchema>;

export const GetHouseholdMemberSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  image: z.string().nullable().optional(),
});

export type GetHouseholdMember = z.infer<typeof GetHouseholdMemberSchema>;

export const GetHouseholdDetailsSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  adminId: z.string().optional(),
  members: z.array(GetHouseholdMemberSchema).optional(),
});

export type GetHouseholdDetails = z.infer<typeof GetHouseholdDetailsSchema>;

export const UpdateHouseholdSchema = z.object({
  name: z.string().min(3, {
    message: 'Le nom de votre colocation doit contenir au moins 3 caractères',
  }),
});

export type UpdateHousehold = z.infer<typeof UpdateHouseholdSchema>;

export const RespondToInvitationSchema = z.object({
  action: z.enum(['ACCEPT', 'DECLINE']),
});

export type RespondToInvitation = z.infer<typeof RespondToInvitationSchema>;

export const PendingInviteSchema = z.object({
  id: z.string(),
  email: z.string().nullable(),
  phone: z.string().nullable(),
  householdId: z.string(),
  status: z.enum(['PENDING', 'ACCEPTED', 'REJECTED', 'EXPIRED']),
  expiresAt: z.string().nullable().optional(),
  createdAt: z.string(),
  household: z.object({
    id: z.string(),
    name: z.string(),
    admin: z.object({
      name: z.string(),
      image: z.string().nullable().optional(),
    }),
  }),
});

export type PendingInvite = z.infer<typeof PendingInviteSchema>;

export const GetPendingInvitesSchema = z.array(PendingInviteSchema);

export type GetPendingInvites = z.infer<typeof GetPendingInvitesSchema>;

export const InvitationValidityEnum = z.enum(['HOURS_24', 'HOURS_48', 'PERMANENT']);

export type InvitationValidity = z.infer<typeof InvitationValidityEnum>;

export const InvitationCodeSchema = z.object({
  code: z.string(),
  validity: InvitationValidityEnum,
  createdAt: z.string(),
});

export type InvitationCode = z.infer<typeof InvitationCodeSchema>;

export const CreateInviteCodeSchema = z.object({
  validity: InvitationValidityEnum.default('HOURS_24'),
});

export type CreateInviteCode = z.infer<typeof CreateInviteCodeSchema>;

export const UpdateInviteValiditySchema = z.object({
  validity: InvitationValidityEnum,
});

export type UpdateInviteValidity = z.infer<typeof UpdateInviteValiditySchema>;
