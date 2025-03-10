
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Json } from '@/integrations/supabase/types';

interface SteamGame {
  appid: number;
  name: string;
  playtime_forever: number;
  img_icon_url: string;
}

export const SteamGamesCollection = () => {
  const [games, setGames] = useState<SteamGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSteamGames = async () => {
      try {
        const { data: user } = await supabase.auth.getUser();
        
        if (!user.user) {
          setError('User not authenticated');
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('steam_games')
          .select('*')
          .eq('user_id', user.user.id);

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          // Type safety: Convert Json[] to SteamGame[] with validation
          const validGames = data
            .filter((game): game is SteamGame => {
              // Validate that each game has the required properties and correct types
              return (
                typeof game === 'object' &&
                game !== null &&
                'appid' in game &&
                typeof game.appid === 'number' &&
                'name' in game &&
                typeof game.name === 'string' &&
                'playtime_forever' in game &&
                typeof game.playtime_forever === 'number' &&
                'img_icon_url' in game &&
                typeof game.img_icon_url === 'string'
              );
            });
          
          setGames(validGames);
        }
      } catch (err) {
        console.error('Error fetching Steam games:', err);
        setError('Failed to load Steam games');
      } finally {
        setLoading(false);
      }
    };

    fetchSteamGames();
  }, []);

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
        <p className="text-neutral-400">No Steam games linked yet. Connect your Steam account to see your games.</p>
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
                  (e.target as HTMLImageElement).src = 'https://placehold.co/64x64?text=Game';
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
