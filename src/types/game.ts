
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
}
