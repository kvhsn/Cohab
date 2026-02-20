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

        <View>
          <Link href="/households">Back to Households</Link>
        </View>
      </View>
    </SafeAreaView>
  );
}
