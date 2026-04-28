import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

interface ProfileHeaderProps {
  onChangePhoto: () => void;
}

/**
 * ProfileHeader
 * Displays the user's avatar, title, subtitle, and profile picture
 * Backend can later replace avatar with real user image.
 */
export function ProfileHeader({ onChangePhoto }: ProfileHeaderProps) {
  return (
    <View style={styles.headerSection}>
      {/* Avatar (placeholder for now, replace with user image later) */}
      <View style={styles.avatar}>
        <ThemedText style={styles.avatarText}>👤</ThemedText>
      </View>

      <ThemedText type="title" style={styles.title}>
        Profile
      </ThemedText>

      <ThemedText style={styles.subtitle}>
        Manage your account information, preferences, and post history.
      </ThemedText>

      <Pressable style={styles.secondaryButton} onPress={onChangePhoto}>
        <ThemedText style={styles.secondaryButtonText}>
          Change Profile Picture
        </ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  headerSection: {
    alignItems: 'center',
    paddingBottom: 8,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(10, 126, 164, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(10, 126, 164, 0.2)',
  },
  avatarText: {
    fontSize: 42,
  },
  title: {
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 20,
    marginBottom: 14,
    paddingHorizontal: 12,
  },
  secondaryButton: {
    minHeight: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#0A7EA4',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    backgroundColor: 'rgba(10, 126, 164, 0.05)',
  },
  secondaryButtonText: {
    color: '#0A7EA4',
    fontSize: 14,
    fontWeight: '600',
  },
});