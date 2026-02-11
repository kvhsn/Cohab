import { Text, View } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { accentColor } from '@/constants/colors';

type CardProps = {
  title: string;
  description: string;
  footer: string;
};

export default function Card({ title, description, footer }: CardProps) {
  return (
    <View className="relative mb-4 overflow-hidden rounded-3xl border border-gray-200 p-6 shadow-sm ">
      <View className="mb-4 flex-row items-start justify-between">
        <View className="rounded-xl bg-gray-100 p-2.5 dark:bg-gray-800">
          <FontAwesome name="google-wallet" size={24} color={accentColor} />
        </View>
        <FontAwesome name="arrow-right" size={24} color="#9BA1A6" />
      </View>

      <View>
        <Text className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-400">{title}</Text>
        <Text className="text-4xl font-bold tracking-tight text-black dark:text-white">
          {description}
        </Text>
      </View>

      <View className="mt-4 flex-row items-center gap-2">
        <FontAwesome name="line-chart" size={14} color={accentColor} />
        <Text className="text-sm font-semibold text-black dark:text-white">{footer}</Text>
      </View>
    </View>
  );
}
