
export type ForumTagType = 'Guide' | 'Help' | 'Discussion' | 'Challenge' | 'Flex';

export type ThreadStatus = 'normal' | 'sticky' | 'closed' | 'archived';

export interface ForumUser {
  id: string;
  username: string;
  avatarUrl?: string;
  rank?: string;
  level?: number;
  badgeCount?: number;
  trophyCount?: number;
  joinDate?: string;
  isAdmin?: boolean;
  isModerator?: boolean;
}

export interface ThreadComment {
  id: string;
  threadId: string;
  content: string;
  authorId: string;
  author: ForumUser;
  createdAt: string;
  updatedAt?: string;
  upvotes: number;
  userHasUpvoted?: boolean;
  attachments?: string[];
  isEdited?: boolean;
  isReported?: boolean;
  parentCommentId?: string; // For replies to comments
  replyCount?: number;
}

export interface ForumThread {
  id: string;
  title: string;
  content: string;
  authorId: string;
  author: ForumUser;
  createdAt: string;
  updatedAt?: string;
  tags: ForumTagType[];
  status: ThreadStatus;
  viewCount: number;
  upvotes: number;
  userHasUpvoted?: boolean;
  commentCount: number;
  isBookmarked?: boolean;
  isReported?: boolean;
  gameName?: string;
  attachments?: string[];
  lastActivity: string;
  isEdited?: boolean;
}

export interface ForumCategory {
  id: string;
  name: string;
  description: string;
  threadCount: number;
  recentThreads: ForumThread[];
}
