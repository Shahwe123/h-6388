
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getGames } from '@/helpers/gameHelpers';
import { fetchGamesStart, fetchGamesSuccess, fetchGamesFailure } from '@/redux/slices/gamesSlice';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';
import { Game } from '@/types/game';

export const useUserGames = () => {
  const [loading, setLoading] = useState(true);
  const [games, setGames] = useState<Game[]>([]);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserGames = async () => {
      try {
        setLoading(true);
        dispatch(fetchGamesStart());

        // Get current user
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData.session) {
          setLoading(false);
          return;
        }

        const userId = sessionData.session.user.id;
        
        // Fetch user games using the helper function
        const userGames = await getGames(userId);
        
        // Calculate additional stats for each game before storing
        const processedGames = userGames.map(game => {
          // Count trophies by type if available
          const trophyCounts = {
            bronze: 0,
            silver: 0,
            gold: 0,
            platinum: 0,
            total: game.trophies?.length || game.trophyCount || 0,
            earned: game.trophies?.filter(t => t.achieved).length || 0
          };
          
          if (game.trophies && game.trophies.length > 0) {
            // Count trophies by type
            game.trophies.forEach(trophy => {
              if (trophy.achieved) {
                switch (trophy.type) {
                  case 'platinum': trophyCounts.platinum++; break;
                  case 'gold': trophyCounts.gold++; break;
                  case 'silver': trophyCounts.silver++; break;
                  case 'bronze': trophyCounts.bronze++; break;
                }
              }
            });
          }
          
          // Calculate more accurate completion percentage
          const completion = trophyCounts.total > 0 
            ? Math.round((trophyCounts.earned / trophyCounts.total) * 100) 
            : 0;
          
          // Return enhanced game object
          return {
            ...game,
            trophyCounts,
            completion,
            // If lastPlayed is missing, set to a default date to avoid UI issues
            lastPlayed: game.lastPlayed || new Date().toISOString()
          };
        });
        
        console.log('Processed games with trophy stats:', processedGames);
        
        // Update local state
        setGames(processedGames);
        
        // Update Redux store
        dispatch(fetchGamesSuccess(processedGames));
        
      } catch (err: any) {
        console.error('Error fetching user games:', err);
        setError(err.message || 'Failed to fetch games');
        dispatch(fetchGamesFailure(err.message || 'Failed to fetch games'));
        toast({
          title: 'Error fetching games',
          description: err.message || 'Unable to load your games',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserGames();
  }, [dispatch, toast]);

  return { games, loading, error };
};
