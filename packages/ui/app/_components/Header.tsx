import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Image, Text, View } from 'react-native';
import { colors } from '@/constants/colors';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function Header() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? colors.dark : colors.light;

  return (
    <View className="flex-row justify-between gap-4 pb-4">
      <View className="flex-row gap-4">
        <Image className="size-12 rounded-full" source={require('@/assets/images/icon.png')} />
        <View className="flex-col">
          <Text className="text-sm font-bold text-light-textSecondary dark:text-dark-textSecondary">
            Bon retour 👋
          </Text>
          <Text className="text-xl font-bold text-light-text dark:text-dark-text">
            Salut, Thomas!
          </Text>
        </View>
      </View>
      <FontAwesome name="bell-o" size={28} color={theme.icon} />
    </View>
  );
}
