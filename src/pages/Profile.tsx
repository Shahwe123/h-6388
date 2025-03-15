
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

const Profile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [friendCount, setFriendCount] = useState(0);
  const [searchParams] = useSearchParams();
  const profileId = searchParams.get('id');
  const { toast } = useToast();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isFriend, setIsFriend] = useState(false);

  useEffect(() => {
    const fetchUserSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setCurrentUserId(session.user.id);
          return session.user.id;
        }
        return null;
      } catch (error) {
        console.error('Error fetching session:', error);
        return null;
      }
    };

    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const userId = await fetchUserSession();

        const targetProfileId = profileId || userId;

        if (!targetProfileId) {
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', targetProfileId)
          .single();

        if (error) {
          throw error;
        }

        setProfile(data as Profile);

        const { count, error: friendError } = await supabase
          .from('friends')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', targetProfileId);

        if (friendError) {
          throw friendError;
        }

        setFriendCount(count || 0);

        if (userId && profileId && userId !== profileId) {
          const { data: friendData, error: checkFriendError } = await supabase
            .from('friends')
            .select('id')
            .eq('user_id', userId)
            .eq('friend_id', profileId);

          if (checkFriendError) {
            console.error('Error checking friend status:', checkFriendError);
          } else {
            setIsFriend(friendData && friendData.length > 0);
          }
        }
      } catch (error: any) {
        toast({
          title: 'Error fetching profile',
          description: error.message,
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();

    if (profileId) {
      const friendsChannel = supabase
        .channel(`profile-friends-${profileId}`)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'friends',
          filter: `user_id=eq.${profileId}`
        }, () => {
          fetchFriendCount(profileId);
        })
        .subscribe();

      return () => {
        supabase.removeChannel(friendsChannel);
      };
    }
  }, [toast, profileId]);

  const fetchFriendCount = async (userId: string) => {
    try {
      const { count, error } = await supabase
        .from('friends')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      if (error) throw error;
      setFriendCount(count || 0);
    } catch (error) {
      console.error('Error fetching friend count:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 bg-primary flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-neon-purple border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-neutral-300">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen pt-20 bg-primary flex items-center justify-center">
        <div className="text-center">
          <p className="text-neutral-300 mb-4">Profile not found. Please try logging in again.</p>
        </div>
      </div>
    );
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
