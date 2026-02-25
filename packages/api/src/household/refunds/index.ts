import { Hono } from 'hono';
import { withAuth } from '../../libs/auth';
import { ContextWithAuth, ContextWithPrisma } from '../../types/Contexts';
import withPrisma from '../../libs/prisma';
import { createBalance } from '../expenses/helpers';
import { createRefunds } from './helpers';

export default new Hono<ContextWithPrisma & ContextWithAuth>()
  .basePath('/:householdId')
  .get('/refunds', withAuth, withPrisma, async (c) => {
    const { id: userId } = c.get('user');
    const prisma = c.get('prisma');
    const householdId = c.req.param('householdId');
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
          members: true,
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
      return c.json({ refunds: createRefunds(balance) }, 200);
    } catch (error) {
      console.error(error);
      return c.json({ status: 'error', message: 'Internal error' }, 500);
    }
  });
