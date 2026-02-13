import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { PrismaClient } from './generated/prisma/client.js';
import withPrisma from './libs/prisma.js';
import { zValidator } from '@hono/zod-validator';
import { LoginSchema, RegisterSchema } from '@colocapp/shared';
import { hashPassword, verifyPassword } from './libs/password.js';
import withAuth, { generateToken } from './libs/auth.js';

type ContextWithPrisma = {
  Variables: {
    prisma: PrismaClient;
  };
};

const app = new Hono<ContextWithPrisma>();

app.use('/*', cors());

app.post('/register', withPrisma, zValidator('json', RegisterSchema), async (c) => {
  const data = c.req.valid('json');

  const hashedPassword = await hashPassword(data.password);

  await c.get('prisma').user.create({
    data: {
      ...data,
      password: hashedPassword,
    },
  });

  return c.json({ success: true }, 201);
});

app.post('/login', withPrisma, zValidator('json', LoginSchema), async (c) => {
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
});

app.get('/auth', withAuth, (c) => {
  return c.json({ status: 'ok' });
});

app.get('/health', (c) => {
  return c.json({ status: 'ok' });
});

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
  hostname: '0.0.0.0',
});
