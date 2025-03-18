
import { Trophy, Medal, BarChart3, Users } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Props for the ProfileStats component
 */
interface ProfileStatsProps {
  trophiesCount: number;
  platinumCount: number;
  completionPercentage: number;
  friendCount: number;
}

/**
 * ProfileStats component
 * 
 * Displays key statistics about a user's gaming profile in a grid layout.
 * Shows trophies, platinums, completion rate, and friend count.
 * 
 * @param {ProfileStatsProps} props - Component props
 * @returns {JSX.Element} The profile stats UI
 */
const ProfileStats = ({ 
  trophiesCount, 
  platinumCount, 
  completionPercentage, 
  friendCount 
}: ProfileStatsProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-3">
      {/* Trophies stat */}
      <motion.div 
        className="bg-black/40 p-3 rounded-lg text-center border border-neon-purple/20 hover:border-neon-purple/50 transition-colors"
        whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.3)' }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-300 flex items-center justify-center mx-auto mb-2">
          <Trophy className="w-5 h-5 text-black" />
        </div>
        <div className="text-xl font-bold text-white">{trophiesCount}</div>
        <div className="text-xs text-neutral-400 uppercase tracking-wider">Trophies</div>
      </motion.div>

      {/* Platinums stat */}
      <motion.div 
        className="bg-black/40 p-3 rounded-lg text-center border border-neon-purple/20 hover:border-neon-purple/50 transition-colors"
        whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.3)' }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-blue to-blue-300 flex items-center justify-center mx-auto mb-2">
          <Medal className="w-5 h-5 text-black" />
        </div>
        <div className="text-xl font-bold text-white">{platinumCount}</div>
        <div className="text-xs text-neutral-400 uppercase tracking-wider">Platinums</div>
      </motion.div>

      {/* Completion Rate stat */}
      <motion.div 
        className="bg-black/40 p-3 rounded-lg text-center border border-neon-purple/20 hover:border-neon-purple/50 transition-colors"
        whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.3)' }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-purple to-purple-300 flex items-center justify-center mx-auto mb-2">
          <BarChart3 className="w-5 h-5 text-black" />
        </div>
        <div className="text-xl font-bold text-white">{completionPercentage}%</div>
        <div className="text-xs text-neutral-400 uppercase tracking-wider">Completion</div>
      </motion.div>

      {/* Friends stat */}
      <motion.div 
        className="bg-black/40 p-3 rounded-lg text-center border border-neon-purple/20 hover:border-neon-purple/50 transition-colors"
        whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.3)' }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-green to-green-300 flex items-center justify-center mx-auto mb-2">
          <Users className="w-5 h-5 text-black" />
        </div>
        <div className="text-xl font-bold text-white">{friendCount}</div>
        <div className="text-xs text-neutral-400 uppercase tracking-wider">Friends</div>
      </motion.div>
    </div>
  );
};

export default ProfileStats;
