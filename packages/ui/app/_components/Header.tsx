import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Image, Text, View } from 'react-native';

export default function Header() {
  return (
    <View className="flex-row justify-between gap-4 pb-4">
      <View className="flex-row gap-4">
        <Image className="size-12 rounded-full" source={require('@/assets/images/icon.png')} />
        <View className="flex-col">
          <Text className="text-sm font-bold text-gray-600 dark:text-gray-400">Bon retour 👋</Text>
          <Text className="text-xl font-bold text-black dark:text-white">Salut, Thomas!</Text>
        </View>
      </View>
      <FontAwesome name="bell-o" size={28} />
    </View>
  );
}
