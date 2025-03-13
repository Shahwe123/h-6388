
import { useState, useEffect } from 'react';
import { X, Search, UserCircle, UserPlus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useDispatch, useSelector } from 'react-redux';
import { addNotification } from '@/redux/slices/notificationsSlice';

interface Profile {
  id: string;
  username: string;
  avatar_url: string | null;
}

interface UserSearchProps {
  userId: string | null;
  username: string | null;
  onClose: () => void;
}

// Define RootState interface to properly type the Redux state
interface RootState {
  user: {
    user: {
      id: string;
      user_metadata: {
        username: string;
      };
    } | null;
  };
}

const UserSearch = ({ userId, username, onClose }: UserSearchProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Profile[]>([]);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [pendingFriendRequests, setPendingFriendRequests] = useState<string[]>([]);
  const { toast } = useToast();
  const dispatch = useDispatch();
  
  // Get user data directly from Redux as a fallback
  const reduxUserData = useSelector((state: RootState) => state.user.user);
  
  // Use effect to log important information for debugging
  useEffect(() => {
    console.log('UserSearch component mounted with props:', { userId, username });
    console.log('Redux user data:', reduxUserData);
  }, [userId, username, reduxUserData]);

  const handleSearch = async () => {
    // Use the userId from props or fall back to Redux if available
    const effectiveUserId = userId || reduxUserData?.id;
    const effectiveUsername = username || reduxUserData?.user_metadata?.username;
    
    console.log('Search triggered with:', { 
      searchQuery, 
      effectiveUserId, 
      effectiveUsername,
      reduxAvailable: !!reduxUserData
    });
    
    if (!searchQuery.trim()) {
      console.log('Search cancelled: Empty query');
      return;
    }
    
    if (!effectiveUserId) {
      console.log('Search cancelled: Missing userId - This is the root cause of the issue');
      toast({
        title: 'Authentication error',
        description: 'Could not determine your user ID. Please try logging in again.',
        variant: 'destructive',
      });
      return;
    }
    
    setSearching(true);
    setHasSearched(true);
    
    try {
      console.log('Executing Supabase query for:', searchQuery, 'with user ID:', effectiveUserId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .ilike('username', `%${searchQuery}%`)
        .neq('id', effectiveUserId)
        .limit(10);
        
      console.log('Query completed. Error:', error);
      console.log('Query completed. Data:', data);
        
      if (error) throw error;
      
      setSearchResults(data || []);
      console.log('Search results set to state:', data ? data.length : 0, 'results');
    } catch (error: any) {
      console.error('Search error:', error);
      toast({
        title: 'Error searching users',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSearching(false);
      console.log('Search completed, searching state set to false');
    }
  };
  
  const sendFriendRequest = async (recipientId: string, recipientUsername: string) => {
    // Use the userId from props or fall back to Redux if available
    const effectiveUserId = userId || reduxUserData?.id;
    const effectiveUsername = username || reduxUserData?.user_metadata?.username;
    
    if (!effectiveUserId || !effectiveUsername) {
      toast({
        title: 'Authentication error',
        description: 'Could not determine your user ID. Please try logging in again.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      const { data: existingRequests, error: checkError } = await supabase
        .from('notifications')
        .select()
        .eq('sender_id', effectiveUserId)
        .eq('recipient_id', recipientId)
        .eq('type', 'friend_request');
        
      if (checkError) throw checkError;
      
      if (existingRequests && existingRequests.length > 0) {
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
          sender_id: effectiveUserId,
          sender_username: effectiveUsername,
          type: 'friend_request',
          read: false
        })
        .select();
        
      if (error) throw error;
      
      // Update Redux store with the new notification
      if (data && data.length > 0) {
        dispatch(addNotification(data[0]));
      }
      
      toast({
        title: 'Friend request sent',
        description: `A friend request has been sent to ${recipientUsername}`,
      });
      
      setPendingFriendRequests(prev => [...prev, recipientId]);
      setSearchResults(prev => prev.filter(user => user.id !== recipientId));
    } catch (error: any) {
      toast({
        title: 'Error sending friend request',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="bg-primary border border-neon-purple/30 rounded-xl w-full max-w-md">
      <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
        <h3 className="font-medium">Find Friends</h3>
        <button 
          className="p-1 text-neutral-400 hover:text-white transition-colors"
          onClick={() => {
            console.log('Modal closed');
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
              onChange={(e) => {
                console.log('Search input changed:', e.target.value);
                setSearchQuery(e.target.value);
              }}
              className="w-full bg-black/70 border border-neutral-700 rounded-md pl-10 pr-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neon-purple"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  console.log('Enter key pressed, triggering search');
                  handleSearch();
                }
              }}
            />
            <Search className="h-4 w-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
          <Button 
            className="cyber-button-sm"
            onClick={() => {
              console.log('Search button clicked');
              handleSearch();
            }}
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
              {searchResults.map((user) => (
                <div
                  key={user.id}
                  className="p-3 bg-black/30 rounded-lg flex items-center justify-between"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 bg-black/50 rounded-full flex items-center justify-center overflow-hidden">
                      {user.avatar_url ? (
                        <img src={user.avatar_url} alt={user.username} className="w-full h-full object-cover" />
                      ) : (
                        <UserCircle className="w-8 h-8 text-neutral-400" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{user.username}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => sendFriendRequest(user.id, user.username)}
                    className="p-2 bg-black/40 hover:bg-neon-purple/20 rounded transition-colors"
                    disabled={pendingFriendRequests.includes(user.id)}
                  >
                    {pendingFriendRequests.includes(user.id) ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : (
                      <UserPlus className="w-5 h-5 text-neutral-300" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSearch;
