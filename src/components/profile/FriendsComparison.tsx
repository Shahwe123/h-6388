
import { Users, UserCircle, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import RankBadge from '@/components/profile/RankBadge';
import { mockFriendsForComparison } from '@/data/profileData';
import { useNavigate } from 'react-router-dom';

interface FriendsComparisonProps {
  friendCount: number;
  isOwnProfile: boolean;
}

const FriendsComparison = ({ friendCount, isOwnProfile }: FriendsComparisonProps) => {
  const navigate = useNavigate();
  
  if (!isOwnProfile) return null;
  
  const handleCompareClick = (friendId: string) => {
    // Make sure we're navigating to the correct path
    console.log(`Navigating to comparison with friend: ${friendId}`);
    navigate(`/friends/compare/${friendId}`);
  };
  
  return (
    <div className="glass-card rounded-xl p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Compare with Friends</h2>
        <Button
          variant="outline"
          size="sm"
          className="bg-black/40 border-neon-purple/30 hover:bg-black/60"
          onClick={() => navigate('/friends')}
        >
          <Users className="h-4 w-4 mr-2" />
          View All
        </Button>
      </div>

      {friendCount > 0 ? (
        <div className="space-y-4">
          <p className="text-sm text-neutral-400">
            You have 13 more Platinum trophies than your friends on average!
          </p>

          {/* Mock friends comparison cards */}
          <div className="space-y-3">
            {mockFriendsForComparison.map(friend => (
              <div key={friend.id} className="bg-black/30 p-4 rounded-lg">
                <div className="mb-3 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-700 rounded-full overflow-hidden flex items-center justify-center">
                      {friend.avatar_url ? (
                        <img src={friend.avatar_url} alt={friend.username} className="w-full h-full object-cover" />
                      ) : (
                        <UserCircle className="w-6 h-6 text-neutral-400" />
                      )}
                    </div>
                    <span className="ml-2 font-medium">{friend.username}</span>
                  </div>
                  <RankBadge rank="Trophy Hunter" />
                </div>

                <div className="grid grid-cols-3 gap-4 text-center text-sm">
                  <div>
                    <div className="font-bold">{friend.trophies}</div>
                    <div className="text-xs text-neutral-500">Trophies</div>
                  </div>
                  <div>
                    <div className="font-bold">{friend.platinums}</div>
                    <div className="text-xs text-neutral-500">Platinums</div>
                  </div>
                  <div>
                    <div className="font-bold text-green-500">{friend.comparison}</div>
                    <div className="text-xs text-neutral-500">Your Lead</div>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-4 bg-black/30 hover:bg-black/60"
                  onClick={() => handleCompareClick(friend.id)}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Compare Stats
                </Button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-neutral-400 text-center py-8">
          <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No friends to compare with</p>
          <p className="text-sm mt-1">Add friends to compare your achievements</p>
        </div>
      )}
    </div>
  );
};

export default FriendsComparison;
