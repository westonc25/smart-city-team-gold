/*
  TEMPORARY MOCK DATA:

  Used for frontend development before backend forum endpoints are connected.

  BACKEND INTEGRATION:
  Replace this file with real data fetched from the backend.
*/

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
    comments: [
      {
        id: 'c1',
        author: 'Maya Chen',
        content: 'I noticed this too near the corner by the pharmacy.',
        createdAt: '1h ago',
      },
      {
        id: 'c2',
        author: 'Jordan Smith',
        content: 'We should probably report it through the city office tomorrow.',
        createdAt: '45m ago',
      },
    ],

    // location fields for map/forum integration (not sure how yall wanna set this up but including for completeness)
    latitude: 36.8508,
    longitude: -76.2859,

    upvotes: 7,
    downvotes: 1,
    userVote: null,
  },
  {
    id: '2',
    author: 'Maya Chen',
    title: 'Community clean up this Saturday',
    content:
      'We are meeting at 9 AM at the central park entrance for a neighborhood clean up. Everyone is welcome.',
    category: 'Events',
    createdAt: '5h ago',
    comments: [
      {
        id: 'c3',
        author: 'Alex Johnson',
        content: "I'll be there. Are gloves and trash bags provided?",
        createdAt: '3h ago',
      },
    ],

    latitude: 36.8525,
    longitude: -76.2891,

    upvotes: 14,
    downvotes: 0,
    userVote: null,
  },
  {
    id: '3',
    author: 'Jordan Smith',
    title: 'Any updates on the new bike lanes?',
    content:
      'I heard the city was planning to expand bike lanes downtown. Does anyone know the timeline?',
    category: 'Question',
    createdAt: '1d ago',
    comments: [],

    latitude: 36.8468,
    longitude: -76.2920,

    upvotes: 3,
    downvotes: 2,
    userVote: null,
  },
];