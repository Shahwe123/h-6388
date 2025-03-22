
import { supabase } from '@/integrations/supabase/client';
import { ForumCategory, ForumThread, ThreadComment, ForumTag, ThreadStatus } from '@/types/forum';

// Helper to convert DB types to frontend types
const convertThreadFromDB = (thread: any, userId?: string): ForumThread => {
  return {
    id: thread.id,
    title: thread.title,
    content: thread.content,
    authorId: thread.author_id,
    author: thread.author || { id: thread.author_id, username: 'Unknown User' },
    createdAt: thread.created_at,
    tags: thread.tags || [],
    status: thread.status || 'normal',
    viewCount: thread.view_count || 0,
    upvotes: thread.upvotes || 0,
    commentCount: thread.comment_count || 0,
    categoryId: thread.category_id,
    gameName: thread.game_name || null,
    attachments: thread.attachments || [],
    lastActivity: thread.last_activity,
    isEdited: thread.is_edited || false,
    userHasUpvoted: userId ? thread.user_has_upvoted || false : false,
    isBookmarked: userId ? thread.is_bookmarked || false : false,
  };
};

const convertCommentFromDB = (comment: any, userId?: string): ThreadComment => {
  return {
    id: comment.id,
    threadId: comment.thread_id,
    content: comment.content,
    authorId: comment.author_id,
    author: comment.author || { id: comment.author_id, username: 'Unknown User' },
    createdAt: comment.created_at,
    upvotes: comment.upvotes || 0,
    attachments: comment.attachments || [],
    isEdited: comment.is_edited || false,
    userHasUpvoted: userId ? comment.user_has_upvoted || false : false,
    parentCommentId: comment.parent_comment_id || null,
    isReported: comment.is_reported || false,
  };
};

