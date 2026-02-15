import { JWTPayload } from 'hono/utils/jwt/types';

export type JwtToken = JWTPayload & {
  sub: string;
};
