/*
  Thin service layer around expo-notifications.

  Responsibilities:
  - Request push notification permissions from the OS
  - Add / remove foreground notification listeners
  - (Future) Register device push token with the backend

  The context (NotificationContext.tsx) owns all state.
  Components should interact with the context, not this module directly.
*/

import * as ExpoNotifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure how notifications behave while the app is in the foreground.
ExpoNotifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Request notification permissions from the OS.
 * Returns `true` if the user has (or already had) permissions granted.
 */
export async function requestNotificationPermission(): Promise<boolean> {
  // Android 13+ requires explicit permission — Expo handles the request.
  if (Platform.OS === 'android') {
    await ExpoNotifications.setNotificationChannelAsync('default', {
      name: 'Smart City Alerts',
      importance: ExpoNotifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  const { status: existingStatus } = await ExpoNotifications.getPermissionsAsync();
  if (existingStatus === 'granted') return true;

  const { status } = await ExpoNotifications.requestPermissionsAsync();
  return status === 'granted';
}

/**
 * Check the current permission status without prompting the user.
 */
export async function checkNotificationPermission(): Promise<boolean> {
  const { status } = await ExpoNotifications.getPermissionsAsync();
  return status === 'granted';
}

/**
 * Add a listener for notifications received while the app is foregrounded.
 * Returns the subscription so the caller can clean up.
 */
export function addForegroundNotificationListener(
  handler: (notification: ExpoNotifications.Notification) => void
): ExpoNotifications.Subscription {
  return ExpoNotifications.addNotificationReceivedListener(handler);
}

/**
 * Add a listener for when the user taps a notification.
 */
export function addNotificationResponseListener(
  handler: (response: ExpoNotifications.NotificationResponse) => void
): ExpoNotifications.Subscription {
  return ExpoNotifications.addNotificationResponseReceivedListener(handler);
}

/**
 * Remove a previously added listener.
 */
export function removeNotificationListener(
  subscription: ExpoNotifications.Subscription
): void {
  ExpoNotifications.removeNotificationSubscription(subscription);
}
