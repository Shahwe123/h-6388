import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Users, User, UserPlus, X, Search, Gamepad2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface Profile {
  id: string;
  username: string;
  avatar_url: string | null;
}

interface Friend {
  id: string;
  friend: Profile;
}

const Friends = () => {
  const [loading, setLoading] = useState(true);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Profile[]>([]);
  const [searching, setSearching] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserAndFriends = async () => {
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
        
        await fetchFriends(session.user.id);
      } catch (error: any) {
        toast({
          title: 'Error fetching data',
          description: error.message,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserAndFriends();
  }, [toast]);
  
  const fetchFriends = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('friends')
        .select('id, friend_id')
        .eq('user_id', userId);
        
      if (error) throw error;
      
      if (!data || data.length === 0) {
        setFriends([]);
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
    }
  };
  
  const handleSearch = async () => {
    if (!searchQuery.trim() || !userId) return;
    
    setSearching(true);
    setHasSearched(true);
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .ilike('username', `%${searchQuery}%`)
        .neq('id', userId)
        .limit(10);
        
      if (error) throw error;
      
      const friendIds = friends.map(f => f.friend.id);
      const filteredResults = data?.filter(user => !friendIds.includes(user.id)) || [];
      
      setSearchResults(filteredResults);
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
      
      setSearchResults(prev => prev.filter(user => user.id !== recipientId));
    } catch (error: any) {
      toast({
        title: 'Error sending friend request',
        description: error.message,
        variant: 'destructive',
      });
    }
  };
  
  const removeFriend = async (friendId: string, friendUsername: string) => {
    if (!userId) return;
    
    try {
      const { error } = await supabase
        .from('friends')
        .delete()
        .or(`and(user_id.eq.${userId},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${userId})`);
        
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

  if (loading) {
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
            {friends.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-16 w-16 mx-auto opacity-30 mb-4" />
                <h3 className="text-xl font-medium mb-2">No friends yet</h3>
                <p className="text-neutral-400 mb-6">
                  Start adding friends to connect and see what games they're playing
                </p>
                <Button 
                  className="cyber-button-sm"
                  onClick={() => setShowSearchModal(true)}
                >
                  Find Friends
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {friends.map(({ id, friend }) => (
                  <div key={id} className="bg-black/30 rounded-lg p-4 flex items-center justify-between">
                    <Link to={`/profile/${friend.id}`} className="flex items-center gap-3 hover:opacity-90 transition-opacity">
                      <div className="w-12 h-12 rounded-full bg-neon-purple/20 flex items-center justify-center overflow-hidden">
                        {friend.avatar_url ? (
                          <img 
                            src={friend.avatar_url} 
                            alt={friend.username} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="h-6 w-6 text-neon-purple" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{friend.username}</p>
                      </div>
                    </Link>
                    
                    <button 
                      className="p-2 rounded text-neutral-400 hover:text-white hover:bg-red-500/80 hover:text-white transition-all duration-200"
                      onClick={() => removeFriend(friend.id, friend.username)}
                      title="Remove friend"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="glass-card rounded-xl p-8">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Gamepad2 className="h-5 w-5 text-neon-pink" />
            Friend Activity
          </h2>
          
          <div className="bg-black/20 rounded-lg p-4 text-center py-8">
            <Gamepad2 className="h-16 w-16 mx-auto opacity-30 mb-4" />
            <h3 className="text-xl font-medium mb-2">No recent activity</h3>
            <p className="text-neutral-400">
              Connect your gaming accounts to track your friends' achievements and stats
            </p>
          </div>
        </div>
      </div>
      
      {showSearchModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-primary border border-neon-purple/30 rounded-xl w-full max-w-md">
            <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
              <h3 className="font-medium">Find Friends</h3>
              <button 
                className="p-1 text-neutral-400 hover:text-white transition-colors"
                onClick={() => {
                  setShowSearchModal(false);
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
                    {searchResults.map(user => (
                      <div key={user.id} className="bg-black/30 rounded-lg p-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-neon-purple/20 flex items-center justify-center overflow-hidden">
                            {user.avatar_url ? (
                              <img 
                                src={user.avatar_url} 
                                alt={user.username} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User className="h-5 w-5 text-neon-purple" />
                            )}
                          </div>
                          <p className="font-medium">{user.username}</p>
                        </div>
                        
                        <Button 
                          className="cyber-button-sm p-2 transition-all duration-200 hover:bg-neon-purple hover:text-white"
                          onClick={() => sendFriendRequest(user.id, user.username)}
                        >
                          <UserPlus className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Friends;
