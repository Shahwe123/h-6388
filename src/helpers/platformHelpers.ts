import { supabase } from '@/integrations/supabase/client';
import { fetchGamesStart, fetchGamesSuccess, fetchGamesFailure, setPlatforms, setGamePlatforms } from '../redux/slices/gamesSlice.js';
import { getGames } from './gameHelpers.js';

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

    // Show detailed logging for debugging
    console.log(`Fetching Steam data for Steam ID: ${steamId}`);

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
      const errorText = await response.text();
      console.error(`Steam API error (${response.status}): ${errorText}`);
      throw new Error(`Failed to fetch Steam data: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log('Steam data received:', data);
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
      dispatch(fetchGamesSuccess(steamData.games))
     
      for (const gameObject of steamData.games) {
        const game = gameObject.game
        if (!game.appid || typeof game.appid !== 'number') {
          console.warn('Invalid game appid:', game.appid, 'for game:', game.name);
          continue; // Skip this game
        }
        
        // Check if game already exists
        const { data: existingGame, error: gameCheckError } = await supabase
          .from('games')
          .select('id')
          .eq('name', game.name || 'Unknown Game')
          .maybeSingle();

        if (gameCheckError) throw gameCheckError;

        let gameId;
        let gamePlatformId;
        // Add game if it doesn't exist
        if (!existingGame) {

          // Adds game to the database
          const { data: newGame, error: gameInsertError } = await supabase
            .from('games')
            .insert({
              name: game.name || 'Unknown Game',
              icon_url: game.img_icon_url ? `https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg` : null,
              description: game.description || null
            })
            .select('id')
            .single();

          if (gameInsertError) throw gameInsertError;
          gameId = newGame.id;

          // adds the platform the game is on
          const { data: newGamePlatform, error: gpInsertError } = await supabase
          .from('game_platforms')
          .insert({
            game_id: gameId,
            platform_id: steamPlatform.id,
            // platform_specific_id: game.appId.toString()
          })
          .select('id')
          .single();

          if (gpInsertError) throw gpInsertError;
          gamePlatformId = newGamePlatform.id;


          // add the achievements of the game

          breakme: if (gameObject.availableAchievements && Array.isArray(gameObject.availableAchievements)) {
            if (!gameObject.availableAchievements || gameObject.availableAchievements.length === 0) {
              console.warn('No achievements for game:', gameObject.game.name);
              break breakme; // Skip this game
            }
            for (const achievement of gameObject.availableAchievements) {
              if (!achievement || !achievement.name) continue;

              // Check if achievement exists TODO: might not need this, for example, if a game already exists in database for steam, chec
              const { data: existingAchievement, error: achievementCheckError } = await supabase
                .from('achievements')
                .select('id')
                .eq('game_platform_id', gamePlatformId)
                .eq('platform_api_name', achievement.name)
                .maybeSingle();

              if (achievementCheckError) throw achievementCheckError;

              let achievementId;

              // Create achievement if it doesn't exist
              if (!existingAchievement) {
                const { data: newAchievement, error: achievementInsertError } = await supabase
                  .from('achievements')
                  .insert({
                    game_platform_id: gamePlatformId,
                    name: achievement.displayName || 'Unknown Achievement',
                    description: achievement.description || null,
                    icon_url: achievement.icon || null,
                    locked_icon_url: achievement.icongray || null,
                    platform_api_name: achievement.name,
                    type: achievement.type || null
                  })
                  .select('id')
                  .single();

                if (achievementInsertError) throw achievementInsertError;
                achievementId = newAchievement.id;
              } else {
                achievementId = existingAchievement.id;
              }

            }
          }
        } else {
          gameId = existingGame.id;
        }
        //TODO: if game exists need to check if game exists on xbox, steam or psn

        // Link user to this game-platform TODO: need to check if user has been linked
        const { data: userHasGame, error: userHasGameError } = await supabase
          .from('user_games')
          .select('id')
          .eq('user_id', userId)
          .eq('game_id', gameId)
          .maybeSingle();

        if (!userHasGame) {
          const { error: userGameError } = await supabase
          .from('user_games')
          .upsert({
            user_id: userId,
            game_id: gameId,
            platform_name: 'steam',
            game_platform_id: gamePlatformId
          });

          if (userGameError) throw userGameError;
        }

        // process achievements earned
        //TODO: some games like vrchat the gameObject is {} empty need to chcek for this
        if (Object.keys(gameObject.playerStats).length !== 0) {
          
          if (gameObject.playerStats.playerstats.achievements && Array.isArray(gameObject.playerStats.playerstats.achievements)) {
            const playerAchievements = gameObject.playerStats.playerstats.achievements
            for (const achievement of playerAchievements) {
              const { data: existingAchievement, error: achievementCheckError } = await supabase
              .from('achievements')
              .select('id')
              // .eq('game_platform_id', gamePlatformId)
              .eq('platform_api_name', achievement.name)
              .maybeSingle();

              const { data: doesUserAchievement, error: doesUserAchievementError } = await supabase
              .from('user_achievements')
              .select('id')
              .eq("user_id", userId)
              .eq('achievement_id', existingAchievement.id)
              .maybeSingle();

              if (!doesUserAchievement) {
                const { error: userAchievementError } = await supabase
                  .from('user_achievements')
                  .upsert({
                    user_id: userId,
                    achievement_id: existingAchievement.id,
                    unlocked: true,
                    unlock_time: null
                  });
              }
            }

          }
        }
      }

    }
    //TODO: should store all game data insdie the games redux

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

    console.log(`Fetching Xbox data for gamertag: ${gamerTag}`);

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
      const errorText = await response.text();
      console.error(`Xbox API error (${response.status}): ${errorText}`);
      throw new Error(`Failed to fetch Xbox data: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log('Xbox data received:', data);
    return data;
  } catch (error) {
    console.error("Error fetching Xbox data:", error);
    throw error;
  }
};


