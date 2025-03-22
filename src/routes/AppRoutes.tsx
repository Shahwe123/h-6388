import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from '../pages/Index';
import NotFound from '../pages/NotFound';
import About from '../pages/About';
import Contact from '../pages/Contact';
import Pricing from '../pages/Pricing';
import Privacy from '../pages/Privacy';
import Terms from '../pages/Terms';
import Cookies from '../pages/Cookies';
import Blog from '../pages/Blog';
import BetaLanding from '../pages/BetaLanding';
import Documentation from '../pages/Documentation';
import Auth from '../pages/Auth';
import AuthRequired from '../components/AuthRequired';
import Dashboard from '../pages/Dashboard';
import Settings from '../pages/Settings';
import Support from '../pages/Support';
import Friends from '../pages/Friends';
import FriendComparison from '../pages/FriendComparison';
import Games from '../pages/Games';
import Guides from '../pages/Guides';
import GameDetail from '../pages/GameDetail';
import Leaderboard from '../pages/Leaderboard';
import Profile from '../pages/Profile';
import LinkAccounts from '../pages/LinkAccounts';
import EmailPreferences from '../pages/EmailPreferences';

// Forum Pages
import Forum from '../pages/Forum';
import ForumThread from '../pages/ForumThread';
import ForumCategory from '../pages/ForumCategory';
import CreateThread from '../pages/CreateThread';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/cookies" element={<Cookies />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/beta" element={<BetaLanding />} />
      <Route path="/documentation" element={<Documentation />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/dashboard" element={<AuthRequired><Dashboard /></AuthRequired>} />
      <Route path="/settings" element={<AuthRequired><Settings /></AuthRequired>} />
      <Route path="/support" element={<AuthRequired><Support /></AuthRequired>} />
      <Route path="/friends" element={<AuthRequired><Friends /></AuthRequired>} />
      <Route path="/friends/:username" element={<AuthRequired><FriendComparison /></AuthRequired>} />
      <Route path="/games" element={<AuthRequired><Games /></AuthRequired>} />
      <Route path="/guides" element={<AuthRequired><Guides /></AuthRequired>} />
      <Route path="/games/:gameId" element={<AuthRequired><GameDetail /></AuthRequired>} />
      <Route path="/leaderboard" element={<AuthRequired><Leaderboard /></AuthRequired>} />
      <Route path="/profile/:username" element={<AuthRequired><Profile /></AuthRequired>} />
      <Route path="/link-accounts" element={<AuthRequired><LinkAccounts /></AuthRequired>} />
      <Route path="/email-preferences" element={<AuthRequired><EmailPreferences /></AuthRequired>} />
      
      {/* Forum Routes */}
      <Route path="/forum" element={<Forum />} />
      <Route path="/forum/thread/:id" element={<ForumThread />} />
      <Route path="/forum/category/:id" element={<ForumCategory />} />
      <Route path="/forum/create" element={<CreateThread />} />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
