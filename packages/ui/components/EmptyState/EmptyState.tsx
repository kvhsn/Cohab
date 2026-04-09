import Icon, { type IconNames } from '@/components/Icon/Icon';
import Typography from '@/components/Typography/Typography';
import { View } from 'react-native';

interface EmptyStateProps {
  /** Ionicons icon name displayed in the circle */
  iconName: IconNames<'Ionicons'>;
  /** Title text */
  title: string;
  /** Descriptive subtitle */
  description: string;
}

export default function EmptyState({ iconName, title, description }: EmptyStateProps) {
  return (
    <View className="items-center justify-center py-16 gap-4">
      <View className="size-20 items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20">
        <Icon as="Ionicons" name={iconName} size="lg" className="text-primary" />
      </View>
      <View className="items-center gap-1">
        <Typography variant="body" className="font-semibold">
          {title}
        </Typography>
        <Typography variant="bodySmall" className="text-center px-8">
          {description}
        </Typography>
      </View>
    </View>
  );
}
