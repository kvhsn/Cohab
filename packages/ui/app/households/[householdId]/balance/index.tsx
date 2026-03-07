import Screen from '@/components/Screen/Screen';
import Typography from '@/components/Typography/Typography';
import { useLocalSearchParams } from 'expo-router';
import React, { Suspense } from 'react';
import BalanceContent from './_components/BalanceContent';

export default function BalanceRoot() {
  const { householdId } = useLocalSearchParams<{ householdId: string }>();

  if (!householdId) return null;

  return (
    <Screen title="Portefeuille">
      <Suspense fallback={<Typography variant="body">Chargement...</Typography>}>
        <BalanceContent householdId={householdId} />
      </Suspense>
    </Screen>
  );
}
