import { useAuth } from '@/hooks/useAuth';
import { Redirect } from 'expo-router';
import React from 'react';

const storybookEnabled = process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === 'true';

export default function Index() {
  const { isAuthenticated, isPending, error } = useAuth();

  if (storybookEnabled) {
    return <Redirect href="/storybook" />;
  }

  if (isPending || error) return null;

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return <Redirect href="/households" />;
}
