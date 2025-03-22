import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Trophy, Clock, BarChart, Users, ArrowLeft, 
  Filter, Pin, CheckCircle, ChevronDown, ChevronUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface GameTrophy {
  id: number;
  name: string;
  description: string;
  type: 'platinum' | 'gold' | 'silver' | 'bronze';
  image: string;
  rarity: string;
  rarityPercentage: number;
  achieved: boolean;
  achievedDate?: string;
  isPinned?: boolean;
}

interface Game {
  id: number;
  name: string;
  platform: string;
  coverImage: string;
  bannerImage: string;
  description: string;
  releaseDate: string;
  developer: string;
  publisher: string;
  genres: string[];
  completion: number;
  totalPlaytime: number;
  trophyCounts: {
    bronze: number;
    silver: number;
    gold: number;
    platinum: number;
    total: number;
    earned: number;
  };
  trophies: GameTrophy[];
  lastPlayed: string;
}

const GameDetail = () => {
  const { gameId } = useParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [game, setGame] = useState<Game | null>(null);
  const [selectedTrophy, setSelectedTrophy] = useState<GameTrophy | null>(null);
  const [trophyFilter, setTrophyFilter] = useState('all');
  const [trophySort, setTrophySort] = useState('default');
  const [filteredTrophies, setFilteredTrophies] = useState<GameTrophy[]>([]);
  
  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        setIsLoading(true);
        
        // Mock game data
        const mockGame: Game = {
          id: parseInt(gameId || '1'),
          name: "God of War Ragnarök",
          platform: "PlayStation 5",
          coverImage: "https://placehold.co/300x400?text=God+of+War",
          bannerImage: "https://placehold.co/1200x400?text=God+of+War+Banner",
          description: "Embark on a mythic journey for answers and allies before Ragnarök arrives in this sequel to the critically acclaimed God of War (2018).",
          releaseDate: "2022-11-09",
          developer: "Santa Monica Studio",
          publisher: "Sony Interactive Entertainment",
          genres: ["Action", "Adventure"],
          completion: 78,
          totalPlaytime: 63,
          trophyCounts: {
            bronze: 30,
            silver: 15,
            gold: 5,
            platinum: 1,
            total: 51,
            earned: 40
          },
          lastPlayed: "2025-03-20T18:30:00Z",
          trophies: [
            {
              id: 1,
              name: "Father and Son",
              description: "Platinum Trophy: Collect all other trophies",
              type: "platinum",
              image: "https://placehold.co/100x100?text=Plat",
              rarity: "Rare",
              rarityPercentage: 8.2,
              achieved: false,
              isPinned: true
            },
            {
              id: 2,
              name: "The Journey Begins",
              description: "Complete the first quest",
              type: "bronze",
              image: "https://placehold.co/100x100?text=Bronze",
              rarity: "Common",
              rarityPercentage: 92.5,
              achieved: true,
              achievedDate: "2025-01-15T14:22:00Z"
            },
            {
              id: 3,
              name: "Dragon Slayer",
              description: "Defeat the ice dragon",
              type: "silver",
              image: "https://placehold.co/100x100?text=Silver",
              rarity: "Uncommon",
              rarityPercentage: 45.1,
              achieved: true,
              achievedDate: "2025-01-20T16:42:00Z"
            },
            {
              id: 4,
              name: "Collector",
              description: "Find all collectibles in Midgard",
              type: "gold",
              image: "https://placehold.co/100x100?text=Gold",
              rarity: "Very Rare",
              rarityPercentage: 6.8,
              achieved: false
            },
            {
              id: 5,
              name: "Weapon Master",
              description: "Fully upgrade all weapons",
              type: "gold",
              image: "https://placehold.co/100x100?text=Gold",
              rarity: "Very Rare",
              rarityPercentage: 12.3,
              achieved: true,
              achievedDate: "2025-02-05T19:15:00Z"
            },
            {
              id: 6,
              name: "Realm Traveler",
              description: "Visit all realms",
              type: "silver",
              image: "https://placehold.co/100x100?text=Silver",
              rarity: "Uncommon",
              rarityPercentage: 38.7,
              achieved: true,
              achievedDate: "2025-01-25T21:30:00Z"
            },
            {
              id: 7,
              name: "Treasure Hunter",
              description: "Open 10 Nornir chests",
              type: "bronze",
              image: "https://placehold.co/100x100?text=Bronze",
              rarity: "Common",
              rarityPercentage: 65.2,
              achieved: true,
              achievedDate: "2025-01-18T15:10:00Z"
            },
            {
              id: 8,
              name: "Mist Walker",
              description: "Complete all trials in Niflheim",
              type: "gold",
              image: "https://placehold.co/100x100?text=Gold",
              rarity: "Ultra Rare",
              rarityPercentage: 3.9,
              achieved: false
            }
          ]
        };
        
        setGame(mockGame);
        setFilteredTrophies(mockGame.trophies);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching game details:", error);
        toast({
          title: "Error loading game",
          description: "Failed to load game details. Please try again.",
          variant: "destructive"
        });
        setIsLoading(false);
      }
    };
    
    fetchGameDetails();
  }, [gameId, toast]);
  
  // Filter trophies when filter or sort changes
  useEffect(() => {
    if (!game) return;
    
    let result = [...game.trophies];
    
    // Apply trophy type filter
    if (trophyFilter !== 'all') {
      result = result.filter(trophy => trophy.type === trophyFilter);
    }
    
    // Apply sorting
    switch (trophySort) {
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'rarity':
        result.sort((a, b) => a.rarityPercentage - b.rarityPercentage);
        break;
      case 'achieved':
        result.sort((a, b) => {
          if (a.achieved === b.achieved) return 0;
          return a.achieved ? -1 : 1;
        });
        break;
      case 'type':
        const typeOrder = { platinum: 0, gold: 1, silver: 2, bronze: 3 };
        result.sort((a, b) => typeOrder[a.type] - typeOrder[b.type]);
        break;
      default:
        // Default ordering (keep original order)
        break;
    }
    
    setFilteredTrophies(result);
  }, [game, trophyFilter, trophySort]);
  
  const togglePinTrophy = (trophyId: number) => {
    if (!game) return;
    
    const updatedTrophies = game.trophies.map(trophy => 
      trophy.id === trophyId 
        ? { ...trophy, isPinned: !trophy.isPinned }
        : trophy
    );
    
    setGame({
      ...game,
      trophies: updatedTrophies
    });
    
    setFilteredTrophies(prevFiltered => 
      prevFiltered.map(trophy => 
        trophy.id === trophyId 
          ? { ...trophy, isPinned: !trophy.isPinned }
          : trophy
      )
    );
    
    const trophy = game.trophies.find(t => t.id === trophyId);
    
    toast({
      title: trophy?.isPinned 
        ? "Trophy unpinned" 
        : "Trophy pinned to dashboard",
      description: trophy?.isPinned 
        ? `Removed ${trophy.name} from your goals` 
        : `Added ${trophy?.name} to your goals`,
      variant: "default"
    });
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-neon-purple border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  
  if (!game) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center">
          <Trophy className="h-16 w-16 mx-auto mb-4 text-zinc-600" />
          <h2 className="text-2xl font-bold mb-2">Game Not Found</h2>
          <p className="text-zinc-400">We couldn't find the game you're looking for.</p>
          <Link to="/games">
            <Button variant="default" className="mt-4">
              View All Games
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  const trophyBgColor = (type: string, achieved: boolean) => {
    if (!achieved) return 'bg-zinc-900 opacity-60';
    
    switch (type) {
      case 'platinum': return 'bg-neon-blue/20';
      case 'gold': return 'bg-yellow-500/20';
      case 'silver': return 'bg-zinc-400/20';
      case 'bronze': return 'bg-amber-800/20';
      default: return 'bg-zinc-800';
    }
  };
  
  const trophyTextColor = (type: string, achieved: boolean) => {
    if (!achieved) return 'text-zinc-500';
    
    switch (type) {
      case 'platinum': return 'text-neon-blue';
      case 'gold': return 'text-yellow-500';
      case 'silver': return 'text-zinc-300';
      case 'bronze': return 'text-amber-600';
      default: return 'text-white';
    }
  };
  
  return (
    <div className="min-h-screen bg-primary pb-16">
      <Helmet>
        <title>{game.name} | PlatinumPath</title>
        <meta name="description" content={`View trophies and progress for ${game.name}`} />
      </Helmet>
      
      {/* Game Banner */}
      <div 
        className="w-full h-64 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${game.bannerImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-transparent" />
        <div className="absolute bottom-0 container-padding w-full">
          <div className="max-w-7xl mx-auto flex items-end gap-6 pb-6">
            <img 
              src={game.coverImage} 
              alt={game.name}
              className="w-32 h-44 object-cover rounded-lg shadow-lg border-2 border-black/20"
            />
            <div className="flex-1">
              <h1 className="text-4xl font-bold">{game.name}</h1>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-sm text-zinc-300 bg-black/30 px-2 py-1 rounded">
                  {game.platform}
                </span>
                <span className="text-sm text-zinc-300">
                  {game.developer}
                </span>
                <span className="text-sm text-zinc-300">
                  {new Date(game.releaseDate).getFullYear()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto container-padding mt-6">
        {/* Back Button */}
        <Link to="/games" className="inline-flex items-center text-zinc-400 hover:text-white transition-colors mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Back to Games</span>
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main trophy content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Trophies Section */}
            <div className="glass-card">
              <div className="p-4 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-bold">Trophies</h2>
                
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={trophyFilter === 'all' ? 'bg-neon-purple/20' : ''}
                    onClick={() => setTrophyFilter('all')}
                  >
                    All
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={trophyFilter === 'platinum' ? 'bg-neon-purple/20' : ''}
                    onClick={() => setTrophyFilter('platinum')}
                  >
                    <Trophy className="h-3 w-3 mr-1 text-neon-blue" />
                    Platinum
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={trophyFilter === 'gold' ? 'bg-neon-purple/20' : ''}
                    onClick={() => setTrophyFilter('gold')}
                  >
                    <Trophy className="h-3 w-3 mr-1 text-yellow-500" />
                    Gold
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={trophyFilter === 'silver' ? 'bg-neon-purple/20' : ''}
                    onClick={() => setTrophyFilter('silver')}
                  >
                    <Trophy className="h-3 w-3 mr-1 text-zinc-300" />
                    Silver
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={trophyFilter === 'bronze' ? 'bg-neon-purple/20' : ''}
                    onClick={() => setTrophyFilter('bronze')}
                  >
                    <Trophy className="h-3 w-3 mr-1 text-amber-600" />
                    Bronze
                  </Button>
                </div>
              </div>
              
              {/* Trophy Sorting */}
              <div className="px-4 py-2 border-b border-zinc-800 flex items-center justify-between">
                <div className="text-sm text-zinc-400">
                  {filteredTrophies.length} {trophyFilter === 'all' ? 'trophies' : `${trophyFilter} trophies`}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-zinc-400">Sort by:</span>
                  <select 
                    className="bg-black/20 border border-zinc-700 rounded px-2 py-1 text-sm"
                    value={trophySort}
                    onChange={(e) => setTrophySort(e.target.value)}
                  >
                    <option value="default">Default</option>
                    <option value="name">Name</option>
                    <option value="rarity">Rarity</option>
                    <option value="achieved">Achieved</option>
                    <option value="type">Trophy Type</option>
                  </select>
                </div>
              </div>
              
              {/* Trophy List */}
              <div className="p-4">
                {filteredTrophies.length === 0 ? (
                  <div className="text-center py-10">
                    <Trophy className="h-12 w-12 mx-auto mb-3 text-zinc-700" />
                    <p className="text-zinc-400">No trophies match your filter criteria.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredTrophies.map(trophy => (
                      <div 
                        key={trophy.id}
                        className={`p-3 rounded-lg flex items-center cursor-pointer relative transition-all ${
                          trophyBgColor(trophy.type, trophy.achieved)
                        } hover:brightness-110`}
                        onClick={() => setSelectedTrophy(trophy)}
                      >
                        <div className={`flex-shrink-0 w-12 h-12 rounded-md ${
                          trophy.achieved ? 'saturate-100' : 'saturate-0'
                        } overflow-hidden`}>
                          <img 
                            src={trophy.image} 
                            alt={trophy.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="ml-3 flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className={`font-medium ${trophy.achieved ? 'text-white' : 'text-zinc-500'}`}>
                                {trophy.name}
                              </h3>
                              <p className="text-xs text-zinc-500 mt-0.5 pr-8">
                                {trophy.description}
                              </p>
                            </div>
                            <div className="flex gap-1">
                              <button 
                                className="p-1 rounded hover:bg-black/30"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  togglePinTrophy(trophy.id);
                                }}
                              >
                                <Pin className={`h-4 w-4 ${trophy.isPinned ? 'text-neon-purple' : 'text-zinc-600'}`} />
                              </button>
                            </div>
                          </div>
                          <div className="flex justify-between mt-1">
                            <div className="flex items-center">
                              <span className={`text-xs ${trophy.achieved ? 'text-green-500' : 'text-zinc-500'}`}>
                                {trophy.achieved ? (
                                  <span className="flex items-center">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Achieved
                                  </span>
                                ) : 'Locked'}
                              </span>
                              {trophy.achieved && trophy.achievedDate && (
                                <span className="text-xs text-zinc-500 ml-2">
                                  {new Date(trophy.achievedDate).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${trophyBgColor(trophy.type, true)} ${trophyTextColor(trophy.type, true)}`}>
                              {trophy.rarity} ({trophy.rarityPercentage}%)
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Game Description & Info */}
            <div className="glass-card">
              <Accordion type="single" collapsible defaultValue="description">
                <AccordionItem value="description" className="border-b border-zinc-800">
                  <AccordionTrigger className="px-4 py-3 hover:no-underline">
                    <h3 className="text-lg font-bold">Game Description</h3>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <p className="text-zinc-300">{game.description}</p>
                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-zinc-500">Developer</p>
                        <p>{game.developer}</p>
                      </div>
                      <div>
                        <p className="text-zinc-500">Publisher</p>
                        <p>{game.publisher}</p>
                      </div>
                      <div>
                        <p className="text-zinc-500">Release Date</p>
                        <p>{new Date(game.releaseDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-zinc-500">Genres</p>
                        <p>{game.genres.join(', ')}</p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="friends" className="border-b border-zinc-800">
                  <AccordionTrigger className="px-4 py-3 hover:no-underline">
                    <h3 className="text-lg font-bold">Friends' Progress</h3>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="text-center py-8 text-zinc-400">
                      <Users className="h-12 w-12 mx-auto mb-3 opacity-40" />
                      <p>Compare your progress with friends</p>
                      <p className="text-sm mt-1">Coming soon!</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="guide" className="border-b-0">
                  <AccordionTrigger className="px-4 py-3 hover:no-underline">
                    <h3 className="text-lg font-bold">Trophy Guides</h3>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="text-center py-8 text-zinc-400">
                      <Trophy className="h-12 w-12 mx-auto mb-3 opacity-40" />
                      <p>Community trophy guides</p>
                      <p className="text-sm mt-1">Coming soon!</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
          
          {/* Stats Sidebar */}
          <div className="space-y-6">
            {/* Trophy Progress */}
            <div className="glass-card p-4">
              <h3 className="text-lg font-bold mb-3">Trophy Progress</h3>
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Overall Completion</span>
                  <span className="text-sm font-bold">{game.completion}%</span>
                </div>
                <Progress value={game.completion} className="h-2 bg-black/40" />
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-black/30 p-3 rounded text-center">
                  <div className="text-lg font-bold">{game.trophyCounts.earned}</div>
                  <div className="text-xs text-zinc-400">Earned</div>
                </div>
                <div className="bg-black/30 p-3 rounded text-center">
                  <div className="text-lg font-bold">{game.trophyCounts.total}</div>
                  <div className="text-xs text-zinc-400">Total</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center">
                    <Trophy className="h-4 w-4 mr-2 text-neon-blue" />
                    <span>Platinum</span>
                  </div>
                  <span>
                    {game.trophyCounts.platinum > 0 ? 
                      `0/${game.trophyCounts.platinum}` : 
                      'None'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center">
                    <Trophy className="h-4 w-4 mr-2 text-yellow-500" />
                    <span>Gold</span>
                  </div>
                  <span>
                    {/* Assuming 3 of 5 gold trophies are earned */}
                    3/{game.trophyCounts.gold}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center">
                    <Trophy className="h-4 w-4 mr-2 text-zinc-300" />
                    <span>Silver</span>
                  </div>
                  <span>
                    {/* Assuming 12 of 15 silver trophies are earned */}
                    12/{game.trophyCounts.silver}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center">
                    <Trophy className="h-4 w-4 mr-2 text-amber-600" />
                    <span>Bronze</span>
                  </div>
                  <span>
                    {/* Assuming 25 of 30 bronze trophies are earned */}
                    25/{game.trophyCounts.bronze}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Playtime Stats */}
            <div className="glass-card p-4">
              <h3 className="text-lg font-bold mb-3">Playtime Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-neon-purple" />
                    <span>Total Playtime</span>
                  </div>
                  <span className="font-bold">{game.totalPlaytime} hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-neon-purple" />
                    <span>Last Played</span>
                  </div>
                  <span>{new Date(game.lastPlayed).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            {/* AI Coach */}
            <div className="glass-card p-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 -mt-4 -mr-4 bg-neon-purple/20 rounded-full blur-xl z-0" />
              <div className="relative z-10">
                <h3 className="text-lg font-bold mb-2">AI Trophy Coach</h3>
                <p className="text-sm text-zinc-400 mb-4">
                  Get personalized tips to earn your next trophy
                </p>
                <Button variant="default" className="w-full" size="sm">
                  Enable AI Coach
                </Button>
              </div>
            </div>
            
            {/* Community Stats (Placeholder) */}
            <div className="glass-card p-4">
              <h3 className="text-lg font-bold mb-3">Community Stats</h3>
              <div className="text-center py-4 text-zinc-400">
                <Users className="h-8 w-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">Community stats coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Trophy Detail Dialog */}
      <Dialog 
        open={!!selectedTrophy} 
        onOpenChange={(open) => !open && setSelectedTrophy(null)}
      >
        {selectedTrophy && (
          <DialogContent className="max-w-md glass-card-dialog">
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center">
                <div className={`flex-shrink-0 w-6 h-6 rounded ${
                  selectedTrophy.type === 'platinum' ? 'bg-neon-blue/20' :
                  selectedTrophy.type === 'gold' ? 'bg-yellow-500/20' :
                  selectedTrophy.type === 'silver' ? 'bg-zinc-400/20' :
                  'bg-amber-800/20'
                } flex items-center justify-center mr-2`}>
                  <Trophy className={`h-3 w-3 ${
                    selectedTrophy.type === 'platinum' ? 'text-neon-blue' :
                    selectedTrophy.type === 'gold' ? 'text-yellow-500' :
                    selectedTrophy.type === 'silver' ? 'text-zinc-300' :
                    'text-amber-600'
                  }`} />
                </div>
                {selectedTrophy.name}
              </DialogTitle>
              <DialogDescription>
                {game.name} • {selectedTrophy.type.charAt(0).toUpperCase() + selectedTrophy.type.slice(1)} Trophy
              </DialogDescription>
            </DialogHeader>
            
            <div className="mt-2">
              <div className="flex justify-center mb-4">
                <div className={`w-24 h-24 rounded-md overflow-hidden ${
                  selectedTrophy.achieved ? 'saturate-100' : 'saturate-0 opacity-70'
                }`}>
                  <img 
                    src={selectedTrophy.image} 
                    alt={selectedTrophy.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              <p className="text-zinc-300 mb-4">{selectedTrophy.description}</p>
              
              <div className="space-y-3">
                <div className="bg-black/30 p-3 rounded-lg flex items-center">
                  <div className={`w-8 h-8 rounded-full ${
                    selectedTrophy.achieved ? 'bg-green-500/20' : 'bg-zinc-800'
                  } flex items-center justify-center`}>
                    {selectedTrophy.achieved ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Trophy className="h-4 w-4 text-zinc-500" />
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">
                      {selectedTrophy.achieved ? 'Achieved' : 'Not achieved'}
                    </p>
                    {selectedTrophy.achieved && selectedTrophy.achievedDate && (
                      <p className="text-xs text-zinc-500">
                        {new Date(selectedTrophy.achievedDate).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="bg-black/30 p-3 rounded-lg">
                  <p className="text-sm font-medium mb-1">Rarity</p>
                  <div className="flex items-center">
                    <div className="flex-1">
                      <Progress 
                        value={selectedTrophy.rarityPercentage} 
                        className="h-2 bg-black/40" 
                      />
                    </div>
                    <span className="text-sm ml-2 w-16 text-right">
                      {selectedTrophy.rarityPercentage}%
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">
                    {selectedTrophy.rarity} • {selectedTrophy.rarityPercentage}% of players have this trophy
                  </p>
                </div>
              </div>
              
              <div className="mt-4 flex justify-between gap-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => {
