
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { useProfileData } from '@/hooks/useProfileData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Users, Star, Activity, Gamepad, Pin } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import StatCharts from '@/components/profile/StatCharts';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import WishlistBacklogWidget from '@/components/wishlist/WishlistBacklogWidget';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [pinnedTrophies, setPinnedTrophies] = useState([]);
  const currentUser = useSelector((state: any) => state.user?.userData);
  const { toast } = useToast();
  const { profile, loading: profileLoading } = useProfileData(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        const mockPinnedTrophies = [
          {
            id: 1,
            name: "Platinum Master",
            game: "Elden Ring",
            description: "Obtain all trophies",
            type: "platinum",
            rarity: "Ultra Rare (2.1%)",
            image: "https://placehold.co/100x100?text=Trophy"
          },
          {
            id: 2,
            name: "First Blood",
            game: "God of War Ragnarök",
            description: "Defeat your first enemy",
            type: "bronze",
            rarity: "Common (98.7%)",
            image: "https://placehold.co/100x100?text=Trophy"
          },
          {
            id: 3,
            name: "Treasure Hunter",
            game: "Uncharted 4",
            description: "Find all treasures",
            type: "gold",
            rarity: "Rare (11.3%)",
            image: "https://placehold.co/100x100?text=Trophy"
          }
        ];
        
        setPinnedTrophies(mockPinnedTrophies);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast({
          title: "Error loading data",
          description: "Failed to load dashboard data. Please try again.",
          variant: "destructive"
        });
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [toast]);
  
  const weeklyStats = {
    trophiesEarned: 12,
    xpGained: 340,
    gamesPlayed: 3,
    hoursPlayed: 18
  };
  
  const recentActivity = [
    { type: 'trophy', game: 'Spider-Man 2', name: 'Web Slinger', date: '2 hours ago' },
    { type: 'game', name: 'God of War Ragnarök', action: 'started playing', date: '1 day ago' },
    { type: 'trophy', game: 'Elden Ring', name: 'First Steps', date: '3 days ago' },
    { type: 'game', name: 'Hogwarts Legacy', action: 'completed', date: '1 week ago' }
  ];
  
  if (isLoading || profileLoading) {
    return (
      <div className="page-container bg-primary flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-neon-purple border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  
  return (
    <div className="page-container bg-primary">
      <Helmet>
        <title>Dashboard | PlatinumPath</title>
        <meta name="description" content="View your gaming stats, pinned trophies, and progress" />
      </Helmet>
      
      <div className="max-w-7xl mx-auto container-padding">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Welcome back, {profile?.username || 'Gamer'}
          </h1>
          <p className="text-zinc-400 mt-1">Track your progress, set goals, and see your gaming journey</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="mr-2 h-5 w-5 text-neon-purple" />
                  Weekly Stats
                </CardTitle>
                <CardDescription>Your gaming activity from the past 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-black/20 p-4 rounded-lg text-center">
                    <Trophy className="h-5 w-5 mx-auto mb-2 text-yellow-400" />
                    <div className="text-xl font-bold">{weeklyStats.trophiesEarned}</div>
                    <div className="text-xs text-zinc-400">Trophies Earned</div>
                  </div>
                  <div className="bg-black/20 p-4 rounded-lg text-center">
                    <Star className="h-5 w-5 mx-auto mb-2 text-neon-blue" />
                    <div className="text-xl font-bold">{weeklyStats.xpGained}</div>
                    <div className="text-xs text-zinc-400">XP Gained</div>
                  </div>
                  <div className="bg-black/20 p-4 rounded-lg text-center">
                    <Gamepad className="h-5 w-5 mx-auto mb-2 text-neon-purple" />
                    <div className="text-xl font-bold">{weeklyStats.gamesPlayed}</div>
                    <div className="text-xs text-zinc-400">Games Played</div>
                  </div>
                  <div className="bg-black/20 p-4 rounded-lg text-center">
                    <Activity className="h-5 w-5 mx-auto mb-2 text-green-500" />
                    <div className="text-xl font-bold">{weeklyStats.hoursPlayed}</div>
                    <div className="text-xs text-zinc-400">Hours Played</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Tabs defaultValue="progression">
              <TabsList className="glass-card mb-4">
                <TabsTrigger value="progression">Trophy Progression</TabsTrigger>
                <TabsTrigger value="genre">Game Genres</TabsTrigger>
                <TabsTrigger value="platform">Platforms</TabsTrigger>
              </TabsList>
              <TabsContent value="progression" className="mt-0">
                <StatCharts />
              </TabsContent>
              <TabsContent value="genre" className="mt-0">
                <StatCharts chartType="pie" />
              </TabsContent>
              <TabsContent value="platform" className="mt-0">
                <Card className="glass-card p-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">PlayStation</span>
                        <span className="text-sm">68%</span>
                      </div>
                      <Progress value={68} className="h-2 bg-black/40" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Steam</span>
                        <span className="text-sm">24%</span>
                      </div>
                      <Progress value={24} className="h-2 bg-black/40" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Xbox</span>
                        <span className="text-sm">8%</span>
                      </div>
                      <Progress value={8} className="h-2 bg-black/40" />
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
            
            {/* Add the Wishlist & Backlog Widget */}
            <WishlistBacklogWidget />
          </div>
          
          <div className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Pin className="mr-2 h-5 w-5 text-neon-purple" />
                  Next Goals
                </CardTitle>
                <CardDescription>Your pinned trophies & achievements</CardDescription>
              </CardHeader>
              <CardContent>
                {pinnedTrophies.length === 0 ? (
                  <div className="text-center py-6 text-zinc-400">
                    <Pin className="mx-auto h-10 w-10 opacity-40 mb-2" />
                    <p>No pinned trophies yet</p>
                    <p className="text-sm mt-1">Pin trophies from games to track your goals</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pinnedTrophies.map((trophy) => (
                      <div key={trophy.id} className="bg-black/20 p-3 rounded-lg flex items-center">
                        <div className="flex-shrink-0 w-10 h-10 rounded-md bg-gradient-game flex items-center justify-center">
                          <Trophy className="h-5 w-5" />
                        </div>
                        <div className="ml-3 flex-1">
                          <div className="flex justify-between">
                            <p className="font-medium text-sm">{trophy.name}</p>
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              trophy.type === 'platinum' ? 'bg-neon-blue/20 text-neon-blue' :
                              trophy.type === 'gold' ? 'bg-yellow-500/20 text-yellow-500' :
                              trophy.type === 'silver' ? 'bg-zinc-400/20 text-zinc-300' :
                              'bg-amber-800/20 text-amber-600'
                            }`}>
                              {trophy.type}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-400">{trophy.game}</p>
                          <p className="text-xs text-zinc-500 mt-1">{trophy.rarity}</p>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" className="w-full mt-2">
                      Manage Goals
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="mr-2 h-5 w-5 text-neon-purple" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivity.map((activity, idx) => (
                    <div key={idx} className="border-b border-zinc-800 last:border-0 pb-2 last:pb-0">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center">
                          {activity.type === 'trophy' ? (
                            <Trophy className="h-4 w-4 text-yellow-400" />
                          ) : (
                            <Gamepad className="h-4 w-4 text-neon-purple" />
                          )}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm">
                            {activity.type === 'trophy' 
                              ? `Earned ${activity.name} in ${activity.game}`
                              : `${activity.action} ${activity.name}`}
                          </p>
                          <p className="text-xs text-zinc-500">{activity.date}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5 text-neon-purple" />
                  Friends Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4 text-zinc-400">
                  <Users className="mx-auto h-10 w-10 opacity-40 mb-2" />
                  <p>Stay updated with your friends</p>
                  <Button variant="outline" size="sm" className="mt-3">
                    View Friends
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
