import IconButton from '@/components/IconButton/IconButton';
import { Stack, useRouter } from 'expo-router';
import { Platform } from 'react-native';

export default function SettingsLayout() {
  const router = useRouter();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Paramètres',
          headerLeft:
            Platform.OS === 'ios'
              ? () => (
                  <IconButton
                    as="Ionicons"
                    name="chevron-back"
                    variant="ghost"
                    onPress={() => router.back()}
                  />
                )
              : undefined,
        }}
      />
    </Stack>
  );
}
