
import { Trophy, Medal, PieChart } from 'lucide-react';
import { useSelector } from 'react-redux';
import { Game } from '@/types/game';

interface ProfileStatsProps {
  trophiesCount?: number;
  platinumCount?: number;
  completionPercentage?: number;
  friendCount: number;
  userId?: string;
}

/**
 * ProfileStats component displays key stats about the user's gaming achievements
 */
const ProfileStats = ({ trophiesCount = 0, platinumCount = 0, completionPercentage = 0, friendCount, userId }: ProfileStatsProps) => {
  const games = useSelector((state: any) => state.games?.games || []);
  
  // Calculate real stats from the games data if available
  const calculateStats = () => {
    if (!games || games.length === 0) {
      return { totalTrophies: trophiesCount, platinumTrophies: platinumCount, avgCompletion: completionPercentage };
    }
    
    let totalTrophies = 0;
    let earnedTrophies = 0;
    let platinumTrophies = 0;
    let totalCompletion = 0;
    
    games.forEach((game: Game) => {
      // Count trophies
      if (game.trophies && Array.isArray(game.trophies)) {
        const earned = game.trophies.filter(t => t.achieved).length;
        earnedTrophies += earned;
        totalTrophies += game.trophies.length;
        platinumTrophies += game.trophies.filter(t => t.achieved && t.type === 'platinum').length;
      } else if (game.trophyCounts) {
        earnedTrophies += game.trophyCounts.earned || 0;
        totalTrophies += game.trophyCounts.total || 0;
        platinumTrophies += game.trophyCounts.platinum || 0;
      } else if (game.trophyCount) {
        totalTrophies += game.trophyCount;
      }
      
      // Add completion percentage
      if (typeof game.completion === 'number') {
        totalCompletion += game.completion;
      }
    });
    
    // Calculate average completion - now based on total earned vs total available
    const avgCompletion = totalTrophies > 0 
      ? Math.round((earnedTrophies / totalTrophies) * 100) 
      : (games.length > 0 ? Math.round(totalCompletion / games.length) : 0);
    
    return { totalTrophies: earnedTrophies, platinumTrophies, avgCompletion };
  };
  
  const stats = calculateStats();
  
  return (
    <div className="glass-card rounded-xl p-6">
      <h2 className="text-xl font-bold mb-4">Trophy Stats</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col items-center glass-card-inner p-4 rounded-lg">
          <Trophy className="h-8 w-8 text-neon-pink mb-2" />
          <div className="text-2xl font-bold">{stats.totalTrophies}</div>
          <div className="text-sm text-neutral-400">Trophies Earned</div>
        </div>
        
        <div className="flex flex-col items-center glass-card-inner p-4 rounded-lg">
          <Medal className="h-8 w-8 text-purple-400 mb-2" />
          <div className="text-2xl font-bold">{stats.platinumTrophies}</div>
          <div className="text-sm text-neutral-400">Platinum Trophies</div>
        </div>
        
        <div className="flex flex-col items-center glass-card-inner p-4 rounded-lg">
          <PieChart className="h-8 w-8 text-neon-blue mb-2" />
          <div className="text-2xl font-bold">{stats.avgCompletion}%</div>
          <div className="text-sm text-neutral-400">Avg. Completion</div>
        </div>
        
        <div className="flex flex-col items-center glass-card-inner p-4 rounded-lg">
          <div className="h-8 w-8 flex items-center justify-center mb-2">
            <span className="text-lg font-bold text-neon-purple">👥</span>
          </div>
          <div className="text-2xl font-bold">{friendCount}</div>
          <div className="text-sm text-neutral-400">Friends</div>
        </div>
      </div>
    </div>
  );
};

export default ProfileStats;
