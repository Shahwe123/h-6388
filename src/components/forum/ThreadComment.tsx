
import React, { useState } from 'react';
import { ThreadComment as ThreadCommentType, ForumUser } from '@/types/forum';
import { formatDistanceToNow } from 'date-fns';
import { ThumbsUp, Flag, Reply, Edit, Trash, MoreVertical } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/profile/Badge';
import { useToast } from '@/hooks/use-toast';

interface ThreadCommentProps {
  comment: ThreadCommentType;
  currentUser?: ForumUser | null;
  onReply?: (commentId: string) => void;
  onEdit?: (commentId: string) => void;
  onDelete?: (commentId: string) => void;
  onReport?: (commentId: string) => void;
}

const ThreadComment: React.FC<ThreadCommentProps> = ({
  comment,
  currentUser,
  onReply,
  onEdit,
  onDelete,
  onReport
}) => {
  const { toast } = useToast();
  const [upvoted, setUpvoted] = useState(comment.userHasUpvoted || false);
  const [upvoteCount, setUpvoteCount] = useState(comment.upvotes);
  
  const isAuthor = currentUser?.id === comment.authorId;
  const isModOrAdmin = currentUser?.isAdmin || currentUser?.isModerator;
  
  const handleUpvote = () => {
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "You need to be logged in to upvote comments",
        variant: "destructive"
      });
      return;
    }
    
    setUpvoted(!upvoted);
    setUpvoteCount(prevCount => upvoted ? prevCount - 1 : prevCount + 1);
    toast({
      title: upvoted ? "Upvote removed" : "Comment upvoted",
      variant: "default"
    });
  };
  
  const handleReply = () => {
    if (onReply) onReply(comment.id);
  };
  
  const handleEdit = () => {
    if (onEdit) onEdit(comment.id);
  };
  
  const handleDelete = () => {
    if (onDelete) onDelete(comment.id);
  };
  
  const handleReport = () => {
    if (onReport) onReport(comment.id);
    toast({
      title: "Comment reported",
      description: "A moderator will review this content soon",
      variant: "default"
    });
  };
  
  return (
    <div className="glass-card rounded-lg p-4 relative">
      <div className="flex gap-4">
        <div className="hidden sm:block">
          <Avatar className="h-10 w-10 border">
            <AvatarImage src={comment.author.avatarUrl} alt={comment.author.username} />
            <AvatarFallback>{comment.author.username.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="font-semibold text-white">{comment.author.username}</span>
            
            {comment.author.isAdmin && (
              <span className="bg-red-900 text-white text-xs px-2 py-0.5 rounded-full">Admin</span>
            )}
            
            {comment.author.isModerator && (
              <span className="bg-blue-900 text-white text-xs px-2 py-0.5 rounded-full">Mod</span>
            )}
            
            <span className="text-xs text-gray-400">
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
              {comment.isEdited && <span className="ml-1">(edited)</span>}
            </span>
          </div>
          
          <div className="prose prose-invert prose-sm max-w-none">
            <p>{comment.content}</p>
          </div>
          
          {comment.attachments && comment.attachments.length > 0 && (
            <div className="mt-3 space-y-2">
              {comment.attachments.map((attachment, index) => (
                <img 
                  key={index}
                  src={attachment}
                  alt="Comment attachment"
                  className="max-w-full rounded-md max-h-80 object-contain bg-black/30"
                />
              ))}
            </div>
          )}
          
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <Button 
              variant="ghost" 
              size="sm"
              className={`flex items-center gap-1 py-1 h-auto ${upvoted ? 'text-neon-blue' : ''}`}
              onClick={handleUpvote}
            >
              <ThumbsUp size={16} />
              <span>{upvoteCount}</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              className="flex items-center gap-1 py-1 h-auto"
              onClick={handleReply}
            >
              <Reply size={16} />
              <span>Reply</span>
            </Button>
            
            {!isAuthor && (
              <Button 
                variant="ghost" 
                size="sm"
                className="flex items-center gap-1 py-1 h-auto"
                onClick={handleReport}
              >
                <Flag size={16} />
                <span>Report</span>
              </Button>
            )}
          </div>
        </div>
        
        {(isAuthor || isModOrAdmin) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isAuthor && (
                <DropdownMenuItem onClick={handleEdit}>
                  <Edit size={16} className="mr-2" />
                  Edit
                </DropdownMenuItem>
              )}
              {(isAuthor || isModOrAdmin) && (
                <>
                  {isAuthor && <DropdownMenuSeparator />}
                  <DropdownMenuItem onClick={handleDelete} className="text-red-500">
                    <Trash size={16} className="mr-2" />
                    Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};

export default ThreadComment;
