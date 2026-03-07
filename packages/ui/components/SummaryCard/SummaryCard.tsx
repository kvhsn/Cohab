import Card from '@/components/Card/Card';
import Icon from '@/components/Icon/Icon';
import Typography from '@/components/Typography/Typography';
import React from 'react';
import { View } from 'react-native';

interface SummaryCardProps {
  share: number;
  className?: string;
}

export function SummaryCard({ share, className }: SummaryCardProps) {
  const isPositive = share >= 0;

  return (
    <Card
      className={`items-center justify-center border-none overflow-hidden ${
        isPositive ? 'bg-primary/10 dark:bg-primary/20' : 'bg-rose-500/10 dark:bg-rose-500/20'
      } ${className}`}>
      <View className="w-full flex-row items-center justify-between">
        <View className="items-center py-4">
          <Typography variant="bodySmall" className="mb-2 opacity-70">
            Solde total
          </Typography>
          <Typography
            variant="h1"
            className={`text-4xl ${isPositive ? 'text-primary' : 'text-rose-500'}`}>
            {share > 0 ? '+' : ''}
            {share.toFixed(2)} €
          </Typography>
          <Typography variant="bodySmall" className="mt-2 opacity-60">
            {share === 0
              ? 'Vous êtes à l’équilibre !'
              : share > 0
                ? 'On vous doit de l’argent !'
                : 'Vous avez des dettes à régler.'}
          </Typography>
        </View>

        <View
          className={`p-4 rounded-3xl rotate-12 opacity-30 ${
            isPositive ? 'bg-primary' : 'bg-rose-500'
          }`}>
          <Icon as="Ionicons" name="wallet" size="lg" className="text-white" />
        </View>
      </View>
    </Card>
  );
}
