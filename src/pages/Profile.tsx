import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Trophy, UserCircle, BarChart3, Clock, Users, Gamepad, ImageIcon, Link, Medal, BarChart, ChartPie } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import LevelProgress from '@/components/profile/LevelProgress';
import RankBadge from '@/components/profile/RankBadge';
import TrophyCase from '@/components/profile/TrophyCase';
import AchievementBadge from '@/components/profile/AchievementBadge';
import RarityCard from '@/components/profile/RarityCard';
import StatCharts from '@/components/profile/StatCharts';
import SocialShare from '@/components/profile/SocialShare';
import { useSelector } from 'react-redux';

interface Profile {
  id: string;
  username: string;
  email: string;
  avatar_url: string | null;
  cover_url: string | null;
  bio: string | null;
  steam_id: string | null;
  xbox_gamertag: string | null;
  playstation_username: string | null;
  is_private: boolean | null;
}

// Mock trophy data 
const mockTrophies = [
  { id: '1', name: 'Platinum Master', type: 'platinum' as const, game: 'God of War', rarity: '0.1%', image: '/trophy1.png' },
  { id: '2', name: 'Gold Champion', type: 'gold' as const, game: 'Elden Ring', rarity: '1.2%' },
  { id: '3', name: 'Silver Star', type: 'silver' as const, game: 'Cyberpunk 2077', rarity: '5.7%' },
  { id: '4', name: 'Bronze Medal', type: 'bronze' as const, game: 'Call of Duty', rarity: '15.3%' },
  { id: '5', name: 'Ultra Rare', type: 'ultra-rare' as const, game: 'Red Dead Redemption 2', rarity: '0.01%' },
  { id: '6', name: 'Legendary', type: 'platinum' as const, game: 'The Last of Us', rarity: '0.5%' },
  { id: '7', name: 'Master Collector', type: 'gold' as const, game: 'Assassin\'s Creed', rarity: '2.3%' },
  { id: '8', name: 'First Blood', type: 'bronze' as const, game: 'Fortnite', rarity: '45.2%' },
];

// Mock friend comparison data
const mockFriendsForComparison = [
  {
    id: 'friend-1',
    username: 'GameMaster42',
    avatar_url: null,
    trophies: 30,
    platinums: 1,
    comparison: '+15'
  },
  {
    id: 'friend-2',
    username: 'TrophyHunter99',
    avatar_url: null,
    trophies: 42,
    platinums: 3,
    comparison: '+3'
  },
  {
    id: 'friend-3',
    username: 'ProGamer2023',
    avatar_url: null,
    trophies: 22,
    platinums: 0,
    comparison: '+23'
  }
];

