
import { Progress } from '@/components/ui/progress';
import { Trophy, Clock } from 'lucide-react';
import { GamePlatform } from '@/types/game';

interface GameComparisonProps {
  gamePlatform: GamePlatform;
  userData: any;
  friendData: any;
}

const GameComparison = ({ gamePlatform, userData, friendData }: GameComparisonProps) => {
  // Use the game reference if available, otherwise fall back to direct properties
  const game = gamePlatform.game || { name: 'Unknown Game' };

  // Determine who's leading in each category
  const trophyLeader = gamePlatform.userTrophies > gamePlatform.friendTrophies ? 'user' : 
                       gamePlatform.userTrophies < gamePlatform.friendTrophies ? 'friend' : 'tie';
                       
  const playtimeLeader = gamePlatform.userPlaytime > gamePlatform.friendPlaytime ? 'user' : 
                         gamePlatform.userPlaytime < gamePlatform.friendPlaytime ? 'friend' : 'tie';
                         
  const completionLeader = gamePlatform.userCompletion > gamePlatform.friendCompletion ? 'user' : 
                          gamePlatform.userCompletion < gamePlatform.friendCompletion ? 'friend' : 'tie';
  
  return (
    <div className="bg-black/30 rounded-lg p-4">
      <h3 className="text-lg font-bold mb-4">{game.name}</h3>
      
      <div className="space-y-4">
        {/* Trophy comparison */}
        <div className="flex items-center">
          <Trophy className="h-5 w-5 text-yellow-400 mr-2" />
          <span className="text-sm mr-3">Trophies:</span>
          
          <div className="flex-1 grid grid-cols-5 gap-2 items-center">
            <div className={`text-right font-bold ${trophyLeader === 'user' ? 'text-green-500' : ''}`}>
              {gamePlatform.userTrophies}
            </div>
            
            <div className="col-span-3">
              <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
                <span>{userData.username}</span>
                <span>{friendData.username}</span>
              </div>
              <div className="flex h-2 rounded-full overflow-hidden bg-black/40">
                <div 
                  className="bg-neon-purple"
                  style={{ width: `${(gamePlatform.userTrophies / (gamePlatform.userTrophies + gamePlatform.friendTrophies)) * 100}%` }}
                ></div>
                <div 
                  className="bg-neon-blue"
                  style={{ width: `${(gamePlatform.friendTrophies / (gamePlatform.userTrophies + gamePlatform.friendTrophies)) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className={`text-left font-bold ${trophyLeader === 'friend' ? 'text-green-500' : ''}`}>
              {gamePlatform.friendTrophies}
            </div>
          </div>
        </div>
        
        {/* Playtime comparison */}
        <div className="flex items-center">
          <Clock className="h-5 w-5 text-green-500 mr-2" />
          <span className="text-sm mr-3">Playtime:</span>
          
          <div className="flex-1 grid grid-cols-5 gap-2 items-center">
            <div className={`text-right font-bold ${playtimeLeader === 'user' ? 'text-green-500' : ''}`}>
              {gamePlatform.userPlaytime} hrs
            </div>
            
            <div className="col-span-3">
              <div className="h-2 rounded-full overflow-hidden bg-black/40 flex">
                <div 
                  className="bg-neon-purple"
                  style={{ width: `${(gamePlatform.userPlaytime / (gamePlatform.userPlaytime + gamePlatform.friendPlaytime)) * 100}%` }}
                ></div>
                <div 
                  className="bg-neon-blue"
                  style={{ width: `${(gamePlatform.friendPlaytime / (gamePlatform.userPlaytime + gamePlatform.friendPlaytime)) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className={`text-left font-bold ${playtimeLeader === 'friend' ? 'text-green-500' : ''}`}>
              {gamePlatform.friendPlaytime} hrs
            </div>
          </div>
        </div>
        
        {/* Completion percentage */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm">Your completion</span>
              <span className={`text-sm font-medium ${completionLeader === 'user' ? 'text-green-500' : ''}`}>
                {gamePlatform.userCompletion}%
              </span>
            </div>
            <Progress value={gamePlatform.userCompletion} className="h-2 bg-black/40" />
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm">Friend's completion</span>
              <span className={`text-sm font-medium ${completionLeader === 'friend' ? 'text-green-500' : ''}`}>
                {gamePlatform.friendCompletion}%
              </span>
            </div>
            <Progress value={gamePlatform.friendCompletion} className="h-2 bg-black/40" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameComparison;
