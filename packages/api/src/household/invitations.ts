import {
  CreateInviteCodeSchema,
  RespondToInvitationSchema,
  UpdateInviteValiditySchema,
} from '@cohab/shared/src/household';
import { Hono } from 'hono';
import crypto from 'node:crypto';
import { validate } from '../libs/validation';
import { withHouseholdAdmin } from '../middleware/household';
import { AppContext } from '../types/Contexts';
import { isValidInvitation } from './utils/invitation';

// ── Pending invitations (any authenticated user) ────────────────────────

const pending = new Hono<AppContext>()
  .get('/invitations/pending', async (c) => {
    const user = c.get('user');
    const prisma = c.get('prisma');

    const filters: Record<string, string>[] = [];
    if (user.email) filters.push({ email: user.email });
    if (user.phoneNumber) filters.push({ phone: user.phoneNumber });

    if (filters.length === 0) return c.json([], 200);

    const pendingInvites = await prisma.pendingInvite.findMany({
      where: { OR: filters, status: 'PENDING' },
      include: {
        household: {
          select: {
            id: true,
            name: true,
            admin: { select: { name: true, image: true } },
          },
        },
      },
    });

    return c.json(pendingInvites, 200);
  })
  .post('/invitations/:id/respond', validate('json', RespondToInvitationSchema), async (c) => {
    const inviteId = c.req.param('id');
    const { action } = c.req.valid('json');
    const { id: userId } = c.get('user');
    const prisma = c.get('prisma');

    const invite = await prisma.pendingInvite.findUniqueOrThrow({
      where: { id: inviteId },
    });

    if (action === 'ACCEPT') {
      await prisma.user.update({
        where: { id: userId },
        data: { houseHoldId: invite.householdId },
      });
      await prisma.pendingInvite.update({
        where: { id: inviteId },
        data: { status: 'ACCEPTED' },
      });
    } else {
      await prisma.pendingInvite.update({
        where: { id: inviteId },
        data: { status: 'REJECTED' },
      });
    }

    return c.json({ status: 'ok' }, 200);
  });

// ── Invite code management (admin only) ─────────────────────────────────

const adminInvite = new Hono<AppContext>()
  .basePath('/:householdId/invite')
  .use('*', withHouseholdAdmin)
  .get('/', async (c) => {
    const householdId = c.req.param('householdId');
    const prisma = c.get('prisma');

    const invitation = await prisma.invitation.findUnique({
      where: { householdId },
      select: { code: true, validity: true, createdAt: true, revokedAt: true },
    });

    if (!invitation || !isValidInvitation(invitation)) {
      return c.json(null, 200);
    }

    return c.json(
      { code: invitation.code, validity: invitation.validity, createdAt: invitation.createdAt },
      200,
    );
  })
  .post('/', validate('json', CreateInviteCodeSchema), async (c) => {
    const householdId = c.req.param('householdId');
    const prisma = c.get('prisma');
    const { validity } = c.req.valid('json');

    const generatedCode = crypto.randomInt(100000, 1000000).toString();
    const invitation = await prisma.invitation.upsert({
      where: { householdId },
      update: { code: generatedCode, createdAt: new Date(), validity, revokedAt: null },
      create: { householdId, code: generatedCode, validity },
      select: { code: true, validity: true, createdAt: true },
    });

    return c.json(invitation, 200);
  })
  .patch('/', validate('json', UpdateInviteValiditySchema), async (c) => {
    const householdId = c.req.param('householdId');
    const prisma = c.get('prisma');
    const { validity } = c.req.valid('json');

    const invitation = await prisma.invitation.update({
      where: { householdId },
      data: { validity, createdAt: new Date(), revokedAt: null },
      select: { code: true, validity: true, createdAt: true },
    });

    return c.json(invitation, 200);
  })
  .delete('/', async (c) => {
    const householdId = c.req.param('householdId');
    const prisma = c.get('prisma');

    await prisma.invitation.update({
      where: { householdId },
      data: { revokedAt: new Date() },
    });

    return c.json({ status: 'ok' }, 200);
  });

export { pending, adminInvite };
