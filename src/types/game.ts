
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
