import MemberAvatar from '@/components/MemberAvatar/MemberAvatar';
import Typography from '@/components/Typography/Typography';
import { formatAmount } from '@/libs/format';
import { cn } from '@/libs/tailwind';
import React from 'react';
import { Pressable, View } from 'react-native';

interface ExpandableDebtRowProps {
  memberName: string;
  label: string;
  subtitle: string;
  amount: number;
  onPress: () => void;
}

export default function ExpandableDebtRow({
  memberName,
  label,
  subtitle,
  amount,
  onPress,
}: ExpandableDebtRowProps) {
  const isPositive = amount >= 0;

  return (
    <Pressable onPress={onPress} className="flex-row items-center gap-3 py-2 active:opacity-70">
      <MemberAvatar name={memberName} isAdmin={false} className="size-10" />
      <View className="flex-1">
        <Typography variant="body" weight="bold">
          {label}
        </Typography>
        <Typography variant="caption" className="opacity-60">
          {subtitle}
        </Typography>
      </View>
      <Typography
        variant="body"
        weight="bold"
        className={cn(isPositive ? 'text-primary' : 'text-rose-500')}>
        {isPositive ? '+' : '-'}
        {formatAmount(Math.abs(amount))} €
      </Typography>
    </Pressable>
  );
}
