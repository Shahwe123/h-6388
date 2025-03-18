
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import ProfileLoading from '@/components/profile/ProfileLoading';
import ProfileNotFound from '@/components/profile/ProfileNotFound';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileStats from '@/components/profile/ProfileStats';
import LevelProgress from '@/components/profile/LevelProgress';
import TrophyCase from '@/components/profile/TrophyCase';
import AchievementHighlights from '@/components/profile/AchievementHighlights';
import GameCollections from '@/components/profile/GameCollections';
import FriendsComparison from '@/components/profile/FriendsComparison';
import { useSelector } from 'react-redux';
import SocialShare from '@/components/profile/SocialShare';
import { useProfileData } from '@/hooks/useProfileData';
import LinkedAccounts from '@/components/profile/LinkedAccounts';
import AchievementStats from '@/components/profile/AchievementStats';
import RecentActivityChart from '@/components/profile/RecentActivityChart';

/**
 * Profile page component
 * 
 * This component displays a user's gaming profile including achievements,
 * trophies, game collection, and social features in a futuristic UI
 */
const Profile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [showSocialShare, setShowSocialShare] = useState(false);
  const currentUser = useSelector((state: any) => state.user?.userData);
  
  const { 
    profile, 
    loading: profileLoading, 
    friendCount,
    isOwnProfile,
    fetchProfileData
  } = useProfileData(username || null);

  // If loading or profile doesn't exist, show appropriate UI
  if (profileLoading) {
    return <ProfileLoading />;
  }
  
  if (!profile) {
    return <ProfileNotFound username={username || 'Unknown'} />;
  }

  // Determine if this profile has any linked accounts
  const hasLinkedAccounts = !!(profile?.steam_id || profile?.playstation_username || profile?.xbox_gamertag);

  // Mock stats for the profile
  const profileStats = {
    trophiesCount: 156,
    platinumCount: 8,
    completionPercentage: 72,
    friendCount: friendCount
  };

  // Mock player stats for level progress
  const playerStats = {
    level: 32,
    xp: 7845,
    nextLevelXp: 10000,
    rank: 'Trophy Hunter'
  };

  return (
    <div className="min-h-screen bg-primary pb-16">
      <div className="max-w-7xl mx-auto container-padding">
        {/* Header Section with user avatar and info */}
        <div className="glass-card rounded-xl border border-neon-purple/30 backdrop-blur-md overflow-hidden mb-6">
          <ProfileHeader 
            profile={profile}
            isOwnProfile={isOwnProfile}
            onShareClick={() => setShowSocialShare(true)}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Left Column - User Stats and Platform Icons */}
          <div className="space-y-4">
            <div className="glass-card rounded-xl border border-neon-purple/30 p-4">
              <h2 className="text-xl font-bold mb-4 tracking-wider uppercase text-white/90 border-b border-neon-purple/20 pb-2">
                USER STATS
              </h2>
              <ProfileStats 
                trophiesCount={profileStats.trophiesCount}
                platinumCount={profileStats.platinumCount}
                completionPercentage={profileStats.completionPercentage}
                friendCount={profileStats.friendCount}
              />
            </div>
            
            <div className="glass-card rounded-xl border border-neon-purple/30 p-4">
              <h2 className="text-xl font-bold mb-4 tracking-wider uppercase text-white/90 border-b border-neon-purple/20 pb-2">
                LINKED PLATFORMS
              </h2>
              <LinkedAccounts 
                profile={profile}
                isOwnProfile={isOwnProfile}
                hasLinkedAccounts={hasLinkedAccounts}
              />
            </div>
          </div>
          
          {/* Middle Column - Trophy Case and Achievement Highlights */}
          <div className="space-y-4 md:col-span-2">
            <div className="glass-card rounded-xl border border-neon-purple/30 p-4">
              <h2 className="text-xl font-bold mb-4 tracking-wider uppercase text-white/90 border-b border-neon-purple/20 pb-2">
                ACHIEVEMENT TRACKER
              </h2>
              <div className="mb-4">
                <LevelProgress 
                  level={playerStats.level}
                  xp={playerStats.xp}
                  nextLevelXp={playerStats.nextLevelXp}
                  rank={playerStats.rank}
                />
              </div>
              <TrophyCase trophies={profile?.recentTrophies || []} />
            </div>
            
            <div className="glass-card rounded-xl border border-neon-purple/30 p-4">
              <h2 className="text-xl font-bold mb-4 tracking-wider uppercase text-white/90 border-b border-neon-purple/20 pb-2">
                RECENT ACHIEVEMENTS
              </h2>
              <RecentActivityChart />
            </div>
            
            <div className="glass-card rounded-xl border border-neon-purple/30 p-4">
              <h2 className="text-xl font-bold mb-4 tracking-wider uppercase text-white/90 border-b border-neon-purple/20 pb-2">
                PLATFORM ACHIEVEMENTS
              </h2>
              <AchievementStats profile={profile} />
            </div>
          </div>
        </div>
        
        <div className="mt-6 glass-card rounded-xl border border-neon-purple/30 p-4">
          <h2 className="text-xl font-bold mb-4 tracking-wider uppercase text-white/90 border-b border-neon-purple/20 pb-2">
            GAME COLLECTIONS
          </h2>
          <GameCollections 
            profile={profile}
            isOwnProfile={isOwnProfile}
            hasLinkedAccounts={hasLinkedAccounts}
          />
        </div>
        
        <div className="mt-6 glass-card rounded-xl border border-neon-purple/30 p-4">
          <h2 className="text-xl font-bold mb-4 tracking-wider uppercase text-white/90 border-b border-neon-purple/20 pb-2">
            FRIENDS COMPARISON
          </h2>
          <FriendsComparison 
            friendCount={friendCount}
            isOwnProfile={isOwnProfile} 
          />
        </div>
      </div>
      
      {showSocialShare && (
        <SocialShare 
          username={username || profile.username || ''} 
          onClose={() => setShowSocialShare(false)} 
        />
      )}
    </div>
  );
};

export default Profile;
