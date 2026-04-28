import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  ReactNode,
} from 'react';
import { ForumPost, ForumComment, VoteDirection } from '@/types/forum';
import { forumMockPosts } from '@/data/forumMockData';
import { ForumService } from '@/services/forum';

type ForumContextType = {
  posts: ForumPost[];
  addPost: (post: ForumPost) => void;
  addComment: (postId: string, comment: ForumComment) => void;
  /** Replaces the in-memory list (e.g. after GET /forum/posts) so feed and post detail stay in sync. */
  replacePosts: (posts: ForumPost[]) => void;
  /** Loads the full comment list for a post into context (e.g. after GET /forum/posts/:id/comments). */
  setComments: (postId: string, comments: ForumComment[]) => void;
  /** Toggle the current user's vote on a post. Tapping the same direction again removes the vote. */
  votePost: (postId: string, direction: VoteDirection) => void;
};

const ForumContext = createContext<ForumContextType | undefined>(undefined);

export function ForumProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<ForumPost[]>(forumMockPosts);

  const addPost = (post: ForumPost) => {
    setPosts((prev) => [post, ...prev]);
  };

  const addComment = (postId: string, comment: ForumComment) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? { ...post, comments: [...(post.comments || []), comment] }
          : post
      )
    );
  };

  const replacePosts = useCallback((next: ForumPost[]) => {
    setPosts(next);
  }, []);

  const setComments = useCallback((postId: string, comments: ForumComment[]) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, comments } : post
      )
    );
  }, []);

  /**
   * Optimistically toggle a vote.
   *
   * If the user taps the same direction they already chose the vote is removed.
   * Otherwise the vote switches (or is newly cast).
   *
   * BACKEND INTEGRATION:
   * After the optimistic UI update, send a PATCH/POST to the backend so the vote
   * persists. If the request fails, roll back with setPosts(prev).
   */
  const votePost = useCallback(
    (postId: string, direction: VoteDirection) => {
      let newVote: VoteDirection = direction;
      let snapshot: ForumPost[] | null = null;

      setPosts((prev) => {
        snapshot = prev;
        return prev.map((post) => {
          if (post.id !== postId) return post;

          const prevVote = post.userVote;
          let { upvotes, downvotes } = post;

          if (prevVote === 'up') upvotes -= 1;
          if (prevVote === 'down') downvotes -= 1;

          newVote = prevVote === direction ? null : direction;
          if (newVote === 'up') upvotes += 1;
          if (newVote === 'down') downvotes += 1;

          return { ...post, upvotes, downvotes, userVote: newVote };
        });
      });

      ForumService.votePost(postId, newVote).catch(() => {
        if (snapshot) setPosts(snapshot);
      });
    },
    [],
  );

  return (
    <ForumContext.Provider value={{ posts, addPost, addComment, replacePosts, setComments, votePost }}>
      {children}
    </ForumContext.Provider>
  );
}

export function useForum() {
  const context = useContext(ForumContext);
  if (context === undefined) {
    throw new Error('useForum must be used within a ForumProvider');
  }
  return context;
}