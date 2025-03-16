
import React, { useState, useEffect } from 'react';
import { Trophy, Star, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const TrophyUnlockAnimation = () => {
  const [showAnimation, setShowAnimation] = useState(false);
  
  useEffect(() => {
    // Start animation
    setShowAnimation(true);
    
    // Reset animation after it completes
    const timer = setTimeout(() => {
      setShowAnimation(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {showAnimation && (
        <>
          {/* Background glow effect */}
          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.8, scale: 2 }}
            transition={{ duration: 0.5 }}
            className="absolute w-32 h-32 rounded-full bg-neon-purple/30 blur-xl"
          />
          
          {/* Trophy icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ 
              duration: 0.5,
              delay: 0.2,
              type: "spring",
              stiffness: 200
            }}
            className="relative z-10"
          >
            <Trophy className="w-16 h-16 text-neon-gold" />
          </motion.div>
          
          {/* Stars/sparkles effect */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            className="absolute"
          >
            <motion.div 
              animate={{ 
                rotate: 360,
                scale: [1, 1.2, 1]
              }} 
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse" 
              }}
            >
              <Sparkles className="absolute -top-8 -right-10 w-6 h-6 text-neon-pink" />
              <Star className="absolute top-8 -left-12 w-6 h-6 text-neon-gold" />
              <Sparkles className="absolute -bottom-10 right-2 w-6 h-6 text-neon-green" />
              <Star className="absolute -bottom-6 -left-6 w-4 h-4 text-neon-blue" />
              <Sparkles className="absolute -top-10 left-0 w-5 h-5 text-neon-gold" />
            </motion.div>
          </motion.div>
          
          {/* Achievement unlocked text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="absolute -bottom-16 text-center"
          >
            <p className="text-neon-purple font-bold text-lg mb-1">Trophy Unlocked!</p>
            <p className="text-neutral-300 text-sm">Achievement Hunter</p>
          </motion.div>
        </>
      )}
      
      {!showAnimation && (
        <div className="flex flex-col items-center">
          <Trophy className="w-16 h-16 text-neon-purple mb-4 mx-auto" />
          <p className="text-neutral-300">Trophy Animation</p>
          <button 
            onClick={() => setShowAnimation(true)}
            className="mt-2 text-xs px-2 py-1 bg-neon-purple/20 rounded-md text-neon-purple border border-neon-purple/30 hover:bg-neon-purple/30 transition-colors"
          >
            Play Animation
          </button>
        </div>
      )}
    </div>
  );
};

export default TrophyUnlockAnimation;
