import Icon, { IconNames } from '@/components/Icon/Icon';
import Typography from '@/components/Typography/Typography';
import React from 'react';
import { Pressable, PressableProps, View } from 'react-native';

interface SettingsItemProps extends PressableProps {
  label: string;
  subtitle?: string;
  iconName: IconNames<'Ionicons'>;
}

export default function SettingsItem({
  label,
  subtitle,
  iconName,
  className,
  ...props
}: SettingsItemProps) {
  return (
    <Pressable
      className={`flex-row items-center p-4 bg-gray-50 dark:bg-slate-700 ${className ?? ''}`}
      {...props}>
      <View className="mr-4 size-10 items-center justify-center rounded-xl bg-primary/10">
        <Icon as="Ionicons" name={iconName} size="md" className="color-primary" />
      </View>
      <View className="flex-1">
        <Typography variant="body" className="font-semibold dark:text-gray-100">
          {label}
        </Typography>
        {subtitle && (
          <Typography variant="bodySmall" className="dark:text-gray-400">
            {subtitle}
          </Typography>
        )}
      </View>
      <Icon
        as="Ionicons"
        name="chevron-forward"
        size="sm"
        className="color-gray-400 dark:color-gray-500"
      />
    </Pressable>
  );
}
