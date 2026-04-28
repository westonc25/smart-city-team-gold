/*
  Global notification state for the Smart City app.

  Manages two distinct but related concerns:
  1. OS-level push permission state (permissionGranted, requestPermission)
  2. In-app notification inbox (notifications[], unreadCount, markRead, etc.)

  Usage:
    const { unreadCount, notifications, requestPermission } = useNotifications();

  "addNotification" lets any part of the app (forum reply, vote milestone, system alert)
  push a new item into the bell without importing this context's internals.
*/

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from 'react';
import {
  checkNotificationPermission,
  requestNotificationPermission,
  addForegroundNotificationListener,
  removeNotificationListener,
} from '@/lib/notifications';

// ── Types ─────────────────────────────────────────────────────────────────────

export type NotificationType = 'forum_reply' | 'post_vote' | 'system';

export type AppNotification = {
  id: string;
  title: string;
  body: string;
  type: NotificationType;
  read: boolean;
  createdAt: string; // ISO string
};

type NotificationContextType = {
  notifications: AppNotification[];
  unreadCount: number;
  permissionGranted: boolean;
  /** Prompt the user for OS permission if not already granted. */
  requestPermission: () => Promise<void>;
  /** Add a new notification to the in-app inbox. */
  addNotification: (n: Omit<AppNotification, 'id' | 'read' | 'createdAt'>) => void;
  /** Mark a single notification as read. */
  markRead: (id: string) => void;
  /** Mark all notifications as read. */
  markAllRead: () => void;
  /** Remove a single notification from the list. */
  dismiss: (id: string) => void;
};

// ── Context ───────────────────────────────────────────────────────────────────

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// ── Seed data — a couple of placeholder items so the bell isn't empty on first run ──

const SEED_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'seed-1',
    title: 'Welcome to Smart City',
    body: 'Stay updated with community posts and city alerts near you.',
    type: 'system',
    read: false,
    createdAt: new Date().toISOString(),
  },
];

// ── Provider ──────────────────────────────────────────────────────────────────

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>(SEED_NOTIFICATIONS);
  const [permissionGranted, setPermissionGranted] = useState(false);

  // Check current OS permission status on mount (without prompting).
  useEffect(() => {
    checkNotificationPermission().then(setPermissionGranted);
  }, []);

  // Listen for push notifications received while the app is foregrounded.
  // When one arrives, add it to the in-app inbox automatically.
  const listenerRef = useRef<ReturnType<typeof addForegroundNotificationListener> | null>(null);
  useEffect(() => {
    listenerRef.current = addForegroundNotificationListener((notification) => {
      const { title, body } = notification.request.content;
      addNotification({
        title: title ?? 'Notification',
        body: body ?? '',
        type: 'system',
      });
    });

    return () => {
      if (listenerRef.current) {
        removeNotificationListener(listenerRef.current);
      }
    };
    // addNotification is stable (useCallback with []) — safe to exclude
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const requestPermission = useCallback(async () => {
    const granted = await requestNotificationPermission();
    setPermissionGranted(granted);
  }, []);

  const addNotification = useCallback(
    (n: Omit<AppNotification, 'id' | 'read' | 'createdAt'>) => {
      const newItem: AppNotification = {
        ...n,
        id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        read: false,
        createdAt: new Date().toISOString(),
      };
      setNotifications((prev) => [newItem, ...prev]);
    },
    []
  );

  const markRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const dismiss = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        permissionGranted,
        requestPermission,
        addNotification,
        markRead,
        markAllRead,
        dismiss,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return ctx;
}
