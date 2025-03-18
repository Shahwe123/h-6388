
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
  
  const pageCount = Math.ceil(trophies.length / itemsPerPage);
  const displayedTrophies = trophies.slice(
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
    <div className="bg-black/30 rounded-xl p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Trophy Showcase</h2>
        <div className="flex space-x-1 bg-black/30 p-1 rounded-md">
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
      
      {trophies.length === 0 ? (
        <div className="text-center py-12">
          <Trophy className="h-16 w-16 mx-auto mb-4 text-neutral-600" />
          <p className="text-neutral-400">No trophies to display yet.</p>
          <p className="text-sm text-neutral-500 mt-2">Connect your gaming accounts to track achievements</p>
        </div>
      ) : (
        <>
          {currentView === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {displayedTrophies.map(trophy => (
                <AchievementBadge
                  key={trophy.id}
                  type={trophy.type}
                  name={trophy.name}
                  rarity={trophy.rarity}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {displayedTrophies.map(trophy => (
                <div key={trophy.id} className="bg-black/30 p-2 rounded-md flex items-center">
                  <div className="w-12 h-12 flex-shrink-0">
                    <AchievementBadge 
                      type={trophy.type} 
                      name="" 
                      animate={false} 
                    />
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-sm">{trophy.name}</p>
                    <p className="text-xs text-neutral-500">{trophy.game}</p>
                  </div>
                  {trophy.rarity && (
                    <p className="ml-auto text-xs text-neutral-400">{trophy.rarity}</p>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {pageCount > 1 && (
            <div className="flex justify-between mt-4">
              <button 
                onClick={handlePrevPage}
                disabled={currentPage === 0}
                className="flex items-center space-x-1 text-sm disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </button>
              
              <div className="text-xs text-neutral-400">
                Page {currentPage + 1} of {pageCount}
              </div>
              
              <button 
                onClick={handleNextPage}
                disabled={currentPage === pageCount - 1}
                className="flex items-center space-x-1 text-sm disabled:opacity-50"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TrophyCase;
