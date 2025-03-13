
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Gamepad } from 'lucide-react';
import { Json } from '@/integrations/supabase/types';

interface SteamGame {
  appid: number;
  name: string;
  playtime_forever: number; 
  img_icon_url?: string;
}

export const SteamGamesCollection = ({ userId }: { userId?: string }) => {
  const [games, setGames] = useState<SteamGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSteamGames = async () => {
      try {
        // First, get the current user ID if not provided
        let targetUserId = userId;
        
        if (!targetUserId) {
          const { data: user } = await supabase.auth.getUser();
          if (!user?.user) {
            setError('User not authenticated');
            setLoading(false);
            return;
          }
          targetUserId = user.user.id;
        }

        // Query the profiles table to get the steam_games JSON data
        const { data, error } = await supabase
          .from('profiles')
          .select('steam_games')
          .eq('id', targetUserId)
          .single();

        if (error) {
          throw error;
        }

        if (data && data.steam_games) {
          // Parse the steam_games JSON data as an array
          const steamGamesArray = Array.isArray(data.steam_games) ? data.steam_games : [];
          
          // Filter and validate the games data
          const validGames: SteamGame[] = [];
          
          for (const game of steamGamesArray) {
            // Skip null or non-object items
            if (!game || typeof game !== 'object') continue;
            
            // Type assertion with safety checks
            const gameObj = game as Record<string, unknown>;
            
            if (
              typeof gameObj.appid === 'number' && 
              typeof gameObj.name === 'string' && 
              typeof gameObj.playtime_forever === 'number'
            ) {
              // Add only games with valid required properties
              validGames.push({
                appid: gameObj.appid,
                name: gameObj.name,
                playtime_forever: gameObj.playtime_forever,
                img_icon_url: typeof gameObj.img_icon_url === 'string' ? gameObj.img_icon_url : undefined
              });
            }
          }
          
          setGames(validGames);
        } else {
          // No games found, but not an error
          setGames([]);
        }
      } catch (err: any) {
        console.error('Error fetching Steam games:', err);
        setError(err.message || 'Failed to load Steam games');
      } finally {
        setLoading(false);
      }
    };

    fetchSteamGames();
  }, [userId]);

  if (loading) {
    return (
      <div className="w-full h-32 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-neon-purple border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="text-center p-4">
        <div className="flex flex-col items-center text-neutral-400">
          <Gamepad className="w-12 h-12 opacity-30 mb-2" />
          <p>No Steam games linked yet.</p>
          <p className="text-sm">Connect your Steam account to see your games.</p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-72 rounded-md border border-neon-purple/20 p-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-1">
        {games.map((game) => (
          <div key={game.appid} className="glass-card p-3 rounded-lg flex flex-col items-center">
            {game.img_icon_url ? (
              <img
                src={`http://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`}
                alt={game.name}
                className="w-16 h-16 mb-2 rounded"
                onError={(e) => {
                  const imgElement = e.target as HTMLImageElement;
                  imgElement.src = 'https://placehold.co/64x64?text=Game';
                }}
              />
            ) : (
              <div className="w-16 h-16 bg-gray-800 flex items-center justify-center rounded mb-2">
                <span className="text-xs">No Image</span>
              </div>
            )}
            <p className="text-sm font-medium text-center line-clamp-1">{game.name}</p>
            <Badge variant="outline" className="mt-1 text-xs">
              {Math.round(game.playtime_forever / 60)} hrs
            </Badge>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default SteamGamesCollection;
