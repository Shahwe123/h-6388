
import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Medal, Zap } from 'lucide-react';

/**
 * Props for the RankBadge component
 * @property {string} rank - The rank name to display
 * @property {string} percentile - Optional percentile information
 */
type RankBadgeProps = {
  rank: 'Legendary Collector' | 'Platinum God' | 'Trophy Hunter' | 'Speedrunner Supreme' | string;
  percentile?: string;
};

/**
 * RankBadge component
 * 
 * Displays a user's rank as a styled badge with an appropriate icon.
 * Different ranks get different colors and icons.
 * 
 * @param {RankBadgeProps} props - Component props
 * @returns {JSX.Element} The rank badge UI
 */
export const RankBadge: React.FC<RankBadgeProps> = ({ rank, percentile }) => {
  // Determine which icon to use based on rank name
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
