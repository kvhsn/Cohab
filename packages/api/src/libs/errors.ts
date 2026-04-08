import type { ErrorHandler } from 'hono';
import type { ContentfulStatusCode } from 'hono/utils/http-status';
import { HTTPException } from 'hono/http-exception';
import { Prisma } from '../generated/prisma/client.js';

// ── Status → error code mapping ──────────────────────────────────────────

const STATUS_CODE_MAP: Record<number, string> = {
  400: 'BAD_REQUEST',
  401: 'UNAUTHORIZED',
  403: 'FORBIDDEN',
  404: 'NOT_FOUND',
  409: 'CONFLICT',
  410: 'GONE',
  422: 'VALIDATION_ERROR',
};

function errorCodeFromStatus(status: number): string {
  return STATUS_CODE_MAP[status] ?? 'INTERNAL_ERROR';
}

// ── Global error handler ─────────────────────────────────────────────────

export const onError: ErrorHandler = (err, c) => {
  const requestId = c.get('requestId') as string;

  // Hono HTTPException — thrown intentionally by route handlers / middleware
  if (err instanceof HTTPException) {
    return c.json(
      {
        code: errorCodeFromStatus(err.status),
        message: err.message,
        requestId,
      },
      err.status as ContentfulStatusCode,
    );
  }

  // Prisma: record not found (findUniqueOrThrow / findFirstOrThrow)
  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
    return c.json({ code: 'NOT_FOUND', message: 'Resource not found', requestId }, 404);
  }

  // Prisma: unique constraint violation
  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
    return c.json({ code: 'CONFLICT', message: 'Resource already exists', requestId }, 409);
  }

  // Unknown / unexpected — log full details, return opaque response
  console.error(`[${requestId}] Unhandled error:`, err);
  return c.json({ code: 'INTERNAL_ERROR', message: 'Internal error', requestId }, 500);
};
