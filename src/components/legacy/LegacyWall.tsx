
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Trophy, 
  Filter, 
  Calendar, 
  Clock, 
  Medal, 
  Star, 
  Award, 
  Search, 
  ChevronRight,
  Bookmark,
  Flag
} from 'lucide-react';
import { Game, GameTrophy, LegacyWallFilter, TrophyFilter } from '@/types/game';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import TrophyCard from './TrophyCard';
import MilestoneCard from './MilestoneCard';
import YearTimeline from './YearTimeline';
import FilterPanel from './FilterPanel';
import SEO from "@/components/SEO";

// Mock data until we have real data
const mockYears = [2018, 2019, 2020, 2021, 2022, 2023, 2024];
const mockPlatforms = ['PlayStation', 'Steam', 'Xbox'];
const mockGenres = ['Action', 'RPG', 'Sports', 'Adventure', 'Shooter', 'Platformer'];

const LegacyWall: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const games = useSelector((state: any) => state.games?.games || []);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTrophy, setSelectedTrophy] = useState<GameTrophy | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [activeView, setActiveView] = useState<'grid' | 'timeline'>('grid');
  const [filters, setFilters] = useState<LegacyWallFilter>({
    year: 'all',
    platform: 'all',
    genre: 'all',
    type: 'all',
    rarity: 'all',
    milestones: false
  });
  
  // Derive all trophies from games
  const allTrophies = React.useMemo(() => {
    const trophies: { trophy: GameTrophy; game: Game }[] = [];
    games.forEach((game: Game) => {
      if (game.trophies) {
        game.trophies.forEach(trophy => {
          if (trophy.achieved) {
            trophies.push({ trophy, game });
          }
        });
      }
    });
    return trophies;
  }, [games]);
  
  // Filtered trophies based on current filters
  const filteredTrophies = React.useMemo(() => {
    return allTrophies.filter(({ trophy, game }) => {
      // Apply search term
      if (searchTerm && !trophy.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !game.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Apply year filter
      if (filters.year !== 'all') {
        const trophyYear = trophy.achievedDate 
          ? new Date(trophy.achievedDate).getFullYear() 
          : game.yearEarned;
        if (trophyYear !== filters.year) return false;
      }
      
      // Apply platform filter
      if (filters.platform !== 'all' && game.platform !== filters.platform) {
        return false;
      }
      
      // Apply genre filter
      if (filters.genre !== 'all' && !game.genres?.includes(filters.genre as string)) {
        return false;
      }
      
      // Apply trophy type filter
      if (filters.type !== 'all') {
        if (filters.type === 'legacy' && !trophy.isLegacy) return false;
        if (filters.type === 'milestones' && !trophy.isFirstOfType && !game.milestoneInfo) return false;
        if (['platinum', 'gold', 'silver', 'bronze'].includes(filters.type) && trophy.type !== filters.type) return false;
      }
      
      // Apply rarity filter
      if (filters.rarity !== 'all') {
        if (filters.rarity === 'common' && trophy.rarityPercentage > 20) return false;
        if (filters.rarity === 'rare' && (trophy.rarityPercentage > 10 || trophy.rarityPercentage <= 5)) return false;
        if (filters.rarity === 'ultra-rare' && trophy.rarityPercentage > 5) return false;
      }
      
      return true;
    });
  }, [allTrophies, searchTerm, filters]);
  
  // Group trophies by year for timeline view
  const trophiesByYear = React.useMemo(() => {
    const grouped: Record<number, { trophy: GameTrophy; game: Game }[]> = {};
    
    filteredTrophies.forEach(item => {
      const year = item.trophy.achievedDate 
        ? new Date(item.trophy.achievedDate).getFullYear()
        : item.game.yearEarned || new Date().getFullYear();
      
      if (!grouped[year]) {
        grouped[year] = [];
      }
      
      grouped[year].push(item);
    });
    
    return grouped;
  }, [filteredTrophies]);
  
  // Milestone trophies
  const milestoneTrophies = React.useMemo(() => {
    return filteredTrophies.filter(({ trophy, game }) => 
      trophy.isFirstOfType || trophy.isLegacy || game.milestoneInfo
    );
  }, [filteredTrophies]);
  
  // Stats for the trophy collection
  const stats = React.useMemo(() => {
    const totalTrophies = allTrophies.length;
    const platinumCount = allTrophies.filter(({ trophy }) => trophy.type === 'platinum').length;
    const goldCount = allTrophies.filter(({ trophy }) => trophy.type === 'gold').length;
    const silverCount = allTrophies.filter(({ trophy }) => trophy.type === 'silver').length;
    const bronzeCount = allTrophies.filter(({ trophy }) => trophy.type === 'bronze').length;
    
    // Find the rarest trophy
    let rarestTrophy = allTrophies.length > 0 ? allTrophies[0] : null;
    allTrophies.forEach(item => {
      if (item.trophy.rarityPercentage < (rarestTrophy?.trophy.rarityPercentage || 100)) {
        rarestTrophy = item;
      }
    });
    
    return {
      totalTrophies,
      platinumCount,
      goldCount,
      silverCount,
      bronzeCount,
      rarestTrophy
    };
  }, [allTrophies]);
  
  // Handle trophy click
  const handleTrophyClick = (trophy: GameTrophy, game: Game) => {
    setSelectedTrophy(trophy);
    // Could navigate to a detail view or open a modal
  };
  
  // Handle sharing trophy
  const handleShareTrophy = (trophy: GameTrophy, game: Game) => {
    // Implementation for sharing functionality
    toast({
      title: "Sharing Trophy",
      description: `Sharing ${trophy.name} from ${game.name}`,
    });
  };
  
  // Toggle bookmark/pin trophy
  const handlePinTrophy = (trophy: GameTrophy, game: Game) => {
    // Implementation to pin/bookmark trophy
    toast({
      title: trophy.isPinned ? "Trophy Unpinned" : "Trophy Pinned",
      description: `${trophy.name} from ${game.name} has been ${trophy.isPinned ? 'removed from' : 'added to'} your pinned trophies`,
    });
  };
  
  return (
    <div className="min-h-screen bg-primary pb-16">
      <SEO 
        title="Trophy Museum - Your Gaming Legacy"
        description="Browse your entire collection of gaming achievements, trophies and milestones through the years."
      />
      
      <div className="max-w-7xl mx-auto pt-36 px-4 sm:px-6"> {/* Increased padding-top further to pt-36 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-purple to-neon-blue">
            Trophy Museum
          </h1>
          <p className="mt-2 text-zinc-400">Your gaming legacy — immortalized</p>
        </div>
        
        {/* Trophy Stats Bar */}
        <div className="bg-black/30 rounded-lg p-4 mb-8 grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.totalTrophies}</div>
            <div className="text-xs text-zinc-400">Total Trophies</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">{stats.platinumCount}</div>
            <div className="text-xs text-zinc-400">Platinum</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">{stats.goldCount}</div>
            <div className="text-xs text-zinc-400">Gold</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-300">{stats.silverCount}</div>
            <div className="text-xs text-zinc-400">Silver</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-700">{stats.bronzeCount}</div>
            <div className="text-xs text-zinc-400">Bronze</div>
          </div>
        </div>
        
        {/* Filters and Search */}
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500 h-4 w-4" />
              <Input 
                type="text" 
                placeholder="Search trophies..." 
                className="pl-10 w-[200px] md:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="ml-2"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={activeView === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveView('grid')}
            >
              Grid View
            </Button>
            <Button
              variant={activeView === 'timeline' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveView('timeline')}
            >
              Timeline
            </Button>
          </div>
        </div>
        
        {/* Filter Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8"
          >
            <Card className="glass-card">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Year</label>
                    <select 
                      className="w-full p-2 rounded bg-black/20 border border-zinc-800"
                      value={filters.year as string}
                      onChange={(e) => setFilters({...filters, year: e.target.value === 'all' ? 'all' : parseInt(e.target.value)})}
                    >
                      <option value="all">All Years</option>
                      {mockYears.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Platform</label>
                    <select 
                      className="w-full p-2 rounded bg-black/20 border border-zinc-800"
                      value={filters.platform as string}
                      onChange={(e) => setFilters({...filters, platform: e.target.value})}
                    >
                      <option value="all">All Platforms</option>
                      {mockPlatforms.map(platform => (
                        <option key={platform} value={platform}>{platform}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Genre</label>
                    <select 
                      className="w-full p-2 rounded bg-black/20 border border-zinc-800"
                      value={filters.genre as string}
                      onChange={(e) => setFilters({...filters, genre: e.target.value})}
                    >
                      <option value="all">All Genres</option>
                      {mockGenres.map(genre => (
                        <option key={genre} value={genre}>{genre}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Trophy Type</label>
                    <select 
                      className="w-full p-2 rounded bg-black/20 border border-zinc-800"
                      value={filters.type as string}
                      onChange={(e) => setFilters({...filters, type: e.target.value as TrophyFilter})}
                    >
                      <option value="all">All Types</option>
                      <option value="platinum">Platinum</option>
                      <option value="gold">Gold</option>
                      <option value="silver">Silver</option>
                      <option value="bronze">Bronze</option>
                      <option value="legacy">Legacy Trophies</option>
                      <option value="milestones">Milestones</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Rarity</label>
                    <select 
                      className="w-full p-2 rounded bg-black/20 border border-zinc-800"
                      value={filters.rarity as string}
                      onChange={(e) => setFilters({...filters, rarity: e.target.value as any})}
                    >
                      <option value="all">All Rarities</option>
                      <option value="common">Common (20%+)</option>
                      <option value="rare">Rare (5-20%)</option>
                      <option value="ultra-rare">Ultra Rare (&lt;5%)</option>
                    </select>
                  </div>
                  
                  <div className="flex items-end">
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => setFilters({
                        year: 'all',
                        platform: 'all',
                        genre: 'all',
                        type: 'all',
                        rarity: 'all',
                        milestones: false
                      })}
                    >
                      Reset Filters
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
        
        {/* No Trophy Message */}
        {filteredTrophies.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="h-16 w-16 mx-auto mb-4 text-neutral-600" />
            <h3 className="text-xl font-bold">No Trophies Found</h3>
            <p className="text-zinc-400 mt-2">
              {allTrophies.length === 0 
                ? "You don't have any trophies yet. Connect your gaming accounts to show your achievements." 
                : "No trophies match your current filters. Try adjusting your search criteria."}
            </p>
            {allTrophies.length === 0 && (
              <Button 
                className="mt-4"
                onClick={() => navigate('/link-accounts')}
              >
                Connect Gaming Accounts
              </Button>
            )}
          </div>
        )}
        
        {/* Trophy Display */}
        <Tabs defaultValue="all" className="mb-6">
          <TabsList className="glass-card">
            <TabsTrigger value="all">All Trophies</TabsTrigger>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
            <TabsTrigger value="platinum">Platinum Journey</TabsTrigger>
          </TabsList>
          
          {/* All Trophies Tab */}
          <TabsContent value="all" className="mt-6">
            {activeView === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredTrophies.map(({ trophy, game }, index) => (
                  <motion.div
                    key={`${trophy.id}-${game.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  >
                    <TrophyCard 
                      trophy={trophy} 
                      game={game} 
                      onClick={() => handleTrophyClick(trophy, game)}
                      onShare={() => handleShareTrophy(trophy, game)}
                      onPin={() => handlePinTrophy(trophy, game)}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-16">
                {Object.entries(trophiesByYear)
                  .sort(([yearA], [yearB]) => parseInt(yearB) - parseInt(yearA))
                  .map(([year, trophies]) => (
                    <div key={year} className="relative">
                      <div className="sticky top-20 bg-gradient-to-r from-neon-purple/20 to-transparent px-4 py-2 rounded-l-md text-white font-bold text-2xl mb-4">
                        {year}
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pl-2">
                        {trophies.map(({ trophy, game }, index) => (
                          <motion.div
                            key={`${trophy.id}-${game.id}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05, duration: 0.3 }}
                          >
                            <TrophyCard 
                              trophy={trophy} 
                              game={game} 
                              onClick={() => handleTrophyClick(trophy, game)}
                              onShare={() => handleShareTrophy(trophy, game)}
                              onPin={() => handlePinTrophy(trophy, game)}
                            />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </TabsContent>
          
          {/* Milestones Tab */}
          <TabsContent value="milestones" className="mt-6">
            {milestoneTrophies.length === 0 ? (
              <div className="text-center py-12 bg-black/20 rounded-lg">
                <Medal className="h-16 w-16 mx-auto mb-4 text-neutral-600" />
                <h3 className="text-xl font-bold">No Milestones Found</h3>
                <p className="text-zinc-400 mt-2">
                  You don't have any milestone trophies in your collection yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {milestoneTrophies.map(({ trophy, game }, index) => (
                  <MilestoneCard
                    key={`${trophy.id}-${game.id}`}
                    trophy={trophy}
                    game={game}
                    milestoneInfo={game.milestoneInfo}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          {/* Platinum Journey Tab */}
          <TabsContent value="platinum" className="mt-6">
            <div className="bg-black/20 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Your Platinum Journey</h2>
              
              {filteredTrophies.filter(({ trophy }) => trophy.type === 'platinum').length === 0 ? (
                <div className="text-center py-12">
                  <Trophy className="h-16 w-16 mx-auto mb-4 text-neutral-600" />
                  <h3 className="text-xl font-bold">No Platinum Trophies Yet</h3>
                  <p className="text-zinc-400 mt-2">
                    Your platinum journey is waiting to begin.
                  </p>
                </div>
              ) : (
                <div className="space-y-8">
                  <YearTimeline 
                    trophies={filteredTrophies.filter(({ trophy }) => trophy.type === 'platinum')} 
                  />
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LegacyWall;
