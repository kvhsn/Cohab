import React from 'react';
import { Image, ImageProps } from 'react-native';

interface LogoProps extends Omit<ImageProps, 'source'> {
  size?: number;
}

export const Logo: React.FC<LogoProps> = ({ size = 100, style, ...props }) => {
  return (
    <Image
      source={require('../assets/images/logo.png')}
      style={[{ width: size, height: size }, style]}
      resizeMode="contain"
      {...props}
    />
  );
};
