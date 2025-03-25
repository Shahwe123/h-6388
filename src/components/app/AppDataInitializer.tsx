
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useInitializeData } from '@/hooks/useInitializeData';
import { useUserGames } from '@/hooks/useUserGames';
import { useDispatch } from 'react-redux';
import { fetchGamesStart, fetchGamesSuccess, fetchGamesFailure } from '@/redux/slices/gamesSlice';
import { getGames } from '@/helpers/gameHelpers';

/**
 * AppDataInitializer component
 * 
 * This component initializes app-wide data when the user is logged in.
 * It listens for auth state changes and triggers data loading when a user logs in.
 * 
 * @returns {null} This component doesn't render anything
 */
export const AppDataInitializer = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const dispatch = useDispatch();
  
  useEffect(() => {
    // Create avatars bucket when the app starts
    const createAvatarsBucket = async () => {
      try {
        await supabase.functions.invoke('create-avatars-bucket');
      } catch (error) {
        console.error('Error creating avatars bucket:', error);
      }
    };

    createAvatarsBucket();
    
    // Get current user ID on component mount
    const getUserId = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUserId(data.user.id);
        loadUserGames(data.user.id);
      }
    };
    
    getUserId();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const newUserId = session?.user?.id || null;
        setUserId(newUserId);
        
        // If user just logged in, load their games
        if (event === 'SIGNED_IN' && newUserId) {
          loadUserGames(newUserId);
        }
      }
    );
    
    // Function to load user games
    const loadUserGames = async (uid: string) => {
      try {
        dispatch(fetchGamesStart());
        const userGames = await getGames(uid);
        dispatch(fetchGamesSuccess(userGames));
        console.log('Loaded user games:', userGames.length);
      } catch (error: any) {
        console.error('Error loading user games:', error);
        dispatch(fetchGamesFailure(error.message || 'Failed to load games'));
      }
    };
    
    // Clean up subscription when component unmounts
    return () => subscription.unsubscribe();
  }, [dispatch]);
  
  // Initialize data when user is logged in
  useInitializeData(userId);
  
  return null;
};
