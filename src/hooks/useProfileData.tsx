
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Profile } from '@/pages/Profile';

/**
 * Custom hook to fetch profile data from the database
 * 
 * Handles loading state, profile data, friend count, and friendship status
 * 
 * @param {string|null} profileId - Optional ID of the profile to fetch, or current user if null
 * @returns {Object} Profile data and related states
 */
export const useProfileData = (profileId: string | null) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [friendCount, setFriendCount] = useState(0);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isFriend, setIsFriend] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    /**
     * Fetch the current user's session from Supabase
     * 
     * @returns {Promise<string|null>} The user ID or null if not logged in
     */
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

    /**
     * Fetch profile data and friend count from the database
     */
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

        // Fix: Convert is_private to boolean if it's a string
        if (data && data.is_private !== null) {
          if (typeof data.is_private === 'string') {
            data.is_private = data.is_private === 'true';
          }
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

  /**
   * Fetch friend count for a specific user
   * 
   * @param {string} userId - The user ID to fetch friends count for
   */
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

  return {
    profile,
    loading,
    friendCount,
    currentUserId,
    isFriend,
    fetchFriendCount
  };
};
