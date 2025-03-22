
import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { forumService } from '@/services/forumService';
import { ForumCategory, ForumThread, ThreadComment } from '@/types/forum';
import { useToast } from '@/hooks/use-toast';

export const useForumData = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Queries
  const categoriesQuery = useQuery({
    queryKey: ['forumCategories'],
    queryFn: forumService.getCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
  
  const getCategoryThreads = (categoryId: string) => {
    return useQuery({
      queryKey: ['forumThreads', categoryId],
      queryFn: () => forumService.getThreads({ categoryId }),
      staleTime: 2 * 60 * 1000, // 2 minutes
      enabled: !!categoryId,
    });
  };
  
  const getThread = (threadId: string) => {
    return useQuery({
      queryKey: ['forumThread', threadId],
      queryFn: () => forumService.getThread(threadId),
      staleTime: 60 * 1000, // 1 minute
      enabled: !!threadId,
    });
  };
  
  const getThreadComments = (threadId: string) => {
    return useQuery({
      queryKey: ['forumComments', threadId],
      queryFn: () => forumService.getComments(threadId),
      staleTime: 30 * 1000, // 30 seconds
      enabled: !!threadId,
    });
  };
  
  const getTrendingThreads = (limit = 5) => {
    return useQuery({
      queryKey: ['forumThreads', 'trending', limit],
      queryFn: () => forumService.getThreads({ sortBy: 'trending', limit }),
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };
  
  const getRecentThreads = (limit = 5) => {
    return useQuery({
      queryKey: ['forumThreads', 'recent', limit],
      queryFn: () => forumService.getThreads({ sortBy: 'recent', limit }),
      staleTime: 2 * 60 * 1000, // 2 minutes
    });
  };
  
  // Mutations
  const createThreadMutation = useMutation({
    mutationFn: forumService.createThread,
    onSuccess: () => {
      toast({
        title: "Thread created successfully",
        variant: "default"
      });
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['forumThreads'] });
      queryClient.invalidateQueries({ queryKey: ['forumCategories'] });
    },
    onError: (error) => {
      toast({
        title: "Error creating thread",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  const createCommentMutation = useMutation({
    mutationFn: forumService.createComment,
    onSuccess: (data, variables) => {
      toast({
        title: "Comment posted successfully",
        variant: "default"
      });
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['forumComments', variables.threadId] });
      queryClient.invalidateQueries({ queryKey: ['forumThread', variables.threadId] });
    },
    onError: (error) => {
      toast({
        title: "Error posting comment",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  const upvoteThreadMutation = useMutation({
    mutationFn: ({ threadId, upvote }: { threadId: string; upvote: boolean }) => 
      forumService.upvoteThread(threadId, upvote),
    onSuccess: (_, variables) => {
      toast({
        title: variables.upvote ? "Thread upvoted" : "Upvote removed",
        variant: "default"
      });
      
      // Invalidate thread data
      queryClient.invalidateQueries({ queryKey: ['forumThread', variables.threadId] });
    },
    onError: (error) => {
      toast({
        title: "Error updating upvote",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  const upvoteCommentMutation = useMutation({
    mutationFn: ({ commentId, upvote, threadId }: { commentId: string; upvote: boolean; threadId: string }) => 
      forumService.upvoteComment(commentId, upvote),
    onSuccess: (_, variables) => {
      toast({
        title: variables.upvote ? "Comment upvoted" : "Upvote removed",
        variant: "default"
      });
      
      // Invalidate comment data
      queryClient.invalidateQueries({ queryKey: ['forumComments', variables.threadId] });
    },
    onError: (error) => {
      toast({
        title: "Error updating upvote",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  const bookmarkThreadMutation = useMutation({
    mutationFn: ({ threadId, bookmark }: { threadId: string; bookmark: boolean }) => 
      forumService.bookmarkThread(threadId, bookmark),
    onSuccess: (_, variables) => {
      toast({
        title: variables.bookmark ? "Thread bookmarked" : "Bookmark removed",
        variant: "default"
      });
      
      // Invalidate thread data
      queryClient.invalidateQueries({ queryKey: ['forumThread', variables.threadId] });
    },
    onError: (error) => {
      toast({
        title: "Error updating bookmark",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  const reportThreadMutation = useMutation({
    mutationFn: ({ threadId, reason }: { threadId: string; reason: string }) => 
      forumService.reportThread(threadId, reason),
    onSuccess: () => {
      toast({
        title: "Thread reported",
        description: "A moderator will review your report soon",
        variant: "default"
      });
    },
    onError: (error) => {
      toast({
        title: "Error reporting thread",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  const reportCommentMutation = useMutation({
    mutationFn: ({ commentId, reason, threadId }: { commentId: string; reason: string; threadId: string }) => 
      forumService.reportComment(commentId, reason),
    onSuccess: (_, variables) => {
      toast({
        title: "Comment reported",
        description: "A moderator will review your report soon",
        variant: "default"
      });
      
      // Invalidate comment data
      queryClient.invalidateQueries({ queryKey: ['forumComments', variables.threadId] });
    },
    onError: (error) => {
      toast({
        title: "Error reporting comment",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  return {
    // Queries
    categoriesQuery,
    getCategoryThreads,
    getThread,
    getThreadComments,
    getTrendingThreads,
    getRecentThreads,
    
    // Mutations
    createThread: createThreadMutation.mutate,
    isCreatingThread: createThreadMutation.isPending,
    
    createComment: createCommentMutation.mutate,
    isCreatingComment: createCommentMutation.isPending,
    
    upvoteThread: upvoteThreadMutation.mutate,
    upvoteComment: upvoteCommentMutation.mutate,
    bookmarkThread: bookmarkThreadMutation.mutate,
    reportThread: reportThreadMutation.mutate,
    reportComment: reportCommentMutation.mutate
  };
};
