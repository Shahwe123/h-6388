
import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Clock, Flame } from 'lucide-react';

/**
 * Props for the RarityCard component
 */
type RarityCardProps = {
  title: string;               // Title of the achievement
  description: string;         // Description of the achievement
  icon: 'trophy' | 'time' | 'grind';  // Type of icon to display
  percentage?: string;         // Optional percentage or status text
}

/**
 * RarityCard component
 * Displays a card for achievement rarity information
 * Used to showcase different types of notable achievements
 * 
 * @param title - Title of the achievement
 * @param description - Description of the achievement
 * @param icon - Type of icon to display
 * @param percentage - Optional percentage or status text
 */
export const RarityCard: React.FC<RarityCardProps> = ({ 
  title,
  description,
  icon,
  percentage
}) => {
  // Determine which icon and color to use based on the icon type
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
        <div className="bg-black/60 p-2 rounded-lg">
          <IconComponent className={`h-6 w-6 ${iconColor}`} />
        </div>
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
