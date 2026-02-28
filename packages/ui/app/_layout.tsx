import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { queryClient } from '@/libs/queryClient';
import '../global.css';

const storybookEnabled = process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === 'true';

export const unstable_settings = storybookEnabled ? { initialRouteName: '(storybook)/index' } : {};

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        {storybookEnabled && (
          <Stack.Screen name="(storybook)/index" options={{ headerShown: false }} />
        )}
      </Stack>
    </QueryClientProvider>
  );
}
