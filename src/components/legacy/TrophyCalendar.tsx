import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, getDay } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Trophy } from 'lucide-react';
import { Calendar } from "@/components/ui/calendar";
import { Button } from '@/components/ui/button';
import { Game, GameTrophy } from '@/types/game';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import TrophyCard from './TrophyCard';
import { useToast } from '@/hooks/use-toast';

interface TrophyCalendarProps {
  trophies: { trophy: GameTrophy; game: Game }[];
}

const TrophyCalendar: React.FC<TrophyCalendarProps> = ({ trophies }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [calendarOpen, setCalendarOpen] = useState(false);
  const { toast } = useToast();

  // Group trophies by date
  const trophiesByDate = React.useMemo(() => {
    const grouped: Record<string, { trophy: GameTrophy; game: Game }[]> = {};
    
    trophies.forEach(item => {
      if (!item.trophy.achievedDate) return;
      
      const dateStr = format(new Date(item.trophy.achievedDate), 'yyyy-MM-dd');
      
      if (!grouped[dateStr]) {
        grouped[dateStr] = [];
      }
      
      grouped[dateStr].push(item);
    });
    
    return grouped;
  }, [trophies]);

  // Get trophies for the selected date
  const selectedDateTrophies = React.useMemo(() => {
    if (!selectedDate) return [];
    
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    return trophiesByDate[dateStr] || [];
  }, [selectedDate, trophiesByDate]);

  // Get all days in the current month with trophy counts
  const daysWithCounts = React.useMemo(() => {
    const days = eachDayOfInterval({
      start: startOfMonth(currentMonth),
      end: endOfMonth(currentMonth)
    });

    return days.map(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const count = trophiesByDate[dateStr]?.length || 0;
      return { date: day, count };
    });
  }, [currentMonth, trophiesByDate]);

  // Navigate between months
  const previousMonth = () => {
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setCurrentMonth(prevMonth);
  };

  const nextMonth = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCurrentMonth(nextMonth);
  };

  // Event handlers for TrophyCard
  const handleTrophyClick = (trophy: GameTrophy, game: Game) => {
    toast({
      title: trophy.name,
      description: `From ${game.name}`,
    });
  };

  const handleShareTrophy = (trophy: GameTrophy, game: Game) => {
    toast({
      title: "Sharing Trophy",
      description: `Sharing ${trophy.name} from ${game.name}`,
    });
  };

  const handlePinTrophy = (trophy: GameTrophy, game: Game) => {
    toast({
      title: trophy.isPinned ? "Trophy Unpinned" : "Trophy Pinned",
      description: `${trophy.name} from ${game.name} has been ${trophy.isPinned ? 'removed from' : 'added to'} your pinned trophies`,
    });
  };

  // Custom day renderer for the Calendar component
  const renderDay = (day: Date) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    const trophyCount = trophiesByDate[dateStr]?.length || 0;
    
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <span>{format(day, 'd')}</span>
        {trophyCount > 0 && (
          <div className="absolute bottom-0 right-0 w-5 h-5 bg-neon-purple rounded-full flex items-center justify-center text-xs">
            {trophyCount}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Month navigation and date picker */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={previousMonth}
            className="mr-2"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-2xl font-bold">{format(currentMonth, 'MMMM yyyy')}</h2>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={nextMonth}
            className="ml-2"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="w-auto gap-2"
            >
              <CalendarIcon className="h-4 w-4" />
              <span>{selectedDate ? format(selectedDate, 'PPP') : 'Pick a date'}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                setSelectedDate(date || new Date());
                setCalendarOpen(false);
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Calendar grid */}
      <div className="bg-black/20 rounded-lg p-6">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center font-medium text-zinc-400 py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: getDay(startOfMonth(currentMonth)) }).map((_, index) => (
            <div key={`empty-start-${index}`} className="h-20 bg-black/10 rounded-md"></div>
          ))}

          {daysWithCounts.map(({ date, count }) => {
            const isSelected = selectedDate && isSameDay(date, selectedDate);
            const isToday = isSameDay(date, new Date());
            
            return (
              <div 
                key={date.toString()}
                onClick={() => setSelectedDate(date)}
                className={`h-20 p-2 rounded-md cursor-pointer transition-colors relative
                  ${isSelected ? 'bg-neon-purple/20 border border-neon-purple' : 'bg-black/30 hover:bg-black/40'} 
                  ${isToday ? 'ring-2 ring-neon-blue' : ''}
                `}
              >
                <div className="flex justify-between items-start">
                  <span className={`text-sm font-medium ${isSelected ? 'text-white' : ''}`}>
                    {format(date, 'd')}
                  </span>
                  {count > 0 && (
                    <div className="bg-neon-purple rounded-full w-6 h-6 flex items-center justify-center">
                      <span className="text-xs">{count}</span>
                    </div>
                  )}
                </div>

                {count > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {count <= 3 ? (
                      Array.from({ length: count }).map((_, i) => (
                        <Trophy key={i} className="h-3 w-3 text-neon-purple" />
                      ))
                    ) : (
                      <div className="text-xs text-neon-purple">{count} trophies</div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {Array.from({ length: 6 - getDay(endOfMonth(currentMonth)) }).map((_, index) => (
            <div key={`empty-end-${index}`} className="h-20 bg-black/10 rounded-md"></div>
          ))}
        </div>
      </div>

      {/* Trophy list for selected date */}
      <div>
        <h3 className="text-xl font-bold mb-4">
          Trophies earned on {format(selectedDate, 'MMMM d, yyyy')}
        </h3>
        
        {selectedDateTrophies.length === 0 ? (
          <div className="text-center py-12 bg-black/20 rounded-lg">
            <Trophy className="h-16 w-16 mx-auto mb-4 text-neutral-600" />
            <h3 className="text-xl font-bold">No Trophies Earned</h3>
            <p className="text-zinc-400 mt-2">
              You didn't earn any trophies on this date.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {selectedDateTrophies.map(({ trophy, game }, index) => (
              <TrophyCard 
                key={`${trophy.id}-${game.id}`}
                trophy={trophy}
                game={game}
                onClick={() => handleTrophyClick(trophy, game)}
                onShare={() => handleShareTrophy(trophy, game)}
                onPin={() => handlePinTrophy(trophy, game)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrophyCalendar;
