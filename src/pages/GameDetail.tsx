import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useToast } from '@/hooks/use-toast';
import { 
  Trophy, Clock, ArrowLeft, 
  Pin, CheckCircle
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
import { useDispatch, useSelector } from 'react-redux';
import { Game, GameTrophy } from '@/types/game';
import { pinTrophy } from '@/redux/slices/gamesSlice';

const GameDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [game, setGame] = useState<Game | null>(null);
  const [selectedTrophy, setSelectedTrophy] = useState<GameTrophy | null>(null);
  const [trophyFilter, setTrophyFilter] = useState('all');
  const [trophySort, setTrophySort] = useState('default');
  const [filteredTrophies, setFilteredTrophies] = useState<GameTrophy[]>([]);
  const dispatch = useDispatch();
  
  const games = useSelector((state: any) => state.games?.games || []);
  const achievements = useSelector((state: any) => state.games?.achievements || {});
  
  useEffect(() => {
    if (games.length > 0 && id) {
      const gameId = parseInt(id, 10);
      console.log("Looking for game with ID:", gameId, "in", games.length, "games");
      
      const currentGame = games.find((g: Game) => g.id === gameId);
      
      if (currentGame) {
        console.log("Found game:", currentGame.name);
        setGame(currentGame);
        setFilteredTrophies(currentGame.trophies || []);
        setIsLoading(false);
      } else {
        console.log("Game not found with ID:", gameId);
        setIsLoading(false);
      }
    } else if (games.length > 0) {
      setIsLoading(false);
    }
  }, [games, id]);
  
  const togglePinTrophy = (trophyId: number, gamePlatformId?: number) => {
    if (!game || !gamePlatformId) return;
    
    const trophy = game.trophies?.find(t => t.id === trophyId);
    
    if (trophy) {
      dispatch(pinTrophy({
        gamePlatformId,
        trophyId,
        isPinned: !trophy.isPinned
      }));
      
      toast({
        title: trophy.isPinned 
          ? "Trophy unpinned" 
          : "Trophy pinned to dashboard",
        description: trophy.isPinned 
          ? `Removed ${trophy.name} from your goals` 
          : `Added ${trophy.name} to your goals`,
        variant: "default"
      });
    }
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
  
  const trophyCounts = {
    bronze: game.trophies?.filter(t => t.type === 'bronze').length || 0,
    silver: game.trophies?.filter(t => t.type === 'silver').length || 0,
    gold: game.trophies?.filter(t => t.type === 'gold').length || 0,
    platinum: game.trophies?.filter(t => t.type === 'platinum').length || 0,
    total: game.trophies?.length || 0,
    earned: game.trophies?.filter(t => t.achieved).length || 0
  };
  
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
      
      <div 
        className="w-full h-64 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${game.image || "https://placehold.co/1200x400?text=Game+Banner"})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-transparent" />
        <div className="absolute bottom-0 container-padding w-full">
          <div className="max-w-7xl mx-auto flex items-end gap-6 pb-6">
            <img 
              src={game.image || "https://placehold.co/300x400?text=Game"} 
              alt={game.name}
              className="w-32 h-44 object-cover rounded-lg shadow-lg border-2 border-black/20"
            />
            <div className="flex-1">
              <h1 className="text-4xl font-bold">{game.name}</h1>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-sm text-zinc-300 bg-black/30 px-2 py-1 rounded">
                  {game.platform}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto container-padding mt-6">
        <Link to="/games" className="inline-flex items-center text-zinc-400 hover:text-white transition-colors mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Back to Games</span>
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
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
                  </select>
                </div>
              </div>
              
              <div className="p-4">
                {filteredTrophies.length === 0 ? (
                  <div className="text-center py-10">
                    <Trophy className="h-12 w-12 mx-auto mb-3 text-zinc-700" />
                    <p className="text-zinc-400">No trophies found for this game.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredTrophies.map(trophy => (
                      <div 
                        key={trophy.id}
                        className={`p-3 rounded-lg flex items-center cursor-pointer relative transition-all ${
                          trophy.type ? trophyBgColor(trophy.type, trophy.achieved) : 'bg-zinc-900 opacity-60'
                        } hover:brightness-110`}
                        onClick={() => setSelectedTrophy(trophy)}
                      >
                        <div className={`flex-shrink-0 w-12 h-12 rounded-md ${
                          trophy.achieved ? 'saturate-100' : 'saturate-0'
                        } overflow-hidden`}>
                          <img 
                            src={trophy.image || "https://placehold.co/100x100?text=Trophy"} 
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
                                {trophy.description || "Complete this achievement to unlock."}
                              </p>
                            </div>
                            <div className="flex gap-1">
                              <button 
                                className="p-1 rounded hover:bg-black/30"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  togglePinTrophy(trophy.id, game.gamePlatformId);
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
                            {trophy.rarity && (
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                trophy.type ? trophyBgColor(trophy.type, true) : 'bg-zinc-800'
                              } ${
                                trophy.type ? trophyTextColor(trophy.type, true) : 'text-white'
                              }`}>
                                {trophy.rarity} ({trophy.rarityPercentage || 0}%) 
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="glass-card">
              <Accordion type="single" collapsible defaultValue="description">
                <AccordionItem value="description" className="border-b border-zinc-800">
                  <AccordionTrigger className="px-4 py-3 hover:no-underline">
                    <h3 className="text-lg font-bold">Game Description</h3>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <p className="text-zinc-300">{game.description || "No description available for this game."}</p>
                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-zinc-500">Platform</p>
                        <p>{game.platform}</p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
          
          <div className="space-y-6">
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
                  <div className="text-lg font-bold">{trophyCounts.earned}</div>
                  <div className="text-xs text-zinc-400">Earned</div>
                </div>
                <div className="bg-black/30 p-3 rounded text-center">
                  <div className="text-lg font-bold">{trophyCounts.total}</div>
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
                    {trophyCounts.platinum > 0 ? 
                      `${game.trophies?.filter(t => t.type === 'platinum' && t.achieved).length || 0}/${trophyCounts.platinum}` : 
                      'None'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center">
                    <Trophy className="h-4 w-4 mr-2 text-yellow-500" />
                    <span>Gold</span>
                  </div>
                  <span>
                    {`${game.trophies?.filter(t => t.type === 'gold' && t.achieved).length || 0}/${trophyCounts.gold}`}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center">
                    <Trophy className="h-4 w-4 mr-2 text-zinc-300" />
                    <span>Silver</span>
                  </div>
                  <span>
                    {`${game.trophies?.filter(t => t.type === 'silver' && t.achieved).length || 0}/${trophyCounts.silver}`}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center">
                    <Trophy className="h-4 w-4 mr-2 text-amber-600" />
                    <span>Bronze</span>
                  </div>
                  <span>
                    {`${game.trophies?.filter(t => t.type === 'bronze' && t.achieved).length || 0}/${trophyCounts.bronze}`}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="glass-card p-4">
              <h3 className="text-lg font-bold mb-3">Playtime Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-neon-purple" />
                    <span>Total Playtime</span>
                  </div>
                  <span className="font-bold">{game.totalPlaytime || 0} hours</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
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
                {game.name} • {selectedTrophy.type ? selectedTrophy.type.charAt(0).toUpperCase() + selectedTrophy.type.slice(1) : 'Achievement'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="mt-2">
              <div className="flex justify-center mb-4">
                <div className={`w-24 h-24 rounded-md overflow-hidden ${
                  selectedTrophy.achieved ? 'saturate-100' : 'saturate-0 opacity-70'
                }`}>
                  <img 
                    src={selectedTrophy.image || "https://placehold.co/100x100?text=Trophy"} 
                    alt={selectedTrophy.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              <p className="text-zinc-300 mb-4">{selectedTrophy.description || "Complete this achievement to unlock."}</p>
              
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
                
                {selectedTrophy.rarityPercentage !== undefined && (
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
                      {selectedTrophy.rarity || 'Common'} • {selectedTrophy.rarityPercentage || 0}% of players have this trophy
                    </p>
                  </div>
                )}
              </div>
              
              <div className="mt-4 flex justify-between gap-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => {
                    togglePinTrophy(selectedTrophy.id, game.gamePlatformId);
                  }}
                >
                  {selectedTrophy.isPinned ? 'Unpin Trophy' : 'Pin Trophy'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => setSelectedTrophy(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default GameDetail;
