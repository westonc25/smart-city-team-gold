import { forumMockPosts } from '@/data/forumMockData';
import { ForumComment, ForumPost } from '@/types/forum';
import React, { createContext, useContext, useMemo, useState } from 'react';

type ForumContextType = {
  posts: ForumPost[];
  addComment: (postId: string, commentText: string) => void;
  addPost: (newPost: ForumPost) => void;
};

const ForumContext = createContext<ForumContextType | undefined>(undefined);

export function ForumProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<ForumPost[]>(forumMockPosts);

  const addComment = (postId: string, commentText: string) => {
    const trimmed = commentText.trim();
    if (!trimmed) return;

    const newComment: ForumComment = {
      id: Date.now().toString(),
      author: 'Resident User',
      content: trimmed,
      createdAt: 'Just now',
    };

    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [...(post.comments ?? []), newComment],
            }
          : post
      )
    );
  };

  const addPost = (newPost: ForumPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  const value = useMemo(
    () => ({
      posts,
      addComment,
      addPost,
    }),
    [posts]
  );

  return <ForumContext.Provider value={value}>{children}</ForumContext.Provider>;
}

export function useForum() {
  const context = useContext(ForumContext);
  if (!context) {
    throw new Error('useForum must be used within a ForumProvider');
  }
  return context;
}