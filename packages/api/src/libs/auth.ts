import { Context, Next } from 'hono';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from './prisma';
import { expo } from '@better-auth/expo';

const trustedOrigins = [
  'cohab://',
  // Development mode - Expo's exp:// scheme with local IP ranges
  ...(process.env.NODE_ENV === 'development'
    ? [
        'exp://', // Trust all Expo URLs (prefix matching)
        'exp://**', // Trust all Expo URLs (wildcard matching)
        'exp://192.168.*.*:*/**', // Trust 192.168.x.x IP range with any port and path
      ]
    : []),
];

export const auth = betterAuth({
  plugins: [expo()],
  emailAndPassword: {
    enabled: true,
  },
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  trustedOrigins,
});

export async function withAuth(c: Context, next: Next) {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session) {
    return c.json({ status: 'error', message: 'Unauthorized' }, 401);
  }

  c.set('session', session.session);
  c.set('user', session.user);

  return next();
}
