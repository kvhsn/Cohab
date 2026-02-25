import { createAuthClient } from 'better-auth/react';
import { expoClient } from '@better-auth/expo/client';
import * as SecureStore from 'expo-secure-store';

import { API_URL } from '@/constants/Config';

export const authClient = createAuthClient({
  baseURL: API_URL,
  plugins: [
    expoClient({
      scheme: 'colocapp',
      storagePrefix: 'colocapp',
      storage: SecureStore,
    }),
  ],
});
