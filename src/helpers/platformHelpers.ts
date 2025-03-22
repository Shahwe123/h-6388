
import { supabase } from '@/integrations/supabase/client';
import { fetchGamesStart, fetchGamesSuccess, fetchGamesFailure, setPlatforms, setGamePlatforms } from '../redux/slices/gamesSlice.js';

/**
 * Fetch Steam game data using Steam ID
 * @param steamId The Steam ID to fetch data for
 * @param userId The user ID to associate the game data with
 * @param dispatch Redux dispatch function
 * @param onSuccess Optional callback on success
 * @param onError Optional callback on error
 */
export const fetchSteamData = async (
  steamId: string, 
  userId: string,
  dispatch: any,
  onSuccess?: () => void,
  onError?: (error: Error) => void
) => {
  if (!steamId) {
    onError?.(new Error("Steam ID not found"));
    return;
  }

  try {
    dispatch(fetchGamesStart());
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch("https://nvjjragekchczuxgdvvo.supabase.co/functions/v1/fetch-steam-data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        "steamId": steamId
      })
    });

    if (!response.ok) {
      throw new Error('Failed to fetch Steam data');
    }

    const data = await response.json();
    await processAndStoreSteamData(data, userId, dispatch);
    onSuccess?.();
  } catch (error) {
    console.error('Error fetching Steam data:', error);
    dispatch(fetchGamesFailure());
    onError?.(error instanceof Error ? error : new Error('Failed to process Steam data'));
  }
};

/**
 * Process and store Steam game data in Supabase
 * @param steamData The Steam data to process
 * @param userId The user ID to associate the game data with
 * @param dispatch Redux dispatch function
 */
export const processAndStoreSteamData = async (steamData: any, userId: string, dispatch: any) => {
  if (!steamData || !userId) return;

  try {
    // Fetch all platforms first
    const { data: platforms, error: platformsError } = await supabase
      .from('platforms')
      .select('*');
      
    if (platformsError) throw platformsError;
    
    // Find the Steam platform
    const steamPlatform = platforms.find(p => p.name.toLowerCase() === 'steam');
    if (!steamPlatform) {
      throw new Error('Steam platform not found in the database');
    }
    
    // Store platforms in Redux
    dispatch(setPlatforms(platforms));

    // Process games from Steam
    if (steamData.games && Array.isArray(steamData.games)) {
      for (const game of steamData.games) {
        if (!game.appId || typeof game.appId !== 'number') {
          console.warn('Invalid game appid:', game.appId, 'for game:', game.gameName);
          continue; // Skip this game
        }

        // Check if game already exists
        const { data: existingGame, error: gameCheckError } = await supabase
          .from('games')
          .select('id')
          .eq('name', game.gameName || 'Unknown Game')
          .maybeSingle();

        if (gameCheckError) throw gameCheckError;

        let gameId;

        // Add game if it doesn't exist
        if (!existingGame) {
          const { data: newGame, error: gameInsertError } = await supabase
            .from('games')
            .insert({
              name: game.gameName || 'Unknown Game',
              icon_url: game.img_icon_url ? `https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg` : null,
              description: game.description || null
            })
            .select('id')
            .single();

          if (gameInsertError) throw gameInsertError;
          gameId = newGame.id;
        } else {
          gameId = existingGame.id;
        }

        // Check if game-platform combination exists
        const { data: existingGamePlatform, error: gpCheckError } = await supabase
          .from('game_platforms')
          .select('id')
          .eq('game_id', gameId)
          .eq('platform_id', steamPlatform.id)
          .maybeSingle();
          
        if (gpCheckError) throw gpCheckError;
        
        let gamePlatformId;
        
        // Create game-platform entry if it doesn't exist
        if (!existingGamePlatform) {
          const { data: newGamePlatform, error: gpInsertError } = await supabase
            .from('game_platforms')
            .insert({
              game_id: gameId,
              platform_id: steamPlatform.id,
              platform_specific_id: game.appId.toString()
            })
            .select('id')
            .single();
            
          if (gpInsertError) throw gpInsertError;
          gamePlatformId = newGamePlatform.id;
        } else {
          gamePlatformId = existingGamePlatform.id;
        }
        
        // Link user to this game-platform
        const { error: userGameError } = await supabase
          .from('user_games')
          .upsert({
            user_id: userId,
            game_id: gameId,
            platform_name: 'steam',
            game_platform_id: gamePlatformId
          });
          
        if (userGameError) throw userGameError;

        // Process achievements for this game
        if (game.achievements && Array.isArray(game.achievements)) {
          for (const achievement of game.achievements) {
            if (!achievement || !achievement.apiName) continue;
            
            // Check if achievement exists
            const { data: existingAchievement, error: achievementCheckError } = await supabase
              .from('achievements')
              .select('id')
              .eq('game_platform_id', gamePlatformId)
              .eq('platform_api_name', achievement.apiName)
              .maybeSingle();
              
            if (achievementCheckError) throw achievementCheckError;
            
            let achievementId;
            
            // Create achievement if it doesn't exist
            if (!existingAchievement) {
              const { data: newAchievement, error: achievementInsertError } = await supabase
                .from('achievements')
                .insert({
                  game_platform_id: gamePlatformId,
                  name: achievement.name || 'Unknown Achievement',
                  description: achievement.description || null,
                  icon_url: achievement.icon || null,
                  locked_icon_url: achievement.lockedIcon || null,
                  platform_api_name: achievement.apiName
                })
                .select('id')
                .single();
                
              if (achievementInsertError) throw achievementInsertError;
              achievementId = newAchievement.id;
            } else {
              achievementId = existingAchievement.id;
            }
            
            // Add user achievement if it's unlocked
            if (achievement.unlocked) {
              const unlockTime = achievement.unlockTime && achievement.unlocktime > 0
                ? new Date(achievement.unlocktime * 1000).toISOString()
                : null;
                
              const { error: userAchievementError } = await supabase
                .from('user_achievements')
                .upsert({
                  user_id: userId,
                  achievement_id: achievementId,
                  unlocked: true,
                  unlock_time: unlockTime
                });
                
              if (userAchievementError) throw userAchievementError;
            }
          }
        }
      }
    }

    // Fetch all updated game platforms
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
    
    // Store game platforms in Redux
    if (userGamePlatforms) {
      const formattedGamePlatforms = userGamePlatforms.map(ug => ({
        id: ug.game_platforms.id,
        gameId: ug.game_platforms.games.id,
        platformId: ug.game_platforms.platforms.id,
        platformSpecificId: ug.game_platforms.platform_specific_id,
        game: {
          id: ug.game_platforms.games.id,
          name: ug.game_platforms.games.name,
          image: ug.game_platforms.games.icon_url,
          description: ug.game_platforms.games.description
        },
        platform: {
          id: ug.game_platforms.platforms.id,
          name: ug.game_platforms.platforms.name
        }
      }));
      
      dispatch(setGamePlatforms(formattedGamePlatforms));
    }

    // Fetch user games with achievements
    const userGames = await getGames(userId);
    dispatch(fetchGamesSuccess(userGames));
  } catch (error) {
    console.error('Error processing Steam data:', error);
    throw error instanceof Error ? error : new Error('Failed to process Steam data');
  }
};

