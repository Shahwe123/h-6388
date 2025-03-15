
import { supabase } from '@/integrations/supabase/client';

/**
 * Get the current user session from Supabase
 * @returns The current session or null if not authenticated
 */
export const getCurrentSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

/**
 * Fetch user profile by user ID
 * @param userId The user ID to fetch the profile for
 * @returns The user profile data or null if not found
 */
export const fetchUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
};
