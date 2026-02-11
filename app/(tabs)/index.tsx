import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-white dark:bg-black">
      <View className="p-6">
        <Text className="mb-4 text-center text-4xl font-bold text-blue-600 dark:text-blue-400">
          Coloc App
        </Text>
        <Text className="mb-8 text-center text-lg text-gray-600 dark:text-gray-300">
          Simplify your shared living experience.
        </Text>

        <View className="rounded-xl bg-gray-100 p-6 dark:bg-gray-800">
          <Text className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
            Features coming soon:
          </Text>
          <View className="space-y-2">
            <Text className="text-gray-700 dark:text-gray-300">• Shared Tasks & Chores</Text>
            <Text className="text-gray-700 dark:text-gray-300">
              • Expense Splitting (Tricount-style)
            </Text>
            <Text className="text-gray-700 dark:text-gray-300">• Grocery Coordination</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
