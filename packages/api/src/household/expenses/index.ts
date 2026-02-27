import { Hono } from 'hono';
import { ContextWithAuth, ContextWithPrisma } from '../../types/Contexts';
import { zValidator } from '@hono/zod-validator';
import withPrisma from '../../libs/prisma';
import { withAuth } from '../../libs/auth';
import { CreateExpenseSchema, GetExpenses } from '@cohab/shared/src/expense';
import { createBalance } from './helpers';

export default new Hono<ContextWithPrisma & ContextWithAuth>()
  .basePath('/:householdId')
  .get('/balance', withAuth, withPrisma, async (c) => {
    const householdId = c.req.param('householdId');
    const { id: userId } = c.get('user');
    const prisma = c.get('prisma');

    try {
      const user = await prisma.user.findUniqueOrThrow({
        where: { id: userId },
        select: { houseHoldId: true },
      });

      if (user.houseHoldId !== householdId) {
        return c.json({ status: 'error', message: 'You do not belong to this household' }, 403);
      }

      const { members: householdMembers } = await prisma.household.findFirstOrThrow({
        where: {
          id: householdId,
        },
        select: {
          members: {
            select: {
              id: true,
            },
          },
        },
      });
      const householdMemberIds = householdMembers.map(({ id }) => id);

      const expenses = await prisma.expense.findMany({
        where: {
          householdId,
        },
        select: {
          amount: true,
          memberId: true,
        },
      });
      const refunds = await prisma.refund.findMany({
        where: {
          householdId,
        },
        select: {
          amount: true,
          fromMemberId: true,
          toMemberId: true,
        },
      });
      const balance = createBalance(expenses, refunds, householdMemberIds);
      return c.json(balance, 200);
    } catch (error) {
      console.error(error);
      return c.json({ status: 'error', message: 'Internal error' }, 500);
    }
  })
  .basePath('/expenses')
  .post('/', withAuth, withPrisma, zValidator('json', CreateExpenseSchema), async (c) => {
    const { name, amount } = c.req.valid('json');
    const householdId = c.req.param('householdId');
    const { id: userId } = c.get('user');
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
    const { id: userId } = c.get('user');
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
        select: {
          createdAt: true,
          id: true,
          name: true,
          amount: true,
          member: {
            select: {
              name: true,
            },
          },
        },
      });
      return c.json(
        {
          expenses: expenses.map((expense) => ({
            ...expense,
            createdAt: expense.createdAt.toISOString(),
          })),
        } as GetExpenses,
        200,
      );
    } catch (error) {
      console.error(error);
      return c.json({ status: 'error', message: 'Internal error' }, 500);
    }
  })
  .delete('/:expenseId', withAuth, withPrisma, async (c) => {
    const { id: userId } = c.get('user');
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
