
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { mockForumCategories, mockForumThreads } from '@/data/forumData';
import { Button } from '@/components/ui/button';
import { ChevronLeft, PlusCircle, MessageSquare } from 'lucide-react';
import ThreadListItem from '@/components/forum/ThreadListItem';
import SEO from '@/components/SEO';

const ForumCategory: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const category = mockForumCategories.find(cat => cat.id === id);
  
  // Filter threads that belong to this category
  // In a real implementation, this would be filtered by the API
  const categoryThreads = mockForumThreads.filter(thread => {
    // For demo purposes, we'll just take the first 3 threads for category 1,
    // next 2 for category 2, etc.
    if (id === '1') return ['1', '2', '3'].includes(thread.id);
    if (id === '2') return ['4', '5'].includes(thread.id);
    if (id === '3') return thread.tags.includes('Challenge');
    if (id === '4') return thread.tags.includes('Guide') || thread.tags.includes('Help');
    if (id === '5') return false; // No threads in this category yet
    return false;
  });
  
  if (!category) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Category Not Found</h2>
          <p className="text-gray-400 mb-6">The category you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/forum')}>
            Back to Forum
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-primary pb-16">
      <SEO 
        title={`${category.name} - Forum`}
        description={category.description}
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
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="bg-neon-blue/20 rounded-full p-3">
                <MessageSquare className="text-neon-blue h-6 w-6" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold">{category.name}</h1>
            </div>
            <p className="text-gray-400 mt-1">{category.description}</p>
          </div>
          
          <Link to="/forum/create">
            <Button className="gap-2">
              <PlusCircle size={18} />
              New Thread
            </Button>
          </Link>
        </div>
        
        <div className="mt-6">
          {categoryThreads.length > 0 ? (
            <div className="space-y-4">
              {categoryThreads.map(thread => (
                <ThreadListItem key={thread.id} thread={thread} />
              ))}
            </div>
          ) : (
            <div className="glass-card p-12 rounded-lg text-center">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Threads Yet</h3>
              <p className="text-gray-400 mb-6">Be the first to start a discussion in this category!</p>
              <Link to="/forum/create">
                <Button size="lg">
                  <PlusCircle size={18} className="mr-2" />
                  Create New Thread
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForumCategory;
