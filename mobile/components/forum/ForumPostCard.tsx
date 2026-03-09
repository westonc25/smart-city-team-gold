import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { ForumPost } from '@/types/forum';
import { StyleSheet, View } from 'react-native';

type ForumPostCardProps = {
  post: ForumPost;
};

export function ForumPostCard({ post }: ForumPostCardProps) {
  const borderColor = useThemeColor(
    { light: '#e5e7eb', dark: '#2a2f37' },
    'text'
  );
  const mutedTextColor = useThemeColor(
    { light: '#6b7280', dark: '#9ca3af' },
    'text'
  );
  const badgeBg = useThemeColor(
    { light: '#eaf6fb', dark: '#12303b' },
    'background'
  );
  const accentColor = useThemeColor(
    { light: '#0a7ea4', dark: '#4FC3F7' },
    'tint'
  );

  return (
    <ThemedView style={[styles.card, { borderColor }]}>
      <View style={styles.headerRow}>
        <View style={[styles.badge, { backgroundColor: badgeBg }]}>
          <ThemedText style={[styles.badgeText, { color: accentColor }]}>
            {post.category}
          </ThemedText>
        </View>
        <ThemedText style={[styles.timeText, { color: mutedTextColor }]}>
          {post.createdAt}
        </ThemedText>
      </View>

      <ThemedText style={styles.title}>{post.title}</ThemedText>
      <ThemedText style={styles.content}>{post.content}</ThemedText>

      <View style={styles.footer}>
        <ThemedText style={[styles.authorText, { color: mutedTextColor }]}>
          Posted by {post.author}
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    gap: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  timeText: {
    fontSize: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
  },
  content: {
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.9,
  },
  footer: {
    marginTop: 4,
  },
  authorText: {
    fontSize: 13,
  },
});