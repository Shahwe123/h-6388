
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
import { useSelector } from 'react-redux';
import SocialShare from '@/components/profile/SocialShare';
import { useProfileData } from '@/hooks/useProfileData';
import LinkedAccounts from '@/components/profile/LinkedAccounts';
import BadgeCollection from '@/components/profile/BadgeCollection';
import SEO from "../components/SEO";

/**
 * Profile page component
 * 
 * This component displays a user's gaming profile including achievements,
 * trophies, game collection, and social features
 */
const Profile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [profileExists, setProfileExists] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [showSocialShare, setShowSocialShare] = useState(false);
  const currentUser = useSelector((state: any) => state.user?.userData);
  
  const { 
    profile, 
    loading: profileLoading, 
    friendCount,
    isOwnProfile,
    fetchProfileData
  } = useProfileData(username || null);

  useEffect(() => {
    // Profile existence check is now handled by useProfileData hook
    // Just manage the main loading state here
    setIsLoading(profileLoading);
  }, [profileLoading]);

  // If loading or profile doesn't exist, show appropriate UI
  if (isLoading) {
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

  const seoTitle = username ? `${username}'s Gaming Profile` : "Your Gaming Profile";

  return (
    <div className="min-h-screen bg-primary pb-16">
      <SEO 
        title={seoTitle}
        description="Customize your gaming profile, showcase your trophies, and connect with other gamers."
      />
      <div className="max-w-7xl mx-auto container-padding">
        <ProfileHeader 
          profile={profile}
          isOwnProfile={isOwnProfile}
          onShareClick={() => setShowSocialShare(true)}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-1 space-y-6">
            <ProfileStats 
              trophiesCount={profileStats.trophiesCount}
              platinumCount={profileStats.platinumCount}
              completionPercentage={profileStats.completionPercentage}
              friendCount={profileStats.friendCount}
            />
            
            <LevelProgress 
              level={playerStats.level}
              xp={playerStats.xp}
              nextLevelXp={playerStats.nextLevelXp}
              rank={playerStats.rank}
            />
            
            <BadgeCollection userId={profile.id} />
          </div>
          
          <div className="lg:col-span-2 space-y-8">
            <LinkedAccounts 
              profile={profile}
              isOwnProfile={isOwnProfile}
              hasLinkedAccounts={hasLinkedAccounts}
            />
            
            <TrophyCase trophies={profile?.recentTrophies || []} />
            
            <AchievementHighlights achievements={profile?.achievements || []} />
            
            <GameCollections 
              profile={profile}
              isOwnProfile={isOwnProfile}
              hasLinkedAccounts={hasLinkedAccounts}
            />
          </div>
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
