import { PrismaClient } from '../generated/prisma/client';

export type ContextWithPrisma = {
  Variables: {
    prisma: PrismaClient;
  };
};
