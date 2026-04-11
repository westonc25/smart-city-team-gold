/*
  Shared forum types.

  These types are used by the forum UI and can change depending on the backend implementation.

  Latitude/longitude fields are included to support posts being tied to map pins/locations. 
  (Not sure how yall wanna set this up but including for completeness)
*/

export type ForumCategory = 'General' | 'Events' | 'Safety' | 'Question';

export type ForumComment = {
  id: string;
  author: string;
  content: string;
  createdAt: string;
};

export type VoteDirection = 'up' | 'down' | null;

export type ForumPost = {
  id: string;
  author: string;
  title: string;
  content: string;
  category: ForumCategory;
  createdAt: string;
  imageUri?: string;

  // Comments can either be populated directly with the post
  // or fetched separately by post id later.
  comments?: ForumComment[];

  // Location data for map linked forum posts.
  latitude?: number;
  longitude?: number;

  // Voting — tracks community engagement on each post.
  upvotes: number;
  downvotes: number;
  /** The current user's vote on this post (null = no vote). */
  userVote: VoteDirection;
};