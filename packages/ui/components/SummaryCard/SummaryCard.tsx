import Card from '@/components/Card/Card';
import Icon from '@/components/Icon/Icon';
import Typography from '@/components/Typography/Typography';
import { cn } from '@/libs/tailwind';
import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

interface SummaryCardProps {
  share: number;
  className?: string;
  isAlone?: boolean;
  title?: string;
  expandable?: boolean;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  children?: React.ReactNode;
}

export function SummaryCard({
  share,
  className,
  isAlone,
  title,
  expandable = false,
  isExpanded = false,
  onToggleExpand,
  children,
}: SummaryCardProps) {
  const isPositive = share >= 0;
  const [measuredHeight, setMeasuredHeight] = useState(0);

  const heightValue = useSharedValue(0);

  useEffect(() => {
    heightValue.value = withTiming(isExpanded ? measuredHeight : 0, { duration: 300 });
  }, [isExpanded, measuredHeight, heightValue]);

  const animatedContentStyle = useAnimatedStyle(() => ({
    height: heightValue.value,
    opacity: withTiming(isExpanded ? 1 : 0, { duration: 200 }),
  }));

  const handleLayout = useCallback(
    (e: { nativeEvent: { layout: { height: number } } }) => {
      const h = e.nativeEvent.layout.height;
      if (h > 0 && h !== measuredHeight) {
        setMeasuredHeight(h);
      }
    },
    [measuredHeight],
  );

  const getTitle = () => {
    if (title) return title;
    return isAlone ? 'Total investi' : 'Solde total';
  };

  const getSubtitle = () => {
    if (isAlone) {
      return share === 0
        ? 'Commencez a suivre vos frais !'
        : "C'est un bon debut ! Invitez vos colocs.";
    }

    if (share === 0) return "Vous etes a l'equilibre !";
    return share > 0 ? "On vous doit de l'argent !" : 'Vous avez des dettes a regler.';
  };

  return (
    <Card
      className={cn(
        'items-center justify-center border-none overflow-hidden',
        isPositive ? 'bg-primary/10 dark:bg-primary/20' : 'bg-rose-500/10 dark:bg-rose-500/20',
        className,
      )}>
      <View className="w-full flex-row items-center justify-between">
        <View className="items-center py-4">
          <Typography variant="bodySmall" weight="medium" className="mb-2 opacity-70">
            {getTitle()}
          </Typography>
          <Typography
            variant="h1"
            className={cn('text-4xl', isPositive ? 'text-primary' : 'text-rose-500')}>
            {share > 0 ? '+' : ''}
            {share.toFixed(2)} {'\u20AC'}
          </Typography>
          <Typography variant="bodySmall" weight="medium" className="mt-2 opacity-60">
            {getSubtitle()}
          </Typography>
        </View>

        <View
          className={`p-4 rounded-3xl rotate-12 opacity-30 ${
            isPositive ? 'bg-primary' : 'bg-rose-500'
          }`}>
          <Icon as="Ionicons" name="wallet" size="lg" className="text-white" />
        </View>
      </View>

      {expandable && (
        <>
          <Pressable onPress={onToggleExpand} className="w-full items-center py-1">
            <View
              className={cn(
                'transition-transform duration-300',
                isExpanded ? 'rotate-180' : 'rotate-0',
              )}>
              <Icon
                as="Ionicons"
                name="chevron-down"
                size="md"
                className={isPositive ? 'text-primary' : 'text-rose-500'}
              />
            </View>
          </Pressable>

          <Animated.View style={animatedContentStyle} className="w-full overflow-hidden">
            <View className="absolute opacity-0" onLayout={handleLayout} pointerEvents="none">
              {children}
            </View>
            {children}
          </Animated.View>
        </>
      )}
    </Card>
  );
}
