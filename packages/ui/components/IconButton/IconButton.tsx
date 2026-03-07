import { buttonStateStyles, tw, TwSize } from '@/libs/tailwind';
import { TailwindClass } from '@/types';
import * as Icons from '@expo/vector-icons';
import React, { ComponentProps } from 'react';
import { Pressable, PressableProps } from 'react-native';
import Icon, { IconProvider } from '../Icon/Icon';

interface IconButtonProps<K extends IconProvider> extends PressableProps {
  as: K;
  name: ComponentProps<(typeof Icons)[K]>['name'];
  size?: TwSize;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
}

const variantStyles = {
  primary: tw('bg-linear-to-r from-primary to-secondary shadow-primary/50 shadow-lg'),
  secondary: tw(
    'bg-white dark:bg-slate-700 shadow-sm border border-gray-100 dark:border-slate-600',
  ),
  ghost: tw('bg-transparent'),
} satisfies Record<NonNullable<IconButtonProps<IconProvider>['variant']>, TailwindClass>;

const sizeStyles = {
  sm: tw('size-8 rounded-lg'),
  md: tw('size-10 rounded-xl'),
  lg: tw('size-12 rounded-2xl'),
} satisfies Required<Record<TwSize, TailwindClass>>;

const iconClasses = {
  primary: tw('text-white'),
  secondary: tw('text-gray-900 dark:text-gray-100'),
  ghost: tw('text-gray-900 dark:text-white'),
} satisfies Record<NonNullable<IconButtonProps<IconProvider>['variant']>, TailwindClass>;

export default function IconButton<K extends IconProvider>({
  as,
  name,
  size = 'md',
  variant = 'primary',
  disabled = false,
  className,
  ...props
}: IconButtonProps<K>) {
  const sizeStyle = sizeStyles[size];
  const variantStyle = variantStyles[variant];
  const iconClass = iconClasses[variant];
  const stateStyle = disabled ? buttonStateStyles.disabled : buttonStateStyles.enabled;

  return (
    <Pressable
      disabled={disabled}
      className={`${sizeStyle} ${variantStyle} ${stateStyle} items-center justify-center ${className || ''}`}
      {...props}>
      <Icon as={as} name={name} size={size} className={iconClass} />
    </Pressable>
  );
}
