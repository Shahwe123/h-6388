
import React, { useState } from 'react';
import { Share2, Twitter, MessageCircle, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

type SocialShareProps = {
  username: string;
  stats?: {
    trophies?: number;
    platinums?: number;
    rank?: string;
  };
};

export const SocialShare: React.FC<SocialShareProps> = ({ 
  username,
  stats = { trophies: 45, platinums: 3, rank: 'Trophy Hunter' }
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const generateMessage = () => {
    return `Check out my gaming profile on GameGlory! I've unlocked ${stats.trophies} trophies including ${stats.platinums} platinums. Try to beat my record! #GameGlory #GamingAchievements`;
  };

  const handleShare = (platform: string) => {
    const message = generateMessage();
    
    // This would actually link to the specific social platform
    // For now, just show a toast
    toast({
      title: `Shared to ${platform}`,
      description: "Your achievement has been shared!",
    });
    
    setIsOpen(false);
  };

  return (
    <div className="relative z-10">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        size="sm"
        className="bg-black/40 border-neon-purple/30 hover:bg-black/60"
      >
        <Share2 className="h-4 w-4 mr-2" />
        Share Profile
      </Button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-48 bg-black/80 backdrop-blur-lg border border-neon-purple/30 rounded-lg shadow-xl z-20"
          >
            <div className="p-2">
              <button
                onClick={() => handleShare('Twitter')}
                className="flex items-center w-full p-2 hover:bg-neon-purple/20 rounded transition-colors"
              >
                <Twitter className="h-4 w-4 mr-2 text-blue-400" />
                <span className="text-sm">Twitter</span>
              </button>
              <button
                onClick={() => handleShare('Discord')}
                className="flex items-center w-full p-2 hover:bg-neon-purple/20 rounded transition-colors"
              >
                <MessageCircle className="h-4 w-4 mr-2 text-indigo-400" />
                <span className="text-sm">Discord</span>
              </button>
              <button
                onClick={() => handleShare('Reddit')}
                className="flex items-center w-full p-2 hover:bg-neon-purple/20 rounded transition-colors"
              >
                <MessageSquare className="h-4 w-4 mr-2 text-orange-400" />
                <span className="text-sm">Reddit</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SocialShare;
