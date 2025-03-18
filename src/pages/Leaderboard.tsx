import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Users, Gamepad } from 'lucide-react';
import RankBadge from '@/components/profile/RankBadge';
import SEO from "../components/SEO";

type LeaderboardEntry = {
  id: string;
  rank: number;
  username: string;
  score: number;
  achievementsCount: number;
  rankTitle: string;
  percentile?: string;
};

const GlobalLeaderboard: React.FC = () => {
  const globalEntries: LeaderboardEntry[] = [
    { id: '1', rank: 1, username: 'TrophyMaster', score: 9850, achievementsCount: 423, rankTitle: 'Legendary Collector', percentile: 'Top 0.1%' },
    { id: '2', rank: 2, username: 'GameWizard', score: 9340, achievementsCount: 389, rankTitle: 'Platinum God', percentile: 'Top 0.5%' },
    { id: '3', rank: 3, username: 'AchievementHunter', score: 8920, achievementsCount: 367, rankTitle: 'Trophy Hunter', percentile: 'Top 1%' },
    { id: '4', rank: 4, username: 'QuestComplete', score: 8450, achievementsCount: 312, rankTitle: 'Trophy Hunter', percentile: 'Top 2%' },
    { id: '5', rank: 5, username: 'GameCompletionist', score: 8120, achievementsCount: 298, rankTitle: 'Trophy Hunter', percentile: 'Top 3%' },
    { id: '6', rank: 6, username: 'AchievementKing', score: 7890, achievementsCount: 275, rankTitle: 'Speedrunner Supreme', percentile: 'Top 5%' },
    { id: '7', rank: 7, username: 'UnlockMaster', score: 7650, achievementsCount: 259, rankTitle: 'Speedrunner Supreme', percentile: 'Top 5%' },
    { id: '8', rank: 8, username: 'LevelUpPro', score: 7320, achievementsCount: 241, rankTitle: 'Trophy Hunter', percentile: 'Top 7%' },
    { id: '9', rank: 9, username: 'QuestChampion', score: 7090, achievementsCount: 228, rankTitle: 'Trophy Hunter', percentile: 'Top 8%' },
    { id: '10', rank: 10, username: 'TrophyCollector', score: 6870, achievementsCount: 215, rankTitle: 'Trophy Hunter', percentile: 'Top 10%' },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Global Leaderboard</h2>
      <p className="text-neutral-400">The world's top achievement hunters ranked by total score.</p>
      <LeaderboardTable entries={globalEntries} />
    </div>
  );
};

const FriendsLeaderboard: React.FC = () => {
  const friendsEntries: LeaderboardEntry[] = [
    { id: '1', rank: 1, username: 'BestFriend01', score: 7650, achievementsCount: 210, rankTitle: 'Trophy Hunter', percentile: 'Top 5%' },
    { id: '2', rank: 2, username: 'GamingBuddy', score: 6430, achievementsCount: 189, rankTitle: 'Trophy Hunter', percentile: 'Top 12%' },
    { id: '3', rank: 3, username: 'FriendlyGamer', score: 5920, achievementsCount: 167, rankTitle: 'Trophy Hunter', percentile: 'Top 15%' },
    { id: '4', rank: 4, username: 'CasualAchiever', score: 4750, achievementsCount: 132, rankTitle: 'Trophy Hunter', percentile: 'Top 22%' },
    { id: '5', rank: 5, username: 'WeekendWarrior', score: 3920, achievementsCount: 98, rankTitle: 'Trophy Hunter', percentile: 'Top 35%' },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Friends Leaderboard</h2>
      <p className="text-neutral-400">See how your friends stack up in the achievement race!</p>
      <LeaderboardTable entries={friendsEntries} />
    </div>
  );
};

type PlatformType = 'PlayStation' | 'Xbox' | 'Steam';

