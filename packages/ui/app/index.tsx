import { Link } from 'expo-router';
import { View, Text, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/hooks/useAuth';
import React from 'react';

export default function HomeScreen() {
  const { isLogged, logout } = useAuth();

  return (
    <SafeAreaView>
      <View>
        <Text>Coloc App</Text>
        <Text>Simplify your shared living experience.</Text>
        {isLogged ? (
          <>
            <Link href="/households">Households</Link>
            <Button title="Logout" onPress={logout} />
          </>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
