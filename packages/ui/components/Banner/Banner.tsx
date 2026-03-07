import { colors } from '@/libs/colors';
import { cn, tw } from '@/libs/tailwind';
import { TailwindClass } from '@/types';
import React from 'react';
import { View, ViewProps } from 'react-native';
import Icon from '../Icon/Icon';

export type BannerVariant = 'information' | 'warning' | 'danger';

interface BannerProps extends ViewProps {
  variant?: BannerVariant;
  children: React.ReactNode;
}

const variantContainerStyles: Record<BannerVariant, TailwindClass> = {
  information: tw('bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800'),
  warning: tw('bg-yellow-50 border-yellow-200 dark:bg-yellow-950/30 dark:border-yellow-800'),
  danger: tw('bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800'),
};

const variantIconColors: Record<BannerVariant, string> = {
  information: colors.info,
  warning: colors.warning,
  danger: colors.error,
};

const variantIconNames = {
  information: 'information-circle-outline',
  warning: 'warning-outline',
  danger: 'alert-circle-outline',
} as const;

export default function Banner({
  variant = 'information',
  children,
  className,
  ...props
}: BannerProps) {
  return (
    <View
      className={cn(
        'flex-row gap-3 p-4 rounded-2xl border',
        variantContainerStyles[variant],
        className,
      )}
      {...props}>
      <Icon
        as="Ionicons"
        name={variantIconNames[variant]}
        size="lg"
        color={variantIconColors[variant]}
      />
      <View className="flex-1 justify-center">{children}</View>
    </View>
  );
}
