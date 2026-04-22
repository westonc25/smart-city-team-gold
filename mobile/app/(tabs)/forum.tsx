/*
  Current implementation uses local mock data so the UI can be
  developed and tested before backend integration.

  Backend team will replace mock/local create post and add comment flows
  with real API calls and forum data.
*/

import * as Location from 'expo-location';
import { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CreatePostModal } from '@/components/forum/CreatePostModal';
import { ForumFeed } from '@/components/forum/ForumFeed';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { forumMockPosts } from '@/data/forumMockData';
import { useThemeColor } from '@/hooks/use-theme-color';
import { normalizeForumPost, normalizeForumPostList } from '@/lib/normalize-forum';
import { ForumService } from '@/services/forum';
import { ForumPost } from '@/types/forum';

const extractPostArray = (data: unknown): unknown[] => {
  if (Array.isArray(data)) return data;
  if (typeof data === 'object' && data !== null && 'data' in data) {
    const inner = (data as { data: unknown }).data;
    if (Array.isArray(inner)) return inner;
  }
  if (typeof data === 'object' && data !== null && 'posts' in data) {
    const inner = (data as { posts: unknown }).posts;
    if (Array.isArray(inner)) return inner;
  }
  return [];
};

export default function ForumScreen() {
  const insets = useSafeAreaInsets();

  // Theme aware colors so the forum screen matches the rest of the app
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

  /*
    TEMPORARY FRONTEND STATE:
    Posts currently come from local mock data so the forum UI can be tested
    before backend forum endpoints are connected 

    BACKEND INTEGRATION:
    Replace the mock data source with posts fetched from the backend.
  */
  const [posts, setPosts] = useState<ForumPost[]>(forumMockPosts);

  // Controls the visibility of the create post bottom sheet.
  const [modalVisible, setModalVisible] = useState(false);

  // Label shown under the page title.
  const postCountText = useMemo(() => {
    if (posts.length === 0) return 'No posts yet';
    if (posts.length === 1) return '1 post';
    return `${posts.length} posts`;
  }, [posts.length]);

  // Fetches posts from the backend on screen load and populates ForumContext.
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data: unknown = await ForumService.getPosts();
        const rawList = extractPostArray(data);
        const normalized = normalizeForumPostList(rawList);
        replacePosts(normalized);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
        replacePosts([]);
      }
    };

    fetchPosts();
  }, [replacePosts]);

  // Sends the new post to the backend, then adds the saved post to context.
  // The backend attaches the user's current location using their session.
  const handleAddPost = async (newPost: ForumPost) => {
    try {
      const data = await ForumService.createPost(
        newPost.title,
        newPost.content,
        newPost.category
      );
      const savedPost = normalizeForumPost(data.post);
      addPost(savedPost ?? newPost);
    } catch (error: any) {
      Alert.alert('Failed to create post', error.message);
    }
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
        /*
          ForumFeed is separated from the screen so feed rendering is easier to 
          replace/update when we add the backend data 
        */
        <ForumFeed posts={posts} onAddComment={handleAddComment} />
      )}

      {/* Create post UI is in its own component for easier maintenance. */}
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