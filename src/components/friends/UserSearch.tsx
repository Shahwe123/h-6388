
import { useState } from 'react';
import { X, Search, UserCircle, UserPlus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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

const UserSearch = ({ userId, username, onClose }: UserSearchProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Profile[]>([]);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [pendingFriendRequests, setPendingFriendRequests] = useState<string[]>([]);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchQuery.trim() || !userId) return;
    
    setSearching(true);
    setHasSearched(true);
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, username, avatar_url')
        .ilike('username', `%${searchQuery}%`)
        .neq('id', userId)
        .limit(10);
        
      if (error) throw error;
      
      // Here we'd normally filter out existing friends, but we need to pass friends list
      // Since we don't have access to friends list here, we'll show all results
      setSearchResults(data || []);
    } catch (error: any) {
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
    if (!userId || !username) return;
    
    try {
      const { data: existingRequests, error: checkError } = await supabase
        .from('notifications')
        .select()
        .eq('sender_id', userId)
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
      
      const { error } = await supabase
        .from('notifications')
        .insert({
          recipient_id: recipientId,
          sender_id: userId,
          sender_username: username,
          type: 'friend_request',
          read: false
        });
        
      if (error) throw error;
      
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
