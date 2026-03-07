import { tw } from '@/libs/tailwind';
import React from 'react';
import { View, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  isActive?: boolean;
}

export default function Card({ children, isActive = false, className, ...props }: CardProps) {
  const backgroundClassnameStyle = tw(isActive ? 'bg-primary/10' : 'bg-white/60 dark:bg-white/5');
  const borderClassnameStyle = tw(
    isActive ? 'border-2 border-primary/50' : 'border border-white/50 dark:border-white/10',
  );
  return (
    <View
      className={`p-6 rounded-3xl shadow-sm ${borderClassnameStyle} ${backgroundClassnameStyle} ${className || ''}`}
      {...props}>
      {children}
    </View>
  );
}
