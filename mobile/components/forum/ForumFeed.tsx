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
  /** Current user latitude (forwarded to each card for distance display). */
  userLat?: number;
  /** Current user longitude (forwarded to each card for distance display). */
  userLon?: number;
};

export function ForumFeed({ posts, userLat, userLon }: ForumFeedProps) {
  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ForumPostCard post={item} userLat={userLat} userLon={userLon} />
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