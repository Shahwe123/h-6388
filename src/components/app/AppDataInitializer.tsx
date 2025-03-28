
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useInitializeData } from '@/hooks/useInitializeData';
import { useDispatch } from 'react-redux';
import { fetchGamesStart, fetchGamesSuccess, fetchGamesFailure, setPlatforms, setGamePlatforms } from '@/redux/slices/gamesSlice';
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
      }
    };
    
    getUserId();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUserId(session?.user?.id || null);
      }
    );
    
    // Clean up subscription when component unmounts
    return () => subscription.unsubscribe();
  }, []);
  
  // Load game data when userId changes
  useEffect(() => {
    if (userId) {
      const loadGameData = async () => {
        try {
          dispatch(fetchGamesStart());
          
          // Fetch platforms
          const { data: platforms, error: platformsError } = await supabase
            .from('platforms')
            .select('*');
            
          if (platformsError) throw platformsError;
          dispatch(setPlatforms(platforms));
          
          // Fetch user game platforms
          const { data: userGamePlatforms, error: userGpError } = await supabase
            .from('user_games')
            .select(`
              game_platform_id,
              game_platforms!inner(
                id,
                platform_specific_id,
                games!inner(id, name, icon_url, description),
                platforms!inner(id, name)
              )
            `)
            .eq('user_id', userId);
            
          if (userGpError) throw userGpError;
          
          if (userGamePlatforms) {
            const formattedGamePlatforms = userGamePlatforms.map(ug => ({
              id: ug.game_platforms.id,
              gameId: ug.game_platforms.games.id,
              platformId: ug.game_platforms.platforms.id,
              platformSpecificId: ug.game_platforms.platform_specific_id,
              game: {
                id: ug.game_platforms.games.id,
                name: ug.game_platforms.games.name,
                platform: ug.game_platforms.platforms.name,
                image: ug.game_platforms.games.icon_url,
                description: ug.game_platforms.games.description
              }
            }));
            
            dispatch(setGamePlatforms(formattedGamePlatforms));
          }
          
          // Fetch games with achievements
          const games = await getGames(userId);
          dispatch(fetchGamesSuccess(games));
          
        } catch (error: any) {
          console.error('Error loading game data:', error);
          dispatch(fetchGamesFailure(error.message));
        }
      };
      
      loadGameData();
    }
  }, [userId, dispatch]);
  
  // Initialize other data when user is logged in
  useInitializeData(userId);
  
  return null;
};
