import { tw, type TwSize } from '@/libs/tailwind';
import React, { useRef, useState, type ComponentProps } from 'react';
import { GestureResponderEvent, View } from 'react-native';
import { Pressable, TextInput, type TextInputProps, type KeyboardTypeOptions } from 'react-native';
import * as VectorIcons from '@expo/vector-icons';
import Icon, { type IconType } from '../Icon/Icon';

type IoniconsName = ComponentProps<typeof VectorIcons.Ionicons>['name'];

const KEYBOARD_ICONS: Partial<Record<KeyboardTypeOptions, IoniconsName>> = {
  'email-address': 'mail',
};

interface InputProps extends Omit<TextInputProps, 'ref'> {
  iconName?: IoniconsName;
  size?: TwSize;
}

export default function Input({ iconName, size = 'md', className, ...props }: InputProps) {
  const [isSecureTextEntry, setIsSecureTextEntry] = useState(!!props.secureTextEntry);
  const inputRef = useRef<TextInput | null>(null);
  const placeholderColor = tw('text-gray-400');
  const isPasswordInput = !!props.secureTextEntry;
  const keyboardIconName = props.keyboardType ? KEYBOARD_ICONS[props.keyboardType] : undefined;

  const onPress = (event: GestureResponderEvent) => {
    event.preventDefault();
    inputRef?.current?.focus();
  };

  return (
    <Pressable
      className={`flex flex-row self-center items-center gap-2 border-gray-100 border rounded-2xl px-2 py-4 bg-white/85 shadow-sm ${className ?? ''}`}
      onPress={onPress}>
      <View className="flex-1 flex-row gap-2">
        {isPasswordInput ? (
          <Icon as="Ionicons" name="lock-closed" size={size} className={placeholderColor} />
        ) : keyboardIconName ? (
          <Icon as="Ionicons" name={keyboardIconName} size={size} className={placeholderColor} />
        ) : (
          iconName && (
            <Icon as="Ionicons" name={iconName} size={size} className={placeholderColor} />
          )
        )}
        <TextInput
          {...props}
          secureTextEntry={isSecureTextEntry}
          className={`${placeholderColor} text-body text-${size}`}
          ref={inputRef}
        />
      </View>
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
