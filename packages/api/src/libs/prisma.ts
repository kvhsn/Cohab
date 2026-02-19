import type { Context, Next } from 'hono';
import { PrismaClient } from '../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set');
}

const adapter = new PrismaPg({
  connectionString: databaseUrl,
});

export const prisma = new PrismaClient({
  adapter,
  omit: {
    user: {
      password: true,
    },
  },
});

export type ExtendedPrismaClient = typeof prisma;

function withPrisma(c: Context, next: Next) {
  if (!c.get('prisma')) {
    c.set('prisma', prisma);
  }
  return next();
}

export default withPrisma;
