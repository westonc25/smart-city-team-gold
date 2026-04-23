/*
  Notification bell icon with an animated unread-count badge.

  Props:
  - onPress   — opens the NotificationPanel
  - color     — icon tint (inherit from parent / tab bar)
  - size      — bell icon size (default 24)

  The badge appears whenever unreadCount > 0.
  Count is capped at "9+" to avoid badge overflow.
*/

import { useNotifications } from '@/context/NotificationContext';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';

type NotificationBellProps = {
  onPress: () => void;
  color?: string;
  size?: number;
};

export function NotificationBell({
  onPress,
  color = '#11181C',
  size = 24,
}: NotificationBellProps) {
  const { unreadCount } = useNotifications();

  const badgeLabel = unreadCount > 9 ? '9+' : String(unreadCount);
  const showBadge = unreadCount > 0;

  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      accessibilityLabel={
        showBadge
          ? `Notifications, ${unreadCount} unread`
          : 'Notifications'
      }
      accessibilityRole="button"
    >
      {/* Bell icon — using 'bell.fill' on iOS via icon-symbol mapping */}
      <IconSymbol name="bell.fill" size={size} color={color} />

      {/* Unread badge */}
      {showBadge && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badgeLabel}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6,
  },
  pressed: {
    opacity: 0.65,
  },
  badge: {
    position: 'absolute',
    top: 1,
    right: 1,
    minWidth: 17,
    height: 17,
    borderRadius: 999,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
    // Border so it pops off any background
    borderWidth: 1.5,
    borderColor: '#ffffff',
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '800',
    lineHeight: 11,
  },
});
