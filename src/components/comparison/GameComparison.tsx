
import { Progress } from '@/components/ui/progress';
import { Trophy, Clock, Award } from 'lucide-react';

interface GameComparisonProps {
  game: any;
  userData: any;
  friendData: any;
}

const GameComparison = ({ game, userData, friendData }: GameComparisonProps) => {
  // Determine who's leading in each category
  const trophyLeader = game.userTrophies > game.friendTrophies ? 'user' : 
                       game.userTrophies < game.friendTrophies ? 'friend' : 'tie';
                       
  const playtimeLeader = game.userPlaytime > game.friendPlaytime ? 'user' : 
                         game.userPlaytime < game.friendPlaytime ? 'friend' : 'tie';
                         
  const completionLeader = game.userCompletion > game.friendCompletion ? 'user' : 
                          game.userCompletion < game.friendCompletion ? 'friend' : 'tie';
  
  // Use normalized scores when available
  const userNormalizedScore = game.userNormalizedScore || game.userTrophies;
  const friendNormalizedScore = game.friendNormalizedScore || game.friendTrophies;
  const normalizedLeader = userNormalizedScore > friendNormalizedScore ? 'user' :
                          userNormalizedScore < friendNormalizedScore ? 'friend' : 'tie';
  
  // Determine if we should show normalized comparison
  const showNormalizedComparison = game.userNormalizedScore !== undefined && 
                                   game.friendNormalizedScore !== undefined &&
                                   game.platform !== game.friendPlatform;
  
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
              {game.userTrophies}
            </div>
            
            <div className="col-span-3">
              <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
                <span>{userData.username}</span>
                <span>{friendData.username}</span>
              </div>
              <div className="flex h-2 rounded-full overflow-hidden bg-black/40">
                <div 
                  className="bg-neon-purple"
                  style={{ width: `${(game.userTrophies / (game.userTrophies + game.friendTrophies)) * 100}%` }}
                ></div>
                <div 
                  className="bg-neon-blue"
                  style={{ width: `${(game.friendTrophies / (game.userTrophies + game.friendTrophies)) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className={`text-left font-bold ${trophyLeader === 'friend' ? 'text-green-500' : ''}`}>
              {game.friendTrophies}
            </div>
          </div>
        </div>
        
        {/* Normalized score comparison - only show when platforms differ */}
        {showNormalizedComparison && (
          <div className="flex items-center">
            <Award className="h-5 w-5 text-purple-400 mr-2" />
            <span className="text-sm mr-3">Normalized:</span>
            
            <div className="flex-1 grid grid-cols-5 gap-2 items-center">
              <div className={`text-right font-bold ${normalizedLeader === 'user' ? 'text-green-500' : ''}`}>
                {Math.round(userNormalizedScore)}
              </div>
              
              <div className="col-span-3">
                <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
                  <span>{game.platform}</span>
                  <span>{game.friendPlatform}</span>
                </div>
                <div className="flex h-2 rounded-full overflow-hidden bg-black/40">
                  <div 
                    className="bg-neon-pink"
                    style={{ width: `${(userNormalizedScore / (userNormalizedScore + friendNormalizedScore)) * 100}%` }}
                  ></div>
                  <div 
                    className="bg-neon-green"
                    style={{ width: `${(friendNormalizedScore / (userNormalizedScore + friendNormalizedScore)) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className={`text-left font-bold ${normalizedLeader === 'friend' ? 'text-green-500' : ''}`}>
                {Math.round(friendNormalizedScore)}
              </div>
            </div>
          </div>
        )}
        
        {/* Playtime comparison */}
        <div className="flex items-center">
          <Clock className="h-5 w-5 text-green-500 mr-2" />
          <span className="text-sm mr-3">Playtime:</span>
          
          <div className="flex-1 grid grid-cols-5 gap-2 items-center">
            <div className={`text-right font-bold ${playtimeLeader === 'user' ? 'text-green-500' : ''}`}>
              {game.userPlaytime} hrs
            </div>
            
            <div className="col-span-3">
              <div className="h-2 rounded-full overflow-hidden bg-black/40 flex">
                <div 
                  className="bg-neon-purple"
                  style={{ width: `${(game.userPlaytime / (game.userPlaytime + game.friendPlaytime)) * 100}%` }}
                ></div>
                <div 
                  className="bg-neon-blue"
                  style={{ width: `${(game.friendPlaytime / (game.userPlaytime + game.friendPlaytime)) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className={`text-left font-bold ${playtimeLeader === 'friend' ? 'text-green-500' : ''}`}>
              {game.friendPlaytime} hrs
            </div>
          </div>
        </div>
        
        {/* Completion percentage */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm">Your completion</span>
              <span className={`text-sm font-medium ${completionLeader === 'user' ? 'text-green-500' : ''}`}>
                {game.userCompletion}%
              </span>
            </div>
            <Progress value={game.userCompletion} className="h-2 bg-black/40" />
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm">Friend's completion</span>
              <span className={`text-sm font-medium ${completionLeader === 'friend' ? 'text-green-500' : ''}`}>
                {game.friendCompletion}%
              </span>
            </div>
            <Progress value={game.friendCompletion} className="h-2 bg-black/40" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameComparison;
