
import React from 'react';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { Timer, Award } from 'lucide-react';

interface LevelProgressProps {
  level: number;
  xp: number;
  nextLevelXp: number;
  rank: string;
}

const LevelProgress: React.FC<LevelProgressProps> = ({ level, xp, nextLevelXp, rank }) => {
  const progressPercentage = (xp / nextLevelXp) * 100;
  
  return (
    <div className="bg-black/50 rounded-xl p-4 border border-neon-purple/30">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-2">
        <div className="flex items-center gap-3">
          <motion.div 
            className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-neon-purple to-neon-pink border-4 border-black/70"
            animate={{ 
              boxShadow: ['0 0 10px #8B5CF6', '0 0 20px #8B5CF6', '0 0 10px #8B5CF6'] 
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              repeatType: "reverse"
            }}
          >
            <span className="text-xl font-bold">{level}</span>
          </motion.div>
          <div className="text-left">
            <h3 className="text-xl font-bold">{rank}</h3>
            <div className="flex items-center gap-1 text-xs text-neutral-300">
              <Timer className="h-3 w-3" />
              <span>53:29 hrs played</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          <Award className="h-5 w-5 text-neon-purple" />
          <span className="text-sm font-mono">
            <span className="text-neon-pink">{xp}</span>
            <span className="text-neutral-400"> / </span>
            <span className="text-neutral-300">{nextLevelXp}</span>
            <span className="text-xs text-neutral-400 ml-1">XP</span>
          </span>
        </div>
      </div>
      
      <div className="relative pt-1">
        <Progress 
          value={progressPercentage} 
          className="h-3 bg-black/50 border border-neon-purple/20"
        />
        <style dangerouslySetInnerHTML={{
          __html: `
            .radix-progress-indicator {
              background: linear-gradient(90deg, #8B5CF6, #F97316) !important;
              box-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
            }
          `
        }} />
        
        <div className="flex justify-between text-xs text-neutral-400 mt-1">
          <span>Current Level</span>
          <span>Next Level</span>
        </div>
      </div>
    </div>
  );
};

export default LevelProgress;
