import withPrisma from '../libs/prisma';
import { zValidator } from '@hono/zod-validator';
import { CreateHouseHoldSchema } from '@colocapp/shared';
import withAuth from '../libs/auth';
import { ContextWithAuth, ContextWithPrisma } from '../types/Contexts';
import { Hono } from 'hono';

export default new Hono<ContextWithPrisma & ContextWithAuth>()
  .basePath('/household')
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
  });
