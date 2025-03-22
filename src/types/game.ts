
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
}

/**
 * Type representing a filter for trophy display
 */
export type TrophyFilter = 'all' | 'platinum' | 'gold' | 'silver' | 'bronze' | 'achieved' | 'unearned';

/**
 * Type representing a sort option for trophy display
 */
export type TrophySort = 'default' | 'name' | 'rarity' | 'achieved' | 'type';
