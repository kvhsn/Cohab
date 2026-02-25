import * as SecureStore from 'expo-secure-store';

export async function saveSecureStorage(key: string, value: string) {
  return await SecureStore.setItemAsync(key, value);
}

export async function getValueForSecureStorage(key: string) {
  return await SecureStore.getItemAsync(key);
}

export async function deleteValueForSecureStorage(key: string) {
  return await SecureStore.deleteItemAsync(key);
}

import { authClient } from './auth';

export async function getAuthHeaders(
  additionalHeaders: Record<string, string> = { 'Content-Type': 'application/json' },
) {
  const headers: Record<string, string> = { ...additionalHeaders };
  const cookies = authClient.getCookie();
  if (cookies) {
    headers['Cookie'] = cookies;
  }
  return headers;
}
