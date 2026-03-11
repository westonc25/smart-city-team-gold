/*
  Reusable forum feed component.

  Keeps post list rendering separated from the main screen so the screen can stay
  focused on control logic while the feed handles list display.
*/

import { ForumPostCard } from '@/components/forum/ForumPostCard';
import { ForumPost } from '@/types/forum';
import { FlatList, StyleSheet } from 'react-native';

type ForumFeedProps = {
  posts: ForumPost[];
  onAddComment: (postId: string, commentText: string) => void;
};

export function ForumFeed({ posts, onAddComment }: ForumFeedProps) {
  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        // Each post is rendered through ForumPostCard so comment UI
        // and per post interactions stay in the card component
        <ForumPostCard post={item} onAddComment={onAddComment} />
      )}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 32,
  },
});