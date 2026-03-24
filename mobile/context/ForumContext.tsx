import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ForumPost, ForumComment } from '@/types/forum';
import { forumMockPosts } from '@/data/forumMockData';

type ForumContextType = {
  posts: ForumPost[];
  addPost: (post: ForumPost) => void;
  addComment: (postId: string, comment: ForumComment) => void;
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

  return (
    <ForumContext.Provider value={{ posts, addPost, addComment }}>
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