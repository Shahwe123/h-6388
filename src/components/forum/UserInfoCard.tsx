
import React from 'react';
import { Link } from 'react-router-dom';
import { ForumUser } from '@/types/forum';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { Trophy, Award, UserPlus } from 'lucide-react';

interface UserInfoCardProps {
  user: ForumUser;
  isFriend?: boolean;
  onAddFriend?: (userId: string) => void;
  compact?: boolean;
}

const UserInfoCard: React.FC<UserInfoCardProps> = ({ 
  user, 
  isFriend = false,
  onAddFriend,
  compact = false
}) => {
  const handleAddFriend = () => {
    if (onAddFriend) {
      onAddFriend(user.id);
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Avatar className="h-6 w-6">
          <AvatarImage src={user.avatarUrl} alt={user.username} />
          <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <Link to={`/profile/${user.username}`} className="text-sm font-medium hover:text-neon-blue transition-colors">
          {user.username}
        </Link>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-lg p-4 flex flex-col items-center text-center">
      <Avatar className="h-20 w-20 mb-3">
        <AvatarImage src={user.avatarUrl} alt={user.username} />
        <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      
      <Link to={`/profile/${user.username}`} className="text-lg font-bold hover:text-neon-blue transition-colors">
        {user.username}
      </Link>
      
      {user.rank && (
        <div className="text-sm text-neon-blue mt-1">{user.rank}</div>
      )}
      
      {user.level && (
        <div className="mt-2 bg-gradient-game text-white text-sm px-3 py-1 rounded-full">
          Level {user.level}
        </div>
      )}
      
      <div className="w-full mt-4 grid grid-cols-2 gap-2 text-center">
        {user.trophyCount !== undefined && (
          <div className="flex flex-col items-center">
            <div className="flex items-center text-amber-400">
              <Trophy size={16} className="mr-1" />
              <span className="font-bold">{user.trophyCount}</span>
            </div>
            <span className="text-xs text-gray-400">Trophies</span>
          </div>
        )}
        
        {user.badgeCount !== undefined && (
          <div className="flex flex-col items-center">
            <div className="flex items-center text-neon-purple">
              <Award size={16} className="mr-1" />
              <span className="font-bold">{user.badgeCount}</span>
            </div>
            <span className="text-xs text-gray-400">Badges</span>
          </div>
        )}
      </div>
      
      {user.joinDate && (
        <div className="text-xs text-gray-400 mt-4">
          Member for {formatDistanceToNow(new Date(user.joinDate))}
        </div>
      )}
      
      {onAddFriend && !isFriend && !user.isAdmin && !user.isModerator && (
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-4 w-full"
          onClick={handleAddFriend}
        >
          <UserPlus size={16} className="mr-2" />
          Add Friend
        </Button>
      )}
      
      {isFriend && (
        <div className="text-xs text-green-400 mt-4">
          Friend
        </div>
      )}
    </div>
  );
};

export default UserInfoCard;
