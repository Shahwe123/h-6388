
import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Clock, Flame } from 'lucide-react';

/**
 * Props for the RarityCard component
 * @property {string} title - Card title
 * @property {string} description - Card description
 * @property {'trophy'|'time'|'grind'} icon - Icon type to display
 * @property {string} percentage - Optional percentage value
 */
type RarityCardProps = {
  title: string;
  description: string;
  icon: 'trophy' | 'time' | 'grind';
  percentage?: string;
}

/**
 * RarityCard component
 * 
 * Displays a card with information about trophy rarity or achievement difficulty.
 * Shows different icons based on the type of rarity (trophy, time-based, grind-based).
 * 
 * @param {RarityCardProps} props - Component props
 * @returns {JSX.Element} The rarity card UI
 */
export const RarityCard: React.FC<RarityCardProps> = ({ 
  title,
  description,
  icon,
  percentage
}) => {
  // Choose icon and color based on the icon type
  let IconComponent;
  let iconColor = '';
  
  switch(icon) {
    case 'trophy':
      IconComponent = Trophy;
      iconColor = 'text-yellow-400';
      break;
    case 'time':
      IconComponent = Clock;
      iconColor = 'text-neon-blue';
      break;
    case 'grind':
      IconComponent = Flame;
      iconColor = 'text-neon-pink';
      break;
    default:
      IconComponent = Trophy;
      iconColor = 'text-yellow-400';
  }
  
  return (
    <motion.div 
      className="bg-black/40 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow border border-neon-purple/20"
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
    >
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div className="bg-black/60 p-2 rounded-lg">
          <IconComponent className={`h-6 w-6 ${iconColor}`} />
        </div>
        {/* Content */}
        <div>
          <h3 className="font-bold text-white text-sm">{title}</h3>
          <p className="text-xs text-neutral-400">{description}</p>
          {percentage && (
            <div className="mt-1 text-xs font-medium text-neon-purple">{percentage}</div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default RarityCard;
