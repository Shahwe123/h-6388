
import React from 'react';
import { motion } from 'framer-motion';
import { Game, GameTrophy } from '@/types/game';
import { format } from 'date-fns';
import { Trophy } from 'lucide-react';

interface YearTimelineProps {
  trophies: { trophy: GameTrophy; game: Game }[];
}

const YearTimeline: React.FC<YearTimelineProps> = ({ trophies }) => {
  // Group the trophies by year
  const groupedTrophies = React.useMemo(() => {
    const grouped: Record<number, { trophy: GameTrophy; game: Game }[]> = {};
    
    // Sort by date first
    const sortedTrophies = [...trophies].sort((a, b) => {
      const dateA = a.trophy.achievedDate ? new Date(a.trophy.achievedDate).getTime() : 0;
      const dateB = b.trophy.achievedDate ? new Date(b.trophy.achievedDate).getTime() : 0;
      return dateA - dateB;
    });
    
    sortedTrophies.forEach(item => {
      if (!item.trophy.achievedDate) return;
      
      const year = new Date(item.trophy.achievedDate).getFullYear();
      
      if (!grouped[year]) {
        grouped[year] = [];
      }
      
      grouped[year].push(item);
    });
    
    return grouped;
  }, [trophies]);
  
  // Get an array of years
  const years = Object.keys(groupedTrophies)
    .map(Number)
    .sort((a, b) => a - b);
  
  if (years.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-400">No platinum trophies with dates found.</p>
      </div>
    );
  }
  
  return (
    <div className="relative pt-8">
      {/* Timeline line */}
      <div className="absolute top-0 bottom-0 left-4 md:left-1/2 w-0.5 bg-gradient-to-b from-neon-purple to-neon-blue" />
      
      {years.map((year, yearIndex) => (
        <div key={year} className="mb-10">
          {/* Year marker */}
          <div className="relative flex items-center justify-center mb-6">
            <div className="absolute z-10 left-4 md:left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full bg-neon-purple flex items-center justify-center">
              <span className="text-xs font-bold">{year}</span>
            </div>
            <div className="ml-16 md:ml-0 md:absolute md:left-1/2 md:transform md:translate-x-8">
              <span className="text-xl font-bold">{year}</span>
              <span className="text-zinc-400 ml-2">({groupedTrophies[year].length} platinums)</span>
            </div>
          </div>
          
          {/* Trophies for this year */}
          <div className="space-y-6 ml-8 md:ml-0">
            {groupedTrophies[year].map((item, index) => (
              <motion.div 
                key={`${item.trophy.id}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className={`relative flex flex-col md:flex-row md:items-center ${
                  index % 2 === 0 ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Connector to main timeline */}
                <div className={`absolute left-[-16px] top-[20px] w-4 h-0.5 bg-neon-purple md:left-auto md:top-1/2 md:transform md:-translate-y-1/2 ${
                  index % 2 === 0 ? 'md:right-1/2' : 'md:left-1/2'
                }`} />
                
                {/* Trophy dot on timeline */}
                <div className={`absolute left-[-20px] top-[20px] w-2 h-2 rounded-full bg-white md:left-1/2 md:top-1/2 md:transform md:-translate-x-1/2 md:-translate-y-1/2`} />
                
                {/* Content box */}
                <div className={`bg-black/30 rounded-lg p-4 w-full md:w-[45%] ${
                  index % 2 === 0 ? 'md:text-right' : ''
                }`}>
                  <div className={`flex items-center gap-3 ${
                    index % 2 === 0 ? 'md:flex-row-reverse md:justify-start' : ''
                  }`}>
                    {item.trophy.image ? (
                      <img 
                        src={item.trophy.image} 
                        alt={item.trophy.name} 
                        className="w-10 h-10 object-contain"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-purple-900/50 rounded-full flex items-center justify-center">
                        <Trophy className="w-5 h-5 text-purple-300" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold">{item.trophy.name}</h3>
                      <p className="text-sm text-zinc-400">{item.game.name}</p>
                    </div>
                  </div>
                  
                  <div className={`mt-3 flex gap-2 text-xs text-zinc-500 ${
                    index % 2 === 0 ? 'md:justify-end' : ''
                  }`}>
                    {item.trophy.achievedDate && (
                      <span>{format(new Date(item.trophy.achievedDate), 'MMM d, yyyy')}</span>
                    )}
                    <span>·</span>
                    <span>{item.trophy.rarityPercentage}% - {item.trophy.rarity}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default YearTimeline;
