import { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CreatePostModal } from '@/components/forum/CreatePostModal';
import { ForumPostCard } from '@/components/forum/ForumPostCard';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { forumMockPosts } from '@/data/forumMockData';
import { useThemeColor } from '@/hooks/use-theme-color';
import { ForumPost } from '@/types/forum';

export default function ForumScreen() {
  const insets = useSafeAreaInsets();
  const accentColor = useThemeColor(
    { light: '#0a7ea4', dark: '#4FC3F7' },
    'tint'
  );
  const mutedTextColor = useThemeColor(
    { light: '#6b7280', dark: '#9ca3af' },
    'text'
  );
  const borderColor = useThemeColor(
    { light: '#e5e7eb', dark: '#2a2f37' },
    'text'
  );

  const [posts, setPosts] = useState<ForumPost[]>(forumMockPosts);
  const [modalVisible, setModalVisible] = useState(false);

  const postCountText = useMemo(() => {
    if (posts.length === 0) return 'No posts yet';
    if (posts.length === 1) return '1 post';
    return `${posts.length} posts`;
  }, [posts.length]);

  const handleAddPost = (newPost: ForumPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  return (
    <ThemedView style={[styles.screen, { paddingTop: insets.top + 12 }]}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <ThemedText type="title">Community Forum</ThemedText>
          <ThemedText style={[styles.subText, { color: mutedTextColor }]}>
            {postCountText}
          </ThemedText>
        </View>

        <Pressable
          style={[styles.createButton, { backgroundColor: accentColor }]}
          onPress={() => setModalVisible(true)}>
          <ThemedText style={styles.createButtonText}>+ Create Post</ThemedText>
        </Pressable>
      </View>

      {posts.length === 0 ? (
        <View style={styles.emptyState}>
          <ThemedText style={styles.emptyIcon}>💬</ThemedText>
          <ThemedText type="subtitle">No posts yet</ThemedText>
          <ThemedText style={[styles.emptyText, { color: mutedTextColor }]}>
            Community posts will appear here once they are available.
          </ThemedText>

          <Pressable
            style={[
              styles.emptyActionButton,
              { backgroundColor: accentColor, borderColor },
            ]}
            onPress={() => setModalVisible(true)}>
            <ThemedText style={styles.emptyActionButtonText}>
              Create First Post
            </ThemedText>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ForumPostCard post={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      <CreatePostModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleAddPost}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  headerText: {
    flex: 1,
  },
  subText: {
    marginTop: 4,
    fontSize: 14,
  },
  createButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  createButtonText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  listContent: {
    paddingBottom: 32,
    gap: 12,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 24,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 4,
  },
  emptyText: {
    textAlign: 'center',
    lineHeight: 22,
  },
  emptyActionButton: {
    marginTop: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  emptyActionButtonText: {
    color: '#ffffff',
    fontWeight: '700',
  },
});