import { describe, expect, test } from 'vitest';
import { createBalance } from '.';
import { Expense } from '../types';
import { Refund } from '@cohab/shared/src/refund';

describe('createBalance', () => {
  test('should handle no expense', () => {
    const refunds: Refund[] = [];
    const members = ['member1', 'member2', 'member3'];
    const expenses: Expense[] = [];
    const balance = createBalance(expenses, refunds, members);
    expect(balance).toStrictEqual({
      total: 0,
      shares: {
        member1: 0,
        member2: 0,
        member3: 0,
      },
    });
  });
  test('should handle distinct member expenses', () => {
    const refunds: Refund[] = [];
    const members = ['member1', 'member2', 'member3'];
    const expenses: Expense[] = [
      {
        memberId: 'member1',
        amount: 1000,
      },
      { memberId: 'member2', amount: 500 },
      { memberId: 'member3', amount: 4000 },
    ];
    const balance = createBalance(expenses, refunds, members);
    expect(balance).toStrictEqual({
      total: 5500,
      shares: {
        member1: -833 + 1,
        member2: -1333,
        member3: 2167,
      },
    });
  });
  test('should handle multiple expenses from same member', () => {
    const refunds: Refund[] = [];
    const members = ['member1', 'member2', 'member3'];
    const expenses: Expense[] = [
      {
        memberId: 'member1',
        amount: 1000,
      },
      { memberId: 'member2', amount: 500 },
      { memberId: 'member3', amount: 4000 },
      {
        memberId: 'member1',
        amount: 500,
      },
    ];
    const balance = createBalance(expenses, refunds, members);
    expect(balance).toStrictEqual({
      total: 6000,
      shares: {
        member1: -500,
        member2: -1500,
        member3: 2000,
      },
    });
  });
  test('should handle expenses with refunds', () => {
    const refunds: Refund[] = [
      {
        fromMemberId: 'member1',
        toMemberId: 'member2',
        amount: 500,
      },
    ];
    const members = ['member1', 'member2', 'member3'];
    const expenses: Expense[] = [
      {
        memberId: 'member1',
        amount: 1000,
      },
      { memberId: 'member2', amount: 500 },
      { memberId: 'member3', amount: 4000 },
    ];
    const balance = createBalance(expenses, refunds, members);
    expect(balance).toStrictEqual({
      total: 5500,
      shares: {
        member1: -1333 + 1,
        member2: -833,
        member3: 2167,
      },
    });
  });
  test('should handle expenses with unknown member (case of leaving household)', () => {
    const refunds: Refund[] = [];
    const members = ['member1', 'member2', 'member3'];
    const expenses: Expense[] = [
      {
        memberId: 'member1',
        amount: 1000,
      },
      { memberId: 'member2', amount: 500 },
      { memberId: 'member3', amount: 4000 },
      { memberId: 'member4', amount: 500 },
    ];
    const balance = createBalance(expenses, refunds, members);
    expect(balance).toStrictEqual({
      total: 6000,
      shares: {
        member1: -1000,
        member2: -1500,
        member3: 2000,
        member4: 500,
      },
    });
  });
});
