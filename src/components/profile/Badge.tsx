
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, Award, Medal, Star, Users, Zap, CheckCircle, 
  Package, Crown, Gamepad, LucideIcon 
} from 'lucide-react';
import { BadgeType } from '@/types/badge';
import { cn } from '@/lib/utils';

type BadgeProps = {
  name: string;
  type: BadgeType;
  icon?: string;
  description?: string;
  earnedAt?: string;
  progress?: number;
  requirement?: number;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const iconMap: Record<string, React.ReactNode> = {
  'trophy': <Trophy />,
  'medal': <Medal />,
  'award': <Award />,
  'star': <Star />,
  'users': <Users />,
  'zap': <Zap />,
  'check-circle': <CheckCircle />,
  'package': <Package />,
  'crown': <Crown />,
  'game-controller': <Gamepad />
};

const getBadgeColor = (type: BadgeType) => {
  switch (type) {
    case 'platinum':
      return 'from-purple-400 to-purple-700';
    case 'gold':
      return 'from-yellow-300 to-yellow-600';
    case 'silver':
      return 'from-slate-300 to-slate-500';
    case 'bronze':
      return 'from-amber-500 to-amber-800';
    case 'leaderboard':
      return 'from-neon-blue to-blue-600';
    case 'achievement':
      return 'from-green-400 to-green-700';
    case 'special':
      return 'from-neon-pink to-neon-purple';
    default:
      return 'from-gray-400 to-gray-700';
  }
};

export const Badge: React.FC<BadgeProps> = ({
  name,
  type,
  icon,
  description,
  earnedAt,
  progress,
  requirement,
  size = 'md',
  onClick
}) => {
  const badgeIcon = icon && iconMap[icon] ? iconMap[icon] : <Award />;
  const badgeColor = getBadgeColor(type);
  
  const sizeClasses = {
    sm: 'w-16 h-16 text-sm',
    md: 'w-24 h-24 text-base',
    lg: 'w-32 h-32 text-lg'
  };
  
  const iconSizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const isInProgress = progress !== undefined && requirement !== undefined;
  
  return (
    <motion.div
      className={cn(
        "relative rounded-full cursor-pointer overflow-hidden",
        sizeClasses[size],
        onClick ? "cursor-pointer" : "cursor-default"
      )}
      whileHover={{ scale: 1.05 }}
      onClick={onClick}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${badgeColor}`}></div>
      
      {/* Badge inner content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-1 bg-black/30">
        <div className={cn("text-white", iconSizeClasses[size])}>
          {badgeIcon}
        </div>
        
        {size !== 'sm' && (
          <p className="text-white font-bold mt-1 text-center truncate w-full">
            {name}
          </p>
        )}
      </div>
      
      {/* Progress indicator for in-progress badges */}
      {isInProgress && (
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-black/50">
          <div 
            className="h-full bg-white/80" 
            style={{ width: `${(progress / requirement) * 100}%` }}
          ></div>
        </div>
      )}
      
      {/* Shimmer effect for earned badges */}
      {earnedAt && (
        <motion.div
          className="absolute inset-0 bg-white/20"
          initial={{ x: '-100%', opacity: 0.5 }}
          animate={{ x: '100%', opacity: 0 }}
          transition={{ 
            repeat: Infinity, 
            duration: 2, 
            repeatDelay: 5,
            ease: "easeInOut" 
          }}
        />
      )}
    </motion.div>
  );
};

export default Badge;
