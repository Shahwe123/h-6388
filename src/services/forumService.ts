import { supabase } from "@/integrations/supabase/client";
import { 
  ForumCategory, 
  ForumCategoryResponse, 
  ForumThread, 
  ForumThreadResponse, 
  ThreadComment, 
  ThreadCommentResponse,
  ForumUser,
  ForumTagType
} from "@/types/forum";

// User profile fetching function
export const fetchUserProfile = async (userId: string): Promise<ForumUser | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, avatar_url, created_at')
    .eq('id', userId)
    .single();
  
  if (error || !data) {
    console.error('Error fetching user profile:', error);
    return null;
  }
  
  // In a real app, you would fetch additional user data like rank, level, etc.
  return {
    id: data.id,
    username: data.username,
    avatarUrl: data.avatar_url,
    joinDate: data.created_at,
    // These would come from other tables in a real app
    rank: 'Novice',
    level: 1,
    badgeCount: 0,
    trophyCount: 0,
    isAdmin: false,
    isModerator: false
  };
};

// Helper to convert API response to ForumCategory
const mapCategoryResponse = async (category: ForumCategoryResponse): Promise<ForumCategory> => {
  // Get recent threads for this category
  const { data: threadsData } = await supabase
    .from('forum_threads')
    .select('*')
    .eq('category_id', category.id)
    .order('last_activity', { ascending: false })
    .limit(2);
    
  const recentThreads = threadsData ? await Promise.all(
    threadsData.map(thread => mapThreadResponse(thread as ForumThreadResponse))
  ) : [];
  
  // Count threads in this category
  const { count } = await supabase
    .from('forum_threads')
    .select('*', { count: 'exact', head: true })
    .eq('category_id', category.id);
  
  return {
    id: category.id,
    name: category.name,
    description: category.description,
    threadCount: count || 0,
    recentThreads
  };
};

// Helper to convert API response to ForumThread
const mapThreadResponse = async (thread: ForumThreadResponse): Promise<ForumThread> => {
  // Fetch author details
  const author = await fetchUserProfile(thread.author_id) || {
    id: thread.author_id,
    username: 'Unknown User'
  };
  
  // Count comments
  const { count } = await supabase
    .from('thread_comments')
    .select('*', { count: 'exact', head: true })
    .eq('thread_id', thread.id);
  
  // Check if current user has upvoted this thread
  let userHasUpvoted = false;
  const user = supabase.auth.getUser();
  if (user) {
    const { data } = await supabase.rpc('user_has_upvoted_thread', {
      thread_id: thread.id,
      user_id: (await user).data.user?.id
    });
    userHasUpvoted = !!data;
  }
  
  return {
    id: thread.id,
    title: thread.title,
    content: thread.content,
    authorId: thread.author_id,
    author,
    createdAt: thread.created_at,
    updatedAt: thread.updated_at,
    tags: thread.tags,
    status: thread.status,
    viewCount: thread.view_count,
    upvotes: thread.upvotes,
    userHasUpvoted,
    commentCount: count || 0,
    isBookmarked: false, // This would be fetched separately
    isReported: false, // This would be fetched separately
    gameName: thread.game_name || undefined,
    attachments: thread.attachments || [],
    lastActivity: thread.last_activity,
    isEdited: thread.is_edited,
    categoryId: thread.category_id
  };
};

// Helper to convert API response to ThreadComment
const mapCommentResponse = async (comment: ThreadCommentResponse): Promise<ThreadComment> => {
  // Fetch author details
  const author = await fetchUserProfile(comment.author_id) || {
    id: comment.author_id,
    username: 'Unknown User'
  };
  
  // Check if current user has upvoted this comment
  let userHasUpvoted = false;
  const user = supabase.auth.getUser();
  if (user) {
    const { data } = await supabase.rpc('user_has_upvoted_comment', {
      comment_id: comment.id,
      user_id: (await user).data.user?.id
    });
    userHasUpvoted = !!data;
  }
  
  // Count replies
  let replyCount = 0;
  if (!comment.parent_comment_id) {
    const { count } = await supabase
      .from('thread_comments')
      .select('*', { count: 'exact', head: true })
      .eq('parent_comment_id', comment.id);
    replyCount = count || 0;
  }
  
  return {
    id: comment.id,
    threadId: comment.thread_id,
    content: comment.content,
    authorId: comment.author_id,
    author,
    createdAt: comment.created_at,
    updatedAt: comment.updated_at,
    upvotes: comment.upvotes,
    userHasUpvoted,
    attachments: comment.attachments || [],
    isEdited: comment.is_edited,
    isReported: comment.is_reported,
    parentCommentId: comment.parent_comment_id || undefined,
    replyCount
  };
};

