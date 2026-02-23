export type Balance = {
  total: number;
  shares: Record<string, number>;
};
export type Expense = { memberId: string; amount: number };
