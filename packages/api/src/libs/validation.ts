import { zValidator } from '@hono/zod-validator';
import type { ValidationTargets } from 'hono/types';
import type { ZodType } from 'zod';
import { ErrorCode } from './errors';

/**
 * Drop-in replacement for `zValidator` with a unified 422 error format.
 *
 * Usage:  .post('/', validate('json', MySchema), async (c) => { ... })
 */
export function validate<Target extends keyof ValidationTargets, T extends ZodType>(
  target: Target,
  schema: T,
) {
  return zValidator(target, schema, (result, c) => {
    if (!result.success) {
      return c.json(
        {
          code: ErrorCode.VALIDATION_ERROR,
          message: 'Invalid request data',
          details: result.error.flatten(),
          requestId: c.get('requestId') as string,
        },
        422,
      );
    }
  });
}
