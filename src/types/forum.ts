
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
  categoryId: string;
}

export interface ForumCategory {
  id: string;
  name: string;
  description: string;
  threadCount: number;
  recentThreads: ForumThread[];
}

// API response types for Supabase
export interface ForumCategoryResponse {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface ForumThreadResponse {
  id: string;
  title: string;
  content: string;
  author_id: string;
  created_at: string;
  updated_at: string;
  tags: ForumTagType[];
  status: ThreadStatus;
  view_count: number;
  upvotes: number;
  category_id: string;
  game_name: string | null;
  attachments: string[] | null;
  last_activity: string;
  is_edited: boolean;
}

export interface ThreadCommentResponse {
  id: string;
  thread_id: string;
  content: string;
  author_id: string;
  created_at: string;
  updated_at: string;
  upvotes: number;
  attachments: string[] | null;
  is_edited: boolean;
  parent_comment_id: string | null;
  is_reported: boolean;
}
