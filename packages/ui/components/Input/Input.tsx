import { tw, type TwSize } from '@/libs/tailwind';
import * as VectorIcons from '@expo/vector-icons';
import React, { useRef, useState, type ComponentProps } from 'react';
import {
  GestureResponderEvent,
  Pressable,
  TextInput,
  View,
  type KeyboardTypeOptions,
  type TextInputProps,
} from 'react-native';
import Icon from '../Icon/Icon';
import Typography from '../Typography/Typography';

type IoniconsName = ComponentProps<typeof VectorIcons.Ionicons>['name'];

const KEYBOARD_ICONS: Partial<Record<KeyboardTypeOptions, IoniconsName>> = {
  'email-address': 'mail',
};

interface InputProps extends Omit<TextInputProps, 'ref'> {
  iconName?: IoniconsName;
  size?: TwSize;
  error?: string;
}

export default function Input({ iconName, size = 'md', className, error, ...props }: InputProps) {
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
    <View className={`w-full gap-1 ${className ?? ''}`}>
      <Pressable
        className={`flex flex-row self-center items-center gap-2 border rounded-2xl px-2 py-4 bg-white/85 shadow-sm ${
          error ? 'border-red-500' : 'border-gray-100'
        }`}
        onPress={onPress}>
        <View className="flex-1 flex-row gap-2">
          {isPasswordInput ? (
            <Icon
              as="Ionicons"
              name="lock-closed"
              size={size}
              className={error ? 'text-red-500' : placeholderColor}
            />
          ) : keyboardIconName ? (
            <Icon
              as="Ionicons"
              name={keyboardIconName}
              size={size}
              className={error ? 'text-red-500' : placeholderColor}
            />
          ) : (
            iconName && (
              <Icon
                as="Ionicons"
                name={iconName}
                size={size}
                className={error ? 'text-red-500' : placeholderColor}
              />
            )
          )}
          <TextInput
            {...props}
            secureTextEntry={isSecureTextEntry}
            className={`${error ? 'text-red-500' : placeholderColor} text-body text-${size}`}
            ref={inputRef}
          />
        </View>
        {isPasswordInput && (
          <Pressable onPress={() => setIsSecureTextEntry(!isSecureTextEntry)}>
            <Icon
              as="Ionicons"
              name={isSecureTextEntry ? 'eye-outline' : 'eye-off-outline'}
              size={size}
              className={error ? 'text-red-500' : placeholderColor}
            />
          </Pressable>
        )}
      </Pressable>
      <View className="h-5 justify-center">
        {error ? (
          <Typography variant="bodySmall" className="text-red-500 ml-4 font-medium">
            {error}
          </Typography>
        ) : null}
      </View>
    </View>
  );
}
