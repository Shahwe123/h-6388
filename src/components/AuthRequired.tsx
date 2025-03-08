
import { Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { getSession } from '@/store/slices/authSlice';
import { fetchProfile } from '@/store/slices/profileSlice';
import { fetchUserGames } from '@/store/slices/gamesSlice';
import { fetchUserAchievements } from '@/store/slices/achievementsSlice';
import { fetchFriends, fetchPendingRequests } from '@/store/slices/friendsSlice';

interface AuthRequiredProps {
  children: React.ReactNode;
}

const AuthRequired = ({ children }: AuthRequiredProps) => {
  const dispatch = useAppDispatch();
  const { user, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const result = await dispatch(getSession()).unwrap();
        if (result.session) {
          const userId = result.session.user.id;
          // Load user data when authenticated
          dispatch(fetchProfile(userId));
          dispatch(fetchUserGames(userId));
          dispatch(fetchUserAchievements(userId));
          dispatch(fetchFriends(userId));
          dispatch(fetchPendingRequests(userId));
        }
      } catch (error) {
        console.error("Session check failed:", error);
      }
    };
    
    checkSession();
  }, [dispatch]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
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
