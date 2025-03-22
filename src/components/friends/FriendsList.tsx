
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { User, Users, Trash2, BarChart3 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import UserSearch from './UserSearch';

interface Friend {
  id: string;
  friend: {
    id: string;
    username: string;
    avatar_url: string | null;
  };
}

interface FriendsListProps {
  friends: Friend[];
  currentUser: any;
  loading: boolean;
}

const FriendsList = ({ friends, currentUser, loading }: FriendsListProps) => {
  const navigate = useNavigate();
  const [showUserSearch, setShowUserSearch] = useState(false);
  const { toast } = useToast();

  const handleAddFriend = async (friendId: string) => {
    try {
      const { error } = await supabase
        .from('friends')
        .insert([{ user_id: currentUser.id, friend_id: friendId }]);

      if (error) {
        toast({
          title: 'Error adding friend',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Friend added',
          description: 'You have successfully added a new friend.',
        });
        setShowUserSearch(false);
      }
    } catch (error: any) {
      toast({
        title: 'Error adding friend',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleRemoveFriend = async (friendId: string) => {
    try {
      const { error } = await supabase
        .from('friends')
        .delete()
        .eq('user_id', currentUser.id)
        .eq('friend_id', friendId);

      if (error) {
        toast({
          title: 'Error removing friend',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Friend removed',
          description: 'You have successfully removed a friend.',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error removing friend',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  // Function to navigate to a friend's profile
  const navigateToProfile = (username: string) => {
    if (!username) return;
    // Ensure the username is properly encoded for URLs
    navigate(`/profile/${encodeURIComponent(username.trim())}`);
  };

  // Function to navigate to comparison page
  const navigateToComparison = (friendId: string) => {
    if (!friendId) return;
    console.log(`Navigating to comparison with friend: ${friendId}`);
    navigate(`/friends/compare/${friendId}`);
  };

  return (
    <div className="glass-card rounded-xl">
      <div className="p-4 border-b border-zinc-800">
        <h2 className="text-xl font-bold">Your Friends</h2>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="w-8 h-8 border-4 border-neon-purple border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : friends.length === 0 ? (
        <div className="p-8 text-center">
          <Users className="mx-auto h-12 w-12 text-neutral-500 mb-3" />
          <h3 className="text-lg font-semibold mb-2">No friends yet</h3>
          <p className="text-neutral-400 mb-4">
            Add friends to compare stats and track each other's progress
          </p>
          <Button onClick={() => setShowUserSearch(true)}>
            Find Friends
          </Button>
        </div>
      ) : (
        <div className="divide-y divide-zinc-800/50">
          {friends.map((friendItem) => (
            <div key={friendItem.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-zinc-800 rounded-full overflow-hidden">
                    {friendItem.friend.avatar_url ? (
                      <img 
                        src={friendItem.friend.avatar_url} 
                        alt={friendItem.friend.username} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-6 h-6 m-2 text-zinc-400" />
                    )}
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium">{friendItem.friend.username}</h3>
                    <div className="flex items-center text-xs text-zinc-400">
                      <span>Last online: 2 days ago</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-xs"
                    onClick={() => navigateToProfile(friendItem.friend.username)}
                  >
                    <User className="h-3.5 w-3.5 mr-1" />
                    Profile
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-xs"
                    onClick={() => navigateToComparison(friendItem.friend.id)}
                  >
                    <BarChart3 className="h-3.5 w-3.5 mr-1" />
                    Compare
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="glass-card border border-zinc-800">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remove Friend</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to remove {friendItem.friend.username} from your friends list?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-black/40 hover:bg-black/60">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:text-red-300"
                          onClick={() => handleRemoveFriend(friendItem.friend.id)}
                        >
                          Remove
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* User search modal */}
      {showUserSearch && (
        <Dialog open={showUserSearch} onOpenChange={setShowUserSearch}>
          <DialogContent className="glass-card sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Find Friends</DialogTitle>
              <DialogDescription>
                Search for users by username to add them as friends
              </DialogDescription>
            </DialogHeader>
            <UserSearch
              currentUser={currentUser}
              onAddFriend={handleAddFriend}
              existingFriends={friends.map(f => f.friend.id)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default FriendsList;
