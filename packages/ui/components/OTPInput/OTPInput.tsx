import React, { useRef, useState, useEffect } from 'react';
import { TextInput, View, Pressable } from 'react-native';
import Typography from '../Typography/Typography';

interface OTPInputProps {
  length?: number;
  value?: string;
  onChange?: (code: string) => void;
  onCodeFilled?: (code: string) => void;
  error?: string;
  className?: string;
  autoFocus?: boolean;
}

export default function OTPInput({
  length = 6,
  value,
  onChange,
  onCodeFilled,
  error,
  className,
  autoFocus = false,
}: OTPInputProps) {
  const [internalValue, setInternalValue] = useState(value || '');
  const inputValue = value !== undefined ? value : internalValue;
  const [isFocused, setIsFocused] = useState(autoFocus);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  const handlePress = () => {
    inputRef.current?.focus();
  };

  const handleChangeText = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, '');
    const newCode = numericText.slice(0, length);
    setInternalValue(newCode);
    onChange?.(newCode);

    if (newCode.length === length) {
      onCodeFilled?.(newCode);
    }
  };

  const codeArray = inputValue.split('').concat(Array(length).fill('')).slice(0, length);

  return (
    <View className={`w-full ${className || ''}`}>
      <Pressable
        onPress={handlePress}
        className="flex-row items-center justify-between gap-1 w-full relative">
        {codeArray.map((char, index) => {
          const isCurrentChar =
            inputValue.length === index || (inputValue.length === length && index === length - 1);
          const isBoxFocused = isFocused && isCurrentChar && !error;
          const isFilled = !!char;

          return (
            <React.Fragment key={index}>
              <View
                className={`w-12 h-14 border-2 rounded-xl items-center justify-center ${
                  error
                    ? 'bg-red-50 dark:bg-red-950/30 border-red-500 dark:border-red-400'
                    : isBoxFocused
                      ? 'bg-white/50 dark:bg-slate-700/50 border-primary'
                      : isFilled
                        ? 'bg-white/50 dark:bg-slate-700/50 border-primary/50'
                        : 'bg-white/50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-600'
                }`}>
                <Typography
                  variant="h1"
                  className={`text-2xl font-bold ${error ? 'text-red-500 dark:text-red-400' : 'text-gray-900 dark:text-gray-100'}`}>
                  {char}
                </Typography>
              </View>
              {index === 2 && length === 6 && (
                <View className="w-2 h-0.5 bg-gray-300 dark:bg-gray-600 mx-1" />
              )}
            </React.Fragment>
          );
        })}
        {/* Hidden input to handle all typing logic natively, SMS autofill, and copy/paste reliably */}
        <TextInput
          ref={inputRef}
          value={inputValue}
          onChangeText={handleChangeText}
          maxLength={length}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          autoFocus={autoFocus}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          caretHidden
          className="absolute inset-0 w-full h-full opacity-0 text-transparent"
        />
      </Pressable>
      <View className="h-5 justify-center mt-1">
        {error ? (
          <Typography
            variant="bodySmall"
            className="text-red-500 dark:text-red-400 font-medium text-center">
            {error}
          </Typography>
        ) : null}
      </View>
    </View>
  );
}