// Forum API operations
export const forumService = {
  // Categories
  async getCategories(): Promise<ForumCategory[]> {
    const { data, error } = await supabase
      .from('forum_categories')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
    
    return Promise.all(data.map(category => 
      mapCategoryResponse(category as ForumCategoryResponse)
    ));
  },
  
  async getCategory(id: string): Promise<ForumCategory | null> {
    const { data, error } = await supabase
      .from('forum_categories')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) {
      console.error('Error fetching category:', error);
      return null;
    }
    
    return mapCategoryResponse(data as ForumCategoryResponse);
  },
  
  // Threads
  async getThreads(options: {
    categoryId?: string;
    sortBy?: 'recent' | 'trending';
    limit?: number;
  } = {}): Promise<ForumThread[]> {
    let query = supabase
      .from('forum_threads')
      .select('*');
    
    if (options.categoryId) {
      query = query.eq('category_id', options.categoryId);
    }
    
    if (options.sortBy === 'trending') {
      query = query.order('upvotes', { ascending: false });
    } else {
      query = query.order('last_activity', { ascending: false });
    }
    
    if (options.limit) {
      query = query.limit(options.limit);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching threads:', error);
      return [];
    }
    
    return Promise.all(data.map(thread => 
      mapThreadResponse(thread as ForumThreadResponse)
    ));
  },
  
  async getThread(id: string): Promise<ForumThread | null> {
    // First, increment view count using a raw SQL query instead of RPC
    await supabase.from('forum_threads')
      .update({ view_count: () => 'view_count + 1' })
      .eq('id', id)
    
    const { data, error } = await supabase
      .from('forum_threads')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) {
      console.error('Error fetching thread:', error);
      return null;
    }
    
    return mapThreadResponse(data as ForumThreadResponse);
  },
  
  async createThread(threadData: {
    title: string;
    content: string;
    tags: ForumTagType[];
    categoryId: string;
    gameName?: string;
    attachments?: string[];
  }): Promise<ForumThread | null> {
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
      console.error('User must be logged in to create a thread');
      return null;
    }
    
    const { data, error } = await supabase
      .from('forum_threads')
      .insert({
        title: threadData.title,
        content: threadData.content,
        tags: threadData.tags as unknown as string[],
        category_id: threadData.categoryId,
        author_id: user.data.user.id,
        game_name: threadData.gameName || null,
        attachments: threadData.attachments || null,
        status: 'normal',
        view_count: 0,
        upvotes: 0,
        last_activity: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error || !data) {
      console.error('Error creating thread:', error);
      return null;
    }
    
    return mapThreadResponse(data as ForumThreadResponse);
  },
  
  // Comments
  async getComments(threadId: string, parentCommentId?: string): Promise<ThreadComment[]> {
    let query = supabase
      .from('thread_comments')
      .select('*')
      .eq('thread_id', threadId)
      .order('created_at');
    
    if (parentCommentId) {
      query = query.eq('parent_comment_id', parentCommentId);
    } else {
      query = query.is('parent_comment_id', null);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
    
    return Promise.all(data.map(comment => 
      mapCommentResponse(comment as ThreadCommentResponse)
    ));
  },
  
  async createComment(commentData: {
    threadId: string;
    content: string;
    parentCommentId?: string;
    attachments?: string[];
  }): Promise<ThreadComment | null> {
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
      console.error('User must be logged in to create a comment');
      return null;
    }
    
    const { data, error } = await supabase
      .from('thread_comments')
      .insert({
        thread_id: commentData.threadId,
        content: commentData.content,
        author_id: user.data.user.id,
        parent_comment_id: commentData.parentCommentId || null,
        attachments: commentData.attachments || null,
        upvotes: 0
      })
      .select()
      .single();
    
    if (error || !data) {
      console.error('Error creating comment:', error);
      return null;
    }
    
    // Update last_activity on the thread
    await supabase
      .from('forum_threads')
      .update({ last_activity: new Date().toISOString() })
      .eq('id', commentData.threadId);
    
    return mapCommentResponse(data as ThreadCommentResponse);
  },
  
  // Upvotes
  async upvoteThread(threadId: string, upvote: boolean): Promise<boolean> {
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
      console.error('User must be logged in to upvote');
      return false;
    }
    
    if (upvote) {
      // Add upvote
      const { error: insertError } = await supabase
        .from('thread_upvotes')
        .insert({
          thread_id: threadId,
          user_id: user.data.user.id
        });
      
      if (insertError) {
        console.error('Error upvoting thread:', insertError);
        return false;
      }
      
      // Increment upvote count
      await supabase
        .from('forum_threads')
        .update({ upvotes: () => 'upvotes + 1' })
        .eq('id', threadId);
    } else {
      // Remove upvote
      const { error: deleteError } = await supabase
        .from('thread_upvotes')
        .delete()
        .eq('thread_id', threadId)
        .eq('user_id', user.data.user.id);
      
      if (deleteError) {
        console.error('Error removing thread upvote:', deleteError);
        return false;
      }
      
      // Decrement upvote count
      await supabase
        .from('forum_threads')
        .update({ upvotes: () => 'upvotes - 1' })
        .eq('id', threadId);
    }
    
    return true;
  },
  
  async upvoteComment(commentId: string, upvote: boolean): Promise<boolean> {
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
      console.error('User must be logged in to upvote');
      return false;
    }
    
    if (upvote) {
      // Add upvote
      const { error: insertError } = await supabase
        .from('comment_upvotes')
        .insert({
          comment_id: commentId,
          user_id: user.data.user.id
        });
      
      if (insertError) {
        console.error('Error upvoting comment:', insertError);
        return false;
      }
      
      // Increment upvote count directly
      await supabase
        .from('thread_comments')
        .update({ upvotes: () => 'upvotes + 1' })
        .eq('id', commentId);
    } else {
      // Remove upvote
      const { error: deleteError } = await supabase
        .from('comment_upvotes')
        .delete()
        .eq('comment_id', commentId)
        .eq('user_id', user.data.user.id);
      
      if (deleteError) {
        console.error('Error removing comment upvote:', deleteError);
        return false;
      }
      
      // Decrement upvote count directly
      await supabase
        .from('thread_comments')
        .update({ upvotes: () => 'upvotes - 1' })
        .eq('id', commentId);
    }
    
    return true;
  },
  
  // Bookmarks
  async bookmarkThread(threadId: string, bookmark: boolean): Promise<boolean> {
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
      console.error('User must be logged in to bookmark');
      return false;
    }
    
    if (bookmark) {
      // Add bookmark
      const { error } = await supabase
        .from('thread_bookmarks')
        .insert({
          thread_id: threadId,
          user_id: user.data.user.id
        });
      
      if (error) {
        console.error('Error bookmarking thread:', error);
        return false;
      }
    } else {
      // Remove bookmark
      const { error } = await supabase
        .from('thread_bookmarks')
        .delete()
        .eq('thread_id', threadId)
        .eq('user_id', user.data.user.id);
      
      if (error) {
        console.error('Error removing thread bookmark:', error);
        return false;
      }
    }
    
    return true;
  },
  
  // Reports
  async reportThread(threadId: string, reason: string): Promise<boolean> {
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
      console.error('User must be logged in to report');
      return false;
    }
    
    const { error } = await supabase
      .from('thread_reports')
      .insert({
        thread_id: threadId,
        user_id: user.data.user.id,
        reason
      });
    
    if (error) {
      console.error('Error reporting thread:', error);
      return false;
    }
    
    return true;
  },
  
  async reportComment(commentId: string, reason: string): Promise<boolean> {
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
      console.error('User must be logged in to report');
      return false;
    }
    
    const { error } = await supabase
      .from('comment_reports')
      .insert({
        comment_id: commentId,
        user_id: user.data.user.id,
        reason
      });
    
    if (error) {
      console.error('Error reporting comment:', error);
      return false;
    }
    
    // Mark comment as reported
    await supabase
      .from('thread_comments')
      .update({ is_reported: true })
      .eq('id', commentId);
    
    return true;
  }
};
