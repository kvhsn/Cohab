import { queryClient } from '@/libs/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import '../global.css';

const storybookEnabled = process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === 'true';

export const unstable_settings = storybookEnabled ? { initialRouteName: '(storybook)/index' } : {};

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }}>
        {storybookEnabled && <Stack.Screen name="(storybook)/index" />}
      </Stack>
    </QueryClientProvider>
  );
}
