
import React from 'react';
import { Link } from 'react-router-dom';
import { ForumCategory } from '@/types/forum';
import { MessageSquare } from 'lucide-react';

interface CategoryCardProps {
  category: ForumCategory;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const { id, name, description, threadCount, recentThreads } = category;
  
  return (
    <div className="glass-card rounded-lg p-4">
      <div className="flex items-center gap-3">
        <div className="bg-neon-blue/20 rounded-full p-3">
          <MessageSquare className="text-neon-blue h-6 w-6" />
        </div>
        
        <div className="flex-1">
          <Link to={`/forum/category/${id}`}>
            <h3 className="text-xl font-semibold text-white hover:text-neon-blue transition-colors">
              {name}
            </h3>
          </Link>
          <p className="text-gray-400 text-sm mt-1">{description}</p>
        </div>
        
        <div className="text-center hidden md:block">
          <span className="text-2xl font-bold text-white">{threadCount}</span>
          <p className="text-gray-400 text-xs">Threads</p>
        </div>
      </div>
      
      {recentThreads.length > 0 && (
        <div className="mt-4 border-t border-white/10 pt-3">
          <span className="text-xs text-gray-400 mb-2 block">Recent threads:</span>
          <div className="space-y-2">
            {recentThreads.slice(0, 2).map(thread => (
              <Link 
                key={thread.id} 
                to={`/forum/thread/${thread.id}`}
                className="block text-sm text-gray-300 hover:text-neon-blue transition-colors"
              >
                {thread.title}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryCard;
