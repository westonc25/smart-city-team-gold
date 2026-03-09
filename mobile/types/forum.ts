export type ForumCategory = 'General' | 'Events' | 'Safety' | 'Question';

export type ForumPost = {
  id: string;
  author: string;
  title: string;
  content: string;
  category: ForumCategory;
  createdAt: string;
};