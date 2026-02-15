import { JwtVariables } from 'hono/jwt';
import { PrismaClient } from '../generated/prisma/client';
import { JwtToken } from './Auth';

type RequestIdVariables = {
  requestId: RequestIdVariables;
};

export type ContextWithPrisma = {
  Variables: {
    prisma: PrismaClient;
  };
} & RequestIdVariables;

export type ContextWithAuth = {
  Variables: JwtVariables<JwtToken>;
} & RequestIdVariables;
