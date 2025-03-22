
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockForumCategories, mockForumThreads } from '@/data/forumData';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CategoryCard from '@/components/forum/CategoryCard';
import ThreadListItem from '@/components/forum/ThreadListItem';
import { PlusCircle, MessageSquare, TrendingUp, Clock } from 'lucide-react';
import SEO from '@/components/SEO';

const Forum: React.FC = () => {
  const [activeTab, setActiveTab] = useState('categories');
  
  // Simulate "trending" threads by sorting by upvotes
  const trendingThreads = [...mockForumThreads]
    .sort((a, b) => b.upvotes - a.upvotes)
    .slice(0, 5);
  
  // Simulate "recent" threads by sorting by lastActivity
  const recentThreads = [...mockForumThreads]
    .sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime())
    .slice(0, 5);
  
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
            <div className="grid gap-4 md:grid-cols-2">
              {mockForumCategories.map(category => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="trending" className="mt-6">
            <div className="space-y-4">
              {trendingThreads.map(thread => (
                <ThreadListItem key={thread.id} thread={thread} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="recent" className="mt-6">
            <div className="space-y-4">
              {recentThreads.map(thread => (
                <ThreadListItem key={thread.id} thread={thread} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Forum;
