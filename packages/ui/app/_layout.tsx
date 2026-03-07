import { queryClient } from '@/libs/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import '../global.css';

const storybookEnabled = process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === 'true';

export const unstable_settings = storybookEnabled ? { initialRouteName: '(storybook)/index' } : {};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: colorScheme === 'dark' ? '#0f172a' : '#e3fdfd',
          },
        }}>
        {storybookEnabled && <Stack.Screen name="(storybook)/index" />}
        <Stack.Screen name="(auth)/login" options={{ gestureEnabled: false }} />
        <Stack.Screen name="(auth)/register" options={{ gestureEnabled: false }} />
      </Stack>
    </QueryClientProvider>
  );
}
