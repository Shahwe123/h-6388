
// Mock data for profile components

export const mockTrophies = [
  { id: '1', name: 'Platinum Master', type: 'platinum' as const, game: 'God of War', rarity: '0.1%', image: '/trophy1.png' },
  { id: '2', name: 'Gold Champion', type: 'gold' as const, game: 'Elden Ring', rarity: '1.2%' },
  { id: '3', name: 'Silver Star', type: 'silver' as const, game: 'Cyberpunk 2077', rarity: '5.7%' },
  { id: '4', name: 'Bronze Medal', type: 'bronze' as const, game: 'Call of Duty', rarity: '15.3%' },
  { id: '5', name: 'Ultra Rare', type: 'ultra-rare' as const, game: 'Red Dead Redemption 2', rarity: '0.01%' },
  { id: '6', name: 'Legendary', type: 'platinum' as const, game: 'The Last of Us', rarity: '0.5%' },
  { id: '7', name: 'Master Collector', type: 'gold' as const, game: 'Assassin\'s Creed', rarity: '2.3%' },
  { id: '8', name: 'First Blood', type: 'bronze' as const, game: 'Fortnite', rarity: '45.2%' },
];

export const mockFriendsForComparison = [
  {
    id: 'friend-1',
    username: 'GameMaster42',
    avatar_url: null,
    trophies: 30,
    platinums: 1,
    comparison: '+15'
  },
  {
    id: 'friend-2',
    username: 'TrophyHunter99',
    avatar_url: null,
    trophies: 42,
    platinums: 3,
    comparison: '+3'
  },
  {
    id: 'friend-3',
    username: 'ProGamer2023',
    avatar_url: null,
    trophies: 22,
    platinums: 0,
    comparison: '+23'
  }
];

export const playerStats = {
  level: 42,
  xp: 4200,
  nextLevelXp: 5000,
  rank: 'Trophy Hunter',
  trophiesCount: 127,
  platinumCount: 14,
  totalGames: 48,
  gamesCompleted: 26,
};
