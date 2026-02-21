import { describe, expect, test } from 'vitest';
import { createBalance, Expense } from '.';

describe('createBalance', () => {
  test('should handle no expense', () => {
    const members = ['member1', 'member2', 'member3'];
    const expenses: Expense[] = [];
    const balance = createBalance(expenses, members);
    expect(balance).toStrictEqual(
      new Map([
        ['member1', 0],
        ['member2', 0],
        ['member3', 0],
      ]),
    );
  });
  test('should handle distinct member expenses', () => {
    const members = ['member1', 'member2', 'member3'];
    const expenses: Expense[] = [
      {
        userId: 'member1',
        amount: 1000,
      },
      { userId: 'member2', amount: 500 },
      { userId: 'member3', amount: 4000 },
    ];
    const balance = createBalance(expenses, members);
    expect(balance).toStrictEqual(
      new Map([
        ['member1', -833 + 1],
        ['member2', -1333],
        ['member3', 2167],
      ]),
    );
  });
  test('should handle multiple expenses from same member', () => {
    const members = ['member1', 'member2', 'member3'];
    const expenses: Expense[] = [
      {
        userId: 'member1',
        amount: 1000,
      },
      { userId: 'member2', amount: 500 },
      { userId: 'member3', amount: 4000 },
      {
        userId: 'member1',
        amount: 500,
      },
    ];
    const balance = createBalance(expenses, members);
    expect(balance).toStrictEqual(
      new Map([
        ['member1', -500],
        ['member2', -1500],
        ['member3', 2000],
      ]),
    );
  });
  test('should handle expenses with unknown member (case of leaving household)', () => {
    const members = ['member1', 'member2', 'member3'];
    const expenses: Expense[] = [
      {
        userId: 'member1',
        amount: 1000,
      },
      { userId: 'member2', amount: 500 },
      { userId: 'member3', amount: 4000 },
      { userId: 'member4', amount: 500 },
    ];
    const balance = createBalance(expenses, members);
    expect(balance).toStrictEqual(
      new Map([
        ['member1', -1000],
        ['member2', -1500],
        ['member3', 2000],
        ['member4', 500],
      ]),
    );
  });
});
