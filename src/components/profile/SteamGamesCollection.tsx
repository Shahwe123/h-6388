
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '../ui/card';
import { ExternalLink } from 'lucide-react';

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
    async function fetchSteamGames() {
      try {
        setLoading(true);
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('steam_games')
          .single();

        if (profileError) throw profileError;

        if (profile && profile.steam_games) {
          // Type guard and validation function
          const isSteamGame = (game: any): game is SteamGame => {
            return (
              game &&
              typeof game === 'object' &&
              typeof game.appid === 'number' &&
              typeof game.name === 'string' &&
              typeof game.playtime_forever === 'number' &&
              typeof game.img_icon_url === 'string'
            );
          };

          // Filter and validate the games array
          const validGames = Array.isArray(profile.steam_games) 
            ? profile.steam_games.filter(isSteamGame)
            : [];

          setGames(validGames);
        }
      } catch (err) {
        console.error('Error fetching games:', err);
        setError('Failed to load your Steam games');
      } finally {
        setLoading(false);
      }
    }

    fetchSteamGames();
  }, []);

  if (loading) {
    return <div className="my-4 p-4 text-center text-neutral-300">Loading your game collection...</div>;
  }

  if (error) {
    return <div className="my-4 p-4 text-center text-red-400">{error}</div>;
  }

  if (games.length === 0) {
    return (
      <div className="my-4 p-6 text-center text-neutral-300 bg-black/40 rounded-xl border border-neon-purple/20">
        <p>No Steam games found. Link your Steam account to see your games here.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {games.map((game) => (
        <Card key={game.appid} className="bg-black/40 border-neon-purple/20 overflow-hidden hover:border-neon-blue/40 transition-all">
          <div className="p-4">
            <div className="flex gap-3 items-center mb-3">
              {game.img_icon_url && (
                <img
                  src={`https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`}
                  alt={`${game.name} icon`}
                  className="w-8 h-8 rounded"
                />
              )}
              <h3 className="font-medium text-white truncate" title={game.name}>
                {game.name}
              </h3>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-neutral-400">
                {Math.floor(game.playtime_forever / 60)} hours played
              </span>
              <a
                href={`https://store.steampowered.com/app/${game.appid}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neon-blue hover:text-neon-purple transition-colors"
              >
                <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
