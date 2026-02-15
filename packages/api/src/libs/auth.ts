import { Context, Next } from 'hono';
import { jwt, sign } from 'hono/jwt';
import { JwtToken } from '../types/Auth';

export const generateToken = async (userId: string) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not set');
  }
  const now = Math.floor(Date.now() / 1000); // Current time in SECONDS

  return await sign(
    {
      sub: userId,
      iat: now,
      exp: now + 3 * 24 * 3600, // 3 days
    } as JwtToken,
    process.env.JWT_SECRET,
  );
};

function withAuth(c: Context, next: Next) {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not set');
  }
  const jwtMiddleware = jwt({
    secret: process.env.JWT_SECRET,
    alg: 'HS256',
  });
  return jwtMiddleware(c, next);
}

export default withAuth;
