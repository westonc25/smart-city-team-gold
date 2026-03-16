/*
  Reusable card for displaying a single forum post in the feed.

  This component now acts as a touchable card that routes the user 
  to the dedicated Post Detail screen for that specific post.
*/

import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { ForumPost } from '@/types/forum';

type ForumPostCardProps = {
  post: ForumPost;
};

export function ForumPostCard({ post }: ForumPostCardProps) {
  const router = useRouter();

  const borderColor = useThemeColor({ light: '#e5e7eb', dark: '#2a2f37' }, 'text');
  const mutedTextColor = useThemeColor({ light: '#6b7280', dark: '#9ca3af' }, 'text');
  const badgeBg = useThemeColor({ light: '#eaf6fb', dark: '#12303b' }, 'background');
  const accentColor = useThemeColor({ light: '#0a7ea4', dark: '#4FC3F7' }, 'tint');

  const commentCount = post.comments?.length ?? 0;

  // Navigate to the post detail view when pressed
  const handlePress = () => {
    router.push(`/post/${post.id}`);
  };

  return (
    <Pressable onPress={handlePress}>
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

        <ThemedText style={styles.title} numberOfLines={2}>{post.title}</ThemedText>
        <ThemedText style={styles.content} numberOfLines={3}>{post.content}</ThemedText>

        <View style={styles.footerRow}>
          <ThemedText style={[styles.authorText, { color: mutedTextColor }]}>
            Posted by {post.author}
          </ThemedText>
          <ThemedText style={[styles.actionText, { color: accentColor }]}>
            {commentCount === 1 ? '1 comment' : `${commentCount} comments`}
          </ThemedText>
        </View>
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    gap: 8,
    marginBottom: 12,

    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
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
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 24,
  },
  content: {
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.9,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
    alignItems: 'center',
  },
  authorText: {
    fontSize: 13,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
  },
});