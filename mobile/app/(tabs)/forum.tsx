/*
  Current implementation uses shared forum context so the UI can be
  developed and tested before backend integration.

  Backend team can later replace context-backed create post flows
  with real API calls and forum data.
*/

import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CreatePostModal } from '@/components/forum/CreatePostModal';
import { ForumFeed } from '@/components/forum/ForumFeed';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useForum } from '@/context/ForumContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import { ForumPost } from '@/types/forum';

export default function ForumScreen() {
  const insets = useSafeAreaInsets();
  const { posts, addPost } = useForum();

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

  // Controls the visibility of the create post bottom sheet.
  const [modalVisible, setModalVisible] = useState(false);

  // Label shown under the page title.
  const postCountText = useMemo(() => {
    if (posts.length === 0) return 'No posts yet';
    if (posts.length === 1) return '1 post';
    return `${posts.length} posts`;
  }, [posts.length]);

  /*
    CURRENT BEHAVIOR:
    Adds a newly created post to shared forum state so it appears at the top
    of the feed and is visible across forum screens.

    BACKEND INTEGRATION:
    This can later call a POST endpoint and store the saved post
    returned by the backend.
  */
  const handleAddPost = (newPost: ForumPost) => {
    addPost(newPost);
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
        <ForumFeed posts={posts} />
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