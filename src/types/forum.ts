
export interface ForumThread {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  upvoteCount: number;
  status: 'normal' | 'sticky' | 'closed' | 'archived';
  categoryId: string;
  tags?: string[];
  attachments?: string[];
}

export interface ForumCategory {
  id: string;
  name: string;
  description: string;
  threadCount: number;
  recentThreads?: ForumThread[];
}