const Profile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [friendCount, setFriendCount] = useState(0);
  const [searchParams] = useSearchParams();
  const profileId = searchParams.get('id');
  const { toast } = useToast();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isFriend, setIsFriend] = useState(false);
  
  // For the demo UI - these would come from the database in a real implementation
  const [playerStats] = useState({
    level: 12,
    xp: 2450,
    nextLevelXp: 3000,
    rank: 'Trophy Hunter',
    trophiesCount: 45,
    platinumCount: 3,
    gamesCompleted: 5,
    totalGames: 15
  });

  useEffect(() => {
    const fetchUserSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setCurrentUserId(session.user.id);
          return session.user.id;
        }
        return null;
      } catch (error) {
        console.error('Error fetching session:', error);
        return null;
      }
    };

    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const userId = await fetchUserSession();
        
        const targetProfileId = profileId || userId;
        
        if (!targetProfileId) {
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', targetProfileId)
          .single();

        if (error) {
          throw error;
        }

        setProfile(data as Profile);
        
        const { count, error: friendError } = await supabase
          .from('friends')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', targetProfileId);
          
        if (friendError) {
          throw friendError;
        }
        
        setFriendCount(count || 0);
        
        if (userId && profileId && userId !== profileId) {
          const { data: friendData, error: checkFriendError } = await supabase
            .from('friends')
            .select('id')
            .eq('user_id', userId)
            .eq('friend_id', profileId);
            
          if (checkFriendError) {
            console.error('Error checking friend status:', checkFriendError);
          } else {
            setIsFriend(friendData && friendData.length > 0);
          }
        }
      } catch (error: any) {
        toast({
          title: 'Error fetching profile',
          description: error.message,
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfileData();
    
    if (profileId) {
      const friendsChannel = supabase
        .channel(`profile-friends-${profileId}`)
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'friends',
          filter: `user_id=eq.${profileId}`
        }, () => {
          fetchFriendCount(profileId);
        })
        .subscribe();
        
      return () => {
        supabase.removeChannel(friendsChannel);
      };
    }
  }, [toast, profileId]);
  
  const fetchFriendCount = async (userId: string) => {
    try {
      const { count, error } = await supabase
        .from('friends')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);
        
      if (error) throw error;
      setFriendCount(count || 0);
    } catch (error) {
      console.error('Error fetching friend count:', error);
    }
  };

  if (loading) {
    return <div className="min-h-screen pt-20 bg-primary flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-neon-purple border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-neutral-300">Loading profile...</p>
        </div>
      </div>;
  }

  if (!profile) {
    return <div className="min-h-screen pt-20 bg-primary flex items-center justify-center">
        <div className="text-center">
          <p className="text-neutral-300 mb-4">Profile not found. Please try logging in again.</p>
        </div>
      </div>;
  }

  const hasLinkedAccounts = profile.steam_id || profile.xbox_gamertag || profile.playstation_username;
  const isOwnProfile = currentUserId === profile.id;
  const completionPercentage = Math.round((playerStats.gamesCompleted / playerStats.totalGames) * 100);

  return (
    <div className="min-h-screen pt-20 pb-12 bg-primary">
      <div className="container-padding mx-auto max-w-6xl">
        {/* Profile Header with Level */}
        <div className="glass-card rounded-xl p-8 mb-8 relative overflow-hidden">
          <div className="h-40 absolute top-0 left-0 right-0">
            {profile?.cover_url ? (
              <img src={profile.cover_url} alt="Profile cover" className="w-full h-full object-cover" />
            ) : (
              <div className="h-40 bg-gradient-game"></div>
            )}
          </div>
          
          <div className="relative mt-20">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <motion.div 
                className="w-24 h-24 bg-black/50 rounded-full border-4 border-neon-purple flex items-center justify-center overflow-hidden"
                whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(139, 92, 246, 0.5)' }}
              >
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt={profile.username} className="w-full h-full object-cover" />
                ) : (
                  <UserCircle className="w-20 h-20 text-neutral-400" />
                )}
              </motion.div>
              
              <div className="text-center md:text-left flex-1">
                <div className="flex items-center flex-wrap justify-center md:justify-start gap-2 mb-1">
                  <h1 className="text-2xl md:text-3xl font-bold neon-text">{profile?.username}</h1>
                  <RankBadge rank={playerStats.rank} />
                </div>
                <p className="text-neutral-300">{profile?.bio || 'No bio yet'}</p>
              </div>
              
              <SocialShare username={profile.username} />
            </div>
            
            {/* Level Progress Bar */}
            <div className="mt-6">
              <LevelProgress 
                level={playerStats.level} 
                xp={playerStats.xp} 
                nextLevelXp={playerStats.nextLevelXp}
                rank={playerStats.rank}
              />
            </div>
          </div>
          
          {/* Stats Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
            <div className="bg-black/30 p-4 rounded-lg text-center">
              <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
              <div className="text-xl font-bold">{playerStats.trophiesCount}</div>
              <div className="text-sm text-neutral-400">Trophies</div>
            </div>
            
            <div className="bg-black/30 p-4 rounded-lg text-center">
              <Medal className="w-6 h-6 text-neon-blue mx-auto mb-2" />
              <div className="text-xl font-bold">{playerStats.platinumCount}</div>
              <div className="text-sm text-neutral-400">Platinums</div>
            </div>
            
            <div className="bg-black/30 p-4 rounded-lg text-center">
              <BarChart3 className="w-6 h-6 text-neon-purple mx-auto mb-2" />
              <div className="text-xl font-bold">{completionPercentage}%</div>
              <div className="text-sm text-neutral-400">Completion Rate</div>
            </div>
            
            <div className="bg-black/30 p-4 rounded-lg text-center">
              <Users className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <div className="text-xl font-bold">{friendCount}</div>
              <div className="text-sm text-neutral-400">Friends</div>
            </div>
          </div>
        </div>
        
        {/* Trophy Showcase */}
        <TrophyCase trophies={mockTrophies} />
        
        {/* Achievement Highlights */}
        <div className="glass-card rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Achievement Highlights</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <RarityCard 
              title="🏆 Ultra-Rare Achievement" 
              description="Only 0.03% of players unlocked this" 
              icon="trophy"
              percentage="Top 0.1% worldwide"
            />
            
            <RarityCard 
              title="🕐 Fastest Completion" 
              description="Finished Elden Ring 100% in 72 hours" 
              icon="time"
              percentage="38% faster than average"
            />
            
            <RarityCard 
              title="🔥 Longest Grind" 
              description="250 hours spent in Red Dead Redemption 2" 
              icon="grind"
              percentage="Dedication Level: Legend"
            />
          </div>
        </div>
        
        {/* Gaming Stats Charts */}
        <div className="glass-card rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Gaming Stats</h2>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-neutral-400">View:</span>
              <div className="flex space-x-1 bg-black/30 p-1 rounded-md">
                <button className="p-1 rounded bg-neon-purple/30">
                  <BarChart className="h-4 w-4" />
                </button>
                <button className="p-1 rounded">
                  <ChartPie className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          
          <StatCharts />
        </div>
        
        {/* Linked Accounts Section */}
        <div className="glass-card rounded-xl p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Linked Gaming Accounts</h2>
            {isOwnProfile && (
              <RouterLink to="/link-accounts">
                <Button className="bg-gradient-game" size="sm">
                  <Link className="h-4 w-4 mr-1" /> 
                  {hasLinkedAccounts ? 'Manage Accounts' : 'Link Accounts'}
                </Button>
              </RouterLink>
            )}
          </div>
          
          {hasLinkedAccounts ? <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {profile.steam_id && <div className="bg-black/30 p-4 rounded-lg flex items-center gap-3">
                  <div className="w-10 h-10 bg-black/50 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11.979 0C5.678 0 0.511 4.86 0.022 11.037l6.432 2.658c0.545-0.371 1.203-0.59 1.912-0.59 0.063 0 0.125 0.004 0.188 0.008l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-0.105l-4.076 2.911c0 0.052 0.004 0.105 0.004 0.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L0.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.605 0 11.979 0zM7.54 18.21l-1.473-0.61c0.262 0.543 0.714 0.999 1.314 1.25 1.297 0.539 2.793-0.076 3.332-1.375 0.263-0.63 0.264-1.319 0.005-1.949s-0.75-1.121-1.377-1.383c-0.624-0.26-1.29-0.249-1.878-0.03l1.523 0.63c0.956 0.4 1.409 1.5 1.009 2.455-0.397 0.957-1.497 1.41-2.454 1.012H7.54zm11.415-9.303c0-1.662-1.353-3.015-3.015-3.015-1.665 0-3.015 1.353-3.015 3.015 0 1.665 1.35 3.015 3.015 3.015 1.663 0 3.015-1.35 3.015-3.015zm-5.273-0.005c0-1.252 1.013-2.266 2.265-2.266 1.249 0 2.266 1.014 2.266 2.266 0 1.251-1.017 2.265-2.266 2.266-1.253 0-2.265-1.014-2.265-2.265z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-neutral-400">Steam</div>
                    <div className="font-medium">{profile.steam_id}</div>
                  </div>
                </div>}
              
              {profile.xbox_gamertag && <div className="bg-black/30 p-4 rounded-lg flex items-center gap-3">
                  <div className="w-10 h-10 bg-black/50 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.382 0 0 5.382 0 12s5.382 12 12 12 12-5.382 12-12S18.618 0 12 0zm0 2c2.826 0 5.348 1.304 7 3.33l.031.03c.04.06.081.12.12.18l-5.951 5.95a3.277 3.277 0 01-2.38.91c-.868 0-1.736-.3-2.43-.9l-5.95-5.95a9.991 9.991 0 017.56-3.55zm-8.45 4.97L8.6 12l-5.05 5.03A9.971 9.971 0 012 12c0-1.89.523-3.661 1.43-5.174l.12.143zm16.9.03c.907 1.514 1.43 3.284 1.43 5.174 0 1.766-.454 3.428-1.25 4.882L15.4 12l5.05-5z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-neutral-400">Xbox</div>
                    <div className="font-medium">{profile.xbox_gamertag}</div>
                  </div>
                </div>}
              
              {profile.playstation_username && <div className="bg-black/30 p-4 rounded-lg flex items-center gap-3">
                  <div className="w-10 h-10 bg-black/50 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9.5 4.27c-.6.24-1.38.51-2.38.9C4.4 6.16 3 6.78 3 8.75v9.34c0 .86.64 1.3 1.37 1.17 2.14-.38 2.9-1.55 2.9-3.1V7.58c0-.38.21-.56.5-.47.29.09.45.31.45.7v12.7l2.26-.75V4.43s-.81-.4-1-.16zm5.3 1.61c-1.35.52-1.95 1.08-1.95 2.3v9.46c0 1.34.85 1.87 1.87 1.65.92-.2 1.49-.71 1.49-1.75V6.41l2.3-.77V4.71c-.01 0-2.38.66-3.71 1.17zm-.22 10.57c-.65 0-1.14-.29-1.14-.89 0-.59.5-1.09 1.14-1.09.65 0 1.09.5 1.09 1.09.01.6-.44.89-1.09.89z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-neutral-400">PlayStation</div>
                    <div className="font-medium">{profile.playstation_username}</div>
                  </div>
                </div>}
            </div> : <div className="text-neutral-400 text-center py-8">
              <Link className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No gaming accounts linked</p>
              <p className="text-sm mt-1">Connect your gaming accounts to track achievements and stats</p>
              {isOwnProfile && (
                <RouterLink to="/link-accounts" className="block mt-4">
                  <Button className="bg-gradient-game mt-2" size="sm">
                    Link Accounts
                  </Button>
                </RouterLink>
              )}
            </div>}
        </div>
        
        {/* Friends Comparison Section - ONLY show for the user's own profile */}
        {isOwnProfile && (
          <div className="glass-card rounded-xl p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Compare with Friends</h2>
              <Button 
                variant="outline"
                size="sm"
                className="bg-black/40 border-neon-purple/30 hover:bg-black/60"
              >
                <Users className="h-4 w-4 mr-2" />
                View All
              </Button>
            </div>
            
            {friendCount > 0 ? (
              <div className="space-y-4">
                <p className="text-sm text-neutral-400">
                  You have 13 more Platinum trophies than your friends on average!
                </p>
                
                {/* Mock friends comparison cards */}
                <div className="space-y-3">
                  {mockFriendsForComparison.map(friend => (
                    <div key={friend.id} className="bg-black/30 p-4 rounded-lg">
                      <div className="mb-3 flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-700 rounded-full overflow-hidden flex items-center justify-center">
                            {friend.avatar_url ? (
                              <img src={friend.avatar_url} alt={friend.username} className="w-full h-full object-cover" />
                            ) : (
                              <UserCircle className="w-6 h-6 text-neutral-400" />
                            )}
                          </div>
                          <span className="ml-2 font-medium">{friend.username}</span>
                        </div>
                        <RankBadge rank="Trophy Hunter" />
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-center text-sm">
                        <div>
                          <div className="font-bold">{friend.trophies}</div>
                          <div className="text-xs text-neutral-500">Trophies</div>
                        </div>
                        <div>
                          <div className="font-bold">{friend.platinums}</div>
                          <div className="text-xs text-neutral-500">Platinums</div>
                        </div>
                        <div>
                          <div className="font-bold text-green-500">{friend.comparison}</div>
                          <div className="text-xs text-neutral-500">Your Lead</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-neutral-400 text-center py-8">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No friends to compare with</p>
                <p className="text-sm mt-1">Add friends to compare your achievements</p>
              </div>
            )}
          </div>
        )}
        
        {/* Games Collection Section */}
        <div className="glass-card rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">Games Collection</h2>
          <div className="text-neutral-400 text-center py-8">
            <Gamepad className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No games in your collection</p>
            <p className="text-sm mt-1">Add games to start tracking your achievements</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
