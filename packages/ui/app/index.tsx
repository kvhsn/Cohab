import { useAuth } from '@/hooks/useAuth';
import { Redirect } from 'expo-router';
import React from 'react';

export default function Index() {
  const { isAuthenticated, isPending, error } = useAuth();

  if (isPending || error) return null;

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return <Redirect href="/households" />;
}
