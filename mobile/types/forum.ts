export type ForumCategory = 'General' | 'Events' | 'Safety' | 'Question';

export type ForumComment = {
  id: string;
  author: string;
  content: string;
  createdAt: string;
};

export type ForumPost = {
  id: string;
  author: string;
  title: string;
  content: string;
  category: ForumCategory;
  createdAt: string;
  comments?: ForumComment[];
};