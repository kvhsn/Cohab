import type { Context, Next } from 'hono';
import { HTTPException } from 'hono/http-exception';

/**
 * Ensures the authenticated user belongs to the household identified
 * by the `:householdId` route parameter.
 *
 * Must run after `withAuth` and `withPrisma`.
 */
export async function withHouseholdMember(c: Context, next: Next) {
  const householdId = c.req.param('householdId');
  const { id: userId } = c.get('user');
  const prisma = c.get('prisma');

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: { houseHoldId: true },
  });

  if (user.houseHoldId !== householdId) {
    throw new HTTPException(403, { message: 'You do not belong to this household' });
  }

  return next();
}

/**
 * Ensures the authenticated user is the admin of the household
 * identified by the `:householdId` route parameter.
 *
 * Must run after `withAuth` and `withPrisma`.
 */
export async function withHouseholdAdmin(c: Context, next: Next) {
  const householdId = c.req.param('householdId');
  const { id: userId } = c.get('user');
  const prisma = c.get('prisma');

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: { administeredHouseHold: { select: { id: true } } },
  });

  if (user.administeredHouseHold?.id !== householdId) {
    throw new HTTPException(403, { message: 'You are not the admin of this household' });
  }

  return next();
}
