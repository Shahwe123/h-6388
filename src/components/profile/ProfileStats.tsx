
import { Trophy, Medal, BarChart3, Users } from 'lucide-react';

/**
 * Props for the ProfileStats component
 */
interface ProfileStatsProps {
  trophiesCount: number;         // Total number of trophies earned
  platinumCount: number;         // Number of platinum trophies earned
  completionPercentage: number;  // Overall completion percentage
  friendCount: number;           // Total number of friends
}

/**
 * ProfileStats component
 * Displays key player statistics in a grid layout
 * Shows trophies, platinums, completion rate, and friend count
 * 
 * @param trophiesCount - Total number of trophies earned
 * @param platinumCount - Number of platinum trophies earned
 * @param completionPercentage - Overall completion percentage
 * @param friendCount - Total number of friends
 */
const ProfileStats = ({ 
  trophiesCount, 
  platinumCount, 
  completionPercentage, 
  friendCount 
}: ProfileStatsProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 mb-8">
      {/* Trophies Stat */}
      <div className="bg-black/30 p-4 rounded-lg text-center">
        <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
        <div className="text-xl font-bold">{trophiesCount}</div>
        <div className="text-sm text-neutral-400">Trophies</div>
      </div>

      {/* Platinums Stat */}
      <div className="bg-black/30 p-4 rounded-lg text-center">
        <Medal className="w-6 h-6 text-neon-blue mx-auto mb-2" />
        <div className="text-xl font-bold">{platinumCount}</div>
        <div className="text-sm text-neutral-400">Platinums</div>
      </div>

      {/* Completion Rate Stat */}
      <div className="bg-black/30 p-4 rounded-lg text-center">
        <BarChart3 className="w-6 h-6 text-neon-purple mx-auto mb-2" />
        <div className="text-xl font-bold">{completionPercentage}%</div>
        <div className="text-sm text-neutral-400">Completion Rate</div>
      </div>

      {/* Friends Stat */}
      <div className="bg-black/30 p-4 rounded-lg text-center">
        <Users className="w-6 h-6 text-green-500 mx-auto mb-2" />
        <div className="text-xl font-bold">{friendCount}</div>
        <div className="text-sm text-neutral-400">Friends</div>
      </div>
    </div>
  );
};

export default ProfileStats;
