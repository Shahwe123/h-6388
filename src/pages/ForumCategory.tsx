
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft, PlusCircle, MessageSquare } from 'lucide-react';
import ThreadListItem from '@/components/forum/ThreadListItem';
import SEO from '@/components/SEO';
import { useForumData } from '@/hooks/useForumData';
import { supabase } from '@/integrations/supabase/client';

const ForumCategory: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCategory, getCategoryThreads } = useForumData();
  
  const categoryQuery = useQuery({
    queryKey: ['forumCategory', id],
    queryFn: () => forumService.getCategory(id || ''),
    enabled: !!id,
  });
  
  const threadsQuery = getCategoryThreads(id || '');
  
  // Check if user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  
  React.useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsLoggedIn(!!data.session);
    };
    
    checkAuth();
    
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session);
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  
  if (categoryQuery.isLoading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="animate-pulse space-y-4 w-full max-w-xl px-4">
          <div className="h-8 bg-gray-700/50 rounded w-1/3"></div>
          <div className="h-6 bg-gray-700/50 rounded w-2/3"></div>
          <div className="h-32 bg-gray-700/50 rounded w-full"></div>
        </div>
      </div>
    );
  }
  
  if (categoryQuery.error || !categoryQuery.data) {
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
  
  const category = categoryQuery.data;
  
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
            <Button className="gap-2" disabled={!isLoggedIn}>
              <PlusCircle size={18} />
              New Thread
            </Button>
          </Link>
        </div>
        
        <div className="mt-6">
          {threadsQuery.isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="glass-card rounded-lg p-4 animate-pulse">
                  <div className="h-5 bg-gray-700/50 rounded w-1/4 mb-3"></div>
                  <div className="h-6 bg-gray-700/50 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-700/50 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : threadsQuery.error ? (
            <div className="text-center py-8">
              <p className="text-red-400">Error loading threads. Please try again later.</p>
            </div>
          ) : threadsQuery.data?.length === 0 ? (
            <div className="glass-card p-12 rounded-lg text-center">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Threads Yet</h3>
              <p className="text-gray-400 mb-6">Be the first to start a discussion in this category!</p>
              <Link to="/forum/create">
                <Button size="lg" disabled={!isLoggedIn}>
                  <PlusCircle size={18} className="mr-2" />
                  Create New Thread
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {threadsQuery.data?.map(thread => (
                <ThreadListItem key={thread.id} thread={thread} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForumCategory;
