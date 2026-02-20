import { Hono } from 'hono';
import { ContextWithAuth, ContextWithPrisma } from '../../types/Contexts';
import { zValidator } from '@hono/zod-validator';
import withPrisma from '../../libs/prisma';
import withAuth from '../../libs/auth';
import { CreateExpenseSchema, GetExpenses } from '@colocapp/shared/src/expense';

export default new Hono<ContextWithPrisma & ContextWithAuth>()
  .basePath('/:householdId/expenses')
  .post('/', withAuth, withPrisma, zValidator('json', CreateExpenseSchema), async (c) => {
    const { name, amount } = c.req.valid('json');
    const householdId = c.req.param('householdId');
    const { sub: userId } = c.get('jwtPayload');
    const prisma = c.get('prisma');

    try {
      const user = await prisma.user.findUniqueOrThrow({
        where: { id: userId },
        select: { houseHoldId: true },
      });

      if (user.houseHoldId !== householdId) {
        return c.json({ status: 'error', message: 'You do not belong to this household' }, 403);
      }

      const expense = await prisma.expense.create({
        data: {
          name,
          amount,
          householdId,
          memberId: userId,
        },
      });

      return c.json(expense, 201);
    } catch (error) {
      console.error(error);
      return c.json({ status: 'error', message: 'Internal error' }, 500);
    }
  })
  .get('/', withAuth, withPrisma, async (c) => {
    const { sub: userId } = c.get('jwtPayload');
    const householdId = c.req.param('householdId');
    const prisma = c.get('prisma');
    try {
      const user = await prisma.user.findUniqueOrThrow({
        where: { id: userId },
        select: { houseHoldId: true },
      });

      if (user.houseHoldId !== householdId) {
        return c.json({ status: 'error', message: 'You do not belong to this household' }, 403);
      }

      const expenses = await prisma.expense.findMany({
        where: {
          householdId,
        },
      });
      return c.json({ expenses } as GetExpenses, 200);
    } catch (error) {
      console.error(error);
      return c.json({ status: 'error', message: 'Internal error' }, 500);
    }
  })
  .delete('/:expenseId', withAuth, withPrisma, async (c) => {
    const { sub: userId } = c.get('jwtPayload');
    const householdId = c.req.param('householdId');
    const expenseId = c.req.param('expenseId');
    const prisma = c.get('prisma');
    try {
      const user = await prisma.user.findUniqueOrThrow({
        where: { id: userId },
        select: { houseHoldId: true },
      });

      if (user.houseHoldId !== householdId) {
        return c.json({ status: 'error', message: 'You do not belong to this household' }, 403);
      }

      const expense = await prisma.expense.delete({
        where: {
          id: expenseId,
        },
      });
      return c.json(expense, 200);
    } catch (error) {
      console.error(error);
      return c.json({ status: 'error', message: 'Internal error' }, 500);
    }
  });
