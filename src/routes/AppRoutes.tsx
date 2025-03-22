
import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Pages
import Index from '@/pages/Index';
import About from '@/pages/About';
import Blog from '@/pages/Blog';
import BlogDetail from '@/pages/Blog';
import Contact from '@/pages/Contact';
import Pricing from '@/pages/Pricing';
import Auth from '@/pages/Auth';
import Terms from '@/pages/Terms';
import Privacy from '@/pages/Privacy';
import Cookies from '@/pages/Cookies';
import Support from '@/pages/Support';
import Documentation from '@/pages/Documentation';
import Guides from '@/pages/Guides';
import EmailPreferences from '@/pages/EmailPreferences';
import Dashboard from '@/pages/Dashboard';
import Profile from '@/pages/Profile';
import Friends from '@/pages/Friends';
import FriendComparison from '@/pages/FriendComparison';
import Games from '@/pages/Games';
import GameDetail from '@/pages/GameDetail';
import Settings from '@/pages/Settings';
import LinkAccounts from '@/pages/LinkAccounts';
import Leaderboard from '@/pages/Leaderboard';
import NotFound from '@/pages/NotFound';

// Components
import PrivateRoute from '@/components/AuthRequired';
import { useToast } from '@/hooks/use-toast';

const AppRoutes = () => {
  const navigate = useNavigate();
  const currentUser = useSelector((state: any) => state.user?.userData);
  const { toast } = useToast();

  useEffect(() => {
    if (!currentUser && localStorage.getItem('supabase.auth.token')) {
      toast({
        title: 'Session Expired',
        description: 'Your session has expired. Please sign in again.',
      });
      navigate('/auth');
    }
  }, [currentUser, navigate, toast]);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Index />} />
      <Route path="/about" element={<About />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<BlogDetail />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/cookies" element={<Cookies />} />
      <Route path="/support" element={<Support />} />
      <Route path="/documentation" element={<Documentation />} />
      <Route path="/guides" element={<Guides />} />
      <Route path="/email-preferences" element={<EmailPreferences />} />
      <Route path="/leaderboard" element={<Leaderboard />} />

      {/* Private routes */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />
      {/* Fix the profile route to properly handle usernames with special characters */}
      <Route path="/profile/:username" element={<Profile />} />
      <Route
        path="/friends"
        element={
          <PrivateRoute>
            <Friends />
          </PrivateRoute>
        }
      />
      <Route
        path="/friends/compare/:friendId"
        element={
          <PrivateRoute>
            <FriendComparison />
          </PrivateRoute>
        }
      />
      <Route
        path="/games"
        element={
          <PrivateRoute>
            <Games />
          </PrivateRoute>
        }
      />
      <Route
        path="/games/:gameId"
        element={
          <PrivateRoute>
            <GameDetail />
          </PrivateRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <PrivateRoute>
            <Settings />
          </PrivateRoute>
        }
      />
      <Route
        path="/link-accounts"
        element={
          <PrivateRoute>
            <LinkAccounts />
          </PrivateRoute>
        }
      />
      
      {/* Catch-all for unknown routes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
