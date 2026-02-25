import { Link, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HouseholdDetails() {
  const { householdId } = useLocalSearchParams<{ householdId: string }>();

  return (
    <SafeAreaView>
      <View>
        <Text>Household Details</Text>
        <Text>ID: {householdId}</Text>

        <View>
          <Link
            href={{
              pathname: '/households/[householdId]/expenses',
              params: { householdId },
            }}>
            Show expenses
          </Link>
        </View>
        <Link
          href={{
            pathname: '/households/[householdId]/balance',
            params: { householdId },
          }}>
          Show balance
        </Link>
        <Link
          href={{
            pathname: '/households/[householdId]/refunds',
            params: { householdId },
          }}>
          Show refunds
        </Link>
        <Link
          href={{
            pathname: '/households/[householdId]/invite',
            params: { householdId },
          }}>
          Invite
        </Link>
      </View>
    </SafeAreaView>
  );
}
