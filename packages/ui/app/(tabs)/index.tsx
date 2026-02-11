import { SectionList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../_components/Header';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Card from '../_components/Card';
import { ComponentProps } from 'react';
import { accentColor } from '@/constants/colors';

type Section = {
  title: string;
  data: ComponentProps<typeof Card>[];
  icon?: ComponentProps<typeof FontAwesome>['name'];
  expandeable?: boolean;
};

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-light-background dark:bg-dark-background">
      <View className="flex-1 p-6">
        <Header />
        <SectionList<ComponentProps<typeof Card>, Section>
          className="mt-1"
          sections={[
            {
              title: 'À la une',
              data: [{ title: 'Solde actuel', description: '+120,50€', footer: 'On te doit' }],
            },
            {
              icon: 'shopping-cart',
              title: 'Liste de courses',
              data: [],
              expandeable: true,
            },
          ]}
          renderItem={({ item }) => <Card {...item} />}
          renderSectionHeader={({ section }) => (
            <View className="mb-3 flex-row items-center gap-2">
              {section.icon && <FontAwesome size={28} name={section.icon} color={accentColor} />}
              <View className="flex-1 flex-row items-center justify-between">
                <Text className="text-xl font-bold text-light-text dark:text-dark-text">
                  {section.title}
                </Text>
                {section.expandeable && (
                  <Text className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
                    Voir tout
                  </Text>
                )}
              </View>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}
