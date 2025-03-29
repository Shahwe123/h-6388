
import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Clock, Award, Medal, Star, Calendar } from 'lucide-react';
import { Game, GameTrophy, MilestoneInfo } from '@/types/game';
import { formatDistanceToNow, format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MilestoneCardProps {
  trophy: GameTrophy;
  game: Game;
  milestoneInfo?: MilestoneInfo;
}

const MilestoneCard: React.FC<MilestoneCardProps> = ({ trophy, game, milestoneInfo }) => {
  const trophyColors = {
    platinum: 'from-purple-500 to-purple-900',
    gold: 'from-yellow-500 to-yellow-800',
    silver: 'from-gray-400 to-gray-700',
    bronze: 'from-amber-700 to-amber-900'
  };
  
  const getMilestoneIcon = () => {
    if (milestoneInfo?.isFirstPlatinum) return <Trophy className="h-6 w-6 text-purple-400" />;
    if (milestoneInfo?.isRarest) return <Award className="h-6 w-6 text-neon-pink" />;
    if (milestoneInfo?.isFastestCompletion) return <Clock className="h-6 w-6 text-green-400" />;
    if (trophy.isFirstOfType) return <Medal className="h-6 w-6 text-blue-400" />;
    if (trophy.isLegacy) return <Star className="h-6 w-6 text-yellow-400" />;
    return <Calendar className="h-6 w-6 text-neon-blue" />;
  };
  
  const getMilestoneTitle = () => {
    if (milestoneInfo?.isFirstPlatinum) return "First Platinum Trophy";
    if (milestoneInfo?.isRarest) return "Rarest Achievement";
    if (milestoneInfo?.isFastestCompletion) return "Fastest Completion";
    if (trophy.isFirstOfType) return `First ${trophy.type} Trophy`;
    if (trophy.isLegacy) return "Legacy Trophy";
    return "Gaming Milestone";
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden border-zinc-800 hover:border-neon-purple transition-all">
        <CardHeader className={`bg-gradient-to-r ${trophyColors[trophy.type]} p-4 pb-6`}>
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              {getMilestoneIcon()}
              {getMilestoneTitle()}
            </CardTitle>
            <div className="bg-black/30 text-xs rounded-full px-2 py-1">
              {trophy.type}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-4 bg-black/40">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              {trophy.image ? (
                <img 
                  src={trophy.image} 
                  alt={trophy.name} 
                  className="w-16 h-16 object-contain"
                />
              ) : (
                <div className={`w-16 h-16 flex items-center justify-center rounded-md bg-gradient-to-br ${trophyColors[trophy.type]}`}>
                  <Trophy className="w-8 h-8" />
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <h3 className="font-bold">{trophy.name}</h3>
              <p className="text-sm text-zinc-400 mb-1">{game.name}</p>
              <p className="text-xs text-zinc-500">{trophy.description}</p>
              
              <div className="mt-3 flex flex-wrap gap-2">
                {trophy.achievedDate && (
                  <div className="bg-black/30 rounded text-xs px-2 py-1 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(trophy.achievedDate), 'MMM d, yyyy')}
                  </div>
                )}
                
                <div className="bg-black/30 rounded text-xs px-2 py-1 flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  {trophy.rarityPercentage}% - {trophy.rarity}
                </div>
                
                {milestoneInfo?.completionTime && (
                  <div className="bg-black/30 rounded text-xs px-2 py-1 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {milestoneInfo.completionTime} hours
                  </div>
                )}
              </div>
              
              {milestoneInfo?.personalNote && (
                <div className="mt-3 text-xs italic border-l-2 border-neon-purple pl-2 py-1">
                  "{milestoneInfo.personalNote}"
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MilestoneCard;
