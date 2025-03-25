
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
        
        // Fix any missing image URLs with proper placeholder
        const gamesWithFixedImages = userGames.map(game => ({
          ...game,
          image: game.image || `https://placehold.co/400x600/2a2a2a/6f6f6f?text=${encodeURIComponent(game.name)}`
        }));
        
        // Update local state
        setGames(gamesWithFixedImages);
        
        // Update Redux store
        dispatch(fetchGamesSuccess(gamesWithFixedImages));
        
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
