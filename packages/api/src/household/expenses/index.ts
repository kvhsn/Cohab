import { CreateExpenseSchema, GetExpense, GetExpenses } from '@cohab/shared/src/expense';
import { Hono } from 'hono';
import { validate } from '../../libs/validation';
import { withHouseholdMember } from '../../middleware/household';
import { withExpenseOwner } from '../../middleware/ownership';
import { AppContext } from '../../types/Contexts';
import { createBalance } from './helpers';

export default new Hono<AppContext>()
  .basePath('/:householdId')
  .use('*', withHouseholdMember)

  // ── Balance ───────────────────────────────────────────────────────────
  .get('/balance', async (c) => {
    const householdId = c.req.param('householdId');
    const prisma = c.get('prisma');

    const { members: householdMembers } = await prisma.household.findFirstOrThrow({
      where: { id: householdId },
      select: { members: { select: { id: true } } },
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

    return c.json(createBalance(expenses, refunds, householdMemberIds), 200);
  })

  // ── Expenses CRUD ─────────────────────────────────────────────────────
  .basePath('/expenses')
  .post('/', validate('json', CreateExpenseSchema), async (c) => {
    const { name, amount, category, note } = c.req.valid('json');
    const householdId = c.req.param('householdId');
    const { id: userId } = c.get('user');
    const prisma = c.get('prisma');

    const expense = await prisma.expense.create({
      data: { name, amount, category, note, householdId, memberId: userId },
    });

    return c.json(expense, 201);
  })
  .get('/', async (c) => {
    const householdId = c.req.param('householdId');
    const prisma = c.get('prisma');
    const { id: userId } = c.get('user');

    const expenses = await prisma.expense.findMany({
      where: { householdId },
      select: {
        createdAt: true,
        id: true,
        name: true,
        amount: true,
        category: true,
        note: true,
        memberId: true,
        member: { select: { name: true } },
      },
    });

    return c.json(
      {
        expenses: expenses.map((expense) => ({
          ...expense,
          isMine: expense.memberId === userId,
          createdAt: expense.createdAt.toISOString(),
        })),
      } as GetExpenses,
      200,
    );
  })
  .get('/:expenseId', async (c) => {
    const expenseId = c.req.param('expenseId');
    const householdId = c.req.param('householdId');
    const { id: userId } = c.get('user');
    const prisma = c.get('prisma');

    const expense = await prisma.expense.findFirstOrThrow({
      where: { id: expenseId, householdId },
      select: {
        id: true,
        name: true,
        amount: true,
        category: true,
        note: true,
        createdAt: true,
        memberId: true,
        member: { select: { name: true } },
      },
    });

    return c.json(
      {
        ...expense,
        isMine: expense.memberId === userId,
        createdAt: expense.createdAt.toISOString(),
      } as GetExpense,
      200,
    );
  })
  .delete('/:expenseId', withExpenseOwner, async (c) => {
    const expenseId = c.req.param('expenseId');
    const prisma = c.get('prisma');

    const expense = await prisma.expense.delete({ where: { id: expenseId } });
    return c.json(expense, 200);
  });
