type Balance = Map<string, number>;

export type Expense = { userId: string; amount: number };

export const createBalance = (expenses: Expense[], members: string[]): Balance => {
  const balance = members.reduce((acc, user) => {
    acc.set(user, 0);
    return acc;
  }, new Map<string, number>());
  if (expenses.length === 0) return balance;

  for (const expense of expenses) {
    const memberBalance = balance.get(expense.userId);
    if (memberBalance === undefined) {
      balance.set(expense.userId, expense.amount);
    } else {
      balance.set(expense.userId, memberBalance + expense.amount);
    }
  }
  const total = [...balance.values()].reduce((acc, total) => acc + total, 0);

  const part = Math.floor(total / members.length);
  const remainder = total % members.length;

  for (const user of members) {
    const userTotal = balance.get(user) || 0;
    balance.set(user, userTotal - part);
  }
  // affect the remainder to the first member
  balance.set(members[0], balance.get(members[0])! + remainder);
  return balance;
};