const PlatformLeaderboard: React.FC = () => {
  const [platform, setPlatform] = useState<PlatformType>('PlayStation');
  
  const platformData: Record<PlatformType, LeaderboardEntry[]> = {
    'PlayStation': [
      { id: '1', rank: 1, username: 'PSN_Master', score: 9250, achievementsCount: 410, rankTitle: 'Platinum God', percentile: 'Top 0.3%' },
      { id: '2', rank: 2, username: 'TrophyHunterPS', score: 8740, achievementsCount: 382, rankTitle: 'Platinum God', percentile: 'Top 0.8%' },
      { id: '3', rank: 3, username: 'PlayStation_Pro', score: 8320, achievementsCount: 355, rankTitle: 'Trophy Hunter', percentile: 'Top 1.2%' },
      { id: '4', rank: 4, username: 'PSN_Legend', score: 7950, achievementsCount: 328, rankTitle: 'Trophy Hunter', percentile: 'Top 2.5%' },
      { id: '5', rank: 5, username: 'PS_Completionist', score: 7620, achievementsCount: 312, rankTitle: 'Trophy Hunter', percentile: 'Top 3.1%' },
    ],
    'Xbox': [
      { id: '1', rank: 1, username: 'Xbox_Champion', score: 8950, achievementsCount: 395, rankTitle: 'Legendary Collector', percentile: 'Top 0.4%' },
      { id: '2', rank: 2, username: 'GamerScoreKing', score: 8540, achievementsCount: 371, rankTitle: 'Platinum God', percentile: 'Top 0.9%' },
      { id: '3', rank: 3, username: 'XboxAchiever', score: 8130, achievementsCount: 345, rankTitle: 'Trophy Hunter', percentile: 'Top 1.5%' },
      { id: '4', rank: 4, username: 'XboxLegend', score: 7720, achievementsCount: 318, rankTitle: 'Trophy Hunter', percentile: 'Top 2.7%' },
      { id: '5', rank: 5, username: 'GamertagHero', score: 7390, achievementsCount: 302, rankTitle: 'Trophy Hunter', percentile: 'Top 3.4%' },
    ],
    'Steam': [
      { id: '1', rank: 1, username: 'SteamWizard', score: 9150, achievementsCount: 405, rankTitle: 'Legendary Collector', percentile: 'Top 0.2%' },
      { id: '2', rank: 2, username: 'PCMasterRace', score: 8740, achievementsCount: 378, rankTitle: 'Platinum God', percentile: 'Top 0.7%' },
      { id: '3', rank: 3, username: 'SteamAchiever', score: 8330, achievementsCount: 351, rankTitle: 'Trophy Hunter', percentile: 'Top 1.3%' },
      { id: '4', rank: 4, username: 'ValveVeteran', score: 7920, achievementsCount: 325, rankTitle: 'Trophy Hunter', percentile: 'Top 2.6%' },
      { id: '5', rank: 5, username: 'SteamCollector', score: 7580, achievementsCount: 309, rankTitle: 'Trophy Hunter', percentile: 'Top 3.2%' },
    ],
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Platform Leaderboards</h2>
      <p className="text-neutral-400">Top achievement hunters by gaming platform.</p>
      
      <div className="flex space-x-2 mb-4">
        <button 
          onClick={() => setPlatform('PlayStation')} 
          className={`px-4 py-2 rounded-md ${platform === 'PlayStation' ? 'bg-neon-blue text-white' : 'bg-black/30 text-neutral-400'}`}
        >
          PlayStation
        </button>
        <button 
          onClick={() => setPlatform('Xbox')} 
          className={`px-4 py-2 rounded-md ${platform === 'Xbox' ? 'bg-neon-green text-white' : 'bg-black/30 text-neutral-400'}`}
        >
          Xbox
        </button>
        <button 
          onClick={() => setPlatform('Steam')} 
          className={`px-4 py-2 rounded-md ${platform === 'Steam' ? 'bg-neon-purple text-white' : 'bg-black/30 text-neutral-400'}`}
        >
          Steam
        </button>
      </div>
      
      <LeaderboardTable entries={platformData[platform]} />
    </div>
  );
};

const LeaderboardTable: React.FC<{ entries: LeaderboardEntry[] }> = ({ entries }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-black/40 text-left">
            <th className="p-3 font-semibold text-neutral-300">Rank</th>
            <th className="p-3 font-semibold text-neutral-300">User</th>
            <th className="p-3 font-semibold text-neutral-300">Rank Title</th>
            <th className="p-3 font-semibold text-neutral-300 text-right">Achievement Count</th>
            <th className="p-3 font-semibold text-neutral-300 text-right">Score</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id} className="border-b border-neutral-800 hover:bg-black/30 transition-colors">
              <td className="p-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black/50 text-neutral-200 font-bold">
                  {entry.rank}
                </div>
              </td>
              <td className="p-3 font-medium">{entry.username}</td>
              <td className="p-3">
                <RankBadge rank={entry.rankTitle} percentile={entry.percentile} />
              </td>
              <td className="p-3 text-right">{entry.achievementsCount}</td>
              <td className="p-3 text-right font-bold text-neon-purple">{entry.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Leaderboard = () => {
  return (
    <div className="container-padding max-w-6xl mx-auto pt-24 pb-16">
      <SEO 
        title="Gaming Leaderboards" 
        description="See where you rank among gamers worldwide. Compete and climb the PlatinumPath leaderboards."
        url="/leaderboard"
      />
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-3">Achievement Leaderboards</h1>
        <p className="text-neutral-400">
          Compare your gaming achievements and see how you stack up against others. Will you rise to the top?
        </p>
      </div>

      <Tabs defaultValue="global" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="global" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            <span>Global</span>
          </TabsTrigger>
          <TabsTrigger value="friends" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Friends</span>
          </TabsTrigger>
          <TabsTrigger value="platform" className="flex items-center gap-2">
            <Gamepad className="h-4 w-4" />
            <span>Platform</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="global" className="space-y-4">
          <GlobalLeaderboard />
        </TabsContent>
        
        <TabsContent value="friends" className="space-y-4">
          <FriendsLeaderboard />
        </TabsContent>
        
        <TabsContent value="platform" className="space-y-4">
          <PlatformLeaderboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Leaderboard;