/**
 * Fetch Xbox game data using gamertag
 * @param gamerTag The Xbox gamertag to fetch data for
 */
export const fetchXboxData = async (gamerTag: string) => {
  if (!gamerTag) {
    console.error("GamerTag not found");
    return;
  }
  
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    const response = await fetch("https://nvjjragekchczuxgdvvo.supabase.co/functions/v1/fetch-xbox-data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        gamerTag
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch Xbox data');
    }
    
    const data = await response.json();
    console.log(data); // TODO: add data to redux store
    return data;
  } catch (error) {
    console.error("Error fetching Xbox data:", error);
    throw error;
  }
};

/**
 * Helper function to fetch games with achievements
 * Imported from gameHelpers.ts to avoid circular dependencies
 */
const getGames = async (userId: string) => {
  try {
    // First, fetch the user's game platforms
    const { data: userGames, error: userGamesError } = await supabase
      .from('user_games')
      .select('game_platform_id')
      .eq('user_id', userId);
    
    if (userGamesError) throw userGamesError;
    
    // If no games found, return empty array
    if (!userGames || userGames.length === 0) {
      return [];
    }
    
    // Extract the game platform IDs for the next query
    const gamePlatformIds = userGames.map(g => g.game_platform_id).filter(id => id !== null);
    
    if (gamePlatformIds.length === 0) {
      return [];
    }

    // Fetch game platform details with related game and platform information
    const { data: gamePlatforms, error: gamePlatformsError } = await supabase
      .from('game_platforms')
      .select(`
        id, 
        platform_specific_id,
        games!inner(id, name, icon_url, description),
        platforms!inner(id, name)
      `)
      .in('id', gamePlatformIds);
      
    if (gamePlatformsError) throw gamePlatformsError;

    if (!gamePlatforms || gamePlatforms.length === 0) {
      return [];
    }

    // Fetch user achievements
    const { data: userAchievements, error: achievementsError } = await supabase
      .from('user_achievements')
      .select('achievement_id, unlock_time, unlocked')
      .eq('user_id', userId);
    
    if (achievementsError) throw achievementsError;
    
    // If user has achievements, fetch their details and merge with games
    if (userAchievements && userAchievements.length > 0) {
      const achievementIds = userAchievements.map(a => a.achievement_id);
      
      // Fetch achievement details
      const { data: achievements, error: achievementDetailsError } = await supabase
        .from('achievements')
        .select('id, name, description, game_platform_id, icon_url, locked_icon_url')
        .in('id', achievementIds);
        
      if (achievementDetailsError) throw achievementDetailsError;

      // Transform gamePlatforms data to match the expected Game interface
      const formattedGames = gamePlatforms.map(gp => {
        // Get achievements for this game platform
        const gameAchievements = achievements.filter(a => a.game_platform_id === gp.id);
        
        // Format each achievement with user status
        const formattedAchievements = gameAchievements.map(achievement => {
          const userAchievement = userAchievements.find(ua => ua.achievement_id === achievement.id);
          return {
            id: achievement.id,
            name: achievement.name,
            description: achievement.description || '',
            image: achievement.icon_url || '',
            achieved: userAchievement?.unlocked || false,
            achievedDate: userAchievement?.unlock_time,
            gamePlatformId: gp.id
          };
        });
        
        return {
          id: gp.games.id,
          name: gp.games.name,
          platform: gp.platforms.name,
          image: gp.games.icon_url || '',
          platformSpecificId: gp.platform_specific_id,
          description: gp.games.description,
          gamePlatformId: gp.id,
          trophies: formattedAchievements,
          trophyCount: formattedAchievements.length,
          completion: formattedAchievements.filter(a => a.achieved).length / (formattedAchievements.length || 1) * 100
        };
      });
      
      return formattedGames;
    }
    
    // If no achievements found, just return the games with basic info
    return gamePlatforms.map(gp => ({
      id: gp.games.id,
      name: gp.games.name,
      platform: gp.platforms.name,
      image: gp.games.icon_url || '',
      platformSpecificId: gp.platform_specific_id,
      description: gp.games.description,
      gamePlatformId: gp.id,
      completion: 0,
      trophyCount: 0
    }));
  } catch (error) {
    console.error('Error fetching games:', error);
    throw error;
  }
};
