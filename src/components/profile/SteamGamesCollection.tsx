
import React, { useState, useEffect } from 'react';
import { Gamepad2, Search, Trophy } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface SteamGame {
  appid: number;
  name: string;
  playtime_forever: number;
  img_icon_url: string;
  has_achievements?: boolean;
  achievements_count?: number;
  achievements_unlocked?: number;
}

interface SteamGamesCollectionProps {
  userId: string;
  isOwnProfile: boolean;
}

const SteamGamesCollection: React.FC<SteamGamesCollectionProps> = ({ userId, isOwnProfile }) => {
  const [games, setGames] = useState<SteamGame[]>([]);
  const [filteredGames, setFilteredGames] = useState<SteamGame[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [steamId, setSteamId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        
        // First, get the user's profile to check if they have a Steam ID
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('steam_id, steam_games')
          .eq('id', userId)
          .single();
          
        if (profileError) throw profileError;
        
        setSteamId(profile.steam_id);
        
        if (!profile.steam_id || !profile.steam_games || profile.steam_games.length === 0) {
          setLoading(false);
          return;
        }
        
        // The games are already stored in the profile
        setGames(profile.steam_games || []);
        setFilteredGames(profile.steam_games || []);
        
      } catch (error) {
        console.error('Error fetching games:', error);
        toast({
          title: 'Error',
          description: 'Failed to load game collection',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchGames();
  }, [userId, toast]);
  
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredGames(games);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = games.filter(game => 
        game.name.toLowerCase().includes(query)
      );
      setFilteredGames(filtered);
    }
  }, [searchQuery, games]);
  
  const formatPlaytime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    return `${hours} hrs`;
  };

  return (
    <div className="glass-card rounded-xl p-6 mb-8">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Gamepad2 className="h-5 w-5 text-neon-green" />
        Steam Games Collection
      </h2>
      
      {loading ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 border-4 border-neon-purple border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-400">Loading game collection...</p>
        </div>
      ) : !steamId ? (
        <div className="text-neutral-400 text-center py-8">
          <Gamepad2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>{isOwnProfile ? "You haven't" : "This user hasn't"} linked a Steam account yet</p>
          {isOwnProfile && (
            <Link to="/link-accounts">
              <Button className="bg-gradient-game mt-4">
                Link Steam Account
              </Button>
            </Link>
          )}
        </div>
      ) : games.length === 0 ? (
        <div className="text-neutral-400 text-center py-8">
          <Gamepad2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No games found in the Steam library</p>
          {isOwnProfile && (
            <p className="text-sm mt-2">Make sure your Steam profile is public and try reconnecting your account</p>
          )}
        </div>
      ) : (
        <>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-500" />
            <Input
              className="pl-10 bg-black/30 border-neutral-700"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filteredGames.map((game) => (
              <div key={game.appid} className="bg-black/40 rounded-lg overflow-hidden hover:bg-black/60 transition-all hover:scale-105 hover:shadow-xl hover:shadow-neon-purple/10 border border-transparent hover:border-neon-purple/20">
                <div className="aspect-square bg-black/50 flex items-center justify-center">
                  {game.img_icon_url ? (
                    <img 
                      src={`https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`}
                      alt={game.name}
                      className="w-16 h-16"
                    />
                  ) : (
                    <Gamepad2 className="w-12 h-12 text-neutral-700" />
                  )}
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-medium truncate mb-1" title={game.name}>
                    {game.name}
                  </h3>
                  <div className="flex justify-between items-center text-xs text-neutral-400">
                    <span>{formatPlaytime(game.playtime_forever)}</span>
                    {game.has_achievements && (
                      <div className="flex items-center">
                        <Trophy className="h-3 w-3 text-yellow-500 mr-1" />
                        <span>
                          {game.achievements_unlocked}/{game.achievements_count}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredGames.length === 0 && (
            <div className="text-center py-4 text-neutral-400">
              No games found matching "{searchQuery}"
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SteamGamesCollection;
