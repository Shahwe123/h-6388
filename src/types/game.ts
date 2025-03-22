
/**
 * Game interface representing a video game in the user's collection
 */
export interface Game {
  id: number;
  name: string;
  platform: string;
  image: string;
  completion: number;
  trophyCount?: number;
  lastPlayed?: string;
  coverImage?: string;
  bannerImage?: string;
  description?: string;
  releaseDate?: string;
  developer?: string;
  publisher?: string;
  genres?: string[];
  totalPlaytime?: number;
  trophyCounts?: TrophyCounts;
  trophies?: GameTrophy[];
  yearEarned?: number; // Year when the first trophy was earned
  rarityScore?: number; // Average rarity of all trophies
  milestoneInfo?: MilestoneInfo; // Additional information for milestone trophies
  platformAchievementWeight?: number; // Weight factor to normalize achievements across platforms
  normalizedScore?: number; // Score after normalization
  totalPossibleScore?: number; // Maximum possible score on this platform
}

/**
 * Counts of different trophy types in a game
 */
export interface TrophyCounts {
  bronze: number;
  silver: number;
  gold: number;
  platinum: number;
  total: number;
  earned: number;
}

/**
 * Individual trophy information
 */
export interface GameTrophy {
  id: number;
  name: string;
  description: string;
  type: 'platinum' | 'gold' | 'silver' | 'bronze';
  image: string;
  rarity: string;
  rarityPercentage: number;
  achieved: boolean;
  achievedDate?: string;
  isPinned?: boolean;
  isLegacy?: boolean; // Flag for legacy/memorable trophies
  isFirstOfType?: boolean; // First platinum, first gold, etc.
  isHistorical?: boolean; // Trophy with historical significance
  pointValue?: number; // Point value for scoring (can vary by platform)
}

/**
 * Type representing a filter for trophy display
 */
export type TrophyFilter = 'all' | 'platinum' | 'gold' | 'silver' | 'bronze' | 'achieved' | 'unearned' | 'legacy' | 'milestones';

/**
 * Type representing a sort option for trophy display
 */
export type TrophySort = 'default' | 'name' | 'rarity' | 'achieved' | 'type' | 'date';

/**
 * Information for milestone trophies
 */
export interface MilestoneInfo {
  isFirstPlatinum?: boolean;
  isRarest?: boolean;
  isFastestCompletion?: boolean;
  completionTime?: number; // In hours
  personalNote?: string;
}

/**
 * Filter options for the Legacy Wall
 */
export interface LegacyWallFilter {
  year?: number | 'all';
  platform?: string | 'all';
  genre?: string | 'all';
  type?: TrophyFilter;
  rarity?: 'common' | 'rare' | 'ultra-rare' | 'all';
  milestones?: boolean;
}

/**
 * Platform-specific trophy weights for normalization
 */
export interface PlatformTrophyWeights {
  platform: string;
  baseWeight: number;
  trophyMultipliers: {
    bronze: number;
    silver: number;
    gold: number;
    platinum: number;
  };
}

/**
 * Helper functions for achievement normalization
 */
export const calculateNormalizedScore = (game: Game): number => {
  if (!game.trophies || game.trophies.length === 0) {
    return 0;
  }

  // Default weights if not specified at game level
  const platformWeights: Record<string, PlatformTrophyWeights> = {
    'playstation': {
      platform: 'playstation',
      baseWeight: 1.0,
      trophyMultipliers: { bronze: 15, silver: 30, gold: 90, platinum: 300 }
    },
    'xbox': {
      platform: 'xbox',
      baseWeight: 1.2, // Xbox typically has fewer achievements
      trophyMultipliers: { bronze: 10, silver: 25, gold: 75, platinum: 250 }
    },
    'steam': {
      platform: 'steam',
      baseWeight: 1.5, // Steam games often have many more achievements
      trophyMultipliers: { bronze: 5, silver: 15, gold: 50, platinum: 200 }
    }
  };

  // Get weight for this platform, default to 1 if not found
  const weight = game.platformAchievementWeight || 
                 (platformWeights[game.platform.toLowerCase()]?.baseWeight || 1.0);
  
  // Calculate raw score
  let score = 0;
  let possibleScore = 0;
  
  game.trophies.forEach(trophy => {
    const multipliers = platformWeights[game.platform.toLowerCase()]?.trophyMultipliers || 
                       { bronze: 10, silver: 20, gold: 60, platinum: 180 };
    
    // Use trophy's specific point value if available
    const points = trophy.pointValue || multipliers[trophy.type];
    possibleScore += points;
    
    if (trophy.achieved) {
      score += points;
    }
  });
  
  // Apply platform weight to score
  return score * weight;
};
