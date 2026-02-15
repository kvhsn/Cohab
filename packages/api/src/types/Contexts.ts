import { JwtVariables } from 'hono/jwt';
import { PrismaClient } from '../generated/prisma/client';
import { JwtToken } from './Auth';

export type ContextWithPrisma = {
  Variables: {
    prisma: PrismaClient;
  };
};

export type ContextWithAuth = {
  Variables: JwtVariables<JwtToken>;
};
