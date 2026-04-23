export type UserPost = {
  id: string;
  title: string;
  category: string;
  createdAt: string;
  likes: number;
  comments: number;
};

export type ProfileFormData = {
  name: string;
  email: string;
  password: string;
  notificationsEnabled: boolean;
  profileImageUri: string | null;
};

export const mockUserProfile: ProfileFormData = {
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123',
  notificationsEnabled: true,
  profileImageUri: null,
};

export const mockUserPosts: UserPost[] = [
  {
    id: '1',
    title: 'Road closure near downtown affecting commute',
    category: 'General',
    createdAt: '2 hours ago',
    likes: 14,
    comments: 5,
  },
  {
    id: '2',
    title: 'Best study friendly coffee spots in the city?',
    category: 'Question',
    createdAt: 'Yesterday',
    likes: 22,
    comments: 8,
  },
  {
    id: '3',
    title: 'Streetlight outage on Hampton Blvd',
    category: 'Safety',
    createdAt: '3 days ago',
    likes: 9,
    comments: 2,
  },
];