
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Define the shape of AuthContext data
interface AuthContextType {
  user: any | null; // The authenticated user or null if not authenticated
  logout: () => Promise<void>; // Function to log out the user
}

// Create the AuthContext with undefined as initial value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider component - provides authentication context to the application
 * Manages user authentication state and provides logout functionality
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State to hold the current authenticated user
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    // Check for active session when component mounts
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
    };
    
    getSession();

    // Set up listener for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    // Clean up subscription when component unmounts
    return () => subscription.unsubscribe();
  }, []);

  /**
   * Logs out the current user by calling Supabase auth signOut
   */
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  // Create context value object with user and logout function
  const value = {
    user,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to access the auth context
 * Throws an error if used outside of AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
