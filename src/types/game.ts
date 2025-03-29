
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

export interface Game {
  id: number;
  name: string;
  platform: string;
  image: string;
  description?: string;
  trophyCount: number;
  trophiesObtained: number;
  completion: number;
  trophies: GameTrophy[];
  gamePlatformId?: number;
  totalPlaytime: number; // Total playtime in hours
}

export interface GamePlatform {
  id: number;
  gameId: number;
  platformId: number;
  game?: Game;
}
