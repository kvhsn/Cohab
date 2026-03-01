import { Text, TextProps } from 'react-native';
import { tw, type TwSize } from '@/libs/tailwind';
import { TailwindClass } from '@/types';

type TypographyVariant = 'h1' | 'subtitle' | 'body' | 'bodySmall' | 'caption' | 'button';

interface TypographyProps extends TextProps {
  variant: TypographyVariant;
  size?: TwSize;
}

const variantStyles = {
  h1: tw('font-bold text-gray-900'),
  subtitle: tw('text-gray-500'),
  body: tw('text-gray-900'),
  bodySmall: tw('text-gray-500'),
  caption: tw('uppercase tracking-widest text-gray-400 font-bold'),
  button: tw('font-bold'),
} satisfies Required<Record<TypographyVariant, TailwindClass>>;

const sizeStyles = {
  h1: tw('text-h1'),
  subtitle: tw('text-subtitle'),
  body: tw('text-body'),
  bodySmall: tw('text-bodySmall'),
  caption: tw('text-caption'),
} satisfies Required<Record<Exclude<TypographyVariant, 'button'>, TailwindClass>>;

export default function Typography({
  variant,
  size,
  className,
  children,
  ...props
}: TypographyProps) {
  const baseStyles = variantStyles[variant];
  const sizeClass = variant === 'button' ? tw(`text-${size}`) : sizeStyles[variant];

  return (
    <Text {...props} className={`${baseStyles} ${sizeClass} ${className || ''}`}>
      {children}
    </Text>
  );
}
