import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import auth from './auth';
import household from './household';
import { requestId } from 'hono/request-id';
import { prisma } from './libs/prisma';

const app = new Hono().basePath('/api');

app.use('/*', cors());
app.use('*', requestId());

app.route('/', auth);
app.route('/', household);

app.get('/health', (c) => {
  return c.json({ status: 'ok' });
});

const port = 3000;

const server = serve(
  {
    fetch: app.fetch,
    port,
    hostname: '0.0.0.0',
  },
  (info) => {
    console.log(`Server is running on port ${info.port}`);
  },
);

const shutdown = async () => {
  console.log('Shutting down server...');
  await prisma.$disconnect();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

export default app;
