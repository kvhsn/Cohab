import { SummaryCard } from '@/components/SummaryCard/SummaryCard';
import { useAuth } from '@/hooks/useAuth';
import queries from '@/libs/queries';
import { useSuspenseQuery } from '@tanstack/react-query';
import React from 'react';
import DebtSection from './DebtSection';

interface BalanceContentProps {
  householdId: string;
}

export default function BalanceContent({ householdId }: BalanceContentProps) {
  const { data: session } = useAuth();
  const { data: balance } = useSuspenseQuery(
    queries.households.getHouseholdBalanceQuery(householdId),
  );
  const { data: me } = useSuspenseQuery(queries.me.getMeQuery());

  const currentUserId = session?.user?.id;
  const currentUserShare = currentUserId ? balance.shares[currentUserId] || 0 : 0;

  const othersBalances = Object.entries(balance.shares).filter(([id]) => id !== currentUserId);

  const peopleWhoOwe = othersBalances
    .filter(([, amount]) => amount < 0)
    .map(([id, amount]) => ({
      id,
      amount: Math.abs(amount),
      member: me.household?.members?.find((m) => m.id === id),
    }));

  const peopleIOwe = othersBalances
    .filter(([, amount]) => amount > 0)
    .map(([id, amount]) => ({
      id,
      amount: Math.abs(amount),
      member: me.household?.members?.find((m) => m.id === id),
    }));

  const totalOwedToMe = peopleWhoOwe.reduce((acc, p) => acc + p.amount, 0);
  const totalIOwe = peopleIOwe.reduce((acc, p) => acc + p.amount, 0);

  return (
    <>
      <SummaryCard share={currentUserShare} className="mb-8 mt-2" />

      <DebtSection title="On me doit" total={totalOwedToMe} items={peopleWhoOwe} type="owe-me" />

      <DebtSection title="Je dois" total={totalIOwe} items={peopleIOwe} type="i-owe" />
    </>
  );
}
