
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useInitializeData } from '@/hooks/useInitializeData';

/**
 * AppDataInitializer component
 * 
 * This component initializes app-wide data when the user is logged in.
 * It listens for auth state changes and triggers data loading when a user logs in.
 * 
 * @returns {null} This component doesn't render anything
 */
export const AppDataInitializer = () => {
  const [userId, setUserId] = useState<string | null>(null);
  
  useEffect(() => {
    // Create avatars bucket when the app starts
    const createAvatarsBucket = async () => {
      try {
        await supabase.functions.invoke('create-avatars-bucket');
      } catch (error) {
        console.error('Error creating avatars bucket:', error);
      }
    };

    createAvatarsBucket();
    
    // Get current user ID on component mount
    const getUserId = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUserId(data.user.id);
      }
    };
    
    getUserId();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUserId(session?.user?.id || null);
      }
    );
    
    // Clean up subscription when component unmounts
    return () => subscription.unsubscribe();
  }, []);
  
  // Initialize data when user is logged in
  useInitializeData(userId);
  
  return null;
};
