
import React from 'react';
import { ThreadStatus } from '@/types/forum';
import { cn } from '@/lib/utils';
import { Pin, Lock, Archive } from 'lucide-react';

type ThreadStatusBadgeProps = {
  status: ThreadStatus;
  size?: 'sm' | 'md' | 'lg';
};

const ThreadStatusBadge: React.FC<ThreadStatusBadgeProps> = ({ status, size = 'md' }) => {
  if (status === 'normal') return null;
  
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };
  
  const iconSize = {
    sm: 12,
    md: 16,
    lg: 20
  };
  
  const getStatusContent = () => {
    switch (status) {
      case 'sticky':
        return {
          icon: <Pin size={iconSize[size]} className="mr-1" />,
          text: 'Sticky',
          style: 'bg-amber-700/80 text-amber-100'
        };
      case 'closed':
        return {
          icon: <Lock size={iconSize[size]} className="mr-1" />,
          text: 'Closed',
          style: 'bg-red-800/80 text-red-100'
        };
      case 'archived':
        return {
          icon: <Archive size={iconSize[size]} className="mr-1" />,
          text: 'Archived',
          style: 'bg-gray-700/80 text-gray-100'
        };
      default:
        return null;
    }
  };
  
  const content = getStatusContent();
  if (!content) return null;
  
  return (
    <span className={cn(
      'flex items-center rounded-md px-2 py-0.5 font-medium',
      sizeClasses[size],
      content.style
    )}>
      {content.icon}
      {content.text}
    </span>
  );
};

export default ThreadStatusBadge;
