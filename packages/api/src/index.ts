import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { PrismaClient } from './generated/prisma/client.js';
import withPrisma from './libs/prisma.js';

type ContextWithPrisma = {
  Variables: {
    prisma: PrismaClient;
  };
};

const app = new Hono<ContextWithPrisma>();

app.use('/*', cors());

app.get('/', withPrisma, async (c) => {
  const prisma = c.get('prisma');
  const users = await prisma.user.findMany({
    include: { posts: true },
  });

  return c.json({ users });
});

app.get('/health', (c) => {
  return c.json({ status: 'ok' });
});

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
