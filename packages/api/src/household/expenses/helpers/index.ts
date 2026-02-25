import { Expense } from '../types';
import { Refund } from '@colocapp/shared/src/refund';
import { Balance } from '@colocapp/shared/src/balance';

export const createBalance = (
  expenses: Expense[],
  refunds: Refund[],
  members: string[],
): Balance => {
  const balance: Balance = {
    total: 0,
    shares: members.reduce<Record<string, number>>((acc, user) => {
      acc[user] = 0;
      return acc;
    }, {}),
  };

  if (members.length === 0) return balance;

  for (const expense of expenses) {
    const memberBalance = balance.shares[expense.memberId];
    if (memberBalance === undefined) {
      // Case where an expense member is no longer in the household
      balance.shares[expense.memberId] = expense.amount;
    } else {
      balance.shares[expense.memberId] = memberBalance + expense.amount;
    }
    balance.total += expense.amount;
  }

  const part = Math.floor(balance.total / members.length);
  const remainder = balance.total % members.length;

  for (const user of members) {
    const userTotal = balance.shares[user] || 0;
    balance.shares[user] = userTotal - part;
  }
  // affect the remainder to the first member
  balance.shares[members[0]] += remainder;

  for (const refund of refunds) {
    const originUserExpanse = balance.shares[refund.fromMemberId] ?? 0;
    const destinationUserExpanse = balance.shares[refund.toMemberId] ?? 0;
    balance.shares[refund.fromMemberId] = originUserExpanse - refund.amount;
    balance.shares[refund.toMemberId] = destinationUserExpanse + refund.amount;
  }
  return balance;
};
