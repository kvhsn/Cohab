import { useAuth } from '@/hooks/useAuth';
import React, { Suspense } from 'react';
import { Button, Text } from 'react-native';
import HouseholdMembershipView from './HouseholdMembershipScreen';

export default function Households() {
  const { logout } = useAuth();

  return (
    <Suspense fallback={<Text>Loading household info...</Text>}>
      <HouseholdMembershipView />
      <Button title="Logout" onPress={logout} />
    </Suspense>
  );
}
