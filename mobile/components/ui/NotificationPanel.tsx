/*
  Slide-in notification inbox panel.
  Opens as a bottom modal sheet over the existing screen.

  Features:
  - Header with title + "Mark all read" button
  - Scrollable list of AppNotification items
  - Unread items have a colored left border + accent background
  - Tap to mark individual notification as read
  - Swipe-dismiss button (×) per notification
  - Empty state when inbox is clear
*/

import { AppNotification, useNotifications } from '@/context/NotificationContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/icon-symbol';

type NotificationPanelProps = {
  visible: boolean;
  onClose: () => void;
};

function NotificationRow({
  notification,
  onRead,
  onDismiss,
}: {
  notification: AppNotification;
  onRead: () => void;
  onDismiss: () => void;
}) {
  const accentColor = useThemeColor({ light: '#0a7ea4', dark: '#4FC3F7' }, 'tint');
  const cardBg = useThemeColor(
    {
      light: notification.read ? '#ffffff' : 'rgba(10,126,164,0.05)',
      dark: notification.read ? '#1c1c1e' : 'rgba(79,195,247,0.07)',
    },
    'background'
  );
  const borderColor = useThemeColor({ light: '#e5e7eb', dark: '#2a2f37' }, 'text');
  const mutedText = useThemeColor({ light: '#6b7280', dark: '#9ca3af' }, 'text');
  const titleColor = useThemeColor({ light: '#11181C', dark: '#ECEDEE' }, 'text');

  // Format the ISO createdAt to a short readable string
  const timeLabel = (() => {
    try {
      const d = new Date(notification.createdAt);
      const diffMs = Date.now() - d.getTime();
      const diffMin = Math.floor(diffMs / 60000);
      if (diffMin < 1) return 'Just now';
      if (diffMin < 60) return `${diffMin}m ago`;
      const diffHr = Math.floor(diffMin / 60);
      if (diffHr < 24) return `${diffHr}h ago`;
      return `${Math.floor(diffHr / 24)}d ago`;
    } catch {
      return '';
    }
  })();

  return (
    <Pressable
      onPress={onRead}
      style={[
        styles.row,
        {
          backgroundColor: cardBg as string,
          borderBottomColor: borderColor as string,
        },
        !notification.read && {
          borderLeftWidth: 3,
          borderLeftColor: accentColor as string,
        },
      ]}
    >
      <View style={styles.rowContent}>
        <Text
          style={[
            styles.rowTitle,
            { color: titleColor as string },
            !notification.read && styles.rowTitleUnread,
          ]}
          numberOfLines={1}
        >
          {notification.title}
        </Text>
        <Text
          style={[styles.rowBody, { color: mutedText as string }]}
          numberOfLines={2}
        >
          {notification.body}
        </Text>
        <Text style={[styles.rowTime, { color: mutedText as string }]}>
          {timeLabel}
        </Text>
      </View>

      <Pressable
        onPress={(e) => {
          e.stopPropagation();
          onDismiss();
        }}
        hitSlop={8}
        style={styles.dismissBtn}
      >
        <IconSymbol name="xmark" size={14} color={mutedText as string} />
      </Pressable>
    </Pressable>
  );
}

export function NotificationPanel({ visible, onClose }: NotificationPanelProps) {
  const insets = useSafeAreaInsets();
  const { notifications, markRead, markAllRead, dismiss, unreadCount } =
    useNotifications();

  const panelBg = useThemeColor({ light: '#ffffff', dark: '#11181C' }, 'background');
  const headerBorderColor = useThemeColor({ light: '#e5e7eb', dark: '#2a2f37' }, 'text');
  const titleColor = useThemeColor({ light: '#11181C', dark: '#ECEDEE' }, 'text');
  const accentColor = useThemeColor({ light: '#0a7ea4', dark: '#4FC3F7' }, 'tint');
  const mutedText = useThemeColor({ light: '#6b7280', dark: '#9ca3af' }, 'text');
  const overlayColor = 'rgba(0,0,0,0.4)';

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      {/* Backdrop — tap to close */}
      <Pressable style={[styles.overlay, { backgroundColor: overlayColor }]} onPress={onClose} />

      <View
        style={[
          styles.panel,
          { backgroundColor: panelBg as string, paddingBottom: insets.bottom + 16 },
        ]}
      >
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: headerBorderColor as string }]}>
          <View style={styles.headerLeft}>
            <Text style={[styles.headerTitle, { color: titleColor as string }]}>
              Notifications
            </Text>
            {unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
              </View>
            )}
          </View>

          <View style={styles.headerActions}>
            {unreadCount > 0 && (
              <Pressable onPress={markAllRead} hitSlop={6} style={styles.markAllBtn}>
                <IconSymbol
                  name="checkmark.circle.fill"
                  size={16}
                  color={accentColor as string}
                />
                <Text style={[styles.markAllText, { color: accentColor as string }]}>
                  Mark all read
                </Text>
              </Pressable>
            )}

            <Pressable onPress={onClose} hitSlop={8} style={styles.closeBtn}>
              <IconSymbol name="xmark.circle.fill" size={22} color={mutedText as string} />
            </Pressable>
          </View>
        </View>

        {/* Notification list */}
        {notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <IconSymbol name="bell" size={40} color={mutedText as string} />
            <Text style={[styles.emptyTitle, { color: titleColor as string }]}>
              You're all caught up
            </Text>
            <Text style={[styles.emptyBody, { color: mutedText as string }]}>
              New community alerts and replies will appear here.
            </Text>
          </View>
        ) : (
          <ScrollView
            style={styles.list}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            bounces
          >
            {notifications.map((notif) => (
              <NotificationRow
                key={notif.id}
                notification={notif}
                onRead={() => markRead(notif.id)}
                onDismiss={() => dismiss(notif.id)}
              />
            ))}
          </ScrollView>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  panel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: '75%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  unreadBadge: {
    backgroundColor: '#ef4444',
    borderRadius: 999,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  unreadBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  markAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  markAllText: {
    fontSize: 13,
    fontWeight: '600',
  },
  closeBtn: {
    padding: 2,
  },
  list: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: 1,
    gap: 10,
  },
  rowContent: {
    flex: 1,
    gap: 3,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  rowTitleUnread: {
    fontWeight: '700',
  },
  rowBody: {
    fontSize: 13,
    lineHeight: 18,
  },
  rowTime: {
    fontSize: 11,
    marginTop: 2,
  },
  dismissBtn: {
    paddingTop: 2,
    padding: 4,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 10,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 8,
  },
  emptyBody: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
