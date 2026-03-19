import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { UserPost } from '@/data/profileMockData';

interface ProfilePostHistoryProps {
  posts: UserPost[];
}

export function ProfilePostHistory({ posts }: ProfilePostHistoryProps) {
  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeaderRow}>
        <ThemedText style={styles.sectionTitle}>Post History</ThemedText>
        <ThemedText style={styles.postCount}>{posts.length} posts</ThemedText>
      </View>

      {posts.length === 0 ? (
        <ThemedText style={styles.emptyStateText}>
          No posts yet. User post history will appear here once connected to backend
          data.
        </ThemedText>
      ) : (
        posts.map((post) => (
          <View key={post.id} style={styles.postCard}>
            <View style={styles.postHeaderRow}>
              <ThemedText style={styles.postCategory}>{post.category}</ThemedText>
              <ThemedText style={styles.postDate}>{post.createdAt}</ThemedText>
            </View>

            <ThemedText style={styles.postTitle}>{post.title}</ThemedText>

            <View style={styles.postMetaRow}>
              <ThemedText style={styles.postMetaText}>{post.likes} likes</ThemedText>
              <ThemedText style={styles.postMetaDivider}>•</ThemedText>
              <ThemedText style={styles.postMetaText}>
                {post.comments} comments
              </ThemedText>
            </View>
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    gap: 14,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#11181C',
  },
  postCount: {
    fontSize: 13,
    opacity: 0.65,
    color: '#11181C',
  },
  emptyStateText: {
    opacity: 0.65,
    lineHeight: 20,
    color: '#11181C',
  },
  postCard: {
    borderRadius: 14,
    padding: 14,
    backgroundColor: '#F7F8FA',
    borderWidth: 1,
    borderColor: '#ECECF1',
    gap: 8,
  },
  postHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  postCategory: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0A7EA4',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  postDate: {
    fontSize: 12,
    opacity: 0.6,
    color: '#11181C',
  },
  postTitle: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 21,
    color: '#11181C',
  },
  postMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  postMetaText: {
    fontSize: 13,
    opacity: 0.7,
    color: '#11181C',
  },
  postMetaDivider: {
    fontSize: 13,
    opacity: 0.45,
    color: '#11181C',
  },
});