/*
  Reusable card for displaying a single forum post.

  This component renders post content, expands/collapse comments, and
  allows comment input for that specific post

  Backend team will replace local comment creation flow with real API backed comment creation
*/

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { ForumPost } from '@/types/forum';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

type ForumPostCardProps = {
  post: ForumPost;
  onAddComment: (postId: string, commentText: string) => void;
};

export function ForumPostCard({ post, onAddComment }: ForumPostCardProps) {
  // Controls whether this post currently shows its comments section.
  const [showComments, setShowComments] = useState(false);

  // Local input state for adding a comment to this specific post.
  const [commentText, setCommentText] = useState('');

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
  const inputBg = useThemeColor(
    { light: '#f9fafb', dark: '#1f2937' },
    'background'
  );

  // Handles cases where comments may not exist yet.
  const commentCount = post.comments?.length ?? 0;

  /*
    CURRENT BEHAVIOR:
    Sends trimmed comment text upward to ForumScreen, which updates local state.

    BACKEND INTEGRATION:
    This flow should eventually create the comment through the backend
    for the current post id.
  */
  const handleSubmitComment = () => {
    const trimmed = commentText.trim();
    if (!trimmed) return;

    onAddComment(post.id, trimmed);
    setCommentText('');
    setShowComments(true);
  };

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

      <View style={styles.actionRow}>
        <Pressable onPress={() => setShowComments((prev) => !prev)}>
          <ThemedText style={[styles.actionText, { color: accentColor }]}>
            {showComments ? 'Hide comments' : `View comments (${commentCount})`}
          </ThemedText>
        </Pressable>
      </View>

      {/* Comments render only when expanded so the default feed stays cleaner. */}
      {showComments && (
        <View style={styles.commentsSection}>
          {commentCount === 0 ? (
            <ThemedText style={[styles.noCommentsText, { color: mutedTextColor }]}>
              No comments yet.
            </ThemedText>
          ) : (
            post.comments?.map((comment) => (
              <View key={comment.id} style={[styles.commentCard, { borderColor }]}>
                <ThemedText style={styles.commentAuthor}>
                  {comment.author}
                </ThemedText>
                <ThemedText style={styles.commentContent}>
                  {comment.content}
                </ThemedText>
                <ThemedText style={[styles.commentTime, { color: mutedTextColor }]}>
                  {comment.createdAt}
                </ThemedText>
              </View>
            ))
          )}

          {/* Inline comment input for this post only. */}
          <View style={styles.commentInputRow}>
            <TextInput
              value={commentText}
              onChangeText={setCommentText}
              placeholder="Write a comment..."
              placeholderTextColor={mutedTextColor}
              style={[
                styles.commentInput,
                {
                  borderColor,
                  backgroundColor: inputBg,
                },
              ]}
            />
            <Pressable
              style={[styles.commentButton, { backgroundColor: accentColor }]}
              onPress={handleSubmitComment}>
              <ThemedText style={styles.commentButtonText}>Post</ThemedText>
            </Pressable>
          </View>
        </View>
      )}
    </ThemedView>
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
  footer: {
    marginTop: 4,
  },
  authorText: {
    fontSize: 13,
  },
  actionRow: {
    marginTop: 4,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  commentsSection: {
    marginTop: 8,
    gap: 8,
  },
  noCommentsText: {
    fontSize: 14,
  },
  commentCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    gap: 4,
  },
  commentAuthor: {
    fontSize: 13,
    fontWeight: '700',
  },
  commentContent: {
    fontSize: 14,
    lineHeight: 20,
  },
  commentTime: {
    fontSize: 12,
  },
  commentInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  commentButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  commentButtonText: {
    color: '#ffffff',
    fontWeight: '700',
  },
});