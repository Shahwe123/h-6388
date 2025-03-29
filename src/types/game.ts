
export interface GameTrophy {
  id: number;
  name: string;
  description: string;
  image: string;
  type: 'bronze' | 'silver' | 'gold' | 'platinum';
  rarity: 'common' | 'uncommon' | 'rare' | 'ultra rare';
  rarityPercentage: number;
  achieved: boolean;
  achievedDate?: string;
  gamePlatformId?: number;
  isLegacy?: boolean;
  isPinned?: boolean;
  isFirstOfType?: boolean; // Added for legacy components
}

export interface GamePlatform {
  id: number;
  gameId: number;
  platformId: number;
  platformSpecificId?: string;
  game?: {
    id: number;
    name: string;
    platform: string;
    image: string;
    description?: string;
    completion: number;
  };
  userTrophies?: number;
  friendTrophies?: number;
  userPlaytime?: number;
  friendPlaytime?: number;
  userCompletion?: number;
  friendCompletion?: number;
}

export interface Game {
  id: number;
  name: string;
  platform: string;
  image: string;
  description?: string;
  trophies?: GameTrophy[];
  trophyCount: number;
  completion: number;
  gamePlatformId?: number;
  totalPlaytime?: number;
  platformSpecificId?: string;
  yearEarned?: number;  // Added for legacy components
  genres?: string[];  // Added for legacy components
  milestoneInfo?: MilestoneInfo;  // Added for legacy components
}

// Added for legacy components
export interface MilestoneInfo {
  isFirstPlatinum?: boolean;
  isRarest?: boolean;
  isFastestCompletion?: boolean;
  completionTime?: number;
  personalNote?: string;
}

// Added for legacy components
export type TrophyFilter = 'all' | 'platinum' | 'gold' | 'silver' | 'bronze' | 'legacy' | 'milestones';

// Added for legacy components
export interface LegacyWallFilter {
  year: number | 'all';
  platform: string | 'all';
  genre: string | 'all';
  type: TrophyFilter;
  rarity: 'all' | 'common' | 'rare' | 'ultra-rare';
  milestones: boolean;
}
