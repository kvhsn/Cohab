import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import household from './household';
import { requestId } from 'hono/request-id';
import { auth } from './libs/auth';
import { showRoutes } from 'hono/dev';

const app = new Hono().basePath('/api');

app.use('/*', cors());
app.use('*', requestId());

app.on(['POST', 'GET'], '/auth/*', (c) => auth.handler(c.req.raw));
app.route('/', household);

app.get('/health', (c) => {
  return c.json({ status: 'ok' });
});

serve(
  {
    fetch: app.fetch,
    port: 3000,
    hostname: '0.0.0.0',
  },
  (info) => {
    console.log(`Server is running on ${info.address}:${info.port} in ${process.env.NODE_ENV}`);
    if (process.env.NODE_ENV === 'development') {
      showRoutes(app, {
        verbose: true,
      });
    }
  },
);

export default app;
