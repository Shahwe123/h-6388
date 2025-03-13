
import { Gamepad2, Trophy } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface GameActivity {
  username: string;
  avatarUrl: string | null;
  gameName: string;
  achievement?: string;
  timestamp: string;
}

const FriendActivity = () => {
  const [activities, setActivities] = useState<GameActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        setLoading(true);
        
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setLoading(false);
          return;
        }
        
        // This would be replaced with actual friend activity data in the future
        // For now, we'll just set loading to false
        setLoading(false);
      } catch (error) {
        console.error('Error fetching friend activity:', error);
        toast({
          title: 'Error',
          description: 'Failed to load friend activity',
          variant: 'destructive',
        });
        setLoading(false);
      }
    };
    
    fetchRecentActivity();
  }, [toast]);

  return (
    <div className="glass-card rounded-xl p-8">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <Gamepad2 className="h-5 w-5 text-neon-pink" />
        Friend Activity
      </h2>
      
      {loading ? (
        <div className="bg-black/20 rounded-lg p-4 text-center py-8">
          <div className="w-10 h-10 border-4 border-neon-purple border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-400">Loading friend activity...</p>
        </div>
      ) : activities.length > 0 ? (
        <div className="space-y-3">
          {activities.map((activity, index) => (
            <div key={index} className="bg-black/20 rounded-lg p-3 flex items-center">
              <div className="w-10 h-10 bg-black/50 rounded-full overflow-hidden flex-shrink-0">
                {activity.avatarUrl ? (
                  <img src={activity.avatarUrl} alt={activity.username} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-500">
                    {activity.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              
              <div className="ml-3 flex-1 overflow-hidden">
                <p className="text-sm font-medium truncate">
                  <span className="text-neon-blue">{activity.username}</span> {' '}
                  {activity.achievement ? (
                    <span>unlocked <Trophy className="inline h-3 w-3 text-yellow-400" /> <span className="text-yellow-400">{activity.achievement}</span> in</span>
                  ) : (
                    <span>played</span>
                  )}
                  {' '}
                  <span className="text-white">{activity.gameName}</span>
                </p>
                <p className="text-xs text-neutral-500">{activity.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-black/20 rounded-lg p-4 text-center py-8">
          <Gamepad2 className="h-16 w-16 mx-auto opacity-30 mb-4" />
          <h3 className="text-xl font-medium mb-2">No recent activity</h3>
          <p className="text-neutral-400">
            Connect your gaming accounts to track your friends' achievements and stats
          </p>
        </div>
      )}
    </div>
  );
};

export default FriendActivity;
