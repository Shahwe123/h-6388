
import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Medal, Zap } from 'lucide-react';

/**
 * Props for the RankBadge component
 */
type RankBadgeProps = {
  rank: 'Legendary Collector' | 'Platinum God' | 'Trophy Hunter' | 'Speedrunner Supreme' | string;
  percentile?: string;  // Optional percentile information (e.g. "Top 5%")
};

/**
 * RankBadge component
 * Displays the player's rank with an appropriate icon and styling
 * 
 * @param rank - The player's rank
 * @param percentile - Optional percentile information
 */
export const RankBadge: React.FC<RankBadgeProps> = ({ rank, percentile }) => {
  // Determine which icon to use based on rank
  let Icon = Crown;
  let badgeColor = 'from-neon-purple to-neon-blue';
  
  if (rank.includes('Platinum')) {
    Icon = Medal;
    badgeColor = 'from-neon-blue to-cyan-500';
  } else if (rank.includes('Speedrunner')) {
    Icon = Zap;
    badgeColor = 'from-neon-pink to-yellow-500';
  }
  
  return (
    <motion.div
      className={`inline-flex items-center bg-gradient-to-r ${badgeColor} px-3 py-1 rounded-full`}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      <Icon className="h-4 w-4 mr-1" />
      <span className="text-sm font-bold">{rank}</span>
      {percentile && (
        <span className="text-xs ml-1 opacity-80">({percentile})</span>
      )}
    </motion.div>
  );
};

export default RankBadge;
