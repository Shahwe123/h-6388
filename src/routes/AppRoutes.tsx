
import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Pages
import Index from '@/pages/Index';
import About from '@/pages/About';
import Blog from '@/pages/Blog';
import BlogDetail from '@/pages/Blog';
import Contact from '@/pages/Contact';
import Auth from '@/pages/Auth';
import Terms from '@/pages/Terms';
import Privacy from '@/pages/Privacy';
import Cookies from '@/pages/Cookies';
import Support from '@/pages/Support';
import Profile from '@/pages/Profile';
import Friends from '@/pages/Friends';
import Settings from '@/pages/Settings';
import LinkAccounts from '@/pages/LinkAccounts';
import NotFound from '@/pages/NotFound';

// Components
import AuthRequired from '@/components/AuthRequired';
import { useToast } from '@/hooks/use-toast';

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
      <Route path="/auth" element={<Auth />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/cookies" element={<Cookies />} />
      <Route path="/support" element={<Support />} />

      {/* Private routes */}
      <Route element={<AuthRequired><Outlet /></AuthRequired>}>
        {/* Authenticated Routes */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/friends" element={<Friends />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/link-accounts" element={<LinkAccounts />} />
      </Route>

      {/* Catch-all for unknown routes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
