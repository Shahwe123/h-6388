
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ComparisonHeader from '@/components/comparison/ComparisonHeader';
import StatComparison from '@/components/comparison/StatComparison';
import GameComparison from '@/components/comparison/GameComparison';
import Loading from '@/components/ui/Loading';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BarChart3, Gamepad, Clock, Trophy } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const FriendComparison = () => {
  const { friendId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [friendData, setFriendData] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const currentUser = useSelector((state: any) => state.user?.userData);
  
  useEffect(() => {
    const fetchComparisonData = async () => {
      try {
        setLoading(true);

        // Check if we have necessary data to proceed
        if (!currentUser?.id) {
          console.error("User data is missing");
          toast({
            title: "Authentication required",
            description: "Please sign in to view comparisons",
            variant: "destructive"
          });
          navigate('/auth');
          return;
        }

        if (!friendId) {
          console.error("Friend ID is missing");
          toast({
            title: "Missing information",
            description: "Could not find the friend to compare with",
            variant: "destructive"
          });
          navigate('/friends');
          return;
        }
        
        // Fetch friend's profile
        const { data: friendProfile, error: friendError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', friendId)
          .single();
          
        if (friendError) {
          console.error("Error fetching friend profile:", friendError);
          toast({
            title: "Friend not found",
            description: "Could not find the friend's profile",
            variant: "destructive"
          });
          navigate('/friends');
          return;
        }
        
        // Fetch current user's profile
        const { data: userProfile, error: userError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .single();
          
        if (userError) {
          console.error("Error fetching user profile:", userError);
          toast({
            title: "Error loading your profile",
            description: userError.message,
            variant: "destructive"
          });
          return;
        }
        
        // Mock data for comparison stats (in a real app, fetch this from database)
        const mockUserStats = {
          totalTrophies: 156,
          platinumCount: 8,
          goldCount: 32,
          silverCount: 48,
          bronzeCount: 68,
          completionRate: 72,
          totalGames: 42,
          totalPlaytime: 1862, // hours
          avgPlaytimePerGame: 44.3,
          mostPlayedGame: "Elden Ring",
          mostPlayedGameHours: 120,
          recentActivity: "3 days ago"
        };
        
        const mockFriendStats = {
          totalTrophies: 142,
          platinumCount: 6,
          goldCount: 28,
          silverCount: 45,
          bronzeCount: 63,
          completionRate: 68,
          totalGames: 38,
          totalPlaytime: 1548, // hours
          avgPlaytimePerGame: 40.7,
          mostPlayedGame: "God of War Ragnarök",
          mostPlayedGameHours: 98,
          recentActivity: "1 day ago"
        };
        
        // Mock game comparison data
        const mockGameComparison = [
          {
            id: 1,
            name: "Elden Ring",
            userTrophies: 24,
            friendTrophies: 18,
            userPlaytime: 120,
            friendPlaytime: 85,
            userCompletion: 92,
            friendCompletion: 68
          },
          {
            id: 2,
            name: "God of War Ragnarök",
            userTrophies: 32,
            friendTrophies: 36,
            userPlaytime: 86,
            friendPlaytime: 98,
            userCompletion: 78,
            friendCompletion: 95
          },
          {
            id: 3,
            name: "Cyberpunk 2077",
            userTrophies: 28,
            friendTrophies: 22,
            userPlaytime: 104,
            friendPlaytime: 92,
            userCompletion: 88,
            friendCompletion: 72
          },
        ];
        
        // Set friend data with mocked stats
        setFriendData({
          ...friendProfile, 
          stats: mockFriendStats,
          games: mockGameComparison
        });
        
        // Set user data with mocked stats
        setUserData({
          ...userProfile, 
          stats: mockUserStats,
          games: mockGameComparison
        });
        
      } catch (error: any) {
        console.error("Error fetching comparison data:", error);
        toast({
          title: "Error loading comparison",
          description: error.message,
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchComparisonData();
  }, [currentUser, friendId, navigate, toast]);
  
  if (loading) {
    return <Loading />;
  }

  if (!userData || !friendData) {
    return (
      <div className="min-h-screen bg-primary flex flex-col items-center justify-center">
        <div className="glass-card p-8 rounded-xl max-w-md mx-auto text-center">
          <h2 className="text-xl font-bold mb-4">Could not load comparison</h2>
          <p className="mb-6">There was an issue loading the comparison data. Please try again later.</p>
          <Button onClick={() => navigate('/friends')}>
            Back to Friends
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-primary pb-16">
      <Helmet>
        <title>Friend Comparison | PlatinumPath</title>
        <meta name="description" content="Compare your gaming stats with friends" />
      </Helmet>
      
      <div className="max-w-7xl mx-auto container-padding pt-8">
        <Button 
          variant="ghost" 
          className="mb-4" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <ComparisonHeader 
          userData={userData} 
          friendData={friendData} 
        />
        
        <Tabs defaultValue="overview" className="mt-8">
          <TabsList className="glass-card">
            <TabsTrigger value="overview">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="games">
              <Gamepad className="h-4 w-4 mr-2" />
              Games
            </TabsTrigger>
            <TabsTrigger value="trophies">
              <Trophy className="h-4 w-4 mr-2" />
              Trophies
            </TabsTrigger>
            <TabsTrigger value="playtime">
              <Clock className="h-4 w-4 mr-2" />
              Playtime
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <StatComparison 
                title="Trophy Comparison"
                icon={<Trophy className="h-5 w-5 text-yellow-400" />}
                userData={userData}
                friendData={friendData}
                stats={[
                  { 
                    label: "Total Trophies", 
                    userValue: userData.stats.totalTrophies, 
                    friendValue: friendData.stats.totalTrophies 
                  },
                  { 
                    label: "Platinum", 
                    userValue: userData.stats.platinumCount, 
                    friendValue: friendData.stats.platinumCount 
                  },
                  { 
                    label: "Gold", 
                    userValue: userData.stats.goldCount, 
                    friendValue: friendData.stats.goldCount 
                  },
                  { 
                    label: "Completion Rate", 
                    userValue: `${userData.stats.completionRate}%`, 
                    friendValue: `${friendData.stats.completionRate}%` 
                  }
                ]}
              />
              
              <StatComparison 
                title="Game Stats"
                icon={<Gamepad className="h-5 w-5 text-neon-purple" />}
                userData={userData}
                friendData={friendData}
                stats={[
                  { 
                    label: "Total Games", 
                    userValue: userData.stats.totalGames, 
                    friendValue: friendData.stats.totalGames 
                  },
                  { 
                    label: "Total Playtime", 
                    userValue: `${userData.stats.totalPlaytime} hrs`, 
                    friendValue: `${friendData.stats.totalPlaytime} hrs` 
                  },
                  { 
                    label: "Avg. Time per Game", 
                    userValue: `${userData.stats.avgPlaytimePerGame} hrs`, 
                    friendValue: `${friendData.stats.avgPlaytimePerGame} hrs` 
                  },
                  { 
                    label: "Most Played", 
                    userValue: userData.stats.mostPlayedGame, 
                    friendValue: friendData.stats.mostPlayedGame,
                    valueOnly: true
                  }
                ]}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="games" className="mt-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Gamepad className="mr-2 h-5 w-5 text-neon-purple" />
                  Shared Games Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userData.games.map((game: any) => (
                    <GameComparison 
                      key={game.id}
                      game={game}
                      userData={userData}
                      friendData={friendData}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="trophies" className="mt-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="mr-2 h-5 w-5 text-yellow-400" />
                  Trophy Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1 glass-card p-4 rounded-xl">
                      <h3 className="text-lg font-semibold mb-4">Trophy Breakdown</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-black/30 p-3 rounded-lg">
                          <div className="flex justify-between mb-2">
                            <span>Platinum</span>
                            <span className="font-bold text-neon-blue">{userData.stats.platinumCount}</span>
                          </div>
                          <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
                            <div 
                              className="bg-neon-blue h-full" 
                              style={{ width: `${(userData.stats.platinumCount / userData.stats.totalTrophies) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="bg-black/30 p-3 rounded-lg">
                          <div className="flex justify-between mb-2">
                            <span>Gold</span>
                            <span className="font-bold text-yellow-500">{userData.stats.goldCount}</span>
                          </div>
                          <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
                            <div 
                              className="bg-yellow-500 h-full" 
                              style={{ width: `${(userData.stats.goldCount / userData.stats.totalTrophies) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="bg-black/30 p-3 rounded-lg">
                          <div className="flex justify-between mb-2">
                            <span>Silver</span>
                            <span className="font-bold text-gray-300">{userData.stats.silverCount}</span>
                          </div>
                          <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
                            <div 
                              className="bg-gray-300 h-full" 
                              style={{ width: `${(userData.stats.silverCount / userData.stats.totalTrophies) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="bg-black/30 p-3 rounded-lg">
                          <div className="flex justify-between mb-2">
                            <span>Bronze</span>
                            <span className="font-bold text-amber-600">{userData.stats.bronzeCount}</span>
                          </div>
                          <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
                            <div 
                              className="bg-amber-600 h-full" 
                              style={{ width: `${(userData.stats.bronzeCount / userData.stats.totalTrophies) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-1 glass-card p-4 rounded-xl">
                      <h3 className="text-lg font-semibold mb-4">Your Friend's Trophy Breakdown</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-black/30 p-3 rounded-lg">
                          <div className="flex justify-between mb-2">
                            <span>Platinum</span>
                            <span className="font-bold text-neon-blue">{friendData.stats.platinumCount}</span>
                          </div>
                          <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
                            <div 
                              className="bg-neon-blue h-full" 
                              style={{ width: `${(friendData.stats.platinumCount / friendData.stats.totalTrophies) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="bg-black/30 p-3 rounded-lg">
                          <div className="flex justify-between mb-2">
                            <span>Gold</span>
                            <span className="font-bold text-yellow-500">{friendData.stats.goldCount}</span>
                          </div>
                          <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
                            <div 
                              className="bg-yellow-500 h-full" 
                              style={{ width: `${(friendData.stats.goldCount / friendData.stats.totalTrophies) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="bg-black/30 p-3 rounded-lg">
                          <div className="flex justify-between mb-2">
                            <span>Silver</span>
                            <span className="font-bold text-gray-300">{friendData.stats.silverCount}</span>
                          </div>
                          <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
                            <div 
                              className="bg-gray-300 h-full" 
                              style={{ width: `${(friendData.stats.silverCount / friendData.stats.totalTrophies) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="bg-black/30 p-3 rounded-lg">
                          <div className="flex justify-between mb-2">
                            <span>Bronze</span>
                            <span className="font-bold text-amber-600">{friendData.stats.bronzeCount}</span>
                          </div>
                          <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
                            <div 
                              className="bg-amber-600 h-full" 
                              style={{ width: `${(friendData.stats.bronzeCount / friendData.stats.totalTrophies) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="playtime" className="mt-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-green-500" />
                  Playtime Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="glass-card p-4 rounded-xl">
                    <h3 className="text-lg font-semibold mb-4">Your Top Games by Playtime</h3>
                    <div className="space-y-3">
                      {userData.games.map((game: any) => (
                        <div key={game.id} className="bg-black/30 p-3 rounded-lg">
                          <div className="flex justify-between mb-2">
                            <span className="font-medium">{game.name}</span>
                            <span className="font-mono">{game.userPlaytime} hrs</span>
                          </div>
                          <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
                            <div 
                              className="bg-neon-purple h-full" 
                              style={{ width: `${(game.userPlaytime / 120) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="glass-card p-4 rounded-xl">
                    <h3 className="text-lg font-semibold mb-4">Your Friend's Top Games by Playtime</h3>
                    <div className="space-y-3">
                      {friendData.games.map((game: any) => (
                        <div key={game.id} className="bg-black/30 p-3 rounded-lg">
                          <div className="flex justify-between mb-2">
                            <span className="font-medium">{game.name}</span>
                            <span className="font-mono">{game.friendPlaytime} hrs</span>
                          </div>
                          <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
                            <div 
                              className="bg-green-500 h-full" 
                              style={{ width: `${(game.friendPlaytime / 98) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FriendComparison;
