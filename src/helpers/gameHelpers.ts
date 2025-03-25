
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
      const formattedGames: Game[] = gamePlatforms.map(gp => {
        // Get achievements for this game platform
        const gameAchievements = achievements.filter(a => a.game_platform_id === gp.id);
        
        // Format each achievement with user status
        const formattedAchievements: GameTrophy[] = gameAchievements.map(achievement => {
          const userAchievement = userAchievements.find(ua => ua.achievement_id === achievement.id);
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
          id: gp.games.id,
          name: gp.games.name,
          platform: gp.platforms.name,
          image: gp.games.icon_url || '',
          description: gp.games.description,
          completion: formattedAchievements.filter(a => a.achieved).length / (formattedAchievements.length || 1) * 100,
          trophies: formattedAchievements,
          trophyCount: formattedAchievements.length
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
      description: gp.games.description,
      completion: 0,
      trophyCount: 0,
      trophies: []
    }));
  } catch (error) {
    console.error('Error fetching games:', error);
    throw error;
  }
};

/**
 * Fetch comparison data between two users for shared games
 * 
 * @param {string} userId The primary user's ID
 * @param {string} friendId The friend's user ID to compare with
 * @returns {Promise<GamePlatform[]>} Array of GamePlatform objects with comparison data
 */
export const getComparisonData = async (userId: string, friendId: string): Promise<GamePlatform[]> => {
  try {
    console.log(`Fetching comparison data for user ${userId} and friend ${friendId}`);
    
    // Get both users' games
    const userGames = await getGames(userId);
    const friendGames = await getGames(friendId);
    
    console.log(`User has ${userGames.length} games, friend has ${friendGames.length} games`);
    
    // Find shared games (games that both users have)
    const sharedGames: GamePlatform[] = [];
    
    // Loop through user games and find matches in friend games
    for (const userGame of userGames) {
      // Find matching game by game ID
      const friendGame = friendGames.find(fg => fg.id === userGame.id);
      
      // If both users have this game, add to comparison data
      if (friendGame) {
        console.log(`Found shared game: ${userGame.name}`);
        
        // Create a comparison object
        const comparisonGame: GamePlatform = {
          id: userGame.gamePlatformId || 0,
          gameId: userGame.id,
          platformId: 0, // We'll get this from the platform info where available
          game: {
            id: userGame.id,
            name: userGame.name,
            platform: userGame.platform,
            image: userGame.image,
            description: userGame.description,
            completion: userGame.completion,
          },
          userTrophies: userGame.trophyCount || 0,
          friendTrophies: friendGame.trophyCount || 0,
          userPlaytime: userGame.totalPlaytime || 0,
          friendPlaytime: friendGame.totalPlaytime || 0,
          userCompletion: userGame.completion || 0,
          friendCompletion: friendGame.completion || 0
        };
        
        sharedGames.push(comparisonGame);
      }
    }
    
    console.log(`Found ${sharedGames.length} shared games for comparison`);
    return sharedGames;
  } catch (error) {
    console.error('Error fetching comparison data:', error);
    throw error;
  }
};
