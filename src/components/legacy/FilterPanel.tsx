
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LegacyWallFilter, TrophyFilter } from '@/types/game';

interface FilterPanelProps {
  filters: LegacyWallFilter;
  onFilterChange: (newFilters: Partial<LegacyWallFilter>) => void;
  availableYears: number[];
  availablePlatforms: string[];
  availableGenres: string[];
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFilterChange,
  availableYears,
  availablePlatforms,
  availableGenres
}) => {
  return (
    <Card className="glass-card">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Year</label>
            <select 
              className="w-full p-2 rounded bg-black/20 border border-zinc-800"
              value={filters.year as string}
              onChange={(e) => onFilterChange({year: e.target.value === 'all' ? 'all' : parseInt(e.target.value)})}
            >
              <option value="all">All Years</option>
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Platform</label>
            <select 
              className="w-full p-2 rounded bg-black/20 border border-zinc-800"
              value={filters.platform as string}
              onChange={(e) => onFilterChange({platform: e.target.value})}
            >
              <option value="all">All Platforms</option>
              {availablePlatforms.map(platform => (
                <option key={platform} value={platform}>{platform}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Genre</label>
            <select 
              className="w-full p-2 rounded bg-black/20 border border-zinc-800"
              value={filters.genre as string}
              onChange={(e) => onFilterChange({genre: e.target.value})}
            >
              <option value="all">All Genres</option>
              {availableGenres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Trophy Type</label>
            <select 
              className="w-full p-2 rounded bg-black/20 border border-zinc-800"
              value={filters.type as string}
              onChange={(e) => onFilterChange({type: e.target.value as TrophyFilter})}
            >
              <option value="all">All Types</option>
              <option value="platinum">Platinum</option>
              <option value="gold">Gold</option>
              <option value="silver">Silver</option>
              <option value="bronze">Bronze</option>
              <option value="legacy">Legacy Trophies</option>
              <option value="milestones">Milestones</option>
            </select>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Rarity</label>
            <select 
              className="w-full p-2 rounded bg-black/20 border border-zinc-800"
              value={filters.rarity as string}
              onChange={(e) => onFilterChange({rarity: e.target.value as any})}
            >
              <option value="all">All Rarities</option>
              <option value="common">Common (20%+)</option>
              <option value="rare">Rare (5-20%)</option>
              <option value="ultra-rare">Ultra Rare (&lt;5%)</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => onFilterChange({
                year: 'all',
                platform: 'all',
                genre: 'all',
                type: 'all',
                rarity: 'all',
                milestones: false
              })}
            >
              Reset Filters
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterPanel;
