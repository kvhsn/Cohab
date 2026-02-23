import { describe, expect, test } from 'vitest';
import { createRefunds } from './';
import { Balance } from '@colocapp/shared/src/balance';

describe('createRefunds', () => {
  test('should handle no expenses', () => {
    const balance: Balance = { total: 0, shares: {} };
    const refunds = createRefunds(balance);
    expect(refunds).toEqual([]);
  });

  test('should handle one expense', () => {
    const balance: Balance = { total: 10, shares: { user1: 10 } };
    const refunds = createRefunds(balance);
    expect(refunds).toEqual([]);
  });
  test('should handle multiple expenses', () => {
    const balance: Balance = {
      total: 10,
      shares: {
        user1: 10,
        user2: -10,
      },
    };
    const refunds = createRefunds(balance);
    expect(refunds).toEqual([
      {
        fromMemberId: 'user1',
        toMemberId: 'user2',
        amount: 10,
      },
    ]);
  });
});
