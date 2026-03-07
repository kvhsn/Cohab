import { cn, tw } from '@/libs/tailwind';
import React from 'react';
import { View, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  isActive?: boolean;
  isDisabled?: boolean;
}

export default function Card({
  children,
  isActive = false,
  isDisabled = false,
  className,
  ...props
}: CardProps) {
  const backgroundClassnameStyle = tw(isActive ? 'bg-primary/50' : 'bg-white/60 dark:bg-white/5');
  const borderClassnameStyle = tw(
    isActive ? 'border-2 border-primary/80' : 'border border-white/50 dark:border-white/10',
  );
  const opacityClassnameStyle = tw(isDisabled ? 'opacity-50' : 'opacity-100');
  return (
    <View
      className={cn(
        'p-6 rounded-3xl shadow-sm',
        borderClassnameStyle,
        backgroundClassnameStyle,
        opacityClassnameStyle,
        className,
      )}
      {...props}>
      {children}
    </View>
  );
}
