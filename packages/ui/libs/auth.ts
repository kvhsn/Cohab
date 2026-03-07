import { createAuthClient } from 'better-auth/react';
import { expoClient } from '@better-auth/expo/client';
import * as SecureStore from 'expo-secure-store';

import { API_URL } from '@/constants/Config';

// In-memory cache that bridges the sync interface required by @better-auth/expo
// with Android's async Keystore. On Android, SecureStore.getItem() (sync) can
// silently return null before the Keystore is ready after a JS bundle reload.
// Solution: async-preload the cache at app startup, then all sync reads hit memory.
const memoryStorage: Record<string, string | null> = {};

// Keys written by @better-auth/expo (storagePrefix + suffix)
const AUTH_STORAGE_KEYS = ['cohab_cookie', 'cohab_session_data'];

export async function preloadAuthStorage() {
  await Promise.all(
    AUTH_STORAGE_KEYS.map(async (key) => {
      if (key in memoryStorage) return;
      const value = await SecureStore.getItemAsync(key);
      if (value !== null) memoryStorage[key] = value;
    }),
  );
}

const secureStorage = {
  getItem(key: string): string | null {
    if (key in memoryStorage) return memoryStorage[key] ?? null;
    try {
      const value = SecureStore.getItem(key);
      if (value !== null) memoryStorage[key] = value;
      return value;
    } catch {
      return null;
    }
  },
  setItem(key: string, value: string): void {
    memoryStorage[key] = value;
    SecureStore.setItemAsync(key, value).catch(console.error);
  },
  deleteItem(key: string): void {
    delete memoryStorage[key];
    SecureStore.deleteItemAsync(key).catch(console.error);
  },
};

export const authClient = createAuthClient({
  baseURL: API_URL,
  plugins: [
    expoClient({
      scheme: 'cohab',
      storagePrefix: 'cohab',
      storage: secureStorage,
    }),
  ],
});
