import { colors } from '@/libs/colors';
import { cn, tw, type TwSize } from '@/libs/tailwind';
import * as VectorIcons from '@expo/vector-icons';
import React, { useRef, useState, type ComponentProps, type ReactElement } from 'react';
import {
  GestureResponderEvent,
  Pressable,
  TextInput,
  useColorScheme,
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
  /** Custom element rendered on the right side of the input (e.g. an icon button). When provided, overrides the default password reveal toggle. */
  rightElement?: ReactElement;
}

export default function Input({
  iconName,
  size = 'md',
  className,
  error,
  rightElement,
  ...props
}: InputProps) {
  const [isSecureTextEntry, setIsSecureTextEntry] = useState(!!props.secureTextEntry);
  const inputRef = useRef<TextInput | null>(null);

  // placeholderTextColor est une prop RN qui ne peut pas être gérée via classes CSS
  const isDark = useColorScheme() === 'dark';
  const placeholderTextColor = error
    ? isDark
      ? colors.errorDark
      : colors.error
    : isDark
      ? colors.placeholderDark
      : colors.placeholderLight;

  const isPasswordInput = !!props.secureTextEntry;
  const keyboardIconName = props.keyboardType ? KEYBOARD_ICONS[props.keyboardType] : undefined;
  const iconClass = tw(
    error ? 'text-red-500 dark:text-red-400' : 'text-gray-400 dark:text-gray-500',
  );

  const onPress = (event: GestureResponderEvent) => {
    event.preventDefault();
    inputRef?.current?.focus();
  };

  return (
    <View className={cn('w-full gap-1', className)}>
      <Pressable
        className={`flex flex-row self-center items-center gap-2 border rounded-2xl px-2 py-4 bg-white/85 dark:bg-slate-800/85 shadow-sm ${
          error ? 'border-red-500' : 'border-gray-100 dark:border-slate-700'
        }`}
        onPress={onPress}>
        <View className="flex-1 flex-row items-center gap-2">
          {isPasswordInput ? (
            <Icon as="Ionicons" name="lock-closed" size={size} className={iconClass} />
          ) : keyboardIconName ? (
            <Icon as="Ionicons" name={keyboardIconName} size={size} className={iconClass} />
          ) : (
            iconName && <Icon as="Ionicons" name={iconName} size={size} className={iconClass} />
          )}
          <TextInput
            {...props}
            secureTextEntry={isSecureTextEntry}
            className={`${error ? 'text-red-500 dark:text-red-400' : 'text-gray-900 dark:text-gray-100'} text-body text-${size} flex-1 p-0`}
            placeholderTextColor={placeholderTextColor}
            ref={inputRef}
          />
        </View>
        {rightElement
          ? rightElement
          : isPasswordInput && (
              <Pressable onPress={() => setIsSecureTextEntry(!isSecureTextEntry)}>
                <Icon
                  as="Ionicons"
                  name={isSecureTextEntry ? 'eye-outline' : 'eye-off-outline'}
                  size={size}
                  className={iconClass}
                />
              </Pressable>
            )}
      </Pressable>
      <View className="h-5 justify-center">
        {error ? (
          <Typography
            variant="bodySmall"
            className="text-red-500 dark:text-red-400 ml-4 font-medium">
            {error}
          </Typography>
        ) : null}
      </View>
    </View>
  );
}
