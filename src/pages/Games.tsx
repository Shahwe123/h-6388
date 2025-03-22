
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

interface Game {
  id: number;
  name: string;
  platform: string;
  image: string;
  completion: number;
  trophyCount: number;
  lastPlayed: string;
}

const Games = () => {
  const { username } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [games, setGames] = useState<Game[]>([]);
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [sortBy, setSortBy] = useState('lastPlayed');
  
  const { profile, loading: profileLoading, isOwnProfile } = useProfileData(username || null);
  
  useEffect(() => {
    const fetchGames = async () => {
      try {
        setIsLoading(true);
        
        // Placeholder games data
        const mockGames: Game[] = [
          {
            id: 1,
            name: "Elden Ring",
            platform: "PlayStation 5",
            image: "https://placehold.co/300x400?text=Elden+Ring",
            completion: 72,
            trophyCount: 42,
            lastPlayed: "2025-03-18T14:22:00Z"
          },
          {
            id: 2,
            name: "God of War Ragnarök",
            platform: "PlayStation 5",
            image: "https://placehold.co/300x400?text=God+of+War",
            completion: 96,
            trophyCount: 51,
            lastPlayed: "2025-03-20T18:30:00Z"
          },
          {
            id: 3,
            name: "Starfield",
            platform: "Xbox Series X",
            image: "https://placehold.co/300x400?text=Starfield",
            completion: 45,
            trophyCount: 28,
            lastPlayed: "2025-03-10T21:15:00Z"
          },
          {
            id: 4,
            name: "Cyberpunk 2077",
            platform: "Steam",
            image: "https://placehold.co/300x400?text=Cyberpunk",
            completion: 83,
            trophyCount: 44,
            lastPlayed: "2025-03-15T23:40:00Z"
          },
          {
            id: 5,
            name: "Spider-Man 2",
            platform: "PlayStation 5",
            image: "https://placehold.co/300x400?text=Spider-Man+2",
            completion: 100,
            trophyCount: 50,
            lastPlayed: "2025-03-05T12:10:00Z"
          },
          {
            id: 6,
            name: "Horizon Forbidden West",
            platform: "PlayStation 5",
            image: "https://placehold.co/300x400?text=Horizon",
            completion: 68,
            trophyCount: 38,
            lastPlayed: "2025-02-28T17:20:00Z"
          },
          {
            id: 7,
            name: "Halo Infinite",
            platform: "Xbox Series X",
            image: "https://placehold.co/300x400?text=Halo",
            completion: 52,
            trophyCount: 32,
            lastPlayed: "2025-03-12T19:30:00Z"
          },
          {
            id: 8,
            name: "The Witcher 3",
            platform: "Steam",
            image: "https://placehold.co/300x400?text=Witcher+3",
            completion: 89,
            trophyCount: 52,
            lastPlayed: "2025-02-20T16:45:00Z"
          },
          {
            id: 9,
            name: "Baldur's Gate 3",
            platform: "Steam",
            image: "https://placehold.co/300x400?text=Baldurs+Gate+3",
            completion: 64,
            trophyCount: 36,
            lastPlayed: "2025-03-16T22:00:00Z"
          },
          {
            id: 10,
            name: "Final Fantasy VII Rebirth",
            platform: "PlayStation 5",
            image: "https://placehold.co/300x400?text=FF7+Rebirth",
            completion: 78,
            trophyCount: 45,
            lastPlayed: "2025-03-19T15:15:00Z"
          },
          {
            id: 11,
            name: "Hollow Knight",
            platform: "Steam",
            image: "https://placehold.co/300x400?text=Hollow+Knight",
            completion: 37,
            trophyCount: 24,
            lastPlayed: "2025-02-25T20:30:00Z"
          },
          {
            id: 12,
            name: "Hogwarts Legacy",
            platform: "PlayStation 5",
            image: "https://placehold.co/300x400?text=Hogwarts+Legacy",
            completion: 91,
            trophyCount: 48,
            lastPlayed: "2025-03-08T14:00:00Z"
          }
        ];
        
        setGames(mockGames);
        setFilteredGames(mockGames);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching games:", error);
        setIsLoading(false);
      }
    };
    
    fetchGames();
  }, [username]);
  
  // Filter and sort games when filters change
  useEffect(() => {
    let result = [...games];
    
    // Apply search filter
    if (searchQuery) {
      result = result.filter(game => 
        game.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply platform filter
    if (platformFilter !== 'all') {
      result = result.filter(game => 
        game.platform.toLowerCase().includes(platformFilter.toLowerCase())
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'completion':
          return b.completion - a.completion;
        case 'trophyCount':
          return b.trophyCount - a.trophyCount;
        case 'lastPlayed':
        default:
          return new Date(b.lastPlayed).getTime() - new Date(a.lastPlayed).getTime();
      }
    });
    
    setFilteredGames(result);
  }, [games, searchQuery, platformFilter, sortBy]);
  
  if (isLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-neon-purple border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  
  if (!profile) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center">
          <Gamepad className="h-16 w-16 mx-auto mb-4 text-zinc-600" />
          <h2 className="text-2xl font-bold mb-2">Profile Not Found</h2>
          <p className="text-zinc-400">We couldn't find the gamer you're looking for.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-primary pb-16">
      <Helmet>
        <title>Game Collection | PlatinumPath</title>
        <meta name="description" content="View your game collection and achievements" />
      </Helmet>
      
      <div className="max-w-7xl mx-auto pt-8 container-padding">
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
        
        {/* Filters */}
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
                    <SelectItem value="playstation">PlayStation</SelectItem>
                    <SelectItem value="xbox">Xbox</SelectItem>
                    <SelectItem value="steam">Steam</SelectItem>
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
        
        {/* Games Display */}
        {filteredGames.length === 0 ? (
          <div className="glass-card p-10 text-center">
            <Gamepad className="h-16 w-16 mx-auto mb-4 text-zinc-600" />
            <h2 className="text-xl font-bold mb-2">No Games Found</h2>
            <p className="text-zinc-400">Try adjusting your filters or search query.</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredGames.map(game => (
              <Link to={`/games/${game.id}`} key={game.id} className="transition-transform hover:scale-105">
                <div className="glass-card h-full overflow-hidden rounded-lg flex flex-col">
                  <div className="relative">
                    <img 
                      src={game.image} 
                      alt={game.name}
                      className="w-full object-cover aspect-[3/4]"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                      <div className="flex justify-between items-center">
                        <div className="text-xs font-medium bg-black/60 px-2 py-1 rounded">
                          {game.platform}
                        </div>
                        <div className="text-xs font-medium bg-neon-purple/80 px-2 py-1 rounded">
                          {game.completion}%
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-bold text-sm line-clamp-1">{game.name}</h3>
                    <div className="flex justify-between mt-2 text-xs text-zinc-400">
                      <span>{game.trophyCount} Trophies</span>
                      <span>{new Date(game.lastPlayed).toLocaleDateString()}</span>
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
                    src={game.image} 
                    alt={game.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="ml-4 flex-1">
                    <h3 className="font-bold">{game.name}</h3>
                    <div className="flex items-center text-sm text-zinc-400">
                      <span>{game.platform}</span>
                      <span className="mx-2">•</span>
                      <span>{game.trophyCount} Trophies</span>
                    </div>
                  </div>
                  <div className="text-right mr-2">
                    <div className="text-lg font-bold">{game.completion}%</div>
                    <div className="text-xs text-zinc-400">
                      {new Date(game.lastPlayed).toLocaleDateString()}
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
