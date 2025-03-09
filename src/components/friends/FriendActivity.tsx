
import { Gamepad2 } from 'lucide-react';

const FriendActivity = () => {
  return (
    <div className="glass-card rounded-xl p-8">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <Gamepad2 className="h-5 w-5 text-neon-pink" />
        Friend Activity
      </h2>
      
      <div className="bg-black/20 rounded-lg p-4 text-center py-8">
        <Gamepad2 className="h-16 w-16 mx-auto opacity-30 mb-4" />
        <h3 className="text-xl font-medium mb-2">No recent activity</h3>
        <p className="text-neutral-400">
          Connect your gaming accounts to track your friends' achievements and stats
        </p>
      </div>
    </div>
  );
};

export default FriendActivity;
