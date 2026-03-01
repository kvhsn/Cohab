import { tw } from '@/libs/tailwind';
import { TailwindClass } from '@/types';
import React, { ComponentType } from 'react';
import { Pressable, PressableProps, Text } from 'react-native';

interface BaseIconProps {
  color?: string;
  className?: string;
  size?: number;
}

interface CustomButtonProps extends PressableProps {
  title: string;
  size: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  LeftIcon?: ComponentType<BaseIconProps>;
  RightIcon?: ComponentType<BaseIconProps>;
}

const variantStyles = {
  primary: tw('bg-linear-to-r from-primary to-secondary shadow-primary/50'),
  secondary: tw('bg-white/80'),
  outline: tw('border-2 border-primary bg-transparent'),
} satisfies Record<Required<CustomButtonProps>['variant'], TailwindClass>;

const sizeStyles = {
  sm: tw('px-2 py-1'),
  md: tw('px-4 py-2'),
  lg: tw('px-8 py-4'),
} satisfies Record<Required<CustomButtonProps>['size'], TailwindClass>;

const textVariantStyles = (
  size: CustomButtonProps['size'],
): Record<Required<CustomButtonProps>['variant'], TailwindClass> => {
  return {
    primary: tw(`text-white text-${size}`),
    secondary: tw(`text-gray-900 text-${size}`),
    outline: tw(`text-primary text-${size}`),
  };
};

const iconColorStyles = {
  primary: 'white',
  secondary: tw('color-gray-900'),
  outline: tw('color-primary'),
} satisfies Record<Required<CustomButtonProps>['variant'], TailwindClass>;

const stateStyles = {
  enable: tw('active:scale-[0.95] active:opacity-90'),
  disabled: tw('opacity-50'),
} satisfies Record<'enable' | 'disabled', TailwindClass>;

const iconSizes = {
  sm: 14,
  md: 16,
  lg: 20,
} satisfies Record<Required<CustomButtonProps>['size'], number>;

export const CustomButton = ({
  title,
  variant = 'primary',
  disabled = false,
  LeftIcon,
  RightIcon,
  size,
  ...props
}: CustomButtonProps) => {
  const sizeStyle = sizeStyles[size];
  const variantStyle = variantStyles[variant];
  const textStyle = textVariantStyles(size)[variant];
  const iconColor = iconColorStyles[variant];
  const stateStyle = stateStyles[disabled ? 'disabled' : 'enable'];
  const iconSize = iconSizes[size];

  return (
    <Pressable
      disabled={disabled}
      className={`flex-row items-center justify-center gap-3 rounded-2xl shadow-lg ${variantStyle} ${stateStyle} ${sizeStyle}`}
      {...props}>
      {LeftIcon && <LeftIcon color={iconColor} size={iconSize} />}
      <Text className={`font-bold ${textStyle}`}>{title}</Text>
      {RightIcon && <RightIcon color={iconColor} size={iconSize} />}
    </Pressable>
  );
};
