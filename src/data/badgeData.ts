
import { Badge } from '@/types/badge';

/**
 * Mock badge data for the badge collection system
 */
export const mockBadges: Badge[] = [
  {
    id: 'plat-master',
    name: 'Platinum Master',
    description: 'Earned 10 platinum trophies',
    icon: 'trophy',
    type: 'platinum',
    earnedAt: '2023-10-15T12:30:00Z'
  },
  {
    id: 'gold-collector',
    name: 'Gold Collector',
    description: 'Collected 50 gold trophies',
    icon: 'medal',
    type: 'gold',
    earnedAt: '2023-09-22T15:45:00Z'
  },
  {
    id: 'trophy-hunter',
    name: 'Trophy Hunter',
    description: 'Earned 100 total trophies',
    icon: 'award',
    type: 'achievement',
    earnedAt: '2023-08-10T09:12:00Z'
  },
  {
    id: 'leaderboard-champion',
    name: 'Leaderboard Champion',
    description: 'Reached #1 on the leaderboard',
    icon: 'crown',
    type: 'leaderboard',
    earnedAt: '2023-11-05T18:20:00Z'
  },
  {
    id: 'speed-demon',
    name: 'Speed Demon',
    description: 'Completed a game in record time',
    icon: 'zap',
    type: 'special',
    earnedAt: '2023-12-01T14:35:00Z'
  },
  {
    id: 'social-butterfly',
    name: 'Social Butterfly',
    description: 'Added 20 friends',
    icon: 'users',
    type: 'achievement',
    earnedAt: '2024-01-15T11:40:00Z'
  },
  {
    id: 'perfectionist',
    name: 'Perfectionist',
    description: 'Achieved 100% completion in 5 games',
    icon: 'check-circle',
    type: 'achievement',
    earnedAt: '2024-02-20T16:25:00Z'
  },
  {
    id: 'early-adopter',
    name: 'Early Adopter',
    description: 'One of the first 1000 users on the platform',
    icon: 'star',
    type: 'special',
    earnedAt: '2023-07-01T08:00:00Z'
  },
  {
    id: 'in-progress-badge',
    name: 'Game Marathon',
    description: 'Play 100 different games',
    icon: 'game-controller',
    type: 'achievement',
    progress: 75,
    requirement: 100
  },
  {
    id: 'almost-there',
    name: 'Collection Master',
    description: 'Earn all types of badges',
    icon: 'package',
    type: 'special',
    progress: 5,
    requirement: 7
  }
];

/**
 * Returns a set of badges for a user based on their profile and stats
 * 
 * @param userId The user ID to get badges for
 * @returns A collection of earned and in-progress badges
 */
export const getUserBadges = (userId: string): { earned: Badge[], inProgress: Badge[] } => {
  // In a real implementation, this would fetch from the database
  // For now, we'll just return the mock data
  return {
    earned: mockBadges.filter(badge => badge.earnedAt !== undefined),
    inProgress: mockBadges.filter(badge => badge.progress !== undefined)
  };
};
