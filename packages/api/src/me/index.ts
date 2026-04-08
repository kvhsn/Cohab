import { GetMe } from '@cohab/shared/src/me';
import { Hono } from 'hono';
import { withAuth } from '../libs/auth';
import withPrisma from '../libs/prisma';
import { AppContext } from '../types/Contexts';

export default new Hono<AppContext>()
  .basePath('/me')
  .use('*', withAuth, withPrisma)
  .get('/', async (c) => {
    const { id: userId } = c.get('user');
    const prisma = c.get('prisma');

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
  });
