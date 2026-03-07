import Screen from '@/components/Screen/Screen';
import Typography from '@/components/Typography/Typography';
import { useLocalSearchParams } from 'expo-router';
import React, { Suspense } from 'react';
import { View } from 'react-native';
import BalanceContent from './_components/BalanceContent';

export default function BalanceRoot() {
  const { householdId } = useLocalSearchParams<{ householdId: string }>();

  if (!householdId) return null;

  return (
    <Screen title="Portefeuille">
      <Suspense
        fallback={
          <View className="flex-1 items-center justify-center py-20">
            <Typography variant="body">Chargement...</Typography>
          </View>
        }>
        <BalanceContent householdId={householdId} />
      </Suspense>
    </Screen>
  );
}
