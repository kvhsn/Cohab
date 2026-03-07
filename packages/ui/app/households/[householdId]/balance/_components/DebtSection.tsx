import Typography from '@/components/Typography/Typography';
import { GetHouseholdMember } from '@cohab/shared/src/household';
import React from 'react';
import { View } from 'react-native';
import { DebtItem } from './DebtItem';

interface DebtSectionProps {
  title: string;
  total: number;
  items: { id: string; amount: number; member?: GetHouseholdMember }[];
  type: 'owe-me' | 'i-owe';
}

export function DebtSection({ title, total, items, type }: DebtSectionProps) {
  const isOweMe = type === 'owe-me';
  const colorClass = isOweMe ? 'primary' : 'rose-500';

  if (items.length === 0) return null;

  return (
    <View className="mb-8">
      <View className="flex-row items-center justify-between mb-4">
        <Typography variant="h1" className="text-xl">
          {title}
        </Typography>
        <View className={`bg-${colorClass}/10 dark:bg-${colorClass}/20 px-3 py-1 rounded-full`}>
          <Typography
            variant="caption"
            className={`text-${colorClass} ${!isOweMe ? 'font-bold' : ''}`}>
            Total: {total.toFixed(2)} €
          </Typography>
        </View>
      </View>
      {items.map((item) => (
        <DebtItem key={item.id} member={item.member} amount={item.amount} type={type} />
      ))}
    </View>
  );
}
