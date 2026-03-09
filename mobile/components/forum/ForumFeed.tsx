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