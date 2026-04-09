import { View } from 'react-native';
import Typography from '../Typography/Typography';

type DividerProps = {
  title?: string;
};

export default function Divider({ title }: DividerProps) {
  return (
    <View className="flex-row items-center py-6">
      <View className="flex-1 h-px bg-gray-200/50 dark:bg-dark-border/50" />
      {title && (
        <View className="px-4">
          <Typography variant="caption" className="text-gray-400 dark:text-gray-500">
            {title}
          </Typography>
        </View>
      )}
      <View className="flex-1 h-px bg-gray-200/50 dark:bg-dark-border/50" />
    </View>
  );
}
