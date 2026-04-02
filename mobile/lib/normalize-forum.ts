import { ForumCategory, ForumPost } from '@/types/forum';

const FORUM_CATEGORIES: ForumCategory[] = [
  'General',
  'Events',
  'Safety',
  'Question',
];

const toForumCategory = (value: string): ForumCategory => {
  const match = FORUM_CATEGORIES.find((c) => c.toLowerCase() === value.toLowerCase());
  return match ?? 'General';
};

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === 'object' && value !== null;

const pickString = (obj: UnknownRecord, ...keys: string[]): string | undefined => {
  for (const key of keys) {
    const v = obj[key];
    if (typeof v === 'string' && v.length > 0) {
      return v;
    }
    if (typeof v === 'number' && Number.isFinite(v)) {
      return String(v);
    }
  }
  return undefined;
};

/**
 * Maps assorted backend shapes into ForumPost when fields are present (camelCase or snake_case).
 */
export const normalizeForumPost = (raw: unknown): ForumPost | null => {
  if (!isRecord(raw)) return null;

  const id = pickString(raw, 'id', 'post_id', 'postId');
  const title = pickString(raw, 'title');
  const content = pickString(raw, 'content', 'body', 'text');
  const author = pickString(raw, 'author', 'username', 'user_name', 'displayName') ?? 'Unknown';
  const categoryRaw = pickString(raw, 'category', 'tag') ?? 'General';
  const createdAt =
    pickString(raw, 'createdAt', 'created_at', 'timestamp') ?? '';

  if (!id || !title || !content) return null;

  const latRaw = raw.latitude ?? raw.lat;
  const lngRaw = raw.longitude ?? raw.lng ?? raw.lon;
  const latitude =
    typeof latRaw === 'number' && Number.isFinite(latRaw) ? latRaw : undefined;
  const longitude =
    typeof lngRaw === 'number' && Number.isFinite(lngRaw) ? lngRaw : undefined;

  const commentsRaw = raw.comments;
  const comments = Array.isArray(commentsRaw)
    ? commentsRaw
        .map((c, index) => {
          if (!isRecord(c)) return null;
          const cid = pickString(c, 'id', 'comment_id') ?? `c-${index}`;
          const cAuthor =
            pickString(c, 'author', 'username') ?? 'Unknown';
          const cContent = pickString(c, 'content', 'body', 'text');
          const cCreated =
            pickString(c, 'createdAt', 'created_at') ?? '';
          if (!cContent) return null;
          return {
            id: cid,
            author: cAuthor,
            content: cContent,
            createdAt: cCreated,
          };
        })
        .filter((c): c is NonNullable<typeof c> => c !== null)
    : undefined;

  return {
    id,
    author,
    title,
    content,
    category: toForumCategory(categoryRaw),
    createdAt,
    comments: comments && comments.length > 0 ? comments : undefined,
    latitude,
    longitude,
  };
};

export const normalizeForumPostList = (raw: unknown): ForumPost[] => {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => normalizeForumPost(item))
    .filter((p): p is ForumPost => p !== null);
};
