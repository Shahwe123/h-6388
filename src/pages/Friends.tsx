
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Users, UserPlus, Gamepad2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FriendsList from '@/components/friends/FriendsList';
import UserSearch from '@/components/friends/UserSearch';
import FriendActivity from '@/components/friends/FriendActivity';
import { useFriends } from '@/hooks/useFriends';

const Friends = () => {
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const { toast } = useToast();
  
  // Use the custom hook for friends data
  const { friends, setFriends, loading: friendsLoading } = useFriends(userId);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setLoading(false);
          return;
        }
        
        setUserId(session.user.id);
        
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', session.user.id)
          .single();
          
        if (profileError) throw profileError;
        setUsername(profileData.username);
      } catch (error: any) {
        toast({
          title: 'Error fetching user data',
          description: error.message,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [toast]);
  
  useEffect(() => {
    if (!userId) return;
    
    const notificationsChannel = supabase
      .channel('public:notifications')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'notifications',
        filter: `recipient_id=eq.${userId}`
      }, payload => {
        if (payload.new.type === 'friend_accepted') {
          // Friend acceptance handling is now in the useFriends hook
        }
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(notificationsChannel);
    };
  }, [userId]);

  if (loading || friendsLoading) {
    return (
      <div className="min-h-screen pt-20 bg-primary flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-neon-purple border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-neutral-300">Loading friends...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 bg-primary">
      <div className="container-padding mx-auto max-w-6xl">
        <div className="glass-card rounded-xl p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-neon-purple" />
              <h1 className="text-2xl md:text-3xl font-bold">Friends</h1>
            </div>
            
            <Button 
              className="cyber-button-sm flex items-center gap-2"
              onClick={() => setShowSearchModal(true)}
            >
              <UserPlus className="h-4 w-4" />
              Add Friend
            </Button>
          </div>
          
          <div className="bg-black/20 rounded-lg p-4">
            <FriendsList friends={friends} setFriends={setFriends} />
          </div>
        </div>
        
        <FriendActivity />
      </div>
      
      {showSearchModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <UserSearch 
            userId={userId} 
            username={username} 
            onClose={() => setShowSearchModal(false)} 
          />
        </div>
      )}
    </div>
  );
};

export default Friends;
