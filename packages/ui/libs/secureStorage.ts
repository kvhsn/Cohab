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

export async function getAuthHeaders(
  additionalHeaders: Record<string, string> = { 'Content-Type': 'application/json' },
) {
  const token = await getValueForSecureStorage('token');
  const headers: Record<string, string> = { ...additionalHeaders };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}
