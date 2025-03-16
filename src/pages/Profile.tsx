
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams } from 'react-router-dom';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileStats from '@/components/profile/ProfileStats';
import TrophyCase from '@/components/profile/TrophyCase';
import AchievementHighlights from '@/components/profile/AchievementHighlights';
import GamingStats from '@/components/profile/GamingStats';
import LinkedAccounts from '@/components/profile/LinkedAccounts';
import FriendsComparison from '@/components/profile/FriendsComparison';
import GameCollections from '@/components/profile/GameCollections';
import { mockTrophies, playerStats } from '@/data/profileData';
import { useProfileData } from '@/hooks/useProfileData';

/**
 * Profile interface
 * 
 * Defines the structure for a user profile with all relevant fields.
 */
export interface Profile {
  id: string;
  username: string;
  email: string;
  avatar_url: string | null;
  cover_url: string | null;
  bio: string | null;
  steam_id: string | null;
  xbox_gamertag: string | null;
  playstation_username: string | null;
  is_private: boolean | null;
}

/**
 * Profile Page Component
 * 
 * Displays the user's profile with gaming statistics, achievements, connected
 * accounts, and other gaming-related information.
 * 
 * @returns {JSX.Element} The Profile page UI
 */
const Profile = () => {
  const [searchParams] = useSearchParams();
  const profileId = searchParams.get('id');
  const { 
    profile, 
    loading, 
    friendCount, 
    currentUserId, 
    isFriend,
    fetchFriendCount
  } = useProfileData(profileId);

  if (loading) {
    return <ProfileLoading />;
  }

  if (!profile) {
    return <ProfileNotFound />;
  }

  const hasLinkedAccounts = profile.steam_id || profile.xbox_gamertag || profile.playstation_username;
  const isOwnProfile = currentUserId === profile.id;
  const completionPercentage = Math.round((playerStats.gamesCompleted / playerStats.totalGames) * 100);

  return (
    <div className="min-h-screen pt-20 pb-12 bg-primary">
      <div className="container-padding mx-auto max-w-6xl">
        <ProfileHeader 
          profile={profile} 
          playerStats={playerStats} 
        />

        <ProfileStats 
          trophiesCount={playerStats.trophiesCount}
          platinumCount={playerStats.platinumCount}
          completionPercentage={completionPercentage}
          friendCount={friendCount}
        />
        
        <TrophyCase trophies={mockTrophies} />
        
        <AchievementHighlights />
        
        <GamingStats />
        
        <LinkedAccounts 
          profile={profile}
          isOwnProfile={isOwnProfile}
          hasLinkedAccounts={hasLinkedAccounts}
        />
        
        {isOwnProfile && (
          <FriendsComparison friendCount={friendCount} />
        )}
        
        <GameCollections 
          profile={profile}
          hasLinkedAccounts={hasLinkedAccounts}
          isOwnProfile={isOwnProfile}
        />
      </div>
    </div>
  );
};

export default Profile;
