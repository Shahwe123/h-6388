
import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

/**
 * Props for the AuthRequired component
 * @property {ReactNode} children - The components to render if authenticated
 */
interface AuthRequiredProps {
  children: ReactNode;
}

/**
 * AuthRequired component
 * 
 * A wrapper component that protects routes requiring authentication.
 * If the user is not logged in, they will be redirected to the auth page.
 * Preserves the original destination for redirection after login.
 * 
 * @param {AuthRequiredProps} props - Component props
 * @returns {JSX.Element} Protected content or redirect
 */
const AuthRequired = ({ children }: AuthRequiredProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Check if user is authenticated when component mounts
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

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    // Clean up subscription when component unmounts
    return () => subscription.unsubscribe();
  }, []);

  // Show loading state while checking authentication
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

  // If not authenticated, redirect to login page
  if (!session) {
    // Save the location they were trying to go to for a future redirect
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If authenticated, render the protected content
  return <>{children}</>;
};

export default AuthRequired;
