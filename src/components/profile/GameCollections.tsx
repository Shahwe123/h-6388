
import { Link as RouterLink } from 'react-router-dom';
import { Gamepad, Link, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Profile } from '@/types/profile';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Progress } from '@/components/ui/progress';
import { useSelector } from 'react-redux';
import { Game } from '@/types/game';
import { getGames } from '@/helpers/gameHelpers';

/**
 * Props interface for the GameCollections component
 * @property {Profile} profile - The user profile data
 * @property {boolean} hasLinkedAccounts - Whether the user has any linked gaming accounts
 * @property {boolean} isOwnProfile - Whether the profile being viewed belongs to the current user
 */
interface GameCollectionsProps {
  profile: Profile;
  hasLinkedAccounts: boolean;
  isOwnProfile: boolean;
}

/**
 * GameCollections component displays user's connected gaming platform collections
 * 
 * Shows collections for:
 * - Steam games (if Steam ID is connected)
 * - PlayStation games (if PlayStation username is connected)
 * - Xbox games (if Xbox gamertag is connected)
 * 
 * If no accounts are linked, shows a prompt to link accounts
 * 
 * @param {GameCollectionsProps} props - Component props
 * @returns {JSX.Element} The game collections UI
 */
const GameCollections = ({ profile, hasLinkedAccounts, isOwnProfile }: GameCollectionsProps) => {
  const [loading, setLoading] = useState(true);
  const games = useSelector((state: any) => state.games?.games || []);
  const [profileGames, setProfileGames] = useState<Game[]>([]);
  
  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        
        if (profile) {
          if (isOwnProfile && games.length > 0) {
            // For own profile, use games from Redux state
            setProfileGames(games.slice(0, 4)); // Show only the first 4 games
          } else if (profile.id) {
            // For other profiles, fetch games directly
            const fetchedGames = await getGames(profile.id);
            setProfileGames(fetchedGames.slice(0, 4)); // Show only the first 4 games
          }
        }
      } catch (error) {
        console.error("Error fetching games:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchGames();
  }, [profile, games, isOwnProfile]);
  
  // If no accounts are linked and not own profile, don't show this section at all
  if (!hasLinkedAccounts && !isOwnProfile) return null;
  
  return (
    <div className="glass-card rounded-xl p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Game Collection</h2>
        <RouterLink to="/games">
          <Button variant="ghost" size="sm" className="text-neon-purple hover:text-neon-purple/80">
            <span>See All</span>
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </RouterLink>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-4 border-neon-purple border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : profileGames.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {profileGames.map((game) => (
            <RouterLink to={`/games/${game.id}`} key={game.id} className="transition-transform hover:scale-105">
              <div className="bg-black/20 rounded-lg overflow-hidden h-full flex flex-col">
                <div className="relative">
                  <img 
                    src={game.image || 'https://placehold.co/300x400?text=Game'} 
                    alt={game.name}
                    className="w-full aspect-[3/4] object-cover"
                    onError={(e) => {
                      const imgElement = e.target as HTMLImageElement;
                      imgElement.src = 'https://placehold.co/300x400?text=Game';
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent">
                    <div className="flex justify-between text-xs">
                      <span className="bg-black/60 px-1.5 py-0.5 rounded">
                        {game.platform}
                      </span>
                      <span className="bg-neon-purple/40 px-1.5 py-0.5 rounded">
                        {Math.round(game.completion)}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-2 flex-1 flex flex-col">
                  <h3 className="font-medium text-sm line-clamp-1">{game.name}</h3>
                  <div className="mt-1 mb-1.5">
                    <Progress value={game.completion} className="h-1 bg-black/40" />
                  </div>
                  <div className="mt-auto text-xs text-neutral-400 flex justify-between">
                    <span>{game.trophyCount || (game.trophies?.length || 0)} Trophies</span>
                  </div>
                </div>
              </div>
            </RouterLink>
          ))}
        </div>
      ) : (
        <div className="text-neutral-400 text-center py-8">
          <Gamepad className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No games found in collection</p>
          <p className="text-sm mt-1">Connect your gaming accounts to see your games</p>
          {isOwnProfile && (
            <RouterLink to="/link-accounts" className="block mt-4">
              <Button className="bg-gradient-game mt-2" size="sm">
                Link Accounts
              </Button>
            </RouterLink>
          )}
        </div>
      )}
    </div>
  );
};

export default GameCollections;
