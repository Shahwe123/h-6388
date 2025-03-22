
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Badge from '@/components/profile/Badge';
import { Badge as BadgeType } from '@/types/badge';
import { motion } from 'framer-motion';
import { getUserBadges } from '@/data/badgeData';

interface BadgeCollectionProps {
  userId: string;
}

const BadgeCollection = ({ userId }: BadgeCollectionProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<BadgeType | null>(null);
  
  const { earned, inProgress } = getUserBadges(userId);
  
  // Show only the first 4 badges in the preview
  const previewBadges = earned.slice(0, 4);
  
  const handleBadgeClick = (badge: BadgeType) => {
    setSelectedBadge(badge);
    setIsDialogOpen(true);
  };
  
  return (
    <div className="glass-card rounded-xl p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Badge Collection</h2>
        <button 
          onClick={() => setIsDialogOpen(true)}
          className="text-sm text-neon-purple hover:text-neon-blue transition-colors"
        >
          See All
        </button>
      </div>

      {previewBadges.length > 0 ? (
        <div className="grid grid-cols-4 gap-3">
          {previewBadges.map((badge) => (
            <Badge
              key={badge.id}
              name={badge.name}
              type={badge.type}
              icon={badge.icon}
              earnedAt={badge.earnedAt}
              size="md"
              onClick={() => handleBadgeClick(badge)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-gray-400">
          No badges earned yet. Complete achievements to earn badges!
        </div>
      )}

      {/* Full badge collection dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-black/90 border-neon-purple max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">Badge Collection</DialogTitle>
            <DialogDescription className="text-gray-300">
              View all your earned and in-progress badges
            </DialogDescription>
          </DialogHeader>

          {selectedBadge ? (
            // Single badge detail view
            <div className="flex flex-col md:flex-row gap-6 items-center p-4">
              <Badge
                name={selectedBadge.name}
                type={selectedBadge.type}
                icon={selectedBadge.icon}
                earnedAt={selectedBadge.earnedAt}
                progress={selectedBadge.progress}
                requirement={selectedBadge.requirement}
                size="lg"
              />
              
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">{selectedBadge.name}</h3>
                <p className="text-gray-300 mb-4">{selectedBadge.description}</p>
                
                {selectedBadge.earnedAt && (
                  <p className="text-sm text-gray-400">
                    Earned on {new Date(selectedBadge.earnedAt).toLocaleDateString()}
                  </p>
                )}
                
                {selectedBadge.progress !== undefined && selectedBadge.requirement !== undefined && (
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{selectedBadge.progress}/{selectedBadge.requirement}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                      <div 
                        className="bg-neon-purple h-2.5 rounded-full" 
                        style={{ width: `${(selectedBadge.progress / selectedBadge.requirement) * 100}%` }} 
                      />
                    </div>
                  </div>
                )}
                
                <button 
                  onClick={() => setSelectedBadge(null)}
                  className="mt-6 text-neon-blue hover:text-neon-purple"
                >
                  Back to all badges
                </button>
              </div>
            </div>
          ) : (
            // All badges view
            <>
              {earned.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">Earned Badges</h3>
                  <motion.div 
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ staggerChildren: 0.1 }}
                  >
                    {earned.map((badge) => (
                      <motion.div
                        key={badge.id}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Badge
                          name={badge.name}
                          type={badge.type}
                          icon={badge.icon}
                          earnedAt={badge.earnedAt}
                          onClick={() => setSelectedBadge(badge)}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              )}
              
              {inProgress.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">In Progress</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {inProgress.map((badge) => (
                      <Badge
                        key={badge.id}
                        name={badge.name}
                        type={badge.type}
                        icon={badge.icon}
                        progress={badge.progress}
                        requirement={badge.requirement}
                        onClick={() => setSelectedBadge(badge)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BadgeCollection;
