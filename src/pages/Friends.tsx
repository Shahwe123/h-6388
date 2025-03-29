import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Users, UserPlus, Gamepad2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FriendsList from '@/components/friends/FriendsList';
import UserSearch from '@/components/friends/UserSearch';
import FriendActivity from '@/components/friends/FriendActivity';
import { useSelector } from 'react-redux';
import { supabase } from '@/integrations/supabase/client';
import SEO from "../components/SEO";

const Friends = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [authSession, setAuthSession] = useState<any>(null);
  const { toast } = useToast();

  const { friends, loading: friendsLoading } = useSelector((state: any) => state.friends);
  const reduxUserData = useSelector((state: any) => state.user);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (reduxUserData.user.session) {
          setAuthSession(reduxUserData.user.session);
          setUserId(reduxUserData.user.session.user.id);
          setUsername(reduxUserData.user.user.user_metadata.username);
        } else {
          console.log("No session found");
        }
      } catch (error: any) {
        console.error("Error in fetchUserData:", error);
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
      <div className="page-container bg-primary flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-neon-purple border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-neutral-300">Loading friends...</p>
        </div>
      </div>
    );
  }

  const currentUser = userId ? {
    id: userId,
    username: username,
    session: authSession
  } : null;

  return (
    <div className="page-container bg-primary">
      <SEO 
        title="Connect with Gamer Friends" 
        description="Add friends, compare achievements, and climb the gaming leaderboards together."
      />
      <div className="container-padding mx-auto max-w-6xl">
        <div className="glass-card rounded-xl p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-neon-purple" />
              <h1 className="text-2xl md:text-3xl font-bold">Friends</h1>
            </div>

            <Button
              className="cyber-button-sm flex items-center gap-2"
              onClick={() => {
                console.log("Opening search modal with user data:", {
                  userId,
                  username,
                  sessionId: authSession?.user?.id
                });
                setShowSearchModal(true);
              }}
            >
              <UserPlus className="h-4 w-4" />
              Add Friend
            </Button>
          </div>

          <div className="bg-black/20 rounded-lg p-4">
            <FriendsList 
              friends={friends} 
              currentUser={currentUser}
              loading={friendsLoading}
            />
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
