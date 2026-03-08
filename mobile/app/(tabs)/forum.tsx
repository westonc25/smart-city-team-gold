import { StyleSheet, View } from 'react-native';
import { useState, useEffect } from 'react';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ForumScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    // Simulate loading delay — replace with real data fetch when Derrick's API is ready
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
        <LoadingSpinner size="large" />
        <ThemedText style={styles.loadingText}>Loading community posts…</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <ThemedText type="title">Forum</ThemedText>
      <View style={styles.emptyState}>
        <ThemedText style={styles.emptyIcon}>💬</ThemedText>
        <ThemedText type="subtitle">No posts yet</ThemedText>
        <ThemedText style={styles.emptyText}>
          Community posts will appear here once they are available.
        </ThemedText>
      </View>
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
  emptyState: {
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.6,
    lineHeight: 22,
  },
});
