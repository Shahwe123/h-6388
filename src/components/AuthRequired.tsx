
import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

/**
 * Props for the AuthRequired component
 */
interface AuthRequiredProps {
  children: ReactNode;  // Child components that require authentication
}

/**
 * AuthRequired component
 * Route protection component that redirects unauthenticated users to the login page
 * Shows a loading state while checking authentication
 * 
 * @param children - Child components that require authentication
 */
const AuthRequired = ({ children }: AuthRequiredProps) => {
  // State to store the user's session
  const [session, setSession] = useState<Session | null>(null);
  // State to track loading status
  const [loading, setLoading] = useState(true);
  // Get current location to redirect back after login
  const location = useLocation();

  useEffect(() => {
    // Check for active session when component mounts
    const getSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Set up listener for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    // Clean up subscription when component unmounts
    return () => subscription.unsubscribe();
  }, []);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-neon-purple border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-neutral-300">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if user is not authenticated
  if (!session) {
    // Save the location they were trying to go to for a future redirect
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // User is authenticated, render protected content
  return <>{children}</>;
};

export default AuthRequired;
