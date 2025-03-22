
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
  const trophyLeader = (gamePlatform.userTrophies || 0) > (gamePlatform.friendTrophies || 0) ? 'user' : 
                       (gamePlatform.userTrophies || 0) < (gamePlatform.friendTrophies || 0) ? 'friend' : 'tie';
                       
  const playtimeLeader = (gamePlatform.userPlaytime || 0) > (gamePlatform.friendPlaytime || 0) ? 'user' : 
                         (gamePlatform.userPlaytime || 0) < (gamePlatform.friendPlaytime || 0) ? 'friend' : 'tie';
                         
  const completionLeader = (gamePlatform.userCompletion || 0) > (gamePlatform.friendCompletion || 0) ? 'user' : 
                          (gamePlatform.userCompletion || 0) < (gamePlatform.friendCompletion || 0) ? 'friend' : 'tie';
  
  // Default values for safety
  const userTrophies = gamePlatform.userTrophies || 0;
  const friendTrophies = gamePlatform.friendTrophies || 0;
  const userPlaytime = gamePlatform.userPlaytime || 0;
  const friendPlaytime = gamePlatform.friendPlaytime || 0;
  const userCompletion = gamePlatform.userCompletion || 0;
  const friendCompletion = gamePlatform.friendCompletion || 0;
  
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
              {userTrophies}
            </div>
            
            <div className="col-span-3">
              <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
                <span>{userData.username}</span>
                <span>{friendData.username}</span>
              </div>
              <div className="flex h-2 rounded-full overflow-hidden bg-black/40">
                <div 
                  className="bg-neon-purple"
                  style={{ width: `${(userTrophies / (userTrophies + friendTrophies || 1)) * 100}%` }}
                ></div>
                <div 
                  className="bg-neon-blue"
                  style={{ width: `${(friendTrophies / (userTrophies + friendTrophies || 1)) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className={`text-left font-bold ${trophyLeader === 'friend' ? 'text-green-500' : ''}`}>
              {friendTrophies}
            </div>
          </div>
        </div>
        
        {/* Playtime comparison */}
        <div className="flex items-center">
          <Clock className="h-5 w-5 text-green-500 mr-2" />
          <span className="text-sm mr-3">Playtime:</span>
          
          <div className="flex-1 grid grid-cols-5 gap-2 items-center">
            <div className={`text-right font-bold ${playtimeLeader === 'user' ? 'text-green-500' : ''}`}>
              {userPlaytime} hrs
            </div>
            
            <div className="col-span-3">
              <div className="h-2 rounded-full overflow-hidden bg-black/40 flex">
                <div 
                  className="bg-neon-purple"
                  style={{ width: `${(userPlaytime / (userPlaytime + friendPlaytime || 1)) * 100}%` }}
                ></div>
                <div 
                  className="bg-neon-blue"
                  style={{ width: `${(friendPlaytime / (userPlaytime + friendPlaytime || 1)) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className={`text-left font-bold ${playtimeLeader === 'friend' ? 'text-green-500' : ''}`}>
              {friendPlaytime} hrs
            </div>
          </div>
        </div>
        
        {/* Completion percentage */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm">Your completion</span>
              <span className={`text-sm font-medium ${completionLeader === 'user' ? 'text-green-500' : ''}`}>
                {userCompletion}%
              </span>
            </div>
            <Progress value={userCompletion} className="h-2 bg-black/40" />
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm">Friend's completion</span>
              <span className={`text-sm font-medium ${completionLeader === 'friend' ? 'text-green-500' : ''}`}>
                {friendCompletion}%
              </span>
            </div>
            <Progress value={friendCompletion} className="h-2 bg-black/40" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameComparison;
