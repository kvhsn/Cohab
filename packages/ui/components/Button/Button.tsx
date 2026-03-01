import { tw, TwSize } from '@/libs/tailwind';
import { TailwindClass } from '@/types';
import React from 'react';
import { Pressable, PressableProps, Text } from 'react-native';
import { type IconType } from '../Icon/Icon';
import Typography from '../Typography/Typography';

interface CustomButtonProps extends PressableProps {
  title: string;
  size: TwSize;
  variant?: 'primary' | 'secondary' | 'link';
  disabled?: boolean;
  LeftIcon?: IconType;
  RightIcon?: IconType;
}

const variantStyles = {
  primary: tw('bg-linear-to-r from-primary to-secondary shadow-primary/50 shadow-lg'),
  secondary: tw('bg-white/80 shadow-lg'),
  link: tw('bg-transparent shadow-none px-0 py-0'),
} satisfies Record<Required<CustomButtonProps>['variant'], TailwindClass>;

const sizeStyles = {
  sm: tw('px-2 py-1'),
  md: tw('px-4 py-2'),
  lg: tw('px-8 py-4'),
} satisfies Record<Required<CustomButtonProps>['size'], TailwindClass>;

const textVariantStyles = {
  primary: tw('text-white'),
  secondary: tw('text-gray-900'),
  link: tw('text-primary'),
} satisfies Record<Required<CustomButtonProps>['variant'], TailwindClass>;

const iconColorStyles = {
  primary: 'white',
  secondary: tw('color-gray-900'),
  link: tw('color-primary'),
} satisfies Record<Required<CustomButtonProps>['variant'], TailwindClass>;

const stateStyles = {
  enable: tw('active:scale-[0.95] active:opacity-90'),
  disabled: tw('opacity-50'),
} satisfies Record<'enable' | 'disabled', TailwindClass>;

export const CustomButton = ({
  title,
  variant = 'primary',
  disabled = false,
  LeftIcon,
  RightIcon,
  size = 'md',
  ...props
}: CustomButtonProps) => {
  const sizeStyle = sizeStyles[size];
  const variantStyle = variantStyles[variant];
  const textStyle = textVariantStyles[variant];
  const iconColor = iconColorStyles[variant];
  const stateStyle = stateStyles[disabled ? 'disabled' : 'enable'];

  return (
    <Pressable
      disabled={disabled}
      className={`flex-row items-center justify-center gap-3 rounded-2xl ${variantStyle} ${stateStyle} ${variant === 'link' ? '' : sizeStyle}`}
      {...props}>
      {LeftIcon && <LeftIcon color={iconColor} size={size} />}
      <Typography variant="button" size={size} className={textStyle}>
        {title}
      </Typography>
      {RightIcon && <RightIcon color={iconColor} size={size} />}
    </Pressable>
  );
};
