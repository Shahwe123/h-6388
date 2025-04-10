import { useState, useEffect } from 'react';
import { X, Search, UserCircle, UserPlus, Check, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface Profile {
  id: string;
  username: string;
  avatar_url: string | null;
}

interface UserSearchProps {
  userId?: string | null;
  username?: string | null;
  onClose?: () => void;
  currentUser?: any;
  onAddFriend?: (friendId: string) => Promise<void>;
  existingFriends?: string[];
}

const UserSearch = ({ 
  userId: propsUserId, 
  username: propsUsername, 
  onClose, 
  currentUser,
  onAddFriend,
  existingFriends = []
}: UserSearchProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Profile[]>([]);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [pendingFriendRequests, setPendingFriendRequests] = useState<string[]>([]);
  const [currentSession, setCurrentSession] = useState<any>(null);
  const { toast } = useToast();
  const dispatch = useDispatch();
  
  const reduxUserData = useSelector((state: any) => state.user?.userData);
  const { friends } = useSelector((state: any) => state.friends);
  
  const userId = propsUserId || reduxUserData?.id;
  const username = propsUsername || reduxUserData?.username;
  
  useEffect(() => {
    const loadSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Error fetching auth session:", error);
        return;
      }
      
      if (data && data.session) {
        console.log("Session loaded:", data.session.user.id);
        setCurrentSession(data.session);
      } else {
        console.log("No active session");
      }
    };
    
    loadSession();
  }, []);
  
  useEffect(() => {
    console.log("UserSearch component initialized with:");
    console.log("Session user ID:", currentSession?.user?.id);
    console.log("Props userId:", propsUserId);
    console.log("Props username:", propsUsername);
    console.log("Redux userId:", reduxUserData?.id);
    console.log("Redux username:", reduxUserData?.username);
    console.log("Effective userId:", userId);
    console.log("Effective username:", username);
    console.log("Current friends:", friends);
  }, [propsUserId, propsUsername, reduxUserData, currentSession, friends]);

  const isExistingFriend = (userId: string) => {
    if (existingFriends && existingFriends.length > 0) {
      return existingFriends.includes(userId);
    }
    
    if (!friends || !Array.isArray(friends)) {
      console.log("Friends list is not available or not an array");
      return false;
    }
    
    const isFriend = friends.some((friend: any) => friend.friend && friend.friend.id === userId);
    console.log(`Checking if ${userId} is a friend:`, isFriend);
    return isFriend;
  };

  const handleSearch = async () => {
    console.log("Search triggered with:", { searchQuery, userId: currentSession?.user?.id || userId });
    if (!searchQuery.trim()) {
      console.log("Search query is empty, aborting search");
      toast({
        title: 'Please enter a username to search',
        variant: 'destructive',
      });
      return;
    }
    
    if (!currentSession?.user?.id && !userId) {
      console.log("No authenticated user ID available, aborting search");
      toast({
        title: 'You must be logged in to search for friends',
        variant: 'destructive',
      });
      return;
    }
    
    setSearching(true);
    setHasSearched(true);
    
    try {
      console.log("Executing search query for:", searchQuery);
      const authUserId = currentSession?.user?.id || userId;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .ilike('username', `%${searchQuery}%`)
        .neq('id', authUserId)
        .limit(10);
        
      if (error) {
        console.error("Search error:", error);
        throw error;
      }
      
      console.log("Search results:", data);
      setSearchResults(data || []);
    } catch (error: any) {
      console.error("Search error:", error);
      toast({
        title: 'Error searching users',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSearching(false);
    }
  };
  
  const sendFriendRequest = async (recipientId: string, recipientUsername: string) => {
    if (onAddFriend) {
      await onAddFriend(recipientId);
      return;
    }
    
    console.log("Sending friend request to:", { recipientId, recipientUsername });
    
    if (isExistingFriend(recipientId)) {
      console.log(`User ${recipientId} is already a friend, preventing friend request`);
      toast({
        title: 'Already friends',
        description: `You are already friends with ${recipientUsername}`,
      });
      return;
    }
    
    if (!currentSession?.user?.id) {
      console.error("No authenticated user session");
      toast({
        title: 'Authentication Error',
        description: 'Please log in to send friend requests',
        variant: 'destructive',
      });
      return;
    }

    const currentUserId = currentSession.user.id;
    const currentUsername = username || 'User';
    
    console.log("Current user:", { currentUserId, currentUsername });

    try {
      const { data: existingRequests, error: checkError } = await supabase
        .from('notifications')
        .select()
        .eq('sender_id', currentUserId)
        .eq('recipient_id', recipientId)
        .eq('type', 'friend_request');
        
      if (checkError) {
        console.error("Error checking existing requests:", checkError);
        throw checkError;
      }
      
      if (existingRequests && existingRequests.length > 0) {
        console.log("Friend request already sent:", existingRequests);
        toast({
          title: 'Friend request already sent',
          description: `You've already sent a request to ${recipientUsername}`,
        });
        return;
      }
      
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          recipient_id: recipientId,
          sender_id: currentUserId,
          sender_username: currentUsername,
          type: 'friend_request',
          read: false
        })
        .select();
        
      if (error) {
        console.error("Error inserting friend request:", error);
        throw error;
      }
      
      console.log("Friend request sent successfully:", data);
      
      toast({
        title: 'Friend request sent',
        description: `A friend request has been sent to ${recipientUsername}`,
      });
      
      setPendingFriendRequests(prev => [...prev, recipientId]);
      setSearchResults(prev => prev.filter(user => user.id !== recipientId));
    } catch (error: any) {
      console.error("Error sending friend request:", error);
      toast({
        title: 'Error sending friend request',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const filteredSearchResults = searchResults.filter(user => !isExistingFriend(user.id));

  return (
    <div className="bg-primary border border-neon-purple/30 rounded-xl w-full max-w-md">
      <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
        <h3 className="font-medium">Find Friends</h3>
        <button 
          className="p-1 text-neutral-400 hover:text-white transition-colors"
          onClick={() => {
            onClose();
            setSearchQuery('');
            setSearchResults([]);
            setHasSearched(false);
          }}
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/70 border border-neutral-700 rounded-md pl-10 pr-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neon-purple"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
            <Search className="h-4 w-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
          <Button 
            className="cyber-button-sm"
            onClick={handleSearch}
            disabled={searching || !searchQuery.trim()}
          >
            {searching ? 'Searching...' : 'Search'}
          </Button>
        </div>
        
        <div className="max-h-80 overflow-y-auto">
          {!hasSearched ? (
            <div className="text-center py-6 text-neutral-400">
              Search for users by username to add them as friends.
            </div>
          ) : searchResults.length === 0 ? (
            <div className="text-center py-6 text-neutral-400">
              No users found matching your search. Try a different name.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredSearchResults.map((user) => {
                const isFriend = isExistingFriend(user.id);
                const isPending = pendingFriendRequests.includes(user.id);
                
                return (
                  <div
                    key={user.id}
                    className="p-3 bg-black/30 rounded-lg flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <Avatar className="w-10 h-10 bg-black/50 rounded-full flex items-center justify-center overflow-hidden">
                        {user.avatar_url ? (
                          <AvatarImage 
                            src={user.avatar_url} 
                            alt={user.username} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <AvatarFallback>
                            <UserCircle className="w-8 h-8 text-neutral-400" />
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.username}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => sendFriendRequest(user.id, user.username)}
                      className="p-2 bg-black/40 hover:bg-neon-purple/20 rounded transition-colors"
                      disabled={isPending || isFriend}
                    >
                      {isPending ? (
                        <Check className="w-5 h-5 text-green-500" />
                      ) : isFriend ? (
                        <UserCheck className="w-5 h-5 text-neon-blue" />
                      ) : (
                        <UserPlus className="w-5 h-5 text-neutral-300" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSearch;
