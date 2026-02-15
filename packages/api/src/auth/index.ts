import { Hono } from 'hono';
import withPrisma from '../libs/prisma';
import { zValidator } from '@hono/zod-validator';
import { LoginSchema, RegisterSchema } from '@colocapp/shared';
import { hashPassword, verifyPassword } from '../libs/password';
import { ContextWithPrisma } from '../types/App';
import withAuth, { generateToken } from '../libs/auth';

export default new Hono<ContextWithPrisma>()
  .basePath('/auth')
  .post('/register', withPrisma, zValidator('json', RegisterSchema), async (c) => {
    const data = c.req.valid('json');

    const hashedPassword = await hashPassword(data.password);

    await c.get('prisma').user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });

    return c.json({ success: true }, 201);
  })
  .post('/login', withPrisma, zValidator('json', LoginSchema), async (c) => {
    const data = c.req.valid('json');

    const user = await c.get('prisma').user.findUnique({
      where: {
        email: data.email,
      },
      select: { password: true, id: true },
    });

    if (!user || !(await verifyPassword(data.password, user.password))) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    const token = await generateToken(user.id);

    return c.json({ token });
  })
  .get('/', withAuth, (c) => {
    return c.json({ status: 'ok' });
  });
