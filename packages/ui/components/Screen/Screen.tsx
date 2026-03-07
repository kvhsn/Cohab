import { tw } from '@/libs/tailwind';
import { Stack } from 'expo-router';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ScreenProps = {
  children: React.ReactNode;
  className?: string;
  title?: string;
};

export default function Screen({ children, className, title }: ScreenProps) {
  const headerShown = typeof title !== 'undefined';
  const paddingTop = headerShown ? tw('mt-10') : '';
  const isDark = useColorScheme() === 'dark';
  // headerTintColor est une option React Navigation (prop JS, non stylable via CSS)
  const headerTintColor = isDark ? '#f1f5f9' : '#0f172a';
  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Stack.Screen
        options={{
          headerShown,
          headerTransparent: true,
          title: title ?? '',
          headerTintColor,
        }}
      />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerClassName={`grow space-between px-6 py-4 ${paddingTop}`}
          className={`flex-1 bg-linear-to-br from-background-primary via-background-secondary via-40% to-background-tertiary dark:from-slate-950 dark:via-slate-900 dark:via-40% dark:to-slate-800 ${className}`}>
          <SafeAreaView style={{ flex: 1 }}>{children}</SafeAreaView>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
