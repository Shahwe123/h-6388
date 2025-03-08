
import { Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { getSession } from '@/store/slices/authSlice';
import { fetchProfile } from '@/store/slices/profileSlice';
import { fetchUserGames } from '@/store/slices/gamesSlice';
import { fetchUserAchievements } from '@/store/slices/achievementsSlice';
import { fetchFriends, fetchPendingRequests } from '@/store/slices/friendsSlice';
import { useToast } from '@/hooks/use-toast';

interface AuthRequiredProps {
  children: React.ReactNode;
}

const AuthRequired = ({ children }: AuthRequiredProps) => {
  const dispatch = useAppDispatch();
  const { user, isLoading } = useAppSelector((state) => state.auth);
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log("Checking session...");
        const result = await dispatch(getSession()).unwrap();
        console.log("Session check result:", result);
        
        if (result.session) {
          const userId = result.session.user.id;
          console.log("User authenticated, fetching data for user ID:", userId);
          
          // Load user data when authenticated - in parallel
          try {
            await Promise.all([
              dispatch(fetchProfile(userId)).unwrap(),
              dispatch(fetchUserGames(userId)).unwrap(),
              dispatch(fetchUserAchievements(userId)).unwrap(),
              dispatch(fetchFriends(userId)).unwrap(),
              dispatch(fetchPendingRequests(userId)).unwrap()
            ]);
            console.log("All user data loaded successfully");
          } catch (dataError) {
            console.error("Error loading user data:", dataError);
            toast({
              title: "Data loading error",
              description: "There was a problem loading your profile data. Please try again later.",
              variant: "destructive",
            });
          }
        }
      } catch (error) {
        console.error("Session check failed:", error);
        toast({
          title: "Authentication error",
          description: "There was a problem with your session. Please try logging in again.",
          variant: "destructive",
        });
      }
    };
    
    checkSession();
  }, [dispatch, toast]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
        <p className="ml-2 text-neutral-400">Loading your profile...</p>
      </div>
    );
  }

  // If not logged in, redirect to auth page
  if (!user) {
    return <Navigate to="/auth" />;
  }

  return <>{children}</>;
};

export default AuthRequired;
