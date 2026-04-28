import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useEffect } from 'react';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthService } from '@/services/auth';

import { NotificationProvider } from '@/context/NotificationContext';
import { ForumProvider } from '@/context/ForumContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // On app launch, validate the stored token against the server.
  // If valid, skip login. If expired or missing, authenticatedFetch clears
  // the token and stays on the login screen.
  useEffect(() => {
    AuthService.validateToken().then(valid => {
      if (valid) router.replace({ pathname: '/(tabs)/map' });
    });
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <NotificationProvider>
        <ForumProvider>
          <Stack initialRouteName="login">
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="signup" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          </Stack>
          <StatusBar style="auto" />
        </ForumProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}
