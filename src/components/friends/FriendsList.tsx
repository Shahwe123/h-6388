
import { useState } from 'react';
import { UserCircle, UserMinus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  username: string;
  avatar_url: string | null;
}

interface Friend {
  id: string;
  friend: User;
}

interface FriendsListProps {
  friends: Friend[];
  setFriends: React.Dispatch<React.SetStateAction<Friend[]>>;
}

const FriendsList = ({ friends, setFriends }: FriendsListProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const removeFriend = async (friendId: string, friendUsername: string) => {
    try {
      const { error } = await supabase
        .from('friends')
        .delete()
        .or(`and(user_id.eq.${friendId},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${friendId})`);
        
      if (error) throw error;
      
      toast({
        title: 'Friend removed',
        description: `${friendUsername} has been removed from your friends list`,
      });
      
      setFriends(prev => prev.filter(f => f.friend.id !== friendId));
    } catch (error: any) {
      toast({
        title: 'Error removing friend',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const navigateToProfile = (friendId: string) => {
    navigate(`/profile?id=${friendId}`);
  };

  if (friends.length === 0) {
    return (
      <div className="text-center py-8 text-neutral-400">
        <div className="text-center py-8">
          <UserCircle className="h-16 w-16 mx-auto opacity-30 mb-4" />
          <h3 className="text-xl font-medium mb-2">No friends yet</h3>
          <p className="text-neutral-400 mb-6">
            Start adding friends to connect and see what games they're playing
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {friends.map((friend) => (
        <div
          key={friend.id}
          className="p-3 bg-black/30 rounded-lg flex items-center justify-between"
        >
          <div 
            className="flex items-center gap-3 flex-1 cursor-pointer"
            onClick={() => navigateToProfile(friend.friend.id)}
          >
            <div className="w-10 h-10 bg-black/50 rounded-full flex items-center justify-center overflow-hidden">
              {friend.friend.avatar_url ? (
                <img src={friend.friend.avatar_url} alt={friend.friend.username} className="w-full h-full object-cover" />
              ) : (
                <UserCircle className="w-8 h-8 text-neutral-400" />
              )}
            </div>
            <div>
              <div className="font-medium">{friend.friend.username}</div>
            </div>
          </div>
          <button
            onClick={() => removeFriend(friend.friend.id, friend.friend.username)}
            className="p-2 hover:bg-red-500/20 hover:border hover:border-red-500/50 rounded transition-colors"
            title="Remove friend"
          >
            <UserMinus className="w-5 h-5 text-neutral-300 hover:text-red-400" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default FriendsList;
