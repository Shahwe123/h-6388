
import { ForumCategory, ForumThread, ThreadComment, ForumUser } from '@/types/forum';

// Mock users for the forum
export const mockForumUsers: ForumUser[] = [
  {
    id: '1',
    username: 'PlatinumHunter',
    avatarUrl: 'https://i.pravatar.cc/150?img=1',
    rank: 'Trophy Master',
    level: 42,
    badgeCount: 15,
    trophyCount: 127,
    joinDate: '2022-03-15T12:00:00Z',
    isAdmin: true
  },
  {
    id: '2',
    username: 'EldenLord',
    avatarUrl: 'https://i.pravatar.cc/150?img=2',
    rank: 'Trophy Hunter',
    level: 36,
    badgeCount: 12,
    trophyCount: 98,
    joinDate: '2022-06-22T14:30:00Z',
    isModerator: true
  },
  {
    id: '3',
    username: 'GamerX',
    avatarUrl: 'https://i.pravatar.cc/150?img=3',
    rank: 'Completionist',
    level: 28,
    badgeCount: 7,
    trophyCount: 65,
    joinDate: '2022-09-10T09:15:00Z'
  },
  {
    id: '4',
    username: 'TrophyCollector',
    avatarUrl: 'https://i.pravatar.cc/150?img=4',
    rank: 'Achievement Hunter',
    level: 31,
    badgeCount: 9,
    trophyCount: 82,
    joinDate: '2022-08-05T16:45:00Z'
  },
  {
    id: '5',
    username: 'SpeedRunner',
    avatarUrl: 'https://i.pravatar.cc/150?img=5',
    rank: 'Elite Gamer',
    level: 35,
    badgeCount: 11,
    trophyCount: 91,
    joinDate: '2022-07-18T11:20:00Z'
  }
];

// Mock forum threads
export const mockForumThreads: ForumThread[] = [
  {
    id: '1',
    title: 'Elden Ring Platinum Trophy Guide',
    content: 'Here\'s a comprehensive guide for getting the platinum trophy in Elden Ring. The key is to focus on collecting all the unique weapons first...',
    authorId: '1',
    author: mockForumUsers[0],
    createdAt: '2023-11-10T14:32:00Z',
    tags: ['Guide'],
    status: 'sticky',
    viewCount: 3452,
    upvotes: 287,
    userHasUpvoted: true,
    commentCount: 42,
    isBookmarked: true,
    gameName: 'Elden Ring',
    lastActivity: '2023-12-01T09:45:00Z',
    categoryId: '1'
  },
  {
    id: '2',
    title: 'Need help with Malenia boss fight',
    content: 'I\'ve been stuck on Malenia for days. Any tips or strategies that worked for you? I\'m running a strength build with the Greatsword...',
    authorId: '3',
    author: mockForumUsers[2],
    createdAt: '2023-11-28T19:15:00Z',
    tags: ['Help'],
    status: 'normal',
    viewCount: 1247,
    upvotes: 43,
    commentCount: 31,
    gameName: 'Elden Ring',
    lastActivity: '2023-11-30T22:10:00Z',
    categoryId: '2'
  },
  {
    id: '3',
    title: 'Just got my 100th platinum trophy!',
    content: 'After 5 years of trophy hunting, I\'ve finally reached 100 platinum trophies! Here\'s my top 10 favorite platinums and why I enjoyed them...',
    authorId: '4',
    author: mockForumUsers[3],
    createdAt: '2023-11-25T11:20:00Z',
    tags: ['Flex'],
    status: 'normal',
    viewCount: 892,
    upvotes: 156,
    commentCount: 27,
    attachments: ['https://placehold.co/600x400/png'],
    lastActivity: '2023-11-29T16:30:00Z',
    categoryId: '1'
  },
  {
    id: '4',
    title: 'Weekly Challenge: Complete Bloodborne with no healing items',
    content: 'This week\'s challenge is to complete Bloodborne without using any blood vials. Post your screenshots and completion time to enter!',
    authorId: '2',
    author: mockForumUsers[1],
    createdAt: '2023-11-27T08:45:00Z',
    tags: ['Challenge'],
    status: 'normal',
    viewCount: 678,
    upvotes: 89,
    commentCount: 18,
    gameName: 'Bloodborne',
    lastActivity: '2023-11-30T14:20:00Z',
    categoryId: '3'
  },
  {
    id: '5',
    title: 'Which trophy was the most satisfying to get?',
    content: 'Everyone has that one trophy that felt amazing to finally unlock. For me it was defeating Sigrun in God of War. What\'s yours?',
    authorId: '5',
    author: mockForumUsers[4],
    createdAt: '2023-11-26T15:30:00Z',
    tags: ['Discussion'],
    status: 'normal',
    viewCount: 1123,
    upvotes: 94,
    commentCount: 52,
    lastActivity: '2023-11-30T18:45:00Z',
    categoryId: '4'
  }
];

