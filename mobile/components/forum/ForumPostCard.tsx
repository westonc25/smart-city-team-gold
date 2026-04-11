/*
  Reusable card for displaying a single forum post in the feed.

  Shows category badge, title/content preview, author, comment count,
  distance from the user (when location data is available), and vote controls.
*/

import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useForum } from '@/context/ForumContext';
import { ForumPost } from '@/types/forum';
import { haversineDistanceMiles, formatMiles } from '@/lib/distance';

type ForumPostCardProps = {
  post: ForumPost;
  /** Current user latitude (undefined when location unavailable). */
  userLat?: number;
  /** Current user longitude (undefined when location unavailable). */
  userLon?: number;
};

export function ForumPostCard({ post, userLat, userLon }: ForumPostCardProps) {
  const router = useRouter();
  const { votePost } = useForum();

  const borderColor = useThemeColor({ light: '#e5e7eb', dark: '#2a2f37' }, 'text');
  const mutedTextColor = useThemeColor({ light: '#6b7280', dark: '#9ca3af' }, 'text');
  const badgeBg = useThemeColor({ light: '#eaf6fb', dark: '#12303b' }, 'background');
  const accentColor = useThemeColor({ light: '#0a7ea4', dark: '#4FC3F7' }, 'tint');

  const commentCount = post.comments?.length ?? 0;
  const netVotes = post.upvotes - post.downvotes;

  // Calculate distance when both user and post location are known.
  const distanceLabel =
    userLat != null &&
    userLon != null &&
    post.latitude != null &&
    post.longitude != null
      ? formatMiles(haversineDistanceMiles(userLat, userLon, post.latitude, post.longitude))
      : null;

  const handlePress = () => {
    router.push(`/post/${post.id}`);
  };

  return (
    <Pressable onPress={handlePress}>
      <ThemedView style={[styles.card, { borderColor }]}>
        {/* ---- Header row: badge + distance / time ---- */}
        <View style={styles.headerRow}>
          <View style={[styles.badge, { backgroundColor: badgeBg }]}>
            <ThemedText style={[styles.badgeText, { color: accentColor }]}>
              {post.category}
            </ThemedText>
          </View>

          <View style={styles.headerRight}>
            {distanceLabel && (
              <ThemedText style={[styles.distanceText, { color: accentColor }]}>
                {distanceLabel}
              </ThemedText>
            )}
            <ThemedText style={[styles.timeText, { color: mutedTextColor }]}>
              {post.createdAt}
            </ThemedText>
          </View>
        </View>

        <ThemedText style={styles.title} numberOfLines={2}>{post.title}</ThemedText>
        <ThemedText style={styles.content} numberOfLines={3}>{post.content}</ThemedText>

        {/* ---- Footer: author | comments | votes ---- */}
        <View style={styles.footerRow}>
          <ThemedText style={[styles.authorText, { color: mutedTextColor }]}>
            Posted by {post.author}
          </ThemedText>

          <View style={styles.footerActions}>
            <ThemedText style={[styles.actionText, { color: accentColor }]}>
              {commentCount === 1 ? '1 comment' : `${commentCount} comments`}
            </ThemedText>

            {/* Vote controls */}
            <View style={styles.voteRow}>
              <Pressable
                onPress={(e) => { e.stopPropagation(); votePost(post.id, 'up'); }}
                hitSlop={6}
                style={styles.voteButton}
              >
                <ThemedText
                  style={[
                    styles.voteIcon,
                    post.userVote === 'up' && { color: '#22c55e' },
                  ]}
                >
                  ▲
                </ThemedText>
              </Pressable>

              <ThemedText style={[styles.voteCount, { color: mutedTextColor }]}>
                {netVotes}
              </ThemedText>

              <Pressable
                onPress={(e) => { e.stopPropagation(); votePost(post.id, 'down'); }}
                hitSlop={6}
                style={styles.voteButton}
              >
                <ThemedText
                  style={[
                    styles.voteIcon,
                    post.userVote === 'down' && { color: '#ef4444' },
                  ]}
                >
                  ▼
                </ThemedText>
              </Pressable>
            </View>
          </View>
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  distanceText: {
    fontSize: 12,
    fontWeight: '600',
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
    flex: 1,
  },
  footerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  voteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  voteButton: {
    padding: 4,
  },
  voteIcon: {
    fontSize: 14,
  },
  voteCount: {
    fontSize: 14,
    fontWeight: '700',
    minWidth: 20,
    textAlign: 'center',
  },
});