import { StyleSheet, View } from 'react-native';
import { useState, useEffect } from 'react';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    // Simulate loading delay — replace with real user data fetch later
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
        <LoadingSpinner size="large" />
        <ThemedText style={styles.loadingText}>Loading profile…</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.avatar}>
        <ThemedText style={styles.avatarText}>👤</ThemedText>
      </View>
      <ThemedText type="title">Profile</ThemedText>
      <ThemedText style={styles.placeholderText}>
        User info and settings will go here.
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 4,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(10, 126, 164, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  avatarText: {
    fontSize: 40,
  },
  placeholderText: {
    opacity: 0.6,
    textAlign: 'center',
    paddingHorizontal: 32,
    lineHeight: 22,
  },
});
