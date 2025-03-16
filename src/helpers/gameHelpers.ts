
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
    // First, fetch the user's games
    const { data, error } = await supabase
      .from('user_games')
      .select('game_id, platform_name')
      .eq('user_id', userId);
    
    if (error) throw error;
    
    // If no games found, return empty array
    if (!data || data.length === 0) {
      return [];
    }
    
    // Extract the game IDs for the next query
    const gameIds = data.map(g => g.game_id);

    // Fetch game details
    const { data: games, error: gamesError } = await supabase
      .from('games')
      .select('id, steam_app_id, name, icon_url')
      .in('id', gameIds);
      
    if (gamesError) throw gamesError;

    // Fetch user achievements
    const { data: userAchievements, error: achievementsError } = await supabase
      .from('user_achievements')
      .select('id, achievement_id, unlock_time')
      .eq('user_id', userId)
      .order('unlock_time', { ascending: false });
    
    if (achievementsError) throw achievementsError;
    
    // If user has achievements, fetch their details and merge with games
    if (userAchievements && userAchievements.length > 0) {
      const achievementIds = userAchievements.map(a => a.achievement_id);
      
      // Fetch achievement details
      const { data: achievements, error: achievementDetailsError } = await supabase
        .from('achievements')
        .select('id, name, description, game_id, icon_url, locked_icon_url')
        .in('id', achievementIds);
        
      if (achievementDetailsError) throw achievementDetailsError;

      // Merge games and achievements data
      const mergedData = [];
      games.forEach(game => {
        achievements.forEach(achievement => {
          if (achievement.game_id === game.id) {
            mergedData.push({
              game, 
              achievement
            });
          }
        });
      });
      
      return mergedData;
    }
    
    // If no achievements found, just return the games
    return games;
  } catch (error) {
    console.error('Error fetching games:', error);
    throw error;
  }
};
