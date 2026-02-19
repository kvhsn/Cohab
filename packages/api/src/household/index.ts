import withPrisma from '../libs/prisma';
import { zValidator } from '@hono/zod-validator';
import { CreateHouseHoldSchema } from '@colocapp/shared';
import withAuth from '../libs/auth';
import { ContextWithAuth, ContextWithPrisma } from '../types/Contexts';
import { Hono } from 'hono';
import crypto from 'node:crypto';
import { isOutdatedInvitation } from './utils/invitation';
import { JoinHouseHoldSchema } from '@colocapp/shared/src/household';

export default new Hono<ContextWithPrisma & ContextWithAuth>()
  .basePath('/households')
  .post('/', withAuth, withPrisma, zValidator('json', CreateHouseHoldSchema), async (c) => {
    const { name } = c.req.valid('json');
    const { sub: userId } = c.get('jwtPayload');
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
        const createdHousehold = await prisma.houseHold.create({
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
  .post('/join', withAuth, withPrisma, zValidator('json', JoinHouseHoldSchema), async (c) => {
    try {
      const { sub: userId } = c.get('jwtPayload');
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
        where: {
          code,
        },
        select: { householdId: true },
      });
      if (!invitation) {
        throw new Error('Invitation not found');
      }
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          houseHoldId: invitation.householdId,
        },
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
  .basePath('/:householdId')
  .post('/invite', withAuth, withPrisma, async (c) => {
    const householdId = c.req.param('householdId');
    const { sub: userId } = c.get('jwtPayload');
    const prisma = c.get('prisma');
    try {
      const user = await prisma.user.findUniqueOrThrow({
        where: { id: userId },
        select: { administeredHouseHold: { select: { id: true } } },
      });

      if (user.administeredHouseHold?.id !== householdId) {
        throw new Error(`You need to be admin of ${householdId} to create an invite`);
      }

      const existingInvitation = await prisma.invitation.findUnique({
        where: { householdId },
        select: { createdAt: true, code: true },
      });

      if (
        existingInvitation &&
        !isOutdatedInvitation(Date.now(), existingInvitation.createdAt.getTime())
      ) {
        return c.json({ householdId, code: existingInvitation.code }, 200);
      }

      const generatedCode = crypto.randomInt(100000, 1000000).toString();
      const invitation = await prisma.invitation.upsert({
        where: { householdId },
        update: { code: generatedCode, createdAt: new Date() },
        create: { householdId, code: generatedCode },
        select: { code: true, householdId: true },
      });

      return c.json(invitation, 200);
    } catch (error) {
      console.error(error);
      return c.json({ status: 'error', message: 'Internal error' }, 500);
    }
  });
