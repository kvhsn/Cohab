import { auth } from '../libs/auth';
import { ExtendedPrismaClient } from '../libs/prisma';

type RequestIdVariables = {
  requestId: RequestIdVariables;
};

export type ContextWithPrisma = {
  Variables: {
    prisma: ExtendedPrismaClient;
  };
} & RequestIdVariables;

export type ContextWithAuth = {
  Variables: {
    user: typeof auth.$Infer.Session.user;
    session: typeof auth.$Infer.Session.session;
  };
} & RequestIdVariables;
