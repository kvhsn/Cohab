import CustomButton from '@/components/Button/Button';
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
      <View className="flex-1 p-4">
        <Typography variant="caption" className="mb-2 ml-4 dark:text-gray-400">
          Général
        </Typography>

        <View className="mb-8 overflow-hidden rounded-2xl border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
          <Link href={`/households/${householdId}/settings/name`} asChild>
            <SettingsItem label="Nom" subtitle="Modifier le nom" iconName="pencil" />
          </Link>
          <Link href={`/households/${householdId}/settings/members`} asChild>
            <SettingsItem label="Gérer les membres" iconName="people" />
          </Link>
          <Link
            href={{
              pathname: '/households/[householdId]/invite',
              params: { householdId },
            }}
            asChild>
            <SettingsItem label="Créer un code d'invitation" iconName="key" />
          </Link>
        </View>
      </View>
      <View className="flex self-center">
        <CustomButton size="sm" onPress={logout} variant="secondary" title="Déconnexion" />
      </View>
    </Screen>
  );
}
