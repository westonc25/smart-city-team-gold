import { Platform } from 'react-native';

const trimTrailingSlashes = (value: string): string => value.replace(/\/+$/, '');

/**
 * Base URL for the Elysia (or other) backend.
 * Set EXPO_PUBLIC_API_URL in .env (e.g. http://192.168.1.5:3000 for a physical device).
 * If unset: Android emulator defaults to host loopback via 10.0.2.2; other platforms use 127.0.0.1.
 */
export const getApiBaseUrl = (): string => {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL;
  if (typeof fromEnv === 'string' && fromEnv.trim().length > 0) {
    return trimTrailingSlashes(fromEnv.trim());
  }

  const fallback =
    Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://127.0.0.1:3000';

  return fallback;
};

export const getForumPostsUrl = (): string => `${getApiBaseUrl()}/forum/posts`;
