import Icon from '@/components/Icon/Icon';
import IconButton from '@/components/IconButton/IconButton';
import Typography from '@/components/Typography/Typography';
import React from 'react';
import { View } from 'react-native';
import { HouseholdMember } from '../../balance/_components/types';

type MemberCardProps = {
  member: HouseholdMember;
  isMemberAdmin: boolean;
  onRemove?: (member: HouseholdMember) => void;
};

export default function MemberCard({ member, isMemberAdmin, onRemove }: MemberCardProps) {
  return (
    <View className="mb-3 flex-row items-center rounded-xl bg-white dark:bg-slate-800 p-4 shadow-sm border border-transparent dark:border-slate-700">
      <View className="mr-4 relative">
        <View className="size-12 items-center justify-center rounded-full bg-primary/10">
          <Typography variant="body" className="text-lg font-bold text-primary">
            {member.name.charAt(0).toUpperCase()}
          </Typography>
        </View>
        {isMemberAdmin && (
          <View className="absolute -right-1 -top-1 rounded-full bg-white dark:bg-slate-700 p-0.5 shadow-sm">
            <Icon as="FontAwesome5" name="crown" size="sm" color="#ca8a04" />
          </View>
        )}
      </View>
      <View className="flex-1">
        <Typography variant="body" className="font-semibold text-gray-900 dark:text-gray-100">
          {member.name}
        </Typography>
        <Typography variant="bodySmall" className="text-gray-500 dark:text-gray-400">
          {member.email}
        </Typography>
      </View>
      {isMemberAdmin && onRemove && (
        <IconButton as="Ionicons" name="trash-outline" size="sm" onPress={() => onRemove(member)} />
      )}
    </View>
  );
}
