import { tw } from '@/libs/tailwind';
import { Stack } from 'expo-router';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ScreenProps = {
  children: React.ReactNode;
  className?: string;
  headerTitle?: string;
};

export default function Screen({ children, className, headerTitle }: ScreenProps) {
  const headerShown = !!headerTitle;
  const paddingTop = headerShown ? tw('mt-6') : '';
  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Stack.Screen
        options={{
          headerShown,
          headerTransparent: true,
          title: headerTitle,
        }}
      />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerClassName={`grow space-between px-6 py-4 ${paddingTop}`}
          className={`flex-1 bg-linear-to-br from-background-primary via-background-secondary via-40% to-background-tertiary ${className}`}>
          <SafeAreaView style={{ flex: 1 }}>{children}</SafeAreaView>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
