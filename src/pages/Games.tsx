
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useProfileData } from '@/hooks/useProfileData';
import { supabase } from '@/integrations/supabase/client';
import { Gamepad, Filter, Grid, List, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSelector } from 'react-redux';
import { Game } from '@/types/game';
import { getGames } from '@/helpers/gameHelpers';
import { format } from 'date-fns';
import SEO from "../components/SEO";

const Games = () => {
  const { username } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [games, setGames] = useState<Game[]>([]);
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [sortBy, setSortBy] = useState('lastPlayed');
  const [availablePlatforms, setAvailablePlatforms] = useState<string[]>([]);
  
  // Get games from Redux store for the current user
  const reduxGames = useSelector((state: any) => state.games?.games || []);
  
  const { profile, loading: profileLoading, isOwnProfile } = useProfileData(username || null);
  
  useEffect(() => {
    const fetchGames = async () => {
      try {
        setIsLoading(true);
        
        let userGames: Game[] = [];
        
        if (isOwnProfile && reduxGames.length > 0) {
          // Use games from Redux for current user
          userGames = reduxGames;
        } else if (profile?.id) {
          // Fetch games for the profile being viewed
          userGames = await getGames(profile.id);
        }
        
        // Extract unique platforms
        const platforms = [...new Set(userGames.map(game => game.platform))];
        setAvailablePlatforms(platforms);
        
        setGames(userGames);
        setFilteredGames(userGames);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching games:", error);
        setIsLoading(false);
      }
    };
    
    if (!profileLoading && profile) {
      fetchGames();
    }
  }, [username, reduxGames, profile, profileLoading, isOwnProfile]);
  
  useEffect(() => {
    let result = [...games];
    
    if (searchQuery) {
      result = result.filter(game => 
        game.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (platformFilter !== 'all') {
      result = result.filter(game => 
        game.platform.toLowerCase().includes(platformFilter.toLowerCase())
      );
    }
    
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'completion':
          return b.completion - a.completion;
        case 'trophyCount':
          const aTrophyCount = a.trophyCount || (a.trophies?.length || 0);
          const bTrophyCount = b.trophyCount || (b.trophies?.length || 0);
          return bTrophyCount - aTrophyCount;
        case 'lastPlayed':
        default:
          // If lastPlayed isn't available, sort by name
          if (!a.lastPlayed && !b.lastPlayed) return a.name.localeCompare(b.name);
          if (!a.lastPlayed) return 1;
          if (!b.lastPlayed) return -1;
          return new Date(b.lastPlayed).getTime() - new Date(a.lastPlayed).getTime();
      }
    });
    
    setFilteredGames(result);
  }, [games, searchQuery, platformFilter, sortBy]);
  
  if (isLoading || profileLoading) {
    return (
      <div className="page-container bg-primary flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-neon-purple border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  
  if (!profile) {
    return (
      <div className="page-container bg-primary flex items-center justify-center">
        <div className="text-center">
          <Gamepad className="h-16 w-16 mx-auto mb-4 text-zinc-600" />
          <h2 className="text-2xl font-bold mb-2">Profile Not Found</h2>
          <p className="text-zinc-400">We couldn't find the gamer you're looking for.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="page-container bg-primary">
      <SEO
        title="Game Collection | PlatinumPath"
        description="View your game collection and achievements"
      />
      
      <div className="max-w-7xl mx-auto container-padding">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              {isOwnProfile ? 'Your Games' : `${profile.username}'s Games`}
            </h1>
            <p className="text-zinc-400 mt-1">{filteredGames.length} games in collection</p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon"
              className={viewMode === 'grid' ? 'bg-neon-purple/20' : ''}
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              className={viewMode === 'list' ? 'bg-neon-purple/20' : ''}
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Card className="glass-card mb-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-zinc-500" />
                  <Input
                    placeholder="Search games..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="w-full sm:w-auto">
                <Select
                  value={platformFilter}
                  onValueChange={setPlatformFilter}
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Platforms</SelectItem>
                    {availablePlatforms.map(platform => (
                      <SelectItem key={platform} value={platform.toLowerCase()}>
                        {platform}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full sm:w-auto">
                <Select
                  value={sortBy}
                  onValueChange={setSortBy}
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lastPlayed">Last Played</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="completion">Completion %</SelectItem>
                    <SelectItem value="trophyCount">Trophy Count</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {filteredGames.length === 0 ? (
          <div className="glass-card p-10 text-center">
            <Gamepad className="h-16 w-16 mx-auto mb-4 text-zinc-600" />
            <h2 className="text-xl font-bold mb-2">No Games Found</h2>
            <p className="text-zinc-400">Try adjusting your filters or search query.</p>
            {isOwnProfile && games.length === 0 && (
              <Link to="/link-accounts" className="block mt-4">
                <Button className="mt-4">Link Your Gaming Accounts</Button>
              </Link>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredGames.map(game => (
              <Link to={`/games/${game.id}`} key={game.id} className="transition-transform hover:scale-105">
                <div className="glass-card h-full overflow-hidden rounded-lg flex flex-col">
                  <div className="relative">
                    <img 
                      src={game.image || 'https://placehold.co/300x400?text=Game'} 
                      alt={game.name}
                      className="w-full object-cover aspect-[3/4]"
                      onError={(e) => {
                        const imgElement = e.target as HTMLImageElement;
                        imgElement.src = 'https://placehold.co/300x400?text=Game';
                      }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                      <div className="flex justify-between items-center">
                        <div className="text-xs font-medium bg-black/60 px-2 py-1 rounded">
                          {game.platform}
                        </div>
                        <div className="text-xs font-medium bg-neon-purple/80 px-2 py-1 rounded">
                          {Math.round(game.completion)}%
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-bold text-sm line-clamp-1">{game.name}</h3>
                    <div className="flex justify-between mt-2 text-xs text-zinc-400">
                      <span>{game.trophyCount || (game.trophies?.length || 0)} Trophies</span>
                      <span>
                        {game.lastPlayed 
                          ? format(new Date(game.lastPlayed), 'MM/dd/yyyy')
                          : 'No date'
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredGames.map(game => (
              <Link to={`/games/${game.id}`} key={game.id}>
                <div className="glass-card p-3 flex items-center hover:bg-neon-purple/10 transition-colors">
                  <img 
                    src={game.image || 'https://placehold.co/300x400?text=Game'} 
                    alt={game.name}
                    className="w-16 h-16 object-cover rounded"
                    onError={(e) => {
                      const imgElement = e.target as HTMLImageElement;
                      imgElement.src = 'https://placehold.co/64x64?text=Game';
                    }}
                  />
                  <div className="ml-4 flex-1">
                    <h3 className="font-bold">{game.name}</h3>
                    <div className="flex items-center text-sm text-zinc-400">
                      <span>{game.platform}</span>
                      <span className="mx-2">•</span>
                      <span>{game.trophyCount || (game.trophies?.length || 0)} Trophies</span>
                    </div>
                  </div>
                  <div className="text-right mr-2">
                    <div className="text-lg font-bold">{Math.round(game.completion)}%</div>
                    <div className="text-xs text-zinc-400">
                      {game.lastPlayed 
                        ? format(new Date(game.lastPlayed), 'MM/dd/yyyy')
                        : 'No date'
                      }
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Games;
