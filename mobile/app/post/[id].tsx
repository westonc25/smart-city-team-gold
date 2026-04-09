import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  EmitterSubscription,
  Keyboard,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useForum } from '@/context/ForumContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import { ForumComment } from '@/types/forum';

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);

  const { posts, addComment } = useForum();
  const post = posts.find((p) => p.id === id);

  const [commentText, setCommentText] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [inputRowHeight, setInputRowHeight] = useState(80);

  const borderColor = useThemeColor({ light: '#e5e7eb', dark: '#2a2f37' }, 'text');
  const mutedTextColor = useThemeColor({ light: '#6b7280', dark: '#9ca3af' }, 'text');
  const accentColor = useThemeColor({ light: '#0a7ea4', dark: '#4FC3F7' }, 'tint');
  const badgeBg = useThemeColor({ light: '#eaf6fb', dark: '#12303b' }, 'background');
  const inputBg = useThemeColor({ light: '#f9fafb', dark: '#1f2937' }, 'background');
  const textColor = useThemeColor({ light: '#11181C', dark: '#ECEDEE' }, 'text');

  useEffect(() => {
    let showSub: EmitterSubscription;
    let hideSub: EmitterSubscription;

    if (Platform.OS === 'ios') {
      showSub = Keyboard.addListener('keyboardWillShow', (e) => {
        setKeyboardHeight(e.endCoordinates.height);
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 50);
      });

      hideSub = Keyboard.addListener('keyboardWillHide', () => {
        setKeyboardHeight(0);
      });
    } else {
      showSub = Keyboard.addListener('keyboardDidShow', (e) => {
        setKeyboardHeight(e.endCoordinates.height);
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 50);
      });

      hideSub = Keyboard.addListener('keyboardDidHide', () => {
        setKeyboardHeight(0);
      });
    }

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const handleAddComment = () => {
    const trimmed = commentText.trim();
    if (!trimmed || !post) return;

    const newComment: ForumComment = {
      id: Date.now().toString(),
      author: 'Resident User',
      content: trimmed,
      createdAt: 'Just now',
    };

    addComment(post.id, newComment);
    setCommentText('');

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleInputFocus = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 200);
  };

  if (!post) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText>Loading post...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <View style={styles.headerBar}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <ThemedText style={[styles.backText, { color: accentColor }]}>
              ← Back to Feed
            </ThemedText>
          </Pressable>
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: inputRowHeight + keyboardHeight + 24 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View
            style={[
              styles.postHeader,
              { borderBottomColor: borderColor, borderBottomWidth: 1 },
            ]}
          >
            <View style={styles.row}>
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
            <ThemedText style={[styles.authorText, { color: mutedTextColor }]}>
              Posted by {post.author}
            </ThemedText>
          </View>

          <View style={styles.commentsSection}>
            <ThemedText style={styles.commentsTitle}>
              Comments ({post.comments?.length ?? 0})
            </ThemedText>

            {!post.comments || post.comments.length === 0 ? (
              <ThemedText style={[styles.noCommentsText, { color: mutedTextColor }]}>
                No comments yet. Be the first to reply!
              </ThemedText>
            ) : (
              post.comments.map((comment) => (
                <View key={comment.id} style={[styles.commentCard, { borderColor }]}>
                  <ThemedText style={styles.commentAuthor}>{comment.author}</ThemedText>
                  <ThemedText style={styles.commentContent}>{comment.content}</ThemedText>
                  <ThemedText style={[styles.commentTime, { color: mutedTextColor }]}>
                    {comment.createdAt}
                  </ThemedText>
                </View>
              ))
            )}
          </View>
        </ScrollView>

        <View
          onLayout={(event) => {
            setInputRowHeight(event.nativeEvent.layout.height);
          }}
          style={[
            styles.commentInputRow,
            {
              borderTopColor: borderColor,
              backgroundColor: inputBg,
              bottom: keyboardHeight,
            },
          ]}
        >
          <TextInput
            value={commentText}
            onChangeText={setCommentText}
            onFocus={handleInputFocus}
            placeholder="Write a comment..."
            placeholderTextColor={mutedTextColor}
            style={[
              styles.commentInput,
              { borderColor, color: textColor, backgroundColor: inputBg },
            ]}
            returnKeyType="send"
            onSubmitEditing={handleAddComment}
            blurOnSubmit={false}
          />
          <Pressable
            style={[styles.commentButton, { backgroundColor: accentColor }]}
            onPress={handleAddComment}
          >
            <ThemedText style={styles.commentButtonText}>Post</ThemedText>
          </Pressable>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBar: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backButton: {
    paddingVertical: 8,
  },
  backText: {
    fontSize: 16,
    fontWeight: '600',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  postHeader: {
    padding: 16,
    gap: 12,
  },
  row: {
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
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 28,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.9,
  },
  authorText: {
    fontSize: 14,
    marginTop: 4,
  },
  commentsSection: {
    padding: 16,
    gap: 12,
  },
  commentsTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  noCommentsText: {
    fontSize: 15,
    fontStyle: 'italic',
  },
  commentCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    gap: 4,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '700',
  },
  commentContent: {
    fontSize: 15,
    lineHeight: 22,
  },
  commentTime: {
    fontSize: 12,
    marginTop: 2,
  },
  commentInputRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 8,
    borderTopWidth: 1,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
  },
  commentButton: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  commentButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
  },
});