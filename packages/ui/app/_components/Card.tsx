import { Text, View } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { accentColor, colors } from '@/constants/colors';
import { useColorScheme } from '@/hooks/use-color-scheme';

type CardProps = {
  title: string;
  description: string;
  footer: string;
};

export default function Card({ title, description, footer }: CardProps) {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? colors.dark : colors.light;

  return (
    <View className="relative mb-4 overflow-hidden rounded-3xl border border-light-border bg-light-surface p-6 shadow-sm dark:border-dark-border dark:bg-dark-surface">
      <View className="mb-4 flex-row items-start justify-between">
        <View className="rounded-xl bg-light-border p-2.5 dark:bg-dark-border">
          <FontAwesome name="google-wallet" size={24} color={accentColor} />
        </View>
        <FontAwesome name="arrow-right" size={24} color={theme.icon} />
      </View>

      <View>
        <Text className="mb-1 text-sm font-medium text-light-textSecondary dark:text-dark-textSecondary">
          {title}
        </Text>
        <Text className="text-4xl font-bold tracking-tight text-light-text dark:text-dark-text">
          {description}
        </Text>
      </View>

      <View className="mt-4 flex-row items-center gap-2">
        <FontAwesome name="line-chart" size={14} color={accentColor} />
        <Text className="text-sm font-semibold text-light-text dark:text-dark-text">{footer}</Text>
      </View>
    </View>
  );
}
