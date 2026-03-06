import React from 'react';
import { View, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  children: React.ReactNode;
}

export default function Card({ children, className, ...props }: CardProps) {
  return (
    <View
      className={`p-6 rounded-3xl bg-white/60 border border-white/50 shadow-sm ${className || ''}`}
      {...props}>
      {children}
    </View>
  );
}
