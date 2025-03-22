
import React from 'react';
import { Link } from 'react-router-dom';
import { ForumCategory } from '@/types/forum';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, ChevronRight } from 'lucide-react';

interface CategoryCardProps {
  category: ForumCategory;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  // Ensure recentThreads exists and has content before accessing properties
  const hasRecentThreads = category.recentThreads && category.recentThreads.length > 0;
  
  return (
    <Card className="overflow-hidden hover:border-neon-purple/30 transition-colors">
      <CardHeader className="pb-2">
        <Link to={`/forum/category/${category.id}`}>
          <CardTitle className="text-xl text-white hover:text-neon-blue transition-colors">
            {category.name}
          </CardTitle>
        </Link>
        <CardDescription className="text-neutral-400">
          {category.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-0">
        <div className="text-sm text-neutral-400 flex items-center gap-1">
          <MessageSquare className="h-4 w-4" />
          <span>{category.threadCount} threads</span>
        </div>
      </CardContent>
      
      {hasRecentThreads && (
        <CardFooter className="flex flex-col p-0 mt-4">
          <div className="bg-black/20 w-full p-3">
            <h4 className="text-xs uppercase text-neutral-500 font-semibold mb-2">Recent Threads</h4>
            <ul className="space-y-2">
              {category.recentThreads.map(thread => (
                <li key={thread.id} className="text-sm">
                  <Link 
                    to={`/forum/thread/${thread.id}`}
                    className="flex items-center justify-between hover:text-neon-blue transition-colors group"
                  >
                    <div className="truncate flex-1">{thread.title}</div>
                    <div className="text-xs text-neutral-500 flex items-center gap-1 whitespace-nowrap">
                      {formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true })}
                      <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default CategoryCard;
