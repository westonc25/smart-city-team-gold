import { db } from "../db";

export const getPosts = async () => {
  return await db`
    SELECT p.post_id, p.user_id, p.title, p.content, p.latitude, p.longitude,
           p.location_name, p.category, p.is_validated, p.created_at,
           u.full_name as author_name
    FROM forum_post p
    JOIN users u ON p.user_id = u.userID
    WHERE p.is_deleted = 0
    ORDER BY p.created_at DESC
  `;
};

export const getPost = async ({ params }: { params: { id: string } }) => {
  const posts = await db`
    SELECT p.*, u.full_name as author_name
    FROM forum_post p
    JOIN users u ON p.user_id = u.userID
    WHERE p.post_id = ${params.id} AND p.is_deleted = 0
  `;
  if (!posts.length) return new Response("Post not found", { status: 404 });
  return posts[0];
};

export const createPost = async ({
  body,
}: {
  body: {
    user_id: number;
    title: string;
    content: string;
    latitude?: number;
    longitude?: number;
    location_name?: string;
    category?: string;
  };
}) => {
  await db`
    INSERT INTO forum_post (user_id, title, content, latitude, longitude, location_name, category, created_at, updated_at, is_deleted)
    VALUES (${body.user_id}, ${body.title}, ${body.content}, ${body.latitude ?? null}, ${body.longitude ?? null}, ${body.location_name ?? null}, ${body.category ?? null}, NOW(), NOW(), 0)
  `;
  return { success: true };
};

export const deletePost = async ({ params }: { params: { id: string } }) => {
  await db`UPDATE forum_post SET is_deleted = 1 WHERE post_id = ${params.id}`;
  return { success: true };
};

export const getComments = async ({ params }: { params: { id: string } }) => {
  return await db`
    SELECT c.comment_id, c.content, c.created_at, u.full_name as author_name
    FROM forum_comments c
    JOIN users u ON c.user_id = u.userID
    WHERE c.post_id = ${params.id} AND c.is_deleted = 0
    ORDER BY c.created_at ASC
  `;
};

export const createComment = async ({
  params,
  body,
}: {
  params: { id: string };
  body: { user_id: number; content: string };
}) => {
  await db`
    INSERT INTO forum_comments (post_id, user_id, content, created_at, updated_at, is_deleted)
    VALUES (${params.id}, ${body.user_id}, ${body.content}, NOW(), NOW(), 0)
  `;
  return { success: true };
};