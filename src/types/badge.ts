
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: BadgeType;
  earnedAt?: string;
  progress?: number;
  requirement?: number;
}

export type BadgeType = 
  | 'platinum' 
  | 'gold' 
  | 'silver' 
  | 'bronze' 
  | 'achievement' 
  | 'leaderboard' 
  | 'special';

export interface BadgeCollection {
  earnedBadges: Badge[];
  inProgressBadges: Badge[];
}
