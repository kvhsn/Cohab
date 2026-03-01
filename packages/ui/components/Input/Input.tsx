import { tw, type TwSize } from '@/libs/tailwind';
import React, { useRef, useState } from 'react';
import { GestureResponderEvent } from 'react-native';
import { Pressable, TextInput, type TextInputProps } from 'react-native';
import Icon, { type IconType } from '../Icon/Icon';

interface InputProps extends Omit<TextInputProps, 'ref'> {
  IconComponent?: IconType;
  size?: TwSize;
}

export default function Input({ IconComponent, size = 'md', ...props }: InputProps) {
  const [isSecureTextEntry, setIsSecureTextEntry] = useState(!!props.secureTextEntry);
  const inputRef = useRef<TextInput | null>(null);
  const placeholderColor = tw('text-gray-400');
  const isPasswordInput = !!props.secureTextEntry;

  const onPress = (event: GestureResponderEvent) => {
    event.preventDefault();
    inputRef?.current?.focus();
  };

  return (
    <Pressable
      className="flex flex-row self-center items-center gap-2 border-gray-100 border rounded-2xl px-2 py-4 bg-white/85 shadow-sm"
      onPress={onPress}>
      {isPasswordInput ? (
        <Icon as="Ionicons" name="lock-closed" size={size} className={placeholderColor} />
      ) : (
        IconComponent && <IconComponent size={size} className={placeholderColor} />
      )}
      <TextInput
        {...props}
        secureTextEntry={isSecureTextEntry}
        className={placeholderColor}
        ref={inputRef}
      />
      {isPasswordInput && (
        <Pressable onPress={() => setIsSecureTextEntry(!isSecureTextEntry)}>
          <Icon
            as="Ionicons"
            name={isSecureTextEntry ? 'eye-outline' : 'eye-off-outline'}
            size={size}
            className={placeholderColor}
          />
        </Pressable>
      )}
    </Pressable>
  );
}