// Mock thread comments
export const mockThreadComments: ThreadComment[] = [
  {
    id: '1',
    threadId: '1',
    content: 'This guide is amazing! I was struggling with the legendary armaments trophy, but following this made it much easier.',
    authorId: '3',
    author: mockForumUsers[2],
    createdAt: '2023-11-10T16:45:00Z',
    upvotes: 24,
    userHasUpvoted: true
  },
  {
    id: '2',
    threadId: '1',
    content: 'You might want to add that you need to complete Ranni\'s questline for one of the endings. Many players miss that.',
    authorId: '2',
    author: mockForumUsers[1],
    createdAt: '2023-11-11T09:30:00Z',
    upvotes: 18
  },
  {
    id: '3',
    threadId: '2',
    content: 'For Malenia, try using Mimic Tear ash summon and Rivers of Blood. The bleed effect works really well against her.',
    authorId: '1',
    author: mockForumUsers[0],
    createdAt: '2023-11-28T20:05:00Z',
    upvotes: 31,
    userHasUpvoted: true
  },
  {
    id: '4',
    threadId: '2',
    content: 'Frost weapons are also effective. I used the Icerind Hatchet with its special attack to keep distance.',
    authorId: '5',
    author: mockForumUsers[4],
    createdAt: '2023-11-29T11:10:00Z',
    upvotes: 15
  },
  {
    id: '5',
    threadId: '3',
    content: 'Congratulations! That\'s an amazing achievement. What was the hardest platinum for you?',
    authorId: '3',
    author: mockForumUsers[2],
    createdAt: '2023-11-25T12:35:00Z',
    upvotes: 8
  }
];

// Mock forum categories
export const mockForumCategories: ForumCategory[] = [
  {
    id: '1',
    name: 'Trophy Hunting',
    description: 'Discussions and guides for trophy hunting across all platforms',
    threadCount: 342,
    recentThreads: [mockForumThreads[0], mockForumThreads[2]]
  },
  {
    id: '2',
    name: 'Game Specific',
    description: 'Forums dedicated to specific games and their achievements',
    threadCount: 567,
    recentThreads: [mockForumThreads[1], mockForumThreads[3]]
  },
  {
    id: '3',
    name: 'Community Challenges',
    description: 'Weekly and monthly challenges for the community',
    threadCount: 124,
    recentThreads: [mockForumThreads[3]]
  },
  {
    id: '4',
    name: 'Tips & Strategies',
    description: 'Share your best gameplay tips and strategies',
    threadCount: 289,
    recentThreads: [mockForumThreads[4]]
  },
  {
    id: '5',
    name: 'Technical Support',
    description: 'Get help with technical issues and bugs',
    threadCount: 156,
    recentThreads: []
  }
];

// Helper function to get a thread by ID
export const getThreadById = (threadId: string): ForumThread | undefined => {
  return mockForumThreads.find(thread => thread.id === threadId);
};

// Helper function to get comments for a specific thread
export const getCommentsByThreadId = (threadId: string): ThreadComment[] => {
  return mockThreadComments.filter(comment => comment.threadId === threadId);
};

// Helper function to get a user by ID
export const getUserById = (userId: string): ForumUser | undefined => {
  return mockForumUsers.find(user => user.id === userId);
};
