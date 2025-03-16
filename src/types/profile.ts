
export interface Profile {
  id: string;
  username: string;
  avatar_url?: string;
  cover_url?: string;
  bio?: string;
  steam_id?: string;
  playstation_username?: string;
  xbox_gamertag?: string;
  is_private?: boolean;
  recentTrophies?: any[];
  achievements?: any[];
  games?: any[];
}

export interface PlayerStats {
  level: number;
  xp: number;
  nextLevelXp: number;
  rank: string;
}
