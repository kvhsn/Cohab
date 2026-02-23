import { Refund } from './types';
import { Balance } from '../expenses/types';

export const createRefunds = (balance: Balance): Refund[] => {
  const refunds: Refund[] = [];

  const positiveBalance = Object.entries(balance.shares).filter(([, amount]) => amount > 0);
  const negativeBalance = Object.entries(balance.shares).filter(([, amount]) => amount < 0);

  for (const [user] of positiveBalance) {
    let currentAmount = balance.shares[user];
    for (const [otherUser] of negativeBalance) {
      const otherAmount = balance.shares[otherUser];
      if (currentAmount > 0 && otherAmount < 0) {
        const refundAmount = Math.min(currentAmount, -otherAmount);
        refunds.push({ fromMemberId: user, toMemberId: otherUser, amount: refundAmount });

        balance.shares[user] -= refundAmount;
        balance.shares[otherUser] += refundAmount;

        currentAmount -= refundAmount;
      }
    }
  }
  return refunds;
};
