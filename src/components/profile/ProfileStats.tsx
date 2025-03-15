
import { Trophy, Medal, BarChart3, Users } from 'lucide-react';

interface ProfileStatsProps {
  trophiesCount: number;
  platinumCount: number;
  completionPercentage: number;
  friendCount: number;
}

const ProfileStats = ({ 
  trophiesCount, 
  platinumCount, 
  completionPercentage, 
  friendCount 
}: ProfileStatsProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 mb-8">
      <div className="bg-black/30 p-4 rounded-lg text-center">
        <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
        <div className="text-xl font-bold">{trophiesCount}</div>
        <div className="text-sm text-neutral-400">Trophies</div>
      </div>

      <div className="bg-black/30 p-4 rounded-lg text-center">
        <Medal className="w-6 h-6 text-neon-blue mx-auto mb-2" />
        <div className="text-xl font-bold">{platinumCount}</div>
        <div className="text-sm text-neutral-400">Platinums</div>
      </div>

      <div className="bg-black/30 p-4 rounded-lg text-center">
        <BarChart3 className="w-6 h-6 text-neon-purple mx-auto mb-2" />
        <div className="text-xl font-bold">{completionPercentage}%</div>
        <div className="text-sm text-neutral-400">Completion Rate</div>
      </div>

      <div className="bg-black/30 p-4 rounded-lg text-center">
        <Users className="w-6 h-6 text-green-500 mx-auto mb-2" />
        <div className="text-xl font-bold">{friendCount}</div>
        <div className="text-sm text-neutral-400">Friends</div>
      </div>
    </div>
  );
};

export default ProfileStats;
