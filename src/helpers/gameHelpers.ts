
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
    console.log('Fetching games for user:', userId);
    
    // First, fetch the user's game platforms
    const { data: userGames, error: userGamesError } = await supabase
      .from('user_games')
      .select('game_platform_id, game_id, platform_name')
      .eq('user_id', userId);
    
    if (userGamesError) {
      console.error('Error fetching user games:', userGamesError);
      throw userGamesError;
    }
    
    // If no games found, return empty array
    if (!userGames || userGames.length === 0) {
      console.log('No games found for user:', userId);
      return [];
    }
    
    console.log('Found user games:', userGames.length);
    
    // Extract the game platform IDs and game IDs
    const gamePlatformIds = userGames
      .map(g => g.game_platform_id)
      .filter(id => id !== null);
    
    const gameIds = userGames
      .map(g => g.game_id)
      .filter(id => id !== null);
    
    if (gameIds.length === 0) {
      console.log('No game IDs found');
      return [];
    }

    // Fetch game details directly
    const { data: games, error: gamesError } = await supabase
      .from('games')
      .select('id, name, icon_url, description')
      .in('id', gameIds);
      
    if (gamesError) {
      console.error('Error fetching games:', gamesError);
      throw gamesError;
    }

    if (!games || games.length === 0) {
      console.log('No game details found');
      return [];
    }

    console.log('Fetched game details:', games.length);

    // Fetch user achievements
    const { data: userAchievements, error: achievementsError } = await supabase
      .from('user_achievements')
      .select('achievement_id, unlock_time, unlocked')
      .eq('user_id', userId);
    
    if (achievementsError) {
      console.error('Error fetching user achievements:', achievementsError);
      throw achievementsError;
    }
    
    console.log('Fetched user achievements:', userAchievements?.length || 0);
    
    // Map to store achievements by game platform
    const achievementsByGameId = new Map();
    
    // If user has achievements, fetch their details and organize by game
    if (userAchievements && userAchievements.length > 0) {
      const achievementIds = userAchievements.map(a => a.achievement_id);
      
      // Fetch achievement details
      const { data: achievements, error: achievementDetailsError } = await supabase
        .from('achievements')
        .select('id, name, description, game_platform_id, icon_url, locked_icon_url')
        .in('id', achievementIds);
        
      if (achievementDetailsError) {
        console.error('Error fetching achievement details:', achievementDetailsError);
        throw achievementDetailsError;
      }
      
      console.log('Fetched achievement details:', achievements?.length || 0);
      
      // Group achievements by game platform ID
      if (achievements) {
        // Get all game platform IDs from achievements
        const achievementGamePlatformIds = [...new Set(achievements.map(a => a.game_platform_id))];
        
        // Get the game IDs associated with these platform IDs
        const { data: achievementGamePlatforms, error: gameMapError } = await supabase
          .from('game_platforms')
          .select('id, game_id')
          .in('id', achievementGamePlatformIds);
          
        if (gameMapError) {
          console.error('Error mapping game platforms:', gameMapError);
          throw gameMapError;
        }
        
        // Create a map of game platform ID to game ID
        const gameIdByPlatformId = {};
        if (achievementGamePlatforms) {
          achievementGamePlatforms.forEach(gp => {
            gameIdByPlatformId[gp.id] = gp.game_id;
          });
        }
        
        // Group achievements by game ID
        achievements.forEach(achievement => {
          const gameId = gameIdByPlatformId[achievement.game_platform_id];
          if (gameId) {
            if (!achievementsByGameId.has(gameId)) {
              achievementsByGameId.set(gameId, []);
            }
            
            const userAchievement = userAchievements.find(ua => ua.achievement_id === achievement.id);
            
            achievementsByGameId.get(gameId).push({
              id: achievement.id,
              name: achievement.name,
              description: achievement.description || '',
              image: achievement.icon_url || '',
              type: determineAchievementType(achievement.name), // Helper function to guess trophy type
              rarity: 'common', // Default rarity
              rarityPercentage: 100, // Default percentage
              achieved: userAchievement?.unlocked || false,
              achievedDate: userAchievement?.unlock_time,
              gamePlatformId: achievement.game_platform_id
            });
          }
        });
      }
    }
    
    // Transform game data to match the expected Game interface
    const formattedGames: Game[] = games.map(game => {
      // Find the platform for this game from user_games
      const userGame = userGames.find(ug => ug.game_id === game.id);
      const platform = userGame?.platform_name || 'Unknown Platform';
      
      // Get trophies for this game
      const trophies = achievementsByGameId.get(game.id) || [];
      
      // Calculate completion percentage
      const completion = trophies.length > 0
        ? (trophies.filter(t => t.achieved).length / trophies.length) * 100
        : 0;
      
      const lastPlayed = trophies.length > 0 
        ? trophies
            .filter(t => t.achieved && t.achievedDate)
            .sort((a, b) => new Date(b.achievedDate || 0).getTime() - new Date(a.achievedDate || 0).getTime())[0]?.achievedDate
        : null;
      
      return {
        id: game.id,
        name: game.name,
        platform: platform,
        image: game.icon_url || '',
        description: game.description || '',
        completion: Math.round(completion),
        trophies: trophies,
        trophyCount: trophies.length,
        lastPlayed: lastPlayed || new Date().toISOString(), // Default to current date if no trophies
        gamePlatformId: userGame?.game_platform_id
      };
    });
    
    console.log('Returning formatted games:', formattedGames.length);
    return formattedGames;
  } catch (error) {
    console.error('Error in getGames function:', error);
    throw error;
  }
};

/**
 * Helper function to determine trophy type based on name and description
 * This is a fallback when the type isn't explicitly provided
 */
function determineAchievementType(name: string): 'platinum' | 'gold' | 'silver' | 'bronze' {
  const nameLower = name.toLowerCase();
  
  // Check for platinum indicators
  if (
    nameLower.includes('platinum') ||
    nameLower.includes('all trophies') ||
    nameLower.includes('100%') ||
    nameLower.includes('complete') ||
    nameLower.includes('collect all')
  ) {
    return 'platinum';
  }
  
  // Check for gold indicators
  if (
    nameLower.includes('master') ||
    nameLower.includes('legendary') ||
    nameLower.includes('expert') ||
    nameLower.includes('incredible') ||
    nameLower.includes('extraordinary')
  ) {
    return 'gold';
  }
  
  // Check for silver indicators
  if (
    nameLower.includes('advanced') ||
    nameLower.includes('skilled') ||
    nameLower.includes('veteran') ||
    nameLower.includes('proficient')
  ) {
    return 'silver';
  }
  
  // Default to bronze for everything else
  return 'bronze';
}

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
