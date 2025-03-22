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
import LegacyWall from '@/components/legacy/LegacyWall';

const AppRoutes: React.FC = () => {
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
      <Route element={<PrivateRoute />}>
        {/* Authenticated Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/games" element={<Games />} />
        <Route path="/games/:id" element={<GameDetail />} />
        <Route path="/legacy-wall" element={<LegacyWall />} />
        <Route path="/friends" element={<Friends />} />
        <Route path="/friend/:friendId" element={<FriendComparison />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/link-accounts" element={<LinkAccounts />} />
      </Route>

      {/* Catch-all for unknown routes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
