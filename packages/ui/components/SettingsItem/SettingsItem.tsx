import Icon, { IconNames } from '@/components/Icon/Icon';
import Typography from '@/components/Typography/Typography';
import { cn } from '@/libs/tailwind';
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
      className={cn(
        'flex-row items-center p-4 bg-transparent active:bg-black/5 dark:active:bg-white/5',
        className,
      )}
      {...props}>
      <View className="mr-4 size-10 items-center justify-center rounded-2xl bg-primary/10 dark:bg-primary/20">
        <Icon as="Ionicons" name={iconName} size="md" className="text-primary" />
      </View>
      <View className="flex-1">
        <Typography variant="body" weight="bold">
          {label}
        </Typography>
        {subtitle && (
          <Typography
            variant="bodySmall"
            weight="medium"
            className="text-gray-500 dark:text-gray-400">
            {subtitle}
          </Typography>
        )}
      </View>
      <Icon
        as="Ionicons"
        name="chevron-forward"
        size="sm"
        className="text-gray-400 dark:text-gray-600"
      />
    </Pressable>
  );
}
