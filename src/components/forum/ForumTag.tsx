
import React from 'react';
import { ForumTagType } from '@/types/forum';
import { cn } from '@/lib/utils';

type ForumTagProps = {
  tag: ForumTagType;
  size?: 'sm' | 'md' | 'lg';
};

const ForumTag: React.FC<ForumTagProps> = ({ tag, size = 'md' }) => {
  const getTagStyles = (tag: ForumTagType) => {
    switch (tag) {
      case 'Guide':
        return 'bg-emerald-800 hover:bg-emerald-700';
      case 'Help':
        return 'bg-blue-800 hover:bg-blue-700';
      case 'Discussion':
        return 'bg-purple-800 hover:bg-purple-700';
      case 'Challenge':
        return 'bg-orange-800 hover:bg-orange-700';
      case 'Flex':
        return 'bg-neon-purple hover:bg-purple-600';
      default:
        return 'bg-gray-800 hover:bg-gray-700';
    }
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5'
  };

  return (
    <span
      className={cn(
        'rounded-full text-white font-medium transition-colors',
        getTagStyles(tag),
        sizeClasses[size]
      )}
    >
      {tag}
    </span>
  );
};

export default ForumTag;
