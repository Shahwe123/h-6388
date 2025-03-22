
import React from 'react';
import { motion } from 'framer-motion';
import { Share2, Bookmark, Trophy } from 'lucide-react';
import { Game, GameTrophy } from '@/types/game';
import { formatDistanceToNow } from 'date-fns';

interface TrophyCardProps {
  trophy: GameTrophy;
  game: Game;
  onClick: () => void;
  onShare: () => void;
  onPin: () => void;
}

const TrophyCard: React.FC<TrophyCardProps> = ({ trophy, game, onClick, onShare, onPin }) => {
  const trophyColors = {
    platinum: 'from-purple-500/50 to-purple-800/50 border-purple-400/30',
    gold: 'from-yellow-500/50 to-yellow-700/50 border-yellow-400/30',
    silver: 'from-gray-400/50 to-gray-600/50 border-gray-300/30',
    bronze: 'from-amber-700/50 to-amber-900/50 border-amber-600/30'
  };
  
  const trophyGlow = {
    platinum: 'shadow-purple-500/30',
    gold: 'shadow-yellow-500/30',
    silver: 'shadow-gray-400/30',
    bronze: 'shadow-amber-700/30'
  };

  const rarityClass = trophy.rarityPercentage <= 5 
    ? 'text-neon-pink' 
    : trophy.rarityPercentage <= 15 
      ? 'text-purple-400' 
      : 'text-zinc-400';
  
  return (
    <motion.div
      className={`relative rounded-lg bg-gradient-to-b ${trophyColors[trophy.type]} border shadow-lg ${trophy.isLegacy ? trophyGlow[trophy.type] : ''} overflow-hidden`}
      whileHover={{ scale: 1.02, y: -5 }}
      onClick={onClick}
    >
      {trophy.isLegacy && (
        <div className="absolute top-2 right-2 z-10">
          <span className="bg-neon-purple text-white text-xs px-2 py-0.5 rounded-full">
            Legacy
          </span>
        </div>
      )}
      
      {trophy.isFirstOfType && (
        <div className="absolute top-2 left-2 z-10">
          <span className="bg-neon-blue text-white text-xs px-2 py-0.5 rounded-full">
            First
          </span>
        </div>
      )}
      
      <div className="p-3 bg-black/70">
        <div className="relative flex justify-center mb-2">
          {trophy.image ? (
            <img 
              src={trophy.image} 
              alt={trophy.name} 
              className="w-12 h-12 object-contain"
            />
          ) : (
            <div className={`w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br ${trophyColors[trophy.type]}`}>
              <Trophy className="w-6 h-6" />
            </div>
          )}
        </div>
        
        <h3 className="font-medium text-sm text-center truncate" title={trophy.name}>
          {trophy.name}
        </h3>
        
        <p className="text-xs text-center text-zinc-400 truncate" title={game.name}>
          {game.name}
        </p>
        
        <div className="flex justify-between items-center mt-2">
          <span className={`text-xs ${rarityClass}`}>
            {trophy.rarityPercentage}%
          </span>
          
          {trophy.achievedDate && (
            <span className="text-xs text-zinc-500">
              {formatDistanceToNow(new Date(trophy.achievedDate), { addSuffix: true })}
            </span>
          )}
        </div>
        
        {/* Actions */}
        <div className="mt-2 pt-2 border-t border-zinc-800/50 flex justify-between">
          <button 
            className="text-zinc-400 hover:text-white"
            onClick={(e) => {
              e.stopPropagation();
              onShare();
            }}
          >
            <Share2 className="w-4 h-4" />
          </button>
          
          <button 
            className={`${trophy.isPinned ? 'text-yellow-400' : 'text-zinc-400 hover:text-white'}`}
            onClick={(e) => {
              e.stopPropagation();
              onPin();
            }}
          >
            <Bookmark className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TrophyCard;
