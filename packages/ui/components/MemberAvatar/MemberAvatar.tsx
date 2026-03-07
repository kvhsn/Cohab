import React from 'react';
import { View } from 'react-native';
import Icon from '../Icon/Icon';
import Typography from '../Typography/Typography';

type MemberAvatarProps = {
  name: string;
  isAdmin: boolean;
  className?: string;
};

export default function MemberAvatar({ name, isAdmin, className }: MemberAvatarProps) {
  return (
    <View
      className={`rounded-full size-12 items-center justify-center shadow-md relative bg-primary/30 ${className}`}>
      <Typography variant="body" className="text-lg font-bold text-primary">
        {name.charAt(0).toUpperCase()}
      </Typography>
      {isAdmin && (
        <Icon
          as="FontAwesome5"
          name="crown"
          size="sm"
          color="#ca8a04" /*  */
          className="absolute -right-1 -top-1 p-0.5"
        />
      )}
    </View>
  );
}
