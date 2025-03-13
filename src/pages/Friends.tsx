
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Users, UserPlus, Gamepad2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FriendsList from '@/components/friends/FriendsList';
import UserSearch from '@/components/friends/UserSearch';
import FriendActivity from '@/components/friends/FriendActivity';
import { useSelector } from 'react-redux';
import { supabase } from '@/integrations/supabase/client';

const Friends = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const { toast } = useToast();
  
  // Use Redux for friends data
  const { friends, loading: friendsLoading } = useSelector((state) => state.friends);
  
  // We still need to fetch the userId and username for the UserSearch component
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setUserId(session.user.id);
          
          const { data: userData, error: userError } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', session.user.id)
            .single();
            
          if (userError) throw userError;
          setUsername(userData.username);
        }
      } catch (error) {
        toast({
          title: 'Error fetching user data',
          description: error.message,
          variant: 'destructive',
        });
      }
    };
    
    fetchUserData();
  }, [toast]);

  if (friendsLoading) {
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
            <FriendsList friends={friends} />
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
