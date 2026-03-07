import Card from '@/components/Card/Card';
import Icon from '@/components/Icon/Icon';
import Typography from '@/components/Typography/Typography';
import { tw } from '@/libs/tailwind';
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
  const colorClass = isOweMe ? tw('primary') : tw('rose-500');

  return (
    <Card className="mb-3 p-4 flex-row items-center justify-between bg-white/40 dark:bg-slate-800/40">
      <View className="flex-row items-center flex-1">
        <View
          className={`w-12 h-12 rounded-full bg-${colorClass}/20 items-center justify-center mr-3 overflow-hidden border border-${colorClass}/20`}>
          {member?.image ? (
            <View className="w-full h-full bg-slate-300" />
          ) : (
            <Typography variant="body" className={`text-${colorClass} font-bold`}>
              {member?.name?.[0].toUpperCase()}
            </Typography>
          )}
          <View
            className={`absolute bottom-0 right-0 bg-${colorClass} px-1.5 rounded-sm border border-white dark:border-slate-900`}>
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

      <View
        className={`flex-row items-center px-4 py-2 rounded-2xl ${
          isOweMe
            ? 'bg-primary/10 dark:bg-primary/20 border border-primary/20'
            : 'bg-rose-500 shadow-sm'
        }`}>
        <Icon
          as="Ionicons"
          name={isOweMe ? 'notifications-outline' : 'card-outline'}
          size="sm"
          className={isOweMe ? 'text-primary mr-2' : 'text-white mr-2'}
        />
        <Typography
          variant="bodySmall"
          className={`font-bold ${isOweMe ? 'text-primary' : 'text-white'}`}>
          {isOweMe ? 'Relancer' : 'Payer'}
        </Typography>
      </View>
    </Card>
  );
}
