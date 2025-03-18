
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, ChevronLeft, ChevronRight, Layout, Table2 } from 'lucide-react';
import AchievementBadge from './AchievementBadge';

type Trophy = {
  id: string;
  name: string;
  type: 'platinum' | 'gold' | 'silver' | 'bronze' | 'ultra-rare';
  game: string;
  rarity?: string;
  image?: string;
};

type TrophyCaseProps = {
  trophies: Trophy[];
};

export const TrophyCase: React.FC<TrophyCaseProps> = ({ trophies }) => {
  const [currentView, setCurrentView] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6;
  
  // If no trophies provided, show mock data
  const mockTrophies: Trophy[] = [
    { id: '1', name: 'Platinum Master', type: 'platinum', game: 'Ghost of Tsushima', rarity: '0.8%' },
    { id: '2', name: 'Golden Victory', type: 'gold', game: 'Elden Ring', rarity: '5.2%' },
    { id: '3', name: 'Silver Lining', type: 'silver', game: 'Spider-Man', rarity: '12.6%' },
    { id: '4', name: 'Bronze Beginner', type: 'bronze', game: 'God of War', rarity: '45.3%' },
    { id: '5', name: 'Ultra Rare Find', type: 'ultra-rare', game: 'Bloodborne', rarity: '0.1%' },
    { id: '6', name: 'Legendary Champion', type: 'platinum', game: 'Sekiro', rarity: '1.3%' },
  ];
  
  const displayTrophies = trophies.length > 0 ? trophies : mockTrophies;
  
  const pageCount = Math.ceil(displayTrophies.length / itemsPerPage);
  const displayedTrophies = displayTrophies.slice(
    currentPage * itemsPerPage, 
    (currentPage + 1) * itemsPerPage
  );
  
  const handleNextPage = () => {
    if (currentPage < pageCount - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };
  
  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };
  
  return (
    <div className="bg-black/40 rounded-xl p-4 mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-neon-purple">Trophy Showcase</h3>
        <div className="flex space-x-1 bg-black/40 p-1 rounded-md">
          <button 
            onClick={() => setCurrentView('grid')}
            className={`p-1 rounded ${currentView === 'grid' ? 'bg-neon-purple/30' : ''}`}
          >
            <Layout className="h-4 w-4" />
          </button>
          <button 
            onClick={() => setCurrentView('list')}
            className={`p-1 rounded ${currentView === 'list' ? 'bg-neon-purple/30' : ''}`}
          >
            <Table2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {currentView === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {displayedTrophies.map(trophy => (
            <motion.div
              key={trophy.id}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <AchievementBadge
                type={trophy.type}
                name={trophy.name}
                rarity={trophy.rarity}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {displayedTrophies.map(trophy => (
            <motion.div 
              key={trophy.id} 
              className="bg-black/50 p-2 rounded-md flex items-center border border-neon-purple/20"
              whileHover={{ 
                backgroundColor: 'rgba(139, 92, 246, 0.2)', 
                borderColor: 'rgba(139, 92, 246, 0.5)' 
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-12 h-12 flex-shrink-0">
                <AchievementBadge 
                  type={trophy.type} 
                  name="" 
                  animate={false} 
                />
              </div>
              <div className="ml-3">
                <p className="font-medium text-white">{trophy.name}</p>
                <p className="text-xs text-neutral-400">{trophy.game}</p>
              </div>
              {trophy.rarity && (
                <div className="ml-auto bg-black/50 px-2 py-1 rounded text-xs">
                  <span className="text-neon-purple font-mono">{trophy.rarity}</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
      
      {pageCount > 1 && (
        <div className="flex justify-between mt-4 text-neon-purple">
          <button 
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            className="flex items-center space-x-1 text-sm disabled:opacity-50 transition-colors hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </button>
          
          <div className="text-xs text-neutral-400 bg-black/30 px-2 py-1 rounded-md">
            Page {currentPage + 1} of {pageCount}
          </div>
          
          <button 
            onClick={handleNextPage}
            disabled={currentPage === pageCount - 1}
            className="flex items-center space-x-1 text-sm disabled:opacity-50 transition-colors hover:text-white"
          >
            <span>Next</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default TrophyCase;