// Forum service
export const forumService = {
  // Get all categories
  async getCategories(): Promise<ForumCategory[]> {
    const { data, error } = await supabase
      .from('forum_categories')
      .select('*')
      .order('name', { ascending: true });
      
    if (error) throw error;
    return data as ForumCategory[];
  },
  
  // Get a single category by ID
  async getCategory(id: string): Promise<ForumCategory> {
    const { data, error } = await supabase
      .from('forum_categories')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    if (!data) throw new Error('Category not found');
    
    return data as ForumCategory;
  },
  
  // Get threads in a specific category
  async getCategoryThreads(categoryId: string, userId?: string): Promise<ForumThread[]> {
    let query = supabase
      .from('forum_threads')
      .select(`
        *,
        author:profiles(id, username, avatar_url)
      `)
      .eq('category_id', categoryId)
      .order('created_at', { ascending: false });
    
    // If user is logged in, check if threads are upvoted/bookmarked
    if (userId) {
      query = query.select(`
        *,
        author:profiles(id, username, avatar_url),
        user_has_upvoted:thread_upvotes!inner(user_id)
      `);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    // Get comment counts for each thread
    const threads = await Promise.all(
      (data || []).map(async (thread) => {
        const { data: countData, error: countError } = await supabase
          .rpc('get_thread_comment_count', { thread_id: thread.id });
        
        if (countError) console.error('Error getting comment count:', countError);
        
        // Check if user has bookmarked this thread
        let isBookmarked = false;
        if (userId) {
          const { data: bookmarkData, error: bookmarkError } = await supabase
            .rpc('user_has_bookmarked_thread', { 
              thread_id: thread.id, 
              user_id: userId 
            });
          
          if (!bookmarkError) {
            isBookmarked = bookmarkData || false;
          }
        }
        
        return convertThreadFromDB({
          ...thread,
          comment_count: countData || 0,
          is_bookmarked: isBookmarked
        }, userId);
      })
    );
    
    return threads;
  },
  
  // Create a new thread
  async createThread(
    title: string, 
    content: string, 
    categoryId: string, 
    authorId: string, 
    tags: string[], 
    gameName?: string, 
    attachments?: string[]
  ): Promise<ForumThread> {
    // Validate tags to ensure they match the enum
    const validTags: ForumTag[] = tags
      .filter(tag => ['Guide', 'Help', 'Discussion', 'Challenge', 'Flex'].includes(tag)) as ForumTag[];
    
    if (validTags.length === 0 && tags.length > 0) {
      throw new Error('Invalid tags provided');
    }
    
    const { data, error } = await supabase
      .from('forum_threads')
      .insert({
        title,
        content,
        category_id: categoryId,
        author_id: authorId,
        tags: validTags,
        game_name: gameName,
        attachments,
        status: 'normal' as ThreadStatus,
        last_activity: new Date().toISOString(),
      })
      .select()
      .single();
      
    if (error) throw error;
    
    return convertThreadFromDB(data, authorId);
  },
  
  // Get a single thread by ID with comments
  async getThread(id: string, userId?: string): Promise<{thread: ForumThread, comments: ThreadComment[]}> {
    // Fetch the thread
    const { data: threadData, error: threadError } = await supabase
      .from('forum_threads')
      .select(`
        *,
        author:profiles(id, username, avatar_url)
      `)
      .eq('id', id)
      .single();
      
    if (threadError) throw threadError;
    if (!threadData) throw new Error('Thread not found');
    
    // Update view count
    try {
      await supabase.rpc('increment_thread_view_count', {
        thread_id: id
      });
    } catch (err) {
      console.error('Error incrementing view count:', err);
    }
    
    // Check if user has upvoted/bookmarked
    let userHasUpvoted = false;
    let isBookmarked = false;
    
    if (userId) {
      const { data: upvoteData } = await supabase
        .rpc('user_has_upvoted_thread', { 
          thread_id: id, 
          user_id: userId 
        });
      
      userHasUpvoted = upvoteData || false;
      
      const { data: bookmarkData } = await supabase
        .rpc('user_has_bookmarked_thread', { 
          thread_id: id, 
          user_id: userId 
        });
      
      isBookmarked = bookmarkData || false;
    }
    
    // Fetch the comments
    const { data: commentsData, error: commentsError } = await supabase
      .from('thread_comments')
      .select(`
        *,
        author:profiles(id, username, avatar_url)
      `)
      .eq('thread_id', id)
      .order('created_at', { ascending: true });
      
    if (commentsError) throw commentsError;
    
    // Check which comments the user has upvoted
    const comments = await Promise.all(
      (commentsData || []).map(async (comment) => {
        let userHasUpvotedComment = false;
        
        if (userId) {
          const { data: upvoteData } = await supabase
            .rpc('user_has_upvoted_comment', { 
              comment_id: comment.id, 
              user_id: userId 
            });
          
          userHasUpvotedComment = upvoteData || false;
        }
        
        return convertCommentFromDB({
          ...comment,
          user_has_upvoted: userHasUpvotedComment
        }, userId);
      })
    );
    
    // Get comment count
    const { data: countData } = await supabase
      .rpc('get_thread_comment_count', { thread_id: id });
    
    const thread = convertThreadFromDB({
      ...threadData,
      comment_count: countData || 0,
      user_has_upvoted: userHasUpvoted,
      is_bookmarked: isBookmarked
    }, userId);
    
    return { thread, comments };
  },
  
  // Post a comment on a thread
  async postComment(
    threadId: string, 
    content: string, 
    authorId: string, 
    parentCommentId?: string,
    attachments?: string[]
  ): Promise<ThreadComment> {
    const { data, error } = await supabase
      .from('thread_comments')
      .insert({
        thread_id: threadId,
        content,
        author_id: authorId,
        parent_comment_id: parentCommentId,
        attachments
      })
      .select()
      .single();
      
    if (error) throw error;
    
    // Update the thread's last activity timestamp
    await supabase
      .from('forum_threads')
      .update({ last_activity: new Date().toISOString() })
      .eq('id', threadId);
    
    return convertCommentFromDB(data, authorId);
  },
  
  // Upvote a thread
  async upvoteThread(threadId: string, userId: string): Promise<void> {
    // Check if already upvoted
    const { data, error } = await supabase
      .rpc('user_has_upvoted_thread', { 
        thread_id: threadId, 
        user_id: userId 
      });
    
    if (error) throw error;
    
    if (data) {
      // Already upvoted, remove upvote
      const { error: deleteError } = await supabase
        .from('thread_upvotes')
        .delete()
        .eq('thread_id', threadId)
        .eq('user_id', userId);
      
      if (deleteError) throw deleteError;
      
      // Decrement upvote count
      await supabase.rpc('decrement_thread_upvote_count', {
        thread_id: threadId
      });
    } else {
      // Not upvoted, add upvote
      const { error: insertError } = await supabase
        .from('thread_upvotes')
        .insert({
          thread_id: threadId,
          user_id: userId
        });
      
      if (insertError) throw insertError;
      
      // Increment upvote count
      await supabase.rpc('increment_thread_upvote_count', {
        thread_id: threadId
      });
    }
  },
  
  // Upvote a comment
  async upvoteComment(commentId: string, userId: string): Promise<void> {
    // Check if already upvoted
    const { data, error } = await supabase
      .rpc('user_has_upvoted_comment', { 
        comment_id: commentId, 
        user_id: userId 
      });
    
    if (error) throw error;
    
    if (data) {
      // Already upvoted, remove upvote
      const { error: deleteError } = await supabase
        .from('comment_upvotes')
        .delete()
        .eq('comment_id', commentId)
        .eq('user_id', userId);
      
      if (deleteError) throw deleteError;
      
      // Decrement upvote count
      await supabase.rpc('decrement_comment_upvote_count', {
        comment_id: commentId
      });
    } else {
      // Not upvoted, add upvote
      const { error: insertError } = await supabase
        .from('comment_upvotes')
        .insert({
          comment_id: commentId,
          user_id: userId
        });
      
      if (insertError) throw insertError;
      
      // Increment upvote count
      await supabase.rpc('increment_comment_upvote_count', {
        comment_id: commentId
      });
    }
  },
  
  // Bookmark a thread
  async toggleBookmark(threadId: string, userId: string): Promise<boolean> {
    // Check if already bookmarked
    const { data, error } = await supabase
      .rpc('user_has_bookmarked_thread', { 
        thread_id: threadId, 
        user_id: userId 
      });
    
    if (error) throw error;
    
    if (data) {
      // Already bookmarked, remove bookmark
      const { error: deleteError } = await supabase
        .from('thread_bookmarks')
        .delete()
        .eq('thread_id', threadId)
        .eq('user_id', userId);
      
      if (deleteError) throw deleteError;
      return false; // No longer bookmarked
    } else {
      // Not bookmarked, add bookmark
      const { error: insertError } = await supabase
        .from('thread_bookmarks')
        .insert({
          thread_id: threadId,
          user_id: userId
        });
      
      if (insertError) throw insertError;
      return true; // Now bookmarked
    }
  },
  
  // Report a thread
  async reportThread(threadId: string, userId: string, reason: string): Promise<void> {
    const { error } = await supabase
      .from('thread_reports')
      .insert({
        thread_id: threadId,
        user_id: userId,
        reason
      });
    
    if (error) throw error;
  },
  
  // Report a comment
  async reportComment(commentId: string, userId: string, reason: string): Promise<void> {
    const { error } = await supabase
      .from('comment_reports')
      .insert({
        comment_id: commentId,
        user_id: userId,
        reason
      });
    
    if (error) throw error;
    
    // Mark the comment as reported
    await supabase
      .from('thread_comments')
      .update({ is_reported: true })
      .eq('id', commentId);
  },
  
  // Get bookmarked threads for a user
  async getUserBookmarks(userId: string): Promise<ForumThread[]> {
    const { data, error } = await supabase
      .from('thread_bookmarks')
      .select(`
        thread_id,
        thread:forum_threads(
          *,
          author:profiles(id, username, avatar_url)
        )
      `)
      .eq('user_id', userId);
    
    if (error) throw error;
    
    // Get comment counts for each thread
    const threads = await Promise.all(
      (data || []).map(async (bookmark) => {
        const thread = bookmark.thread;
        if (!thread) return null;
        
        const { data: countData } = await supabase
          .rpc('get_thread_comment_count', { thread_id: thread.id });
        
        // Check if user has upvoted this thread
        const { data: upvoteData } = await supabase
          .rpc('user_has_upvoted_thread', { 
            thread_id: thread.id, 
            user_id: userId 
          });
        
        return convertThreadFromDB({
          ...thread,
          comment_count: countData || 0,
          user_has_upvoted: upvoteData || false,
          is_bookmarked: true // Since these are bookmarks
        }, userId);
      })
    );
    
    return threads.filter(Boolean) as ForumThread[];
  }
};
