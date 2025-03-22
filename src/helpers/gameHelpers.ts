
import { supabase } from '@/integrations/supabase/client';

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
export const getGames = async (userId: string) => {
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
