
import React from 'react';
import { Link } from 'react-router-dom';
import { ForumThread } from '@/types/forum';
import ForumTag from './ForumTag';
import ThreadStatusBadge from './ThreadStatusBadge';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, Eye, ThumbsUp } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ThreadListItemProps {
  thread: ForumThread;
}

const ThreadListItem: React.FC<ThreadListItemProps> = ({ thread }) => {
  const {
    id,
    title,
    author,
    createdAt,
    tags,
    status,
    viewCount,
    upvotes,
    commentCount,
    lastActivity,
    gameName
  } = thread;

  return (
    <div className="glass-card p-4 rounded-lg transition-transform hover:scale-[1.01] duration-200">
      <div className="flex items-start gap-3">
        <div className="hidden sm:block">
          <Avatar className="h-10 w-10 border">
            <AvatarImage src={author.avatarUrl} alt={author.username} />
            <AvatarFallback>{author.username.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <ThreadStatusBadge status={status} size="sm" />
            {tags.map((tag, index) => (
              <ForumTag key={index} tag={tag} size="sm" />
            ))}
            {gameName && (
              <span className="text-xs bg-gray-800 text-gray-200 rounded-full px-2 py-0.5">
                {gameName}
              </span>
            )}
          </div>
          
          <Link to={`/forum/thread/${id}`} className="hover:text-neon-blue transition-colors">
            <h3 className="text-lg font-semibold line-clamp-2">{title}</h3>
          </Link>
          
          <div className="flex flex-wrap items-center text-sm text-gray-400 mt-2 gap-x-4 gap-y-1">
            <span className="flex items-center">
              By <span className="text-gray-300 ml-1">{author.username}</span>
            </span>
            
            <span className="flex items-center">
              <Eye size={14} className="mr-1" />
              {viewCount}
            </span>
            
            <span className="flex items-center">
              <ThumbsUp size={14} className="mr-1" />
              {upvotes}
            </span>
            
            <span className="flex items-center">
              <MessageSquare size={14} className="mr-1" />
              {commentCount}
            </span>
            
            <span className="flex items-center">
              Created {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
            </span>
            
            <span className="flex items-center text-neon-blue">
              Active {formatDistanceToNow(new Date(lastActivity), { addSuffix: true })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreadListItem;
