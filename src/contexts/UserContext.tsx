
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Define the shape of user data
interface UserType {
  id: string;
  name: string;  // Kept for compatibility
  email: string;
  avatar: string;
  is_private: boolean;
}

// Define the shape of UserContext data
interface UserContextType {
  user: UserType | null;
  setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
}

// Create the UserContext with undefined as initial value
const UserContext = createContext<UserContextType | undefined>(undefined);

/**
 * UserProvider component - provides user profile data context to the application
 * This is different from AuthContext as it contains more detailed user profile information
 */
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State to hold the current user profile data
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    // Load user data from session when component mounts
    const loadUserData = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (sessionData.session?.user) {
        // Fetch user profile data from the profiles table
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', sessionData.session.user.id)
          .single();
          
        if (data) {
          // Format the user data
          setUser({
            id: data.id,
            name: data.username || '', // Use username property instead of name
            email: data.email || sessionData.session.user.email || '',
            avatar: data.avatar_url || '',
            is_private: data.is_private || false,
          });
        }
      }
    };
    
    loadUserData();
  }, []);

  // Create context value object with user state and setter
  const value = {
    user,
    setUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

/**
 * Custom hook to access the user context
 * Throws an error if used outside of UserProvider
 */
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
