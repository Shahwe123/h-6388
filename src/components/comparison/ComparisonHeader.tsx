
import { UserCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface ComparisonHeaderProps {
  userData: any;
  friendData: any;
}

const ComparisonHeader = ({ userData, friendData }: ComparisonHeaderProps) => {
  return (
    <div className="glass-card p-6 rounded-xl">
      <h1 className="text-2xl font-bold mb-6">Gaming Stats Comparison</h1>
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full overflow-hidden mb-3 bg-black/30 flex items-center justify-center">
            {userData.avatar_url ? (
              <img 
                src={userData.avatar_url} 
                alt={userData.username} 
                className="w-full h-full object-cover"
              />
            ) : (
              <UserCircle className="w-12 h-12 text-gray-400" />
            )}
          </div>
          <h2 className="text-xl font-bold">{userData.username}</h2>
          <p className="text-sm text-neutral-400">You</p>
        </div>
        
        <div className="py-4 px-8 bg-gradient-to-r from-neon-purple/30 to-neon-blue/30 rounded-full text-center">
          <p className="text-sm uppercase tracking-wider text-neutral-300">VS</p>
        </div>
        
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full overflow-hidden mb-3 bg-black/30 flex items-center justify-center">
            {friendData.avatar_url ? (
              <img 
                src={friendData.avatar_url} 
                alt={friendData.username} 
                className="w-full h-full object-cover"
              />
            ) : (
              <UserCircle className="w-12 h-12 text-gray-400" />
            )}
          </div>
          <h2 className="text-xl font-bold">{friendData.username}</h2>
          <p className="text-sm text-neutral-400">Friend</p>
        </div>
      </div>
    </div>
  );
};

export default ComparisonHeader;
