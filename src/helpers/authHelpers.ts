
import { supabase } from '@/integrations/supabase/client';

/**
 * Get the current user session from Supabase
 * 
 * This helper function fetches the current authentication session
 * from Supabase. It returns the session if the user is authenticated,
 * or null if not logged in.
 * 
 * @returns {Promise<Session|null>} The current session or null if not authenticated
 */
export const getCurrentSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

/**
 * Fetch user profile by user ID
 * 
 * This helper function retrieves a user's profile data from the
 * 'profiles' table in the database using their user ID.
 * 
 * @param {string} userId The user ID to fetch the profile for
 * @returns {Promise<Object|null>} The user profile data or null if not found
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
