import { cn, tw, type TwSize } from '@/libs/tailwind';
import { TailwindClass } from '@/types';
import { Text, TextProps } from 'react-native';

type TypographyVariant = 'h1' | 'subtitle' | 'body' | 'bodySmall' | 'caption' | 'button';
type TypographyWeight = 'regular' | 'medium' | 'semibold' | 'bold';

interface TypographyProps extends TextProps {
  variant: TypographyVariant;
  size?: TwSize;
  weight?: TypographyWeight;
}

const weightStyles = {
  regular: tw('font-plus-jakarta'),
  medium: tw('font-medium font-plus-jakarta-medium'),
  semibold: tw('font-semibold font-plus-jakarta-semibold'),
  bold: tw('font-bold font-plus-jakarta-bold'),
} satisfies Required<Record<TypographyWeight, TailwindClass>>;

const DEFAULT_WEIGHTS: Record<TypographyVariant, TypographyWeight> = {
  h1: 'bold',
  subtitle: 'medium',
  body: 'regular',
  bodySmall: 'regular',
  caption: 'bold',
  button: 'bold',
};

const variantStyles = {
  h1: tw('text-gray-900 dark:text-gray-50'),
  subtitle: tw('text-gray-500 dark:text-gray-400'),
  body: tw('text-gray-900 dark:text-gray-100'),
  bodySmall: tw('text-gray-500 dark:text-gray-400'),
  caption: tw('uppercase tracking-widest text-gray-400 dark:text-gray-500'),
  button: tw(''),
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
  weight,
  className,
  children,
  ...props
}: TypographyProps) {
  const baseStyles = variantStyles[variant];
  const sizeClass = variant === 'button' ? tw(`text-${size}`) : sizeStyles[variant];
  const weightClass = weightStyles[weight || DEFAULT_WEIGHTS[variant]];

  return (
    <Text {...props} className={cn(baseStyles, sizeClass, weightClass, className)}>
      {children}
    </Text>
  );
}
