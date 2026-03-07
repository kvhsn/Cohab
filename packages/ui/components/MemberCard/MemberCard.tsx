import IconButton from '@/components/IconButton/IconButton';
import Typography from '@/components/Typography/Typography';
import { GetHouseholdMember } from '@cohab/shared/src/household';
import React from 'react';
import { View } from 'react-native';
import Card from '../Card/Card';
import MemberAvatar from '../MemberAvatar/MemberAvatar';

type MemberCardProps = {
  member: GetHouseholdMember;
  isMemberAdmin: boolean;
  onRemove?: (member: GetHouseholdMember) => void;
};

export default function MemberCard({ member, isMemberAdmin, onRemove }: MemberCardProps) {
  return (
    <Card className="flex-row items-center gap-2">
      <MemberAvatar name={member.name} isAdmin={isMemberAdmin} className="relative" />
      <View className="flex-1">
        <Typography variant="body" className="font-semibold text-gray-900 dark:text-gray-100">
          {member.name}
        </Typography>
        <Typography variant="bodySmall" className="text-gray-500 dark:text-gray-400">
          {member.email}
        </Typography>
      </View>
      {!isMemberAdmin && onRemove && (
        <IconButton
          variant="danger"
          as="Ionicons"
          name="trash-outline"
          size="sm"
          onPress={() => onRemove(member)}
        />
      )}
    </Card>
  );
}
