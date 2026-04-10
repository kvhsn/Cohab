import type { Context, Next } from 'hono';
import { HTTPException } from 'hono/http-exception';

/**
 * Ensures the authenticated user is the owner of the expense identified
 * by the `:expenseId` route parameter.
 *
 * Must run after `withAuth` and `withPrisma`.
 */
export async function withExpenseOwner(c: Context, next: Next) {
  const expenseId = c.req.param('expenseId');
  const { id: userId } = c.get('user');
  const prisma = c.get('prisma');

  const expense = await prisma.expense.findUniqueOrThrow({
    where: { id: expenseId },
    select: { memberId: true },
  });

  if (expense.memberId !== userId) {
    throw new HTTPException(403, { message: 'You are not the owner of this expense' });
  }

  return next();
}
