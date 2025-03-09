
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  username: string;
  avatar_url: string | null;
}

interface Friend {
  id: string;
  friend: Profile;
}

export const useFriends = (userId: string | null) => {
  const [loading, setLoading] = useState(true);
  const [friends, setFriends] = useState<Friend[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    
    fetchFriends(userId);

    const friendsChannel = supabase
      .channel('public:friends')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'friends',
        filter: `user_id=eq.${userId}`
      }, () => {
        fetchFriends(userId);
      })
      .on('postgres_changes', { 
        event: 'DELETE', 
        schema: 'public', 
        table: 'friends',
        filter: `user_id=eq.${userId}`
      }, () => {
        fetchFriends(userId);
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(friendsChannel);
    };
  }, [userId]);

  const fetchFriends = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('friends')
        .select('id, friend_id')
        .eq('user_id', userId);
        
      if (error) throw error;
      
      if (!data || data.length === 0) {
        setFriends([]);
        setLoading(false);
        return;
      }
      
      const friendIds = data.map(item => item.friend_id);
      
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .in('id', friendIds);
        
      if (profilesError) throw profilesError;
      
      const formattedFriends: Friend[] = data.map(item => {
        const profile = profilesData?.find(p => p.id === item.friend_id);
        return {
          id: item.id,
          friend: {
            id: profile?.id || '',
            username: profile?.username || 'Unknown User',
            avatar_url: profile?.avatar_url
          }
        };
      }).filter(friend => friend.friend.id !== '');
      
      setFriends(formattedFriends);
    } catch (error: any) {
      toast({
        title: 'Error fetching friends',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return { friends, setFriends, loading };
};
