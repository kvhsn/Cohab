import IconButton from '@/components/IconButton/IconButton';
import Screen from '@/components/Screen/Screen';
import Typography from '@/components/Typography/Typography';
import { Link, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

export default function HouseholdDetails() {
  const { householdId } = useLocalSearchParams<{ householdId: string }>();

  return (
    <Screen>
      <View className="flex-row items-center justify-between px-4 py-2">
        <Typography variant="h1">Household Details</Typography>
        <Link href={`/households/${householdId}/settings`} asChild>
          <IconButton as="Ionicons" name="settings-outline" variant="ghost" />
        </Link>
      </View>
      <View className="px-4">
        <Typography variant="bodySmall" className="text-gray-400">
          ID: {householdId}
        </Typography>

        <View>
          <Link
            href={{
              pathname: '/households/[householdId]/expenses',
              params: { householdId },
            }}>
            <Typography variant="bodySmall">Show expenses</Typography>
          </Link>
        </View>
        <Link
          href={{
            pathname: '/households/[householdId]/balance',
            params: { householdId },
          }}>
          <Typography variant="bodySmall">Show balance</Typography>
        </Link>
        <Link
          href={{
            pathname: '/households/[householdId]/refunds',
            params: { householdId },
          }}>
          <Typography variant="bodySmall">Show refunds</Typography>
        </Link>
        <Link
          href={{
            pathname: '/households/[householdId]/invite',
            params: { householdId },
          }}>
          <Typography variant="bodySmall">Invite</Typography>
        </Link>
      </View>
    </Screen>
  );
}
