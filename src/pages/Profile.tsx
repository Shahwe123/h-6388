
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
  const currentUser = useSelector((state) => state.user?.userData);
  
  const { 
    profileData, 
    fetchProfileData, 
    isOwnProfile,
    profileUser
  } = useProfileData(username);

  useEffect(() => {
    const checkProfileExists = async () => {
      if (!username) return;
      
      setIsLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('username')
          .eq('username', username)
          .single();
          
        if (error || !data) {
          setProfileExists(false);
        } else {
          setProfileExists(true);
          fetchProfileData();
        }
      } catch (error) {
        console.error('Error checking profile:', error);
        setProfileExists(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkProfileExists();
  }, [username, fetchProfileData]);

  if (isLoading) {
    return <ProfileLoading />;
  }
  
  if (!profileExists) {
    return <ProfileNotFound username={username} />;
  }

  return (
    <div className="min-h-screen bg-primary pb-16">
      <div className="max-w-7xl mx-auto container-padding">
        <ProfileHeader 
          profile={profileData}
          isOwnProfile={isOwnProfile === true}
          onShareClick={() => setShowSocialShare(true)}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-1 space-y-6">
            <ProfileStats profile={profileData} />
            <LevelProgress profile={profileData} />
            <FriendsComparison profile={profileData} isOwnProfile={isOwnProfile === true} />
          </div>
          
          <div className="lg:col-span-2 space-y-8">
            <TrophyCase trophies={profileData?.recentTrophies || []} />
            <AchievementHighlights achievements={profileData?.achievements || []} />
            <GameCollections games={profileData?.games || []} />
          </div>
        </div>
      </div>
      
      {showSocialShare && (
        <SocialShare 
          username={username || ''} 
          onClose={() => setShowSocialShare(false)} 
        />
      )}
    </div>
  );
};

export default Profile;
