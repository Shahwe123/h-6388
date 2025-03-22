
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CategoryCard from '@/components/forum/CategoryCard';
import ThreadListItem from '@/components/forum/ThreadListItem';
import { PlusCircle, MessageSquare, TrendingUp, Clock, AlertTriangle } from 'lucide-react';
import SEO from '@/components/SEO';
import { useForumData } from '@/hooks/useForumData';
import { supabase } from "@/integrations/supabase/client";

const Forum: React.FC = () => {
  const [activeTab, setActiveTab] = useState('categories');
  const { 
    categoriesQuery, 
    getTrendingThreads,
    getRecentThreads
  } = useForumData();
  
  const trendingThreadsQuery = getTrendingThreads(5);
  const recentThreadsQuery = getRecentThreads(5);
  
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
  
  return (
    <div className="min-h-screen bg-primary pb-16">
      <SEO 
        title="Community Forum"
        description="Join discussions, share tips, and connect with other gamers in our community forums."
      />
      
      <div className="max-w-7xl mx-auto container-padding">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold neon-text">Community Forum</h1>
            <p className="text-gray-400 mt-1">Connect, share, and discuss with fellow gamers</p>
          </div>
          
          <Link to="/forum/create">
            <Button className="gap-2">
              <PlusCircle size={18} />
              New Thread
            </Button>
          </Link>
        </div>
        
        {isLoggedIn === false && (
          <div className="mb-6 p-4 bg-amber-950/50 border border-amber-800/50 rounded-lg flex items-center gap-3">
            <AlertTriangle className="text-amber-500 h-5 w-5" />
            <div className="text-sm">
              <span className="font-medium text-amber-400">Login required for full access.</span>
              <span className="text-gray-300 ml-2">You must be logged in to create threads, post comments, and upvote content.</span>
            </div>
          </div>
        )}
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="w-full sm:w-auto grid grid-cols-3 bg-background/20 h-auto p-1">
            <TabsTrigger 
              value="categories"
              className="flex items-center gap-2 data-[state=active]:bg-background/80"
            >
              <MessageSquare size={16} />
              <span className="hidden sm:inline">Categories</span>
            </TabsTrigger>
            <TabsTrigger 
              value="trending"
              className="flex items-center gap-2 data-[state=active]:bg-background/80"
            >
              <TrendingUp size={16} />
              <span className="hidden sm:inline">Trending</span>
            </TabsTrigger>
            <TabsTrigger 
              value="recent"
              className="flex items-center gap-2 data-[state=active]:bg-background/80"
            >
              <Clock size={16} />
              <span className="hidden sm:inline">Recent</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="categories" className="mt-6">
            {categoriesQuery.isLoading ? (
              <div className="grid gap-4 md:grid-cols-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="glass-card rounded-lg p-4 animate-pulse">
                    <div className="h-6 bg-gray-700/50 rounded w-1/3 mb-3"></div>
                    <div className="h-4 bg-gray-700/50 rounded w-3/4 mb-6"></div>
                    <div className="h-3 bg-gray-700/50 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-700/50 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : categoriesQuery.error ? (
              <div className="text-center py-8">
                <p className="text-red-400">Error loading categories. Please try again later.</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {categoriesQuery.data?.map(category => (
                  <CategoryCard key={category.id} category={category} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="trending" className="mt-6">
            {trendingThreadsQuery.isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="glass-card rounded-lg p-4 animate-pulse">
                    <div className="h-5 bg-gray-700/50 rounded w-1/4 mb-3"></div>
                    <div className="h-6 bg-gray-700/50 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-700/50 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : trendingThreadsQuery.error ? (
              <div className="text-center py-8">
                <p className="text-red-400">Error loading trending threads. Please try again later.</p>
              </div>
            ) : trendingThreadsQuery.data?.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <MessageSquare className="mx-auto h-12 w-12 opacity-30 mb-3" />
                <p>No trending threads yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {trendingThreadsQuery.data?.map(thread => (
                  <ThreadListItem key={thread.id} thread={thread} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="recent" className="mt-6">
            {recentThreadsQuery.isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="glass-card rounded-lg p-4 animate-pulse">
                    <div className="h-5 bg-gray-700/50 rounded w-1/4 mb-3"></div>
                    <div className="h-6 bg-gray-700/50 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-700/50 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : recentThreadsQuery.error ? (
              <div className="text-center py-8">
                <p className="text-red-400">Error loading recent threads. Please try again later.</p>
              </div>
            ) : recentThreadsQuery.data?.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <MessageSquare className="mx-auto h-12 w-12 opacity-30 mb-3" />
                <p>No threads yet. Be the first to create one!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentThreadsQuery.data?.map(thread => (
                  <ThreadListItem key={thread.id} thread={thread} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Forum;
