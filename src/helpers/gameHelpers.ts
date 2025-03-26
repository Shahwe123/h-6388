
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
        .select('id, name, description, game_platform_id, icon_url, locked_icon_url, platform_api_name')
        .in('id', achievementIds);
        
      if (achievementDetailsError) throw achievementDetailsError;

      // Get all achievements for each game, not just the ones the user has earned
      const { data: allAchievements, error: allAchievementsError } = await supabase
        .from('achievements')
        .select('id, name, description, game_platform_id, icon_url, locked_icon_url, platform_api_name')
        .in('game_platform_id', gamePlatformIds);
        
      if (allAchievementsError) throw allAchievementsError;

      // Transform gamePlatforms data to match the expected Game interface
      const formattedGames: Game[] = gamePlatforms.map(gp => {
        // Get all achievements for this game platform
        const gameAllAchievements = allAchievements.filter(a => a.game_platform_id === gp.id);
        
        // Format each achievement with user status
        const formattedAchievements: GameTrophy[] = gameAllAchievements.map(achievement => {
          const userAchievement = userAchievements.find(ua => ua.achievement_id === achievement.id);
          
          // Determine trophy type based on name or description patterns
          // Use explicit type to ensure it's one of the allowed types
          let trophyType: "platinum" | "gold" | "silver" | "bronze" = 'bronze';
          
          if (achievement.name?.toLowerCase().includes('platinum') || 
              achievement.description?.toLowerCase().includes('platinum') || 
              achievement.platform_api_name?.toLowerCase().includes('platinum')) {
            trophyType = 'platinum';
          } else if (achievement.name?.toLowerCase().includes('gold') || 
                    achievement.description?.toLowerCase().includes('gold') || 
                    achievement.platform_api_name?.toLowerCase().includes('gold')) {
            trophyType = 'gold';
          } else if (achievement.name?.toLowerCase().includes('silver') || 
                    achievement.description?.toLowerCase().includes('silver') || 
                    achievement.platform_api_name?.toLowerCase().includes('silver')) {
            trophyType = 'silver';
          }
          
          // Generate rarity value and percentage
          const rarityPercentage = Math.floor(Math.random() * 100);
          let rarity = 'Common';
          if (rarityPercentage < 5) rarity = 'Ultra Rare';
          else if (rarityPercentage < 15) rarity = 'Very Rare';
          else if (rarityPercentage < 40) rarity = 'Rare';
          else if (rarityPercentage < 60) rarity = 'Uncommon';
          
          return {
            id: achievement.id,
            name: achievement.name,
            description: achievement.description || '',
            image: achievement.icon_url || '',
            rarity: rarity,
            rarityPercentage: rarityPercentage,
            achieved: userAchievement?.unlocked || false,
            achievedDate: userAchievement?.unlock_time,
            gamePlatformId: gp.id,
            type: trophyType
          };
        });
        
        // Calculate earned trophies and completion percentage
        const earnedTrophies = formattedAchievements.filter(a => a.achieved).length;
        const completionPercentage = formattedAchievements.length > 0 
          ? Math.round((earnedTrophies / formattedAchievements.length) * 100) 
          : 0;
        
        // Get a better image for the game
        let imageUrl = '';
        const gameNameForImage = encodeURIComponent(gp.games.name.replace(/[^\w\s-]/g, ''));
        
        // For Steam games
        if (gp.platforms.name.toLowerCase() === 'steam' && gp.platform_specific_id) {
          // Use Steam header image which is higher quality
          imageUrl = `https://cdn.cloudflare.steamstatic.com/steam/apps/${gp.platform_specific_id}/header.jpg`;
        } 
        // Use the database icon if available
        else if (gp.games.icon_url) {
          imageUrl = gp.games.icon_url;
        }
        // Fall back to a placeholder with the game name
        else {
          imageUrl = `https://placehold.co/400x600/2a2a2a/ffffff?text=${gameNameForImage}`;
        }
        
        // Calculate trophy counts
        const trophyCounts = {
          bronze: formattedAchievements.filter(t => t.type === 'bronze').length,
          silver: formattedAchievements.filter(t => t.type === 'silver').length,
          gold: formattedAchievements.filter(t => t.type === 'gold').length,
          platinum: formattedAchievements.filter(t => t.type === 'platinum').length,
          total: formattedAchievements.length,
          earned: earnedTrophies
        };
        
        return {
          id: gp.games.id,
          name: gp.games.name,
          platform: gp.platforms.name,
          image: imageUrl,
          description: gp.games.description,
          completion: completionPercentage,
          trophies: formattedAchievements,
          trophyCount: formattedAchievements.length,
          trophyCounts: trophyCounts,
          lastPlayed: formattedAchievements.filter(a => a.achieved && a.achievedDate)
            .sort((a, b) => new Date(b.achievedDate!).getTime() - new Date(a.achievedDate!).getTime())[0]?.achievedDate,
          gamePlatformId: gp.id,
          platformSpecificId: gp.platform_specific_id,
          // Generate placeholder data for display
          releaseDate: new Date(Date.now() - Math.random() * 5 * 365 * 24 * 60 * 60 * 1000).toISOString(),
          developer: ['Studio MDHR', 'Naughty Dog', 'BioWare', 'CD Projekt Red', 'Nintendo', 'Bethesda', 'Rockstar Games'][Math.floor(Math.random() * 7)],
          publisher: ['Sony', 'Microsoft', 'Electronic Arts', 'Ubisoft', 'Nintendo', 'Activision', 'Square Enix'][Math.floor(Math.random() * 7)],
          genres: [
            ['Action', 'Adventure'], 
            ['RPG', 'Open World'], 
            ['FPS', 'Action'], 
            ['Strategy', 'Simulation'], 
            ['Sports', 'Racing']
          ][Math.floor(Math.random() * 5)],
          totalPlaytime: Math.floor(Math.random() * 200)
        };
      });
      
      return formattedGames;
    }
    
    // If no achievements found, just return the games with basic info
    return gamePlatforms.map(gp => {
      // Generate better quality image
      let imageUrl = '';
      const gameNameForImage = encodeURIComponent(gp.games.name.replace(/[^\w\s-]/g, ''));
      
      // For Steam games
      if (gp.platforms.name.toLowerCase() === 'steam' && gp.platform_specific_id) {
        imageUrl = `https://cdn.cloudflare.steamstatic.com/steam/apps/${gp.platform_specific_id}/header.jpg`;
      } 
      // Use the database icon if available
      else if (gp.games.icon_url) {
        imageUrl = gp.games.icon_url;
      }
      // Fall back to a placeholder
      else {
        imageUrl = `https://placehold.co/400x600/2a2a2a/ffffff?text=${gameNameForImage}`;
      }
      
      // Return game with minimal info
      return {
        id: gp.games.id,
        name: gp.games.name,
        platform: gp.platforms.name,
        image: imageUrl,
        description: gp.games.description,
        completion: 0,
        trophyCount: 0,
        trophies: [],
        gamePlatformId: gp.id,
        platformSpecificId: gp.platform_specific_id,
        // Generate placeholder data for display
        releaseDate: new Date(Date.now() - Math.random() * 5 * 365 * 24 * 60 * 60 * 1000).toISOString(),
        developer: ['Studio MDHR', 'Naughty Dog', 'BioWare', 'CD Projekt Red', 'Nintendo', 'Bethesda', 'Rockstar Games'][Math.floor(Math.random() * 7)],
        publisher: ['Sony', 'Microsoft', 'Electronic Arts', 'Ubisoft', 'Nintendo', 'Activision', 'Square Enix'][Math.floor(Math.random() * 7)],
        genres: [
          ['Action', 'Adventure'], 
          ['RPG', 'Open World'], 
          ['FPS', 'Action'], 
          ['Strategy', 'Simulation'], 
          ['Sports', 'Racing']
        ][Math.floor(Math.random() * 5)],
        totalPlaytime: Math.floor(Math.random() * 200)
      };
    });
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
