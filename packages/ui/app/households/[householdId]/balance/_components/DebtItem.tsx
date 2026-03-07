import Card from '@/components/Card/Card';
import IconButton from '@/components/IconButton/IconButton';
import MemberAvatar from '@/components/MemberAvatar/MemberAvatar';
import Typography from '@/components/Typography/Typography';
import { cn, tw } from '@/libs/tailwind';
import { GetHouseholdMember } from '@cohab/shared/src/household';
import React from 'react';
import { View } from 'react-native';

interface DebtItemProps {
  member?: GetHouseholdMember;
  amount: number;
  type: 'owe-me' | 'i-owe';
}

export default function DebtItem({ member, amount, type }: DebtItemProps) {
  const isOweMe = type === 'owe-me';
  const containerColorClass = isOweMe
    ? tw('bg-primary/20 border-primary/20')
    : tw('bg-rose-500/20 border-rose-500/20');
  const badgeColorClass = isOweMe ? tw('bg-primary') : tw('bg-rose-500');

  return (
    <Card className="mb-3 p-4 flex-row items-center justify-between bg-white/40 dark:bg-slate-800/40">
      <View className="flex-row items-center flex-1">
        <View
          className={cn(
            'relative size-12 rounded-full items-center justify-center mr-8 border',
            containerColorClass,
          )}>
          {member && <MemberAvatar isAdmin={false} name={member.name} />}
          <View
            className={cn(
              'absolute bottom-0 -right-6 px-1.5 rounded-sm border border-white dark:border-slate-900',
              badgeColorClass,
            )}>
            <Typography variant="caption" className="text-[9px] text-white">
              {amount.toFixed(0)}€
            </Typography>
          </View>
        </View>
        <View>
          <Typography variant="body" className="font-bold">
            {member?.name || 'Inconnu'}
          </Typography>
          <Typography variant="bodySmall" className="text-gray-500 dark:text-gray-400">
            {isOweMe ? 'Dépenses communes' : 'Remboursement à faire'}
          </Typography>
        </View>
      </View>

      <IconButton
        onPress={() => {}}
        size="sm"
        name={isOweMe ? 'notifications-outline' : 'card-outline'}
        variant={isOweMe ? 'primary' : 'danger'}
        as="Ionicons"
      />
    </Card>
  );
}
