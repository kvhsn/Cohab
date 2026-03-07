import { colors } from '@/libs/colors';
import { buttonStateStyles, cn, tw, TwSize } from '@/libs/tailwind';
import { TailwindClass } from '@/types';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, PressableProps, StyleSheet, useColorScheme, View } from 'react-native';
import { type IconType } from '../Icon/Icon';
import Typography from '../Typography/Typography';

interface CustomButtonProps extends PressableProps {
  title: string;
  size: TwSize;
  variant: 'primary' | 'secondary' | 'link' | 'danger';
  disabled?: boolean;
  LeftIcon?: IconType;
  RightIcon?: IconType;
}

const variantStyles = {
  primary: tw('shadow-primary/50 shadow-lg'),
  secondary: tw('bg-white/80 dark:bg-slate-700/80 shadow-lg dark:border dark:border-slate-600'),
  link: tw('bg-transparent px-0 py-0'),
  danger: tw('bg-red-500'),
} satisfies Record<Required<CustomButtonProps>['variant'], TailwindClass>;

const sizeStyles = {
  xs: tw('px-2 py-1'),
  sm: tw('px-4 py-2'),
  md: tw('px-6 py-3'),
  lg: tw('px-10 py-4'),
} satisfies Record<Required<CustomButtonProps>['size'], TailwindClass>;

const textVariantStyles = {
  primary: tw('text-white'),
  secondary: tw('text-gray-900 dark:text-gray-100'),
  link: tw('text-primary'),
  danger: tw('text-white'),
} satisfies Record<Required<CustomButtonProps>['variant'], TailwindClass>;

export default function CustomButton({
  title,
  variant,
  disabled = false,
  LeftIcon,
  RightIcon,
  size,
  className,
  ...props
}: CustomButtonProps) {
  const isDark = useColorScheme() === 'dark';
  const sizeStyle = sizeStyles[size];
  const variantStyle = variantStyles[variant];
  const textStyle = textVariantStyles[variant];
  const stateStyle = disabled ? buttonStateStyles.disabled : buttonStateStyles.enabled;
  const iconColor = {
    primary: colors.white,
    secondary: isDark ? colors.textDark : colors.textLight,
    link: colors.primary,
    danger: colors.white,
  }[variant];

  const content = (
    <>
      {LeftIcon && <LeftIcon color={iconColor} size={size} />}
      <Typography variant="button" size={size} className={textStyle}>
        {title}
      </Typography>
      {RightIcon && <RightIcon color={iconColor} size={size} />}
    </>
  );

  return (
    <Pressable disabled={disabled} className={cn(stateStyle, className)} {...props}>
      {variant === 'primary' ? (
        <View
          className={cn(
            'overflow-hidden rounded-2xl flex-row items-center justify-center gap-3',
            variantStyle,
            sizeStyle,
          )}>
          <LinearGradient
            colors={[colors.primary, colors.secondary]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={StyleSheet.absoluteFill}
          />
          {content}
        </View>
      ) : (
        <View
          className={cn(
            'flex-row items-center justify-center gap-3 rounded-2xl',
            variantStyle,
            sizeStyle,
          )}>
          {content}
        </View>
      )}
    </Pressable>
  );
}
