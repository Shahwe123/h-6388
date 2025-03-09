
import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Award, Star, Flame } from 'lucide-react';

type AchievementBadgeProps = {
  type: 'platinum' | 'gold' | 'silver' | 'bronze' | 'ultra-rare';
  name: string;
  rarity?: string;
  animate?: boolean;
}

const badgeIcons = {
  platinum: <Trophy className="h-7 w-7 text-purple-300" />,
  gold: <Trophy className="h-6 w-6 text-yellow-400" />,
  silver: <Trophy className="h-6 w-6 text-slate-300" />,
  bronze: <Trophy className="h-6 w-6 text-amber-700" />,
  'ultra-rare': <Star className="h-7 w-7 text-neon-pink" />
};

const badgeColors = {
  platinum: 'bg-gradient-to-br from-purple-500 to-purple-900',
  gold: 'bg-gradient-to-br from-yellow-300 to-yellow-600',
  silver: 'bg-gradient-to-br from-slate-300 to-slate-500',
  bronze: 'bg-gradient-to-br from-amber-500 to-amber-800',
  'ultra-rare': 'bg-gradient-to-br from-neon-pink to-neon-purple'
};

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({ 
  type, 
  name, 
  rarity,
  animate = true
}) => {
  const icon = badgeIcons[type] || <Award className="h-6 w-6" />;
  const color = badgeColors[type] || 'bg-gradient-to-br from-gray-700 to-gray-900';
  
  return (
    <motion.div
      className={`relative rounded-lg ${color} p-1 shadow-lg`}
      whileHover={animate ? { scale: 1.05, rotate: [0, -1, 1, -1, 0] } : {}}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-black/60 rounded-md p-3 flex flex-col items-center">
        <div className="relative">
          {icon}
          {type === 'ultra-rare' && (
            <motion.div
              className="absolute inset-0 opacity-60"
              animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.8, 0.6] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            >
              <Flame className="h-7 w-7 text-neon-pink" />
            </motion.div>
          )}
        </div>
        <p className="text-xs font-bold mt-2 text-white text-center truncate w-full">{name}</p>
        {rarity && <p className="text-[10px] opacity-80 mt-1">{rarity}</p>}
      </div>
    </motion.div>
  );
};

export default AchievementBadge;
