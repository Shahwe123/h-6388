
import { supabase } from '@/integrations/supabase/client';
import { Game, GamePlatform, GameTrophy } from '@/types/game';

/**
 * Fetch user games and achievements
 * 
 * This helper function retrieves a user's games and their achievements from
 * the database. It performs several queries to fetch related data and merges
 * them together for display.
 * 
 * @param {string} userId The user ID to fetch games for
 * @returns {Promise<Array>} An array of games and achievements
 * @throws {Error} If there's an issue fetching the data
 */
export const getGames = async (userId: string): Promise<Game[]> => {
  try {
    // First, fetch the user's game 
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
    // console.log(gamePlatformIds)
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

    // Fetch achievements for all the game platforms / array of objects
    const { data: achievements, error: fetchAchievementsError } = await supabase
      .from('achievements')
      .select('id, name, description, game_platform_id, icon_url, locked_icon_url')
      .in('game_platform_id', gamePlatformIds);
      // console.log(achievements) TODO: check if all achievements come through

    if (fetchAchievementsError) throw fetchAchievementsError;
    console.log(achievements)

    // Fetch user achievements
    const { data: userAchievementsIds, error: achievementsError } = await supabase
      .from('user_achievements')
      .select('achievement_id, unlock_time, unlocked')
      .eq('user_id', userId);
    
    if (achievementsError) throw achievementsError;
    
    // Create a variable to store all the game data
    const allGameData: Game[] = [];

    // Loop through gamePlatforms (1st loop)
    for (const gamePlatform of gamePlatforms) {
      // Create a variable for the current game as an object
      const gameObject: Game = {
        id: gamePlatform.games.id,
        name: gamePlatform.games.name,
        platform: gamePlatform.platforms.name,
        image: gamePlatform.games.icon_url || '',
        description: gamePlatform.games.description,
        completion: 0, // Default value for completion
        trophyCount: 0, // Default value for trophy count
        trophies: [], // Initialize an empty array for trophies
        gamePlatformId: gamePlatform.id,
        totalPlaytime: 0 // Default value for total playtime
      };

      // Loop through achievements (outer loop)
      for (const achievement of achievements) {
        // Check if the current achievement belongs to the current game platform
        if (achievement.game_platform_id === gamePlatform.id) {
          // Create a GameTrophy object for the current achievement
          const gameTrophy: GameTrophy = {
            id: achievement.id,
            name: achievement.name,
            description: achievement.description || '',
            image: achievement.icon_url || '',
            type: 'bronze', // Default type if not specified
            rarity: 'common', // Default rarity if not specified
            rarityPercentage: 100, // Default percentage if not specified
            achieved: false, // Default achieved status
            achievedDate: null, // Default achieved date
            gamePlatformId: gamePlatform.id
          };

          // Loop through userAchievementsIds (inner loop)
          for (const userAchievement of userAchievementsIds) {
            // Check if the current user achievement matches the current achievement
            if (userAchievement.achievement_id === achievement.id) {
              console.log(achievement)
              console.log(userAchievement)
              // Tag the trophy as achieved and add the achieved time
              gameTrophy.achieved = userAchievement.unlocked || false;
              gameTrophy.achievedDate = userAchievement.unlock_time || null;
              break; // Exit the inner loop once a match is found
            }
          }

          // Add the GameTrophy to the game's trophies array
          gameObject.trophies.push(gameTrophy);
        }
      }

      // Calculate completion percentage and trophy count
      gameObject.trophyCount = gameObject.trophies.length;
      gameObject.completion =
        gameObject.trophies.filter(trophy => trophy.achieved).length /
        (gameObject.trophies.length || 1) *
        100;

      // Add the game object to the allGameData array
      allGameData.push(gameObject);
      break
    }

    // Log the final allGameData array for debugging
    console.log('All Game Data:', allGameData);

    // If user has achievements, fetch their details and merge with games
    if (userAchievementsIds && userAchievementsIds.length > 0) {
      const achievementId = userAchievementsIds.map(a => a.achievement_id);
      
      // Fetch achievement details
      const { data: userAchievements, error: achievementDetailsError } = await supabase
        .from('achievements')
        .select('id, name, description, game_platform_id, icon_url, locked_icon_url')
        .in('id', achievementId);
      // console.log(gamePlatforms)
      // console.log(userAchievements)
      if (achievementDetailsError) throw achievementDetailsError;

      // Transform gamePlatforms data to match the expected Game interface
      const formattedGames: Game[] = gamePlatforms.map(gp => {
        // Get achievements for this game platform
        const gameAchievements = achievements.filter(a => a.game_platform_id === gp.id);
        
        // Format each achievement with user status
        const formattedAchievements: GameTrophy[] = gameAchievements.map(achievement => {
          const userAchievement = userAchievementsIds.find(ua => ua.achievement_id === achievement.id);
          return {
            id: achievement.id,
            name: achievement.name,
            description: achievement.description || '',
            image: achievement.icon_url || '',
            type: 'bronze', // Default type if not specified
            rarity: 'common', // Default rarity if not specified
            rarityPercentage: 100, // Default percentage if not specified
            achieved: userAchievement?.unlocked || false,
            achievedDate: userAchievement?.unlock_time,
            gamePlatformId: gp.id
          };
        });
        
        return {
          id: gp.games.id, // Make sure this is correctly mapped
          name: gp.games.name,
          platform: gp.platforms.name,
          image: gp.games.icon_url || '',
          description: gp.games.description,
          completion: formattedAchievements.filter(a => a.achieved).length / (formattedAchievements.length || 1) * 100,
          trophies: formattedAchievements,
          trophyCount: formattedAchievements.length,
          gamePlatformId: gp.id,
          totalPlaytime: 0 // Default value for total playtime
        };
      });
      
      console.log("Formatted games:", formattedGames.map(g => ({ id: g.id, name: g.name })));
      return formattedGames;
    }
    
    // If no achievements found, just return the games with basic info
    return gamePlatforms.map(gp => ({
      id: gp.games.id, // Make sure this is correctly mapped
      name: gp.games.name,
      platform: gp.platforms.name,
      image: gp.games.icon_url || '',
      description: gp.games.description,
      completion: 0,
      trophyCount: 0,
      trophies: [],
      gamePlatformId: gp.id,
      totalPlaytime: 0 // Default value for total playtime
    }));
  } catch (error) {
    console.error('Error fetching games:', error);
    throw error;
  }
};


