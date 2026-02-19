import { JwtVariables } from 'hono/jwt';
import { ExtendedPrismaClient } from '../libs/prisma';
import { JwtToken } from './Auth';

type RequestIdVariables = {
  requestId: RequestIdVariables;
};

export type ContextWithPrisma = {
  Variables: {
    prisma: ExtendedPrismaClient;
  };
} & RequestIdVariables;

export type ContextWithAuth = {
  Variables: JwtVariables<JwtToken>;
} & RequestIdVariables;
