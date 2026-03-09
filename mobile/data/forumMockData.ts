import { ForumPost } from '@/types/forum';

export const forumMockPosts: ForumPost[] = [
  {
    id: '1',
    author: 'Alex Johnson',
    title: 'Streetlight outage on Main St',
    content:
      'A few streetlights near Main St and 4th Ave were out last night. Has anyone else noticed this?',
    category: 'Safety',
    createdAt: '2h ago',
  },
  {
    id: '2',
    author: 'Maya Chen',
    title: 'Community clean up this Saturday',
    content:
      'We are meeting at 9 AM at the central park entrance for a neighborhood clean up. Everyone is welcome.',
    category: 'Events',
    createdAt: '5h ago',
  },
  {
    id: '3',
    author: 'Jordan Smith',
    title: 'Any updates on the new bike lanes?',
    content:
      'I heard the city was planning to expand bike lanes downtown. Does anyone know the timeline?',
    category: 'Question',
    createdAt: '1d ago',
  },
];