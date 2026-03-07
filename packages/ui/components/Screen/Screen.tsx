import { colors } from '@/libs/colors';
import { cn } from '@/libs/tailwind';
import { Stack } from 'expo-router';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

type ScreenProps = {
  children: React.ReactNode;
  className?: string;
  title?: string;
};

export default function Screen({ children, className, title }: ScreenProps) {
  const headerShown = typeof title !== 'undefined';
  const isDark = useColorScheme() === 'dark';
  const { bottom, top, left, right } = useSafeAreaInsets();
  const headerTintColor = isDark ? colors.headerDark : colors.headerLight;
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
          contentContainerStyle={{
            paddingTop: top,
            paddingBottom: bottom,
            paddingLeft: left,
            paddingRight: right,
          }}
          className={cn(
            'flex-1 bg-linear-to-br from-background-primary via-background-secondary via-40% to-background-tertiary dark:from-slate-950 dark:via-slate-900 dark:via-40% dark:to-slate-800',
            className,
          )}>
          <SafeAreaView>
            <View className="px-4 pb-4">{children}</View>
          </SafeAreaView>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
