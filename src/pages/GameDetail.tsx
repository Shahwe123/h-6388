
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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
import { useSelector, useDispatch } from 'react-redux';
import { getGames } from '@/helpers/gameHelpers';
import { Game, GameTrophy } from '@/types/game';
import { pinTrophy } from '@/redux/slices/gamesSlice';
import SEO from '../components/SEO';
import { format } from 'date-fns';

const GameDetail = () => {
  const { gameId } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [game, setGame] = useState<Game | null>(null);
  const [selectedTrophy, setSelectedTrophy] = useState<GameTrophy | null>(null);
  const [trophyFilter, setTrophyFilter] = useState('all');
  const [trophySort, setTrophySort] = useState('default');
  const [filteredTrophies, setFilteredTrophies] = useState<GameTrophy[]>([]);
  
  // Get all games from Redux store
  const reduxGames = useSelector((state: any) => state.games?.games || []);
  
  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        setIsLoading(true);
        
        if (!gameId) {
          navigate('/games');
          return;
        }
        
        // Try to find the game in Redux store first
        const gameIdNum = parseInt(gameId);
        let gameData = reduxGames.find((g: Game) => g.id === gameIdNum);
        
        // If not found in Redux, try to fetch from API
        if (!gameData) {
          // Get current user
          const { data: sessionData } = await supabase.auth.getSession();
          if (sessionData.session) {
            const userId = sessionData.session.user.id;
            // Fetch user games using the helper function
            const userGames = await getGames(userId);
            gameData = userGames.find((g) => g.id === gameIdNum);
          }
        }
        
        if (gameData) {
          // Ensure trophies array exists
          if (!gameData.trophies) {
            gameData.trophies = [];
          }

          // Create trophy counts if not present
          if (!gameData.trophyCounts) {
            const trophyCounts = {
              bronze: gameData.trophies.filter(t => t.type === 'bronze').length,
              silver: gameData.trophies.filter(t => t.type === 'silver').length,
              gold: gameData.trophies.filter(t => t.type === 'gold').length,
              platinum: gameData.trophies.filter(t => t.type === 'platinum').length,
              total: gameData.trophies.length,
              earned: gameData.trophies.filter(t => t.achieved).length
            };
            gameData.trophyCounts = trophyCounts;
          }

          setGame(gameData);
          setFilteredTrophies(gameData.trophies || []);
        } else {
          toast({
            title: "Game not found",
            description: "We couldn't find this game in your collection.",
            variant: "destructive"
          });
          navigate('/games');
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching game details:", error);
        toast({
          title: "Error loading game",
          description: "Failed to load game details. Please try again.",
          variant: "destructive"
        });
        setIsLoading(false);
        navigate('/games');
      }
    };
    
    fetchGameDetails();
  }, [gameId, reduxGames, toast, navigate]);
  
  // Filter trophies when filter or sort changes
  useEffect(() => {
    if (!game || !game.trophies) return;
    
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
    
    const trophy = game.trophies?.find(t => t.id === trophyId);
    if (!trophy) return;
    
    const isPinned = !trophy.isPinned;
    
    // Update Redux store
    if (game.gamePlatformId) {
      dispatch(pinTrophy({
        gamePlatformId: game.gamePlatformId,
        trophyId: trophyId,
        isPinned: isPinned
      }));
    }
    
    // Update local state
    const updatedTrophies = game.trophies?.map(t => 
      t.id === trophyId ? { ...t, isPinned: isPinned } : t
    ) || [];
    
    setGame(game => game ? { 
      ...game, 
      trophies: updatedTrophies 
    } : null);
    
    setFilteredTrophies(prevFiltered => 
      prevFiltered.map(t => 
        t.id === trophyId ? { ...t, isPinned: isPinned } : t
      )
    );
    
    toast({
      title: isPinned 
        ? "Trophy pinned to dashboard" 
        : "Trophy unpinned",
      description: isPinned 
        ? `Added ${trophy.name} to your goals` 
        : `Removed ${trophy.name} from your goals`,
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
  
  // Calculate actual trophy counts
  const earnedCount = game.trophies?.filter(t => t.achieved).length || 0;
  const totalCount = game.trophies?.length || 0;
  const bronzeCount = game.trophies?.filter(t => t.type === 'bronze').length || 0;
  const silverCount = game.trophies?.filter(t => t.type === 'silver').length || 0;
  const goldCount = game.trophies?.filter(t => t.type === 'gold').length || 0;
  const platinumCount = game.trophies?.filter(t => t.type === 'platinum').length || 0;
  
  const earnedBronze = game.trophies?.filter(t => t.type === 'bronze' && t.achieved).length || 0;
  const earnedSilver = game.trophies?.filter(t => t.type === 'silver' && t.achieved).length || 0;
  const earnedGold = game.trophies?.filter(t => t.type === 'gold' && t.achieved).length || 0;
  const earnedPlatinum = game.trophies?.filter(t => t.type === 'platinum' && t.achieved).length || 0;
  
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

  // Format release date if available
  const formattedReleaseDate = game.releaseDate 
    ? new Date(game.releaseDate).toLocaleDateString()
    : 'Unknown';

  // Format last played date if available
  const formattedLastPlayed = game.lastPlayed
    ? new Date(game.lastPlayed).toLocaleDateString()
    : 'Unknown';
  
  return (
    <div className="min-h-screen bg-primary pb-16">
      <SEO
        title={`${game.name} | PlatinumPath`}
        description={`View trophies and progress for ${game.name}`}
      />
      
      {/* Game Banner */}
      <div 
        className="w-full h-64 bg-cover bg-center relative"
        style={{ 
          backgroundImage: `url(${game.bannerImage || game.image})`,
          backgroundPosition: 'center top'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-transparent" />
        <div className="absolute bottom-0 container-padding w-full">
          <div className="max-w-7xl mx-auto flex items-end gap-6 pb-6">
            <img 
              src={game.coverImage || game.image} 
              alt={game.name}
              className="w-32 h-44 object-cover rounded-lg shadow-lg border-2 border-black/20"
              onError={(e) => {
                const imgElement = e.target as HTMLImageElement;
                imgElement.src = `https://placehold.co/400x600/2a2a2a/ffffff?text=${encodeURIComponent(game.name)}`;
              }}
            />
            <div className="flex-1">
              <h1 className="text-4xl font-bold">{game.name}</h1>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-sm text-zinc-300 bg-black/30 px-2 py-1 rounded">
                  {game.platform}
                </span>
                <span className="text-sm text-zinc-300">
                  {game.developer || 'Unknown Developer'}
                </span>
                <span className="text-sm text-zinc-300">
                  {game.releaseDate ? new Date(game.releaseDate).getFullYear() : 'Unknown Year'}
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
                        <div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-md ${
                          trophy.achieved ? 'saturate-100' : 'saturate-0 opacity-70'
                        } overflow-hidden bg-black/40`}>
                          <img 
                            src={trophy.image} 
                            alt={trophy.name}
                            className="max-w-full max-h-full object-contain"
                            onError={(e) => {
                              const imgElement = e.target as HTMLImageElement;
                              switch (trophy.type) {
                                case 'platinum':
                                  imgElement.src = 'https://placehold.co/64x64/2a80b9/ffffff?text=P';
                                  break;
                                case 'gold':
                                  imgElement.src = 'https://placehold.co/64x64/f1c40f/ffffff?text=G';
                                  break;
                                case 'silver':
                                  imgElement.src = 'https://placehold.co/64x64/bdc3c7/ffffff?text=S';
                                  break;
                                case 'bronze':
                                  imgElement.src = 'https://placehold.co/64x64/cd6133/ffffff?text=B';
                                  break;
                              }
                            }}
                          />
                        </div>
                        <div className="ml-3 flex-1">
                          <div className="flex justify-between items-start">
                            <div className="pr-8">
                              <h3 className={`font-medium ${trophy.achieved ? 'text-white' : 'text-zinc-500'}`}>
                                {trophy.name}
                              </h3>
                              <p className="text-xs text-zinc-500 mt-0.5 line-clamp-2">
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
                              {trophy.rarity || 'Common'} ({trophy.rarityPercentage?.toFixed(1) || '0'}%)
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
                    <p className="text-zinc-300">{game.description || 'No description available for this game.'}</p>
                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-zinc-500">Developer</p>
                        <p>{game.developer || 'Unknown'}</p>
                      </div>
                      <div>
                        <p className="text-zinc-500">Publisher</p>
                        <p>{game.publisher || 'Unknown'}</p>
                      </div>
                      <div>
                        <p className="text-zinc-500">Release Date</p>
                        <p>{formattedReleaseDate}</p>
                      </div>
                      <div>
                        <p className="text-zinc-500">Genres</p>
                        <p>{game.genres?.join(', ') || 'Unknown'}</p>
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
                  <span className="text-sm font-bold">{Math.round(game.completion)}%</span>
                </div>
                <Progress value={game.completion} className="h-2 bg-black/40" />
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-black/30 p-3 rounded text-center">
                  <div className="text-lg font-bold">{earnedCount}</div>
                  <div className="text-xs text-zinc-400">Earned</div>
                </div>
                <div className="bg-black/30 p-3 rounded text-center">
                  <div className="text-lg font-bold">{totalCount}</div>
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
                    {platinumCount > 0 ? 
                      `${earnedPlatinum}/${platinumCount}` : 
                      'None'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center">
                    <Trophy className="h-4 w-4 mr-2 text-yellow-500" />
                    <span>Gold</span>
                  </div>
                  <span>
                    {goldCount > 0 ? 
                      `${earnedGold}/${goldCount}` : 
                      'None'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center">
                    <Trophy className="h-4 w-4 mr-2 text-zinc-300" />
                    <span>Silver</span>
                  </div>
                  <span>
                    {silverCount > 0 ? 
                      `${earnedSilver}/${silverCount}` : 
                      'None'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center">
                    <Trophy className="h-4 w-4 mr-2 text-amber-600" />
                    <span>Bronze</span>
                  </div>
                  <span>
                    {bronzeCount > 0 ? 
                      `${earnedBronze}/${bronzeCount}` : 
                      'None'}
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
                  <span className="font-bold">{game.totalPlaytime || 'N/A'} {game.totalPlaytime ? 'hours' : ''}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-neon-purple" />
                    <span>Last Played</span>
                  </div>
                  <span>{formattedLastPlayed}</span>
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
                <div className={`w-24 h-24 rounded-md overflow-hidden flex items-center justify-center bg-black/40 ${
                  selectedTrophy.achieved ? 'saturate-100' : 'saturate-0 opacity-70'
                }`}>
                  <img 
                    src={selectedTrophy.image} 
                    alt={selectedTrophy.name}
                    className="max-w-16 max-h-16 object-contain"
                    onError={(e) => {
                      const imgElement = e.target as HTMLImageElement;
                      switch (selectedTrophy.type) {
                        case 'platinum':
                          imgElement.src = 'https://placehold.co/64x64/2a80b9/ffffff?text=P';
                          break;
                        case 'gold':
                          imgElement.src = 'https://placehold.co/64x64/f1c40f/ffffff?text=G';
                          break;
                        case 'silver':
                          imgElement.src = 'https://placehold.co/64x64/bdc3c7/ffffff?text=S';
                          break;
                        case 'bronze':
                          imgElement.src = 'https://placehold.co/64x64/cd6133/ffffff?text=B';
                          break;
                      }
                    }}
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
                
                <div className="bg-black/30 p-3 rounded-lg flex items-center">
                  <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                    <BarChart className="h-4 w-4 text-zinc-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">{selectedTrophy.rarity || 'Common'}</p>
                    <p className="text-xs text-zinc-500">
                      {selectedTrophy.rarityPercentage?.toFixed(1) || '0'}% of players have this
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex justify-between">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedTrophy(null)}
                  >
                    Close
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      if (selectedTrophy) togglePinTrophy(selectedTrophy.id);
                    }}
                  >
                    <Pin className={`h-4 w-4 mr-1 ${selectedTrophy.isPinned ? 'text-neon-purple' : ''}`} />
                    {selectedTrophy.isPinned ? 'Unpin Trophy' : 'Pin to Dashboard'}
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default GameDetail;
