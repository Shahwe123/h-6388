
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getThreadById, getCommentsByThreadId, mockForumUsers } from '@/data/forumData';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { formatDistanceToNow } from 'date-fns';
import { 
  ChevronLeft, ThumbsUp, Bookmark, Flag, MessageSquare, 
  Share, Paperclip, Send, Shield, Pin, Lock
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import ThreadComment from '@/components/forum/ThreadComment';
import UserInfoCard from '@/components/forum/UserInfoCard';
import ForumTag from '@/components/forum/ForumTag';
import ThreadStatusBadge from '@/components/forum/ThreadStatusBadge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import SEO from '@/components/SEO';

const ForumThread: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Normally we'd fetch this from Redux or context
  const currentUser = mockForumUsers[0]; // For demonstration, assume first user is logged in
  
  const thread = getThreadById(id || '');
  const comments = getCommentsByThreadId(id || '');
  
  // Local state for UI interactions
  const [newComment, setNewComment] = useState('');
  const [upvoted, setUpvoted] = useState(thread?.userHasUpvoted || false);
  const [upvoteCount, setUpvoteCount] = useState(thread?.upvotes || 0);
  const [bookmarked, setBookmarked] = useState(thread?.isBookmarked || false);
  const [replyToComment, setReplyToComment] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);
  
  if (!thread) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Thread Not Found</h2>
          <p className="text-gray-400 mb-6">The thread you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/forum')}>
            Back to Forum
          </Button>
        </div>
      </div>
    );
  }
  
  const isAuthor = currentUser.id === thread.authorId;
  const isModOrAdmin = currentUser.isAdmin || currentUser.isModerator;
  
  const handleUpvote = () => {
    setUpvoted(!upvoted);
    setUpvoteCount(prevCount => upvoted ? prevCount - 1 : prevCount + 1);
    toast({
      title: upvoted ? "Upvote removed" : "Thread upvoted",
      variant: "default"
    });
  };
  
  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    toast({
      title: bookmarked ? "Bookmark removed" : "Thread bookmarked",
      variant: "default"
    });
  };
  
  const handleReport = () => {
    toast({
      title: "Thread reported",
      description: "A moderator will review this content soon",
      variant: "default"
    });
  };
  
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied",
      description: "Thread URL copied to clipboard",
      variant: "default"
    });
  };
  
  const handleModAction = (action: 'sticky' | 'lock' | 'delete') => {
    let message = '';
    
    switch (action) {
      case 'sticky':
        message = thread.status === 'sticky' 
          ? "Thread unstickied from the forum" 
          : "Thread stickied to the top of the forum";
        break;
      case 'lock':
        message = thread.status === 'closed' 
          ? "Thread unlocked and open for comments" 
          : "Thread locked and closed for comments";
        break;
      case 'delete':
        message = "Thread deleted";
        navigate('/forum');
        break;
    }
    
    toast({
      title: "Moderation action",
      description: message,
      variant: "default"
    });
  };
  
  const handlePostComment = () => {
    if (!newComment.trim()) {
      toast({
        title: "Empty comment",
        description: "Please enter a comment",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Comment posted",
      variant: "default"
    });
    
    setNewComment('');
    setAttachments([]);
  };
  
  const handleReply = (commentId: string) => {
    setReplyToComment(commentId);
  };
  
  const handleSubmitReply = () => {
    if (!replyContent.trim()) {
      toast({
        title: "Empty reply",
        description: "Please enter a reply",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Reply posted",
      variant: "default"
    });
    
    setReplyToComment(null);
    setReplyContent('');
  };
  
  const handleAddAttachment = () => {
    // In a real app, this would handle file upload to Cloudinary
    const newAttachment = 'https://placehold.co/600x400/png';
    setAttachments([...attachments, newAttachment]);
    
    toast({
      title: "Image attached",
      variant: "default"
    });
  };
  
  const cancelReply = () => {
    setReplyToComment(null);
    setReplyContent('');
  };
  
  return (
    <div className="min-h-screen bg-primary pb-16">
      <SEO 
        title={thread.title}
        description={`Join the discussion: ${thread.title}`}
      />
      
      <div className="max-w-7xl mx-auto container-padding">
        <Button 
          variant="ghost" 
          className="mb-4" 
          onClick={() => navigate('/forum')}
        >
          <ChevronLeft size={18} className="mr-1" />
          Back to Forum
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <div className="glass-card rounded-lg p-6">
              <div className="flex flex-wrap gap-2 mb-4">
                <ThreadStatusBadge status={thread.status} />
                {thread.tags.map((tag, index) => (
                  <ForumTag key={index} tag={tag} size="md" />
                ))}
                {thread.gameName && (
                  <span className="bg-gray-800 text-gray-200 rounded-full px-3 py-1 text-sm">
                    {thread.gameName}
                  </span>
                )}
              </div>
              
              <h1 className="text-2xl font-bold mb-4">{thread.title}</h1>
              
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={thread.author.avatarUrl} alt={thread.author.username} />
                    <AvatarFallback>{thread.author.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <Link 
                      to={`/profile/${thread.author.username}`}
                      className="font-medium hover:text-neon-blue transition-colors"
                    >
                      {thread.author.username}
                    </Link>
                    <div className="text-sm text-gray-400">
                      Posted {formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true })}
                      {thread.isEdited && <span className="ml-1">(edited)</span>}
                    </div>
                  </div>
                </div>
                
                {(isAuthor || isModOrAdmin) && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        {isModOrAdmin ? <Shield size={16} className="mr-2" /> : null}
                        {isModOrAdmin ? "Mod Actions" : "Actions"}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {isModOrAdmin && (
                        <>
                          <DropdownMenuItem onClick={() => handleModAction('sticky')}>
                            <Pin size={16} className="mr-2" />
                            {thread.status === 'sticky' ? 'Unsticky Thread' : 'Sticky Thread'}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleModAction('lock')}>
                            <Lock size={16} className="mr-2" />
                            {thread.status === 'closed' ? 'Unlock Thread' : 'Lock Thread'}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                        </>
                      )}
                      <DropdownMenuItem onClick={() => handleModAction('delete')} className="text-red-500">
                        Delete Thread
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
              
              <div className="prose prose-invert max-w-none mb-6">
                <p>{thread.content}</p>
              </div>
              
              {thread.attachments && thread.attachments.length > 0 && (
                <div className="mb-6 space-y-2">
                  {thread.attachments.map((attachment, index) => (
                    <img 
                      key={index}
                      src={attachment}
                      alt="Thread attachment"
                      className="max-w-full rounded-md"
                    />
                  ))}
                </div>
              )}
              
              <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/10">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className={`flex items-center gap-1 ${upvoted ? 'text-neon-blue' : ''}`}
                  onClick={handleUpvote}
                >
                  <ThumbsUp size={18} />
                  <span>{upvoteCount}</span>
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <MessageSquare size={18} />
                  <span>{comments.length}</span>
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  className={`flex items-center gap-1 ${bookmarked ? 'text-amber-400' : ''}`}
                  onClick={handleBookmark}
                >
                  <Bookmark size={18} />
                  <span>{bookmarked ? 'Bookmarked' : 'Bookmark'}</span>
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={handleShare}
                >
                  <Share size={18} />
                  <span>Share</span>
                </Button>
                
                {!isAuthor && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={handleReport}
                  >
                    <Flag size={18} />
                    <span>Report</span>
                  </Button>
                )}
              </div>
            </div>
            
            <div className="glass-card rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">
                  Comments ({comments.length})
                </h2>
              </div>
              
              <div className="space-y-6">
                {comments.map(comment => (
                  <React.Fragment key={comment.id}>
                    <ThreadComment 
                      comment={comment}
                      currentUser={currentUser}
                      onReply={handleReply}
                    />
                    
                    {replyToComment === comment.id && (
                      <div className="glass-card rounded-lg p-4 ml-6 sm:ml-10 mt-2">
                        <div className="text-sm text-gray-400 mb-2">
                          Replying to <span className="text-white">{comment.author.username}</span>
                        </div>
                        <Textarea
                          placeholder="Write your reply..."
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          rows={3}
                          className="mb-3"
                        />
                        <div className="flex justify-between">
                          <Button variant="ghost" size="sm" onClick={cancelReply}>
                            Cancel
                          </Button>
                          <Button size="sm" onClick={handleSubmitReply}>
                            <Send size={16} className="mr-2" />
                            Post Reply
                          </Button>
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                ))}
                
                {comments.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <MessageSquare size={40} className="mx-auto mb-4 opacity-50" />
                    <p>No comments yet. Be the first to comment!</p>
                  </div>
                )}
              </div>
              
              <div className="mt-8 pt-6 border-t border-white/10">
                <h3 className="font-medium mb-3">Add a Comment</h3>
                <Textarea
                  placeholder="Write your comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={4}
                  className="mb-3"
                />
                
                {attachments.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {attachments.map((attachment, index) => (
                      <img 
                        key={index}
                        src={attachment}
                        alt={`Attachment ${index + 1}`}
                        className="rounded-md max-h-40 object-contain"
                      />
                    ))}
                  </div>
                )}
                
                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleAddAttachment}
                  >
                    <Paperclip size={16} className="mr-2" />
                    Add Image
                  </Button>
                  
                  <Button onClick={handlePostComment}>
                    <Send size={16} className="mr-2" />
                    Post Comment
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <UserInfoCard 
              user={thread.author}
              isFriend={false}
              onAddFriend={(userId) => {
                toast({
                  title: "Friend request sent",
                  description: `Friend request sent to ${thread.author.username}`,
                  variant: "default"
                });
              }}
            />
            
            <div className="glass-card rounded-lg p-4">
              <h3 className="font-medium mb-3">Forum Statistics</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Views:</span>
                  <span>{thread.viewCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Comments:</span>
                  <span>{comments.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Created:</span>
                  <span>{formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Last Activity:</span>
                  <span>{formatDistanceToNow(new Date(thread.lastActivity), { addSuffix: true })}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumThread;
