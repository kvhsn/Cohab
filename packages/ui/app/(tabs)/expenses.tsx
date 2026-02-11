import { SafeAreaView, Text, View } from 'react-native';

export default function ExpensesScreen() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-light-background dark:bg-dark-background">
      <View className="p-6">
        <Text>Expenses</Text>
      </View>
    </SafeAreaView>
  );
}
