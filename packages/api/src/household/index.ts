import {
  CreateHouseHoldSchema,
  CreateInviteCodeSchema,
  JoinHouseHoldSchema,
  RespondToInvitationSchema,
  UpdateHouseholdSchema,
  UpdateInviteValiditySchema,
} from '@cohab/shared/src/household';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import crypto from 'node:crypto';
import { z } from 'zod';
import { withAuth } from '../libs/auth';
import withPrisma from '../libs/prisma';
import { ContextWithAuth, ContextWithPrisma } from '../types/Contexts';
import expenses from './expenses';
import refunds from './refunds';
import { isValidInvitation } from './utils/invitation';

export default new Hono<ContextWithPrisma & ContextWithAuth>()
  .basePath('/households')
  .post('/', withAuth, withPrisma, zValidator('json', CreateHouseHoldSchema), async (c) => {
    const { name, invites } = c.req.valid('json');
    const { id: userId } = c.get('user');
    const prisma = c.get('prisma');
    try {
      const user = await prisma.user.findUniqueOrThrow({
        where: {
          id: userId,
        },
      });
      if (user.houseHoldId) {
        throw new Error(
          `Please leave current household ${user.houseHoldId} before creating a new one`,
        );
      } else {
        const createdHousehold = await prisma.household.create({
          data: {
            name,
            adminId: userId,
            members: {
              connect: {
                id: userId,
              },
            },
          },
          select: {
            id: true,
          },
        });

        if (invites && invites.length > 0) {
          await Promise.all(
            invites.map(async (inviteStr) => {
              const isEmail = z.email().safeParse(inviteStr).success;

              const matchingUser = await prisma.user.findFirst({
                where: isEmail ? { email: inviteStr } : { phoneNumber: inviteStr },
                select: { id: true, houseHoldId: true },
              });

              if (matchingUser) {
                if (!matchingUser.houseHoldId) {
                  await prisma.user.update({
                    where: { id: matchingUser.id },
                    data: { houseHoldId: createdHousehold.id },
                  });
                }
              } else {
                await prisma.pendingInvite.create({
                  data: {
                    householdId: createdHousehold.id,
                    email: isEmail ? inviteStr : null,
                    phone: !isEmail ? inviteStr : null,
                    status: 'PENDING',
                  },
                });
              }
            }),
          );
        }

        return c.json(createdHousehold, 201);
      }
    } catch (error) {
      console.error(error);
      return c.json(
        {
          status: 'error',
          message: 'Internal error',
        },
        500,
      );
    }
  })
  .put('/', withAuth, withPrisma, zValidator('json', UpdateHouseholdSchema), async (c) => {
    const { id: userId } = c.get('user');
    const prisma = c.get('prisma');
    const { name } = c.req.valid('json');
    try {
      const { houseHoldId } = await prisma.user.findUniqueOrThrow({
        where: { id: userId },
        select: { houseHoldId: true },
      });

      if (!houseHoldId) {
        throw new Error('You are not in a household');
      }

      const updated = await prisma.household.update({
        where: { id: houseHoldId },
        data: { name },
      });

      return c.json(updated, 200);
    } catch (error) {
      console.error(error);
      return c.json({ status: 'error', message: 'Internal error' }, 500);
    }
  })
  .delete('/members/:memberId', withAuth, withPrisma, async (c) => {
    const memberId = c.req.param('memberId');
    const { id: userId } = c.get('user');
    const prisma = c.get('prisma');
    try {
      const adminUser = await prisma.user.findUniqueOrThrow({
        where: { id: userId },
        select: { administeredHouseHold: { select: { id: true } } },
      });

      const householdId = adminUser.administeredHouseHold?.id;
      if (!householdId) {
        throw new Error('You are not the admin of any household');
      }

      if (userId === memberId) {
        throw new Error('Admin cannot remove themselves this way. Use leave logic.');
      }

      await prisma.user.update({
        where: {
          id_houseHoldId: {
            id: memberId,
            houseHoldId: householdId,
          },
        },
        data: {
          houseHoldId: null,
        },
      });

      return c.json({ status: 'ok', message: 'Member removed' }, 200);
    } catch (error) {
      console.error(error);
      return c.json({ status: 'error', message: 'Internal error' }, 500);
    }
  })
  .post('/leave', withAuth, withPrisma, async (c) => {
    const { id: userId } = c.get('user');
    const prisma = c.get('prisma');
    try {
      const user = await prisma.user.findUniqueOrThrow({
        where: { id: userId },
        select: {
          houseHoldId: true,
          administeredHouseHold: { select: { id: true, members: { select: { id: true } } } },
        },
      });

      const houseHoldId = user.houseHoldId;
      if (!houseHoldId) {
        throw new Error('You are not in a household');
      }

      if (user.administeredHouseHold?.id === houseHoldId) {
        const otherMembers = user.administeredHouseHold.members.filter((m) => m.id !== userId);

        if (otherMembers.length > 0) {
          const newAdminId = otherMembers[0].id;
          await prisma.household.update({
            where: { id: houseHoldId },
            data: { adminId: newAdminId },
          });
          await prisma.user.update({
            where: { id: userId },
            data: { houseHoldId: null },
          });
        } else {
          await prisma.invitation.deleteMany({ where: { householdId: houseHoldId } });
          await prisma.expense.deleteMany({ where: { householdId: houseHoldId } });
          await prisma.refund.deleteMany({ where: { householdId: houseHoldId } });
          await prisma.household.delete({ where: { id: houseHoldId } });

          await prisma.user.update({
            where: { id: userId },
            data: { houseHoldId: null },
          });
        }
      } else {
        await prisma.user.update({
          where: { id: userId },
          data: { houseHoldId: null },
        });
      }

      return c.json({ status: 'ok', message: 'Left household' }, 200);
    } catch (error) {
      console.error(error);
      return c.json({ status: 'error', message: 'Internal error' }, 500);
    }
  })
  .post('/join', withAuth, withPrisma, zValidator('json', JoinHouseHoldSchema), async (c) => {
    try {
      const { id: userId } = c.get('user');
      const prisma = c.get('prisma');
      const { code } = c.req.valid('json');

      const user = await prisma.user.findUniqueOrThrow({
        where: { id: userId },
        select: { houseHoldId: true },
      });
      if (user.houseHoldId) {
        throw new Error('You are already in a household');
      }

      const invitation = await prisma.invitation.findUnique({
        where: { code },
        select: { householdId: true, validity: true, createdAt: true, revokedAt: true },
      });

      if (!invitation) {
        return c.json({ status: 'error', message: "Code d'invitation invalide" }, 404);
      }

      if (!isValidInvitation(invitation)) {
        return c.json(
          { status: 'error', message: "Ce code d'invitation a expiré ou a été révoqué" },
          410,
        );
      }

      await prisma.user.update({
        where: { id: userId },
        data: { houseHoldId: invitation.householdId },
      });

      return c.json(
        { status: 'ok', message: `Successfully joined household ${invitation.householdId}` },
        200,
      );
    } catch (error) {
      console.error(error);
      return c.json({ status: 'error', message: 'Internal error' }, 500);
    }
  })
  .get('/invitations/pending', withAuth, withPrisma, async (c) => {
    const user = c.get('user');
    const prisma = c.get('prisma');

    try {
      const filters = [];
      if (user.email) filters.push({ email: user.email });
      if (user.phoneNumber) filters.push({ phone: user.phoneNumber });

      if (filters.length === 0) {
        return c.json([], 200);
      }

      const pendingInvites = await prisma.pendingInvite.findMany({
        where: {
          OR: filters,
          status: 'PENDING',
        },
        include: {
          household: {
            select: {
              id: true,
              name: true,
              admin: {
                select: {
                  name: true,
                  image: true,
                },
              },
            },
          },
        },
      });

      return c.json(pendingInvites, 200);
    } catch (error: unknown) {
      console.error('Error fetching pending invitations:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      return c.json({ status: 'error', message: `Internal error: ${message}` }, 500);
    }
  })
  .post(
    '/invitations/:id/respond',
    withAuth,
    withPrisma,
    zValidator('json', RespondToInvitationSchema),
    async (c) => {
      const inviteId = c.req.param('id');
      const { action } = c.req.valid('json');
      const { id: userId } = c.get('user');
      const prisma = c.get('prisma');

      try {
        const invite = await prisma.pendingInvite.findUniqueOrThrow({
          where: { id: inviteId },
        });

        if (action === 'ACCEPT') {
          await prisma.user.update({
            where: { id: userId },
            data: { houseHoldId: invite.householdId },
          });

          await prisma.pendingInvite.update({
            where: { id: inviteId },
            data: { status: 'ACCEPTED' },
          });
        } else {
          await prisma.pendingInvite.update({
            where: { id: inviteId },
            data: { status: 'REJECTED' },
          });
        }

        return c.json({ status: 'ok' }, 200);
      } catch (error: unknown) {
        console.error('Error responding to invitation:', error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        return c.json({ status: 'error', message: `Internal error: ${message}` }, 500);
      }
    },
  )
  // GET current invitation code for a household
  .get('/:householdId/invite', withAuth, withPrisma, async (c) => {
    const householdId = c.req.param('householdId');
    const { id: userId } = c.get('user');
    const prisma = c.get('prisma');

    try {
      const user = await prisma.user.findUniqueOrThrow({
        where: { id: userId },
        select: { administeredHouseHold: { select: { id: true } } },
      });

      if (user.administeredHouseHold?.id !== householdId) {
        return c.json({ status: 'error', message: 'Forbidden' }, 403);
      }

      const invitation = await prisma.invitation.findUnique({
        where: { householdId },
        select: { code: true, validity: true, createdAt: true, revokedAt: true },
      });

      if (!invitation || !isValidInvitation(invitation)) {
        return c.json(null, 200);
      }

      return c.json(
        { code: invitation.code, validity: invitation.validity, createdAt: invitation.createdAt },
        200,
      );
    } catch (error) {
      console.error(error);
      return c.json({ status: 'error', message: 'Internal error' }, 500);
    }
  })
  // POST create a new invitation code
  .post(
    '/:householdId/invite',
    withAuth,
    withPrisma,
    zValidator('json', CreateInviteCodeSchema),
    async (c) => {
      const householdId = c.req.param('householdId');
      const { id: userId } = c.get('user');
      const prisma = c.get('prisma');
      const { validity } = c.req.valid('json');

      try {
        const user = await prisma.user.findUniqueOrThrow({
          where: { id: userId },
          select: { administeredHouseHold: { select: { id: true } } },
        });

        if (user.administeredHouseHold?.id !== householdId) {
          return c.json({ status: 'error', message: 'Forbidden' }, 403);
        }

        const generatedCode = crypto.randomInt(100000, 1000000).toString();
        const invitation = await prisma.invitation.upsert({
          where: { householdId },
          update: { code: generatedCode, createdAt: new Date(), validity, revokedAt: null },
          create: { householdId, code: generatedCode, validity },
          select: { code: true, validity: true, createdAt: true },
        });

        return c.json(invitation, 200);
      } catch (error) {
        console.error(error);
        return c.json({ status: 'error', message: 'Internal error' }, 500);
      }
    },
  )
  // PATCH update invitation validity
  .patch(
    '/:householdId/invite',
    withAuth,
    withPrisma,
    zValidator('json', UpdateInviteValiditySchema),
    async (c) => {
      const householdId = c.req.param('householdId');
      const { id: userId } = c.get('user');
      const prisma = c.get('prisma');
      const { validity } = c.req.valid('json');

      try {
        const user = await prisma.user.findUniqueOrThrow({
          where: { id: userId },
          select: { administeredHouseHold: { select: { id: true } } },
        });

        if (user.administeredHouseHold?.id !== householdId) {
          return c.json({ status: 'error', message: 'Forbidden' }, 403);
        }

        const invitation = await prisma.invitation.update({
          where: { householdId },
          data: { validity, createdAt: new Date(), revokedAt: null },
          select: { code: true, validity: true, createdAt: true },
        });

        return c.json(invitation, 200);
      } catch (error) {
        console.error(error);
        return c.json({ status: 'error', message: 'Internal error' }, 500);
      }
    },
  )
  // DELETE revoke invitation code
  .delete('/:householdId/invite', withAuth, withPrisma, async (c) => {
    const householdId = c.req.param('householdId');
    const { id: userId } = c.get('user');
    const prisma = c.get('prisma');

    try {
      const user = await prisma.user.findUniqueOrThrow({
        where: { id: userId },
        select: { administeredHouseHold: { select: { id: true } } },
      });

      if (user.administeredHouseHold?.id !== householdId) {
        return c.json({ status: 'error', message: 'Forbidden' }, 403);
      }

      await prisma.invitation.update({
        where: { householdId },
        data: { revokedAt: new Date() },
      });

      return c.json({ status: 'ok' }, 200);
    } catch (error) {
      console.error(error);
      return c.json({ status: 'error', message: 'Internal error' }, 500);
    }
  })
  .route('/', expenses)
  .route('/', refunds);
