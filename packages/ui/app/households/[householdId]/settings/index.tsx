import CustomButton from '@/components/Button/Button';
import Card from '@/components/Card/Card';
import Screen from '@/components/Screen/Screen';
import SettingsItem from '@/components/SettingsItem/SettingsItem';
import Typography from '@/components/Typography/Typography';
import { useAuth } from '@/hooks/useAuth';
import { Link, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

export default function SettingsIndex() {
  const { householdId } = useLocalSearchParams<{ householdId: string }>();
  const { logout } = useAuth();

  return (
    <Screen title="Paramètres">
      <Typography variant="caption" className="mb-2 ml-4">
        Général
      </Typography>

      <Card className="mb-8 overflow-hidden p-0">
        <Link href={`/households/${householdId}/settings/name`} asChild>
          <SettingsItem label="Nom" subtitle="Modifier le nom" iconName="pencil" />
        </Link>
        <View className="h-px bg-gray-100/50 dark:bg-white/5 mx-4" />
        <Link href={`/households/${householdId}/settings/members`} asChild>
          <SettingsItem label="Gérer les membres" iconName="people" />
        </Link>
        <View className="h-px bg-gray-100/50 dark:bg-white/5 mx-4" />
        <Link
          href={{
            pathname: '/households/[householdId]/invite',
            params: { householdId },
          }}
          asChild>
          <SettingsItem label="Créer un code d'invitation" iconName="key" />
        </Link>
      </Card>

      <View className="mt-auto self-center">
        <CustomButton size="sm" onPress={logout} variant="secondary" title="Déconnexion" />
      </View>
    </Screen>
  );
}
