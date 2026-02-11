import { SafeAreaView, Text, View } from 'react-native';

export default function GroceriesScreen() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-light-background dark:bg-dark-background">
      <View className="p-6">
        <Text>Groceries</Text>
      </View>
    </SafeAreaView>
  );
}
