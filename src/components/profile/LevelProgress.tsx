
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

/**
 * Props for the LevelProgress component
 * @property {number} level - Current player level
 * @property {number} xp - Current XP amount
 * @property {number} nextLevelXp - XP required for the next level
 * @property {string} rank - Optional player rank
 */
type LevelProgressProps = {
  level: number;
  xp: number;
  nextLevelXp: number;
  rank?: string;
}

/**
 * LevelProgress component
 * 
 * Displays a user's current level, XP progress, and rank.
 * Includes a progress bar showing progress towards the next level.
 * 
 * @param {LevelProgressProps} props - Component props
 * @returns {JSX.Element} The level progress UI
 */
export const LevelProgress: React.FC<LevelProgressProps> = ({ 
  level, 
  xp, 
  nextLevelXp,
  rank 
}) => {
  // Calculate progress percentage (capped at 100%)
  const progress = Math.min(100, Math.round((xp / nextLevelXp) * 100));
  
  return (
    <div className="w-full bg-black/30 rounded-xl p-4 mb-4">
      <div className="flex items-center justify-between">
        {/* Level badge and info */}
        <div className="flex items-center">
          <motion.div 
            className="h-14 w-14 rounded-full bg-gradient-game flex items-center justify-center text-white font-bold text-xl relative"
            whileHover={{ scale: 1.05 }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {level}
            <span className="absolute -top-1 -right-1 bg-black/60 rounded-full p-1">
              <ArrowUp className="h-3 w-3 text-neon-blue" />
            </span>
          </motion.div>
          <div className="ml-3">
            <h3 className="font-bold text-white">Level {level}</h3>
            <p className="text-xs text-neutral-400">
              {rank ? rank : 'Trophy Hunter'}
            </p>
          </div>
        </div>
        
        {/* XP counter */}
        <div className="text-right">
          <p className="text-sm font-medium">
            <span className="text-neon-blue">{xp}</span>
            <span className="text-neutral-500">/{nextLevelXp} XP</span>
          </p>
          <p className="text-xs text-neutral-400">Next level in {nextLevelXp - xp} XP</p>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="mt-3 bg-black/50 h-2 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-gradient-to-r from-neon-blue to-neon-purple"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

export default LevelProgress;
