import { createAuthClient } from 'better-auth/react';
import { expoClient } from '@better-auth/expo/client';
import * as SecureStore from 'expo-secure-store';

import { API_URL } from '@/constants/Config';

// In-memory cache to ensure synchronous reads work reliably on Android.
// Android's synchronous Keystore API can be unreliable — writes via setItem()
// may not always persist correctly. Using setItemAsync() + a memory cache
// fixes the Android auto-logout-on-reload issue.
const memoryStorage: Record<string, string | null> = {};

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
