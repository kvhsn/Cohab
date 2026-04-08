import { Hono } from 'hono';
import { withHouseholdMember } from '../../middleware/household';
import { AppContext } from '../../types/Contexts';
import { createBalance } from '../expenses/helpers';
import { createRefunds } from './helpers';

export default new Hono<AppContext>()
  .basePath('/:householdId')
  .use('*', withHouseholdMember)
  .get('/refunds', async (c) => {
    const householdId = c.req.param('householdId');
    const prisma = c.get('prisma');

    const { members: householdMembers } = await prisma.household.findFirstOrThrow({
      where: { id: householdId },
      select: { members: true },
    });

    const householdMemberIds = householdMembers.map(({ id }) => id);

    const [expenses, refunds] = await Promise.all([
      prisma.expense.findMany({
        where: { householdId },
        select: { amount: true, memberId: true },
      }),
      prisma.refund.findMany({
        where: { householdId },
        select: { amount: true, fromMemberId: true, toMemberId: true },
      }),
    ]);

    const balance = createBalance(expenses, refunds, householdMemberIds);
    return c.json({ refunds: createRefunds(balance) }, 200);
  });
