import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { HapticTab } from '@/components/haptic-tab';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { accentColor, colors } from '@/constants/colors';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? colors.dark : colors.light;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: accentColor,
        tabBarInactiveTintColor: theme.icon,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            backgroundColor: theme.background,
            borderTopColor: theme.border,
          },
          default: {
            backgroundColor: theme.background,
            borderTopColor: theme.border,
          },
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="expenses"
        options={{
          title: 'Dépenses',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="money" color={color} />,
        }}
      />
      <Tabs.Screen
        name="groceries"
        options={{
          title: 'Courses',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="shopping-cart" color={color} />,
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: 'Paramètres',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="gear" color={color} />,
        }}
      />
    </Tabs>
  );
}
