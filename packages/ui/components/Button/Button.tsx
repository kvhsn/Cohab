import { buttonStateStyles, tw, TwSize } from '@/libs/tailwind';
import { TailwindClass } from '@/types';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, PressableProps, StyleSheet, View } from 'react-native';
import { type IconType } from '../Icon/Icon';
import Typography from '../Typography/Typography';

interface CustomButtonProps extends PressableProps {
  title: string;
  size: TwSize;
  variant: 'primary' | 'secondary' | 'link';
  disabled?: boolean;
  LeftIcon?: IconType;
  RightIcon?: IconType;
}

const variantStyles = {
  primary: tw('shadow-primary/50 shadow-lg'),
  // En dark mode, le secondary devient un fond slate translucide avec bordure subtile
  secondary: tw('bg-white/80 dark:bg-slate-700/80 shadow-lg dark:border dark:border-slate-600'),
  link: tw('bg-transparent shadow-none px-0 py-0'),
} satisfies Record<Required<CustomButtonProps>['variant'], TailwindClass>;

const sizeStyles = {
  sm: tw('px-2 py-1'),
  md: tw('px-4 py-2'),
  lg: tw('px-8 py-4'),
} satisfies Record<Required<CustomButtonProps>['size'], TailwindClass>;

const textVariantStyles = {
  primary: tw('text-white'),
  // En dark mode, secondary -> texte clair (gray-100) pour contraste sur fond slate
  secondary: tw('text-gray-900 dark:text-gray-100'),
  link: tw('text-primary'),
} satisfies Record<Required<CustomButtonProps>['variant'], TailwindClass>;

const iconColorStyles = {
  primary: tw('white'),
  secondary: tw('color-gray-900'),
  link: tw('color-primary'),
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
  const sizeStyle = sizeStyles[size];
  const variantStyle = variantStyles[variant];
  const textStyle = textVariantStyles[variant];
  const iconColor = iconColorStyles[variant];
  const stateStyle = disabled ? buttonStateStyles.disabled : buttonStateStyles.enabled;

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
    <Pressable disabled={disabled} className={`${stateStyle} ${className ?? ''}`} {...props}>
      {variant === 'primary' ? (
        <View
          className={`overflow-hidden rounded-2xl ${variantStyle} flex-row items-center justify-center gap-3 ${sizeStyle}`}>
          <LinearGradient
            colors={['#c084fc', '#60a5fa']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={StyleSheet.absoluteFill}
          />
          {content}
        </View>
      ) : (
        <View
          className={`flex-row items-center justify-center gap-3 rounded-2xl ${variantStyle} ${variant === 'link' ? '' : sizeStyle}`}>
          {content}
        </View>
      )}
    </Pressable>
  );
}
