
import { supabase } from '@/integrations/supabase/client';
import { fetchGamesStart, fetchGamesSuccess, fetchGamesFailure } from '../redux/slices/gamesSlice.js';

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
    // Loops through
    if (steamData.games && Array.isArray(steamData.games)) {
      for (const game of steamData.games) {
        if (!game.appId || typeof game.appId !== 'number') {
          console.warn('Invalid game appid:', game.appId, 'for game:', game.gameName);
          continue; // Skip this game
        }

        const { data: existingGame, error: gameCheckError } = await supabase
          .from('games')
          .select('id')
          .eq('steam_app_id', game.appId)
          .maybeSingle();

        if (gameCheckError) throw gameCheckError;

        let gameId;

        // Checks if game exists in database
        if (!existingGame) {
          // if game is not in the database, its added
          const { data: newGame, error: gameInsertError } = await supabase
            .from('games')
            .insert({
              steam_app_id: game.appId,
              name: game.gameName || 'Unknown Game',
              icon_url: game.img_icon_url ? `https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg` : null
            })
            .select('id')
            .single();

          if (gameInsertError) throw gameInsertError;

          gameId = newGame.id;
          
          const { error: profileUpdateError } = await supabase.from('user_games').insert([{ user_id: userId, game_id: gameId, platform_name: 'steam' }])
          if (profileUpdateError) throw profileUpdateError;

          // Process achievements for new games
          if (game.achievements && Array.isArray(game.achievements)) {
            const achievementsToInsert = game.achievements
              .filter(achievement =>
                achievement &&
                typeof achievement === 'object' &&
                achievement.apiName
              )
              .map(achievement => ({
                game_id: gameId,
                platform: 'steam',
                platform_api_name: achievement.apiName,
                name: achievement.name || 'Unknown Achievement',
                description: achievement.description || null,
                icon_url: achievement.icon || null,
                locked_icon_url: achievement.lockedIcon || null
              }));

            if (achievementsToInsert.length > 0) {
              const { error: achievementsInsertError } = await supabase
                .from('achievements')
                .insert(achievementsToInsert);

              if (achievementsInsertError) throw achievementsInsertError;
            }
          }
        } else {
          // game exists
          gameId = existingGame.id;
        }
        
        // Process user achievements
        if (game.achievements && Array.isArray(game.achievements)) {
          for (const achievement of game.achievements) {
            if (achievement && achievement.unlocked && achievement.apiName) {
              const { data: achievementData, error: achievementError } = await supabase
                .from('achievements')
                .select('id')
                .eq('game_id', gameId)
                .eq('platform_api_name', achievement.apiname)
                .maybeSingle();

              if (achievementError) throw achievementError;

              if (achievementData) {
                const unlockTime = achievement.unlockTime && achievement.unlocktime > 0
                  ? new Date(achievement.unlocktime * 1000).toISOString()
                  : null;

                const { error: userAchievementError } = await supabase
                  .from('user_achievements')
                  .upsert({
                    user_id: userId,
                    achievement_id: achievementData.id,
                    unlocked: true,
                    unlock_time: unlockTime
                  });

                if (userAchievementError) throw userAchievementError;
              }
            }
          }
        }
      }
    }

    // Fetch updated games list
    const getGames = async (userId: string) => {
      const { data, error } = await supabase
      .from('user_games')
      .select('game_id, platform_name')
      .eq('user_id', userId);
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        return [];
      }
      
      const gameIds = data.map(g => g.game_id);

      const { data: games, error: gamesError } = await supabase
          .from('games')
          .select('id, steam_app_id, name, icon_url')
          .in('id', gameIds);
          
      if (gamesError) throw gamesError;

      const { data: userAchievements, error: achievementsError } = await supabase
      .from('user_achievements')
      .select('id, achievement_id, unlock_time')
      .eq('user_id', userId)
      .order('unlock_time', { ascending: false });
      
      if (achievementsError) throw achievementsError;
      
      if (userAchievements && userAchievements.length > 0) {
        const achievementIds = userAchievements.map(a => a.achievement_id);
        const { data: achievements, error: achievementDetailsError } = await supabase
            .from('achievements')
            .select('id, name, description, game_id, icon_url, locked_icon_url')
            .in('id', achievementIds);
            
        if (achievementDetailsError) throw achievementDetailsError;

        const mergedData = []
        games.forEach(game => {
          achievements.forEach(achievement => {
            if (achievement.game_id === game.id) {
              mergedData.push({
                game, achievement
              })
            }
          });
        });
        return mergedData;
      }
      return games;
    }

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
