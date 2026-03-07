import { type TwSize } from '@/libs/tailwind';
import * as Icons from '@expo/vector-icons';
import React, { type ComponentProps, type ComponentType } from 'react';

const iconSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
} satisfies Record<TwSize, number>;

interface IconBaseProps {
  size: TwSize;
  color?: string;
  className?: string;
}

export type IconType = ComponentType<IconBaseProps>;

export type IconProvider = keyof typeof Icons;

export type IconNames<K extends IconProvider> = ComponentProps<(typeof Icons)[K]>['name'];

interface IconProps<K extends IconProvider> extends IconBaseProps {
  as: K;
  name: IconNames<K>;
}

export default function Icon<K extends IconProvider>({
  as,
  name,
  size,
  color,
  ...props
}: IconProps<K>) {
  // eslint-disable-next-line import/namespace
  const IconSet = Icons[as];

  if (!IconSet) return null;

  return <IconSet name={name} size={iconSizes[size]} color={color} {...props} />;
}
