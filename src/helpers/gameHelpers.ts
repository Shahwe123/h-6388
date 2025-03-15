
import { supabase } from '@/integrations/supabase/client';

/**
 * Fetch user games and achievements
 * @param userId The user ID to fetch games for
 * @returns An array of games and achievements
 */
export const getGames = async (userId: string) => {
  try {
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
    
    return games;
  } catch (error) {
    console.error('Error fetching games:', error);
    throw error;
  }
};
