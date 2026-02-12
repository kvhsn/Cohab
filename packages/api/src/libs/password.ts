import { scrypt, randomBytes, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scryptAsync = promisify(scrypt);

const KEY_LENGTH = 64;

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const buffer = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer;
  return `${salt}:${buffer.toString('hex')}`;
}

export async function verifyPassword(password: string, storedValue: string): Promise<boolean> {
  const [salt, hash] = storedValue.split(':');
  if (!salt || !hash) return false;

  const hashBuffer = Buffer.from(hash, 'hex');
  const buffer = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer;

  return timingSafeEqual(hashBuffer, buffer);
}
