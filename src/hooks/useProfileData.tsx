
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Profile } from '@/types/profile';

/**
 * Custom hook to fetch profile data from the database
 * 
 * Handles loading state, profile data, friend count, and friendship status
 * 
 * @param {string|null} username - Username of the profile to fetch, or current user if null
 * @returns {Object} Profile data and related states
 */
export const useProfileData = (username: string | null) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [friendCount, setFriendCount] = useState(0);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isFriend, setIsFriend] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const { toast } = useToast();

  const fetchProfileData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Get current user session
      const { data: { session } } = await supabase.auth.getSession();
      const currentUserId = session?.user?.id || null;
      setCurrentUserId(currentUserId);
      
      // If username is not provided and user is logged in, fetch current user's profile
      let profileUsername = username;
      if (!profileUsername && currentUserId) {
        // Fetch the username for the current user
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', currentUserId)
          .single();
          
        if (userError) {
          console.error('Error fetching current user profile:', userError);
          setLoading(false);
          return;
        }
        
        if (userData) {
          profileUsername = userData.username;
        }
      }
      
      if (!profileUsername) {
        console.error('No username provided and user not logged in');
        setLoading(false);
        return;
      }
      
      // Fetch profile data
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', profileUsername)
        .single();
        
      if (error) {
        console.error('Error fetching profile:', error);
        setLoading(false);
        return;
      }
      
      // Determine if this is the user's own profile
      setIsOwnProfile(currentUserId === data.id);
      
      // Fetch friend count
      if (data) {
        const { count } = await supabase
          .from('friends')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', data.id);
          
        setFriendCount(count || 0);
        
        // Check if the current user is friends with this profile
        if (currentUserId && currentUserId !== data.id) {
          const { data: friendData } = await supabase
            .from('friends')
            .select('id')
            .eq('user_id', currentUserId)
            .eq('friend_id', data.id);
            
          setIsFriend(friendData && friendData.length > 0);
        }
      }
      
      // Set the profile data with achievements, trophies, etc.
      // For now, we'll just set mock data
      setProfile({
        ...data,
        recentTrophies: [],
        achievements: [],
        games: []
      });
      
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      toast({
        title: 'Error fetching profile',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [username, toast]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

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
    isOwnProfile,
    fetchProfileData,
    fetchFriendCount
  };
};
