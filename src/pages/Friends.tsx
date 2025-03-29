
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useFriends } from '@/hooks/useFriends';
import { supabase } from '@/integrations/supabase/client';
import { Helmet } from 'react-helmet-async';
import FriendsList from '@/components/friends/FriendsList';
import UserSearch from '@/components/friends/UserSearch';
import FriendActivity from '@/components/friends/FriendActivity';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Friends = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const userData = useSelector((state: any) => state.user?.userData);
  const { friends, loading } = useFriends(userId);
  const { toast } = useToast();

  useEffect(() => {
    const getUserId = async () => {
      const { data } = await supabase.auth.getSession();
      setUserId(data.session?.user.id || null);
    };

    getUserId();
  }, []);

  return (
    <>
      <Helmet>
        <title>Friends | PlatinumPath</title>
        <meta name="description" content="Connect with friends and see their gaming activity" />
      </Helmet>

      <div className="container py-8 px-4 mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold mb-6 text-white">Friends</h1>
        
        <Tabs defaultValue="friends" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="friends">My Friends</TabsTrigger>
            <TabsTrigger value="find">Find Friends</TabsTrigger>
            <TabsTrigger value="activity">Friend Activity</TabsTrigger>
          </TabsList>
          
          <TabsContent value="friends">
            <FriendsList friends={friends} loading={loading} userId={userId} />
          </TabsContent>
          
          <TabsContent value="find">
            <UserSearch currentUserId={userId} />
          </TabsContent>
          
          <TabsContent value="activity">
            <FriendActivity friends={friends} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Friends;
