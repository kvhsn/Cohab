import { Link } from 'expo-router';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Household() {
  return (
    <SafeAreaView>
      <View>
        <Link href="/households/create">Create</Link>
        <Link href="/households/invite">Invite</Link>
        <Link href="/households/join">Join</Link>
      </View>
    </SafeAreaView>
  );
}
