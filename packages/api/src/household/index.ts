import {
  CreateHouseHoldSchema,
  JoinHouseHoldSchema,
  UpdateHouseholdSchema,
} from '@cohab/shared/src/household';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';
import { withAuth } from '../libs/auth';
import withPrisma from '../libs/prisma';
import { validate } from '../libs/validation';
import { withHouseholdAdmin } from '../middleware/household';
import { AppContext } from '../types/Contexts';
import expenses from './expenses';
import { adminInvite, pending } from './invitations';
import refunds from './refunds';
import { isValidInvitation } from './utils/invitation';

export default new Hono<AppContext>()
  .basePath('/households')
  .use('*', withAuth, withPrisma)

  // ── Create ──────────────────────────────────────────────────────────────
  .post('/', validate('json', CreateHouseHoldSchema), async (c) => {
    const { name, invites } = c.req.valid('json');
    const { id: userId } = c.get('user');
    const prisma = c.get('prisma');

    const user = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
    });

    if (user.houseHoldId) {
      throw new HTTPException(409, {
        message: `Please leave current household ${user.houseHoldId} before creating a new one`,
      });
    }

    const createdHousehold = await prisma.household.create({
      data: {
        name,
        adminId: userId,
        members: { connect: { id: userId } },
      },
      select: { id: true },
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
  })

  // ── Update ──────────────────────────────────────────────────────────────
  .put('/', validate('json', UpdateHouseholdSchema), async (c) => {
    const { id: userId } = c.get('user');
    const prisma = c.get('prisma');
    const { name } = c.req.valid('json');

    const { houseHoldId } = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { houseHoldId: true },
    });

    if (!houseHoldId) {
      throw new HTTPException(400, { message: 'You are not in a household' });
    }

    const updated = await prisma.household.update({
      where: { id: houseHoldId },
      data: { name },
    });

    return c.json(updated, 200);
  })

  // ── Remove member (admin only) ─────────────────────────────────────────
  .delete('/:householdId/members/:memberId', withHouseholdAdmin, async (c) => {
    const householdId = c.req.param('householdId');
    const memberId = c.req.param('memberId');
    const { id: userId } = c.get('user');
    const prisma = c.get('prisma');

    if (userId === memberId) {
      throw new HTTPException(400, {
        message: 'Admin cannot remove themselves. Use the leave endpoint.',
      });
    }

    await prisma.user.update({
      where: { id_houseHoldId: { id: memberId, houseHoldId: householdId } },
      data: { houseHoldId: null },
    });

    return c.json({ status: 'ok', message: 'Member removed' }, 200);
  })

  // ── Leave ───────────────────────────────────────────────────────────────
  .post('/leave', async (c) => {
    const { id: userId } = c.get('user');
    const prisma = c.get('prisma');

    const user = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: {
        houseHoldId: true,
        administeredHouseHold: { select: { id: true, members: { select: { id: true } } } },
      },
    });

    const houseHoldId = user.houseHoldId;
    if (!houseHoldId) {
      throw new HTTPException(400, { message: 'You are not in a household' });
    }

    if (user.administeredHouseHold?.id === houseHoldId) {
      const otherMembers = user.administeredHouseHold.members.filter((m) => m.id !== userId);

      if (otherMembers.length > 0) {
        await prisma.household.update({
          where: { id: houseHoldId },
          data: { adminId: otherMembers[0].id },
        });
      } else {
        await prisma.invitation.deleteMany({ where: { householdId: houseHoldId } });
        await prisma.expense.deleteMany({ where: { householdId: houseHoldId } });
        await prisma.refund.deleteMany({ where: { householdId: houseHoldId } });
        await prisma.household.delete({ where: { id: houseHoldId } });
      }
    }

    await prisma.user.update({
      where: { id: userId },
      data: { houseHoldId: null },
    });

    return c.json({ status: 'ok', message: 'Left household' }, 200);
  })

  // ── Join via invitation code ────────────────────────────────────────────
  .post('/join', validate('json', JoinHouseHoldSchema), async (c) => {
    const { id: userId } = c.get('user');
    const prisma = c.get('prisma');
    const { code } = c.req.valid('json');

    const user = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { houseHoldId: true },
    });

    if (user.houseHoldId) {
      throw new HTTPException(409, { message: 'You are already in a household' });
    }

    const invitation = await prisma.invitation.findUnique({
      where: { code },
      select: { householdId: true, validity: true, createdAt: true, revokedAt: true },
    });

    if (!invitation) {
      throw new HTTPException(404, { message: "Code d'invitation invalide" });
    }

    if (!isValidInvitation(invitation)) {
      throw new HTTPException(410, { message: "Ce code d'invitation a expiré ou a été révoqué" });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { houseHoldId: invitation.householdId },
    });

    return c.json({ status: 'ok', householdId: invitation.householdId }, 200);
  })

  // ── Sub-routers ─────────────────────────────────────────────────────────
  .route('/', pending)
  .route('/', adminInvite)
  .route('/', expenses)
  .route('/', refunds);
