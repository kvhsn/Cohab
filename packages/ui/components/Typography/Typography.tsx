import { Text, TextProps } from 'react-native';
import { type TwSize } from '@/libs/tailwind';

type TypographyVariant = 'h1' | 'subtitle' | 'body' | 'bodySmall' | 'caption' | 'button';

interface TypographyProps extends TextProps {
  variant: TypographyVariant;
  size?: TwSize;
}

const variantStyles = {
  h1: 'font-bold text-gray-900',
  subtitle: 'text-gray-500',
  body: 'text-gray-900',
  bodySmall: 'text-gray-500',
  caption: 'uppercase tracking-widest text-gray-400 font-bold',
  button: 'font-bold',
} satisfies Required<Record<TypographyVariant, string>>;

const sizeStyles = {
  h1: 'text-h1',
  subtitle: 'text-subtitle',
  body: 'text-body',
  bodySmall: 'text-bodySmall',
  caption: 'text-caption',
} satisfies Required<Record<Exclude<TypographyVariant, 'button'>, string>>;

export default function Typography({
  variant,
  size,
  className,
  children,
  ...props
}: TypographyProps) {
  const baseStyles = variantStyles[variant];
  const sizeClass = variant === 'button' ? `text-${size}` : sizeStyles[variant];

  return (
    <Text {...props} className={`${baseStyles} ${sizeClass} ${className || ''}`}>
      {children}
    </Text>
  );
}
