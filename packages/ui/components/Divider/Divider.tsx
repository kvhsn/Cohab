import { View } from 'react-native';
import Typography from '../Typography/Typography';

type DividerProps = {
  title?: string;
};

export default function Divider({ title }: DividerProps) {
  return (
    <View className="flex-row items-center py-8">
      <View className="flex-1 h-px bg-gray-100" />
      {title && (
        <View className="px-4">
          <Typography variant="caption">{title}</Typography>
        </View>
      )}
      <View className="flex-1 h-px bg-gray-100" />
    </View>
  );
}
