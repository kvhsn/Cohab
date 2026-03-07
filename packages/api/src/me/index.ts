import { GetMe } from '@cohab/shared/src/me';
import { Hono } from 'hono';
import { withAuth } from '../libs/auth';
import withPrisma from '../libs/prisma';
import { ContextWithAuth, ContextWithPrisma } from '../types/Contexts';

export default new Hono<ContextWithPrisma & ContextWithAuth>()
  .basePath('/me')
  .get('/', withAuth, withPrisma, async (c) => {
    const { id: userId } = c.get('user');
    const prisma = c.get('prisma');
    try {
      const user = await prisma.user.findUniqueOrThrow({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          household: {
            select: {
              id: true,
              name: true,
              adminId: true,
              members: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
                },
              },
            },
          },
        },
      });
      return c.json(user as GetMe, 200);
    } catch (error) {
      console.error(error);
      return c.json({ status: 'error', message: 'Internal error' }, 500);
    }
  });