export const fetchPsnData = async (
  psnId: string,
  userId: string,
  dispatch: any,
  onSuccess?: () => void,
  onError?: (error: Error) => void
) => {

  if (!psnId) {
    onError?.(new Error("Steam ID not found"));
    return;
  }

  try {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    if (!token) {
      throw new Error('Not authenticated');
    }
    const response = await fetch("https://nvjjragekchczuxgdvvo.supabase.co/functions/v1/fetch-psn-data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        "accountId": "me"
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`PSN API error (${response.status}): ${errorText}`);
      throw new Error(`Failed to fetch PSN data: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log('PSN data received:', data);

    await processAndStorePsnData(data, userId, dispatch);
    onSuccess?.();
  } catch (error) {
    console.error('Error fetching PlayStation data:', error);
    dispatch(fetchGamesFailure());
    onError?.(error instanceof Error ? error : new Error('Failed to process PlayStation data'));
  }
}

export const processAndStorePsnData = async (psnData: any, userId: string, dispatch: any) => {
  if (!psnData || !userId) return;

  try {
    // Fetch all platforms first
    const { data: platforms, error: platformsError } = await supabase
      .from('platforms')
      .select('*');

    if (platformsError) throw platformsError;

    // Find the PlayStation platform
    const psnPlatform = platforms.find(p => p.name.toLowerCase() === 'psn');
    if (!psnPlatform) {
      throw new Error('Steam platform not found in the database');
    }

    for (const gameObject of psnData.fullGameData) {
      // Check if game already exists
      const { data: existingGame, error: gameCheckError } = await supabase
      .from('games')
      .select('id')
      .eq('name', gameObject.trophyTitle.trophyTitleName || 'Unknown Game')
      .maybeSingle();

      if (gameCheckError) throw gameCheckError;

      let gameId;
      let gamePlatformId;
      // Add game if it doesn't exist
      if (!existingGame) {
        const { data: newGame, error: gameInsertError } = await supabase
          .from('games')
          .insert({
            name: gameObject.trophyTitle.trophyTitleName || 'Unknown Game',
            icon_url: gameObject.trophyTitle.trophyTitleIconUrl ,
            description: gameObject.trophyTitle.description || null
          })
          .select('id')
          .single();

          if (gameInsertError) throw gameInsertError;
          gameId = newGame.id;

          const { data: newGamePlatform, error: gpInsertError } = await supabase
          .from('game_platforms')
          .insert({
            game_id: gameId,
            platform_id: psnPlatform.id,
            // platform_specific_id: game.appId.toString()
          })
          .select('id')
          .single();

          if (gpInsertError) throw gpInsertError;
          gamePlatformId = newGamePlatform.id;

          breakme: if (gameObject.trophyData.trophies && Array.isArray(gameObject.trophyData.trophies)) {
            if (!gameObject.trophyData.trophies || gameObject.trophyData.trophies.length === 0) {
              console.warn('No achievements for game:', gameObject.trophyTitle.trophyTitleName);
              break breakme; // Skip this game
            }
            for (const achievement of gameObject.trophyData.trophies) {
              if (!achievement || !achievement.trophyName) continue;

              // Check if achievement exists TODO: might not need this, for example, if a game already exists in database for steam, chec
              const { data: existingAchievement, error: achievementCheckError } = await supabase
                .from('achievements')
                .select('id')
                .eq('game_platform_id', gamePlatformId)
                .eq('name', achievement.trophyName)
                .maybeSingle();

              if (achievementCheckError) throw achievementCheckError;

              let achievementId;
              const currentTrophyPSNId = achievement.trophyId;
              // Create achievement if it doesn't exist
              if (!existingAchievement) {
                const { data: newAchievement, error: achievementInsertError } = await supabase
                  .from('achievements')
                  .insert({
                    game_platform_id: gamePlatformId,
                    name: achievement.trophyName || 'Unknown Achievement',
                    description: achievement.trophyDetail || null,
                    icon_url: achievement.trophyIconUrl || null,
                    locked_icon_url: achievement.icongray || null,
                    platform_api_name: achievement.name || null,
                    type: achievement.trophyType || null
                  })
                  .select('id')
                  .single();

                if (achievementInsertError) throw achievementInsertError;
                achievementId = newAchievement.id;
              } else {
                achievementId = existingAchievement.id;
              }
              //TODO: maybe look for more efficient method
              for (const userAchievement of gameObject.userAchievements.trophies) {
                if (userAchievement.trophyId === achievement.trophyId) {
                  if (userAchievement.earned === true) {
                    const { data: doesUserAchievement, error: doesUserAchievementError } = await supabase
                    .from('user_achievements')
                    .select('id')
                    .eq("user_id", userId)
                    .eq('achievement_id', achievementId)
                    .maybeSingle();

                    if (!doesUserAchievement) {
                      const { error: userAchievementError } = await supabase
                        .from('user_achievements')
                        .upsert({
                          user_id: userId,
                          achievement_id: achievementId,
                          unlocked: true,
                          unlock_time: userAchievement.earnedDateTime
                        });
                    }
                  }
                }
              }

            }
          }
      } else {
        gameId = existingGame.id
      }

      // Link user to this game-platform TODO: need to check if user has been linked
      const { data: userHasGame, error: userHasGameError } = await supabase
      .from('user_games')
      .select('id')
      .eq('user_id', userId)
      .eq('game_id', gameId)
      .maybeSingle();

      if (!userHasGame) {
        const { error: userGameError } = await supabase
        .from('user_games')
        .upsert({
          user_id: userId,
          game_id: gameId,
          platform_name: 'steam',
          game_platform_id: gamePlatformId
        });

        if (userGameError) throw userGameError;
      }

    }

    // // Fetch all updated game platforms
    // const { data: userGamePlatforms, error: userGpError } = await supabase
    //   .from('user_games')
    //   .select(`
    //     game_platform_id,
    //     game_platforms!inner(
    //       id,
    //       platform_specific_id,
    //       games!inner(id, name, icon_url, description),
    //       platforms!inner(id, name)
    //     )
    //   `)
    //   .eq('user_id', userId);

    // if (userGpError) throw userGpError;

    // Fetch user games with achievements
    const userGames = await getGames(userId);
    dispatch(fetchGamesSuccess(userGames));
    
  } catch (error) {
    console.error('Error processing PlayStation data:', error);
    throw error instanceof Error ? error : new Error('Failed to process PlayStation data');
  }
}