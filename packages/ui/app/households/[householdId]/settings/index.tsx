import CustomButton from '@/components/Button/Button';
import Icon from '@/components/Icon/Icon';
import Screen from '@/components/Screen/Screen';
import Typography from '@/components/Typography/Typography';
import { useAuth } from '@/hooks/useAuth';
import { Link, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Pressable, View } from 'react-native';

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
            <Pressable className="flex-row items-center border-b border-gray-50 dark:border-slate-700 p-4 active:bg-gray-50 dark:active:bg-slate-700">
              <View className="mr-4 size-10 items-center justify-center rounded-xl bg-primary/10">
                <Icon as="Ionicons" name="pencil" size="md" className="color-primary" />
              </View>
              <View className="flex-1">
                <Typography variant="body" className="font-semibold dark:text-gray-100">
                  Nom
                </Typography>
                <Typography variant="bodySmall" className="dark:text-gray-400">
                  Modifier le nom
                </Typography>
              </View>
              <Icon
                as="Ionicons"
                name="chevron-forward"
                size="sm"
                className="color-gray-400 dark:color-gray-500"
              />
            </Pressable>
          </Link>
          <Link href={`/households/${householdId}/settings/members`} asChild>
            <Pressable className="flex-row items-center border-gray-50 p-4 active:bg-gray-50 dark:active:bg-slate-700">
              <View className="mr-4 size-10 items-center justify-center rounded-xl bg-primary/10">
                <Icon as="Ionicons" name="people" size="md" className="color-primary" />
              </View>
              <View className="flex-1">
                <Typography variant="body" className="font-semibold dark:text-gray-100">
                  Gérer les membres
                </Typography>
              </View>
              <Icon
                as="Ionicons"
                name="chevron-forward"
                size="sm"
                className="color-gray-400 dark:color-gray-500"
              />
            </Pressable>
          </Link>
        </View>
      </View>
      <View className="flex self-center">
        <CustomButton size="sm" onPress={logout} variant="secondary" title="Déconnexion" />
      </View>
    </Screen>
  );
}
