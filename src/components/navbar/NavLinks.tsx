
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, User, Gamepad, Users, BarChart, Trophy } from 'lucide-react';
import { useSelector } from 'react-redux';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';

/**
 * Props for the NavLinks component
 */
interface NavLinksProps {
  isMobile?: boolean;
  onClick?: () => void;
}

/**
 * Navigation links component
 * 
 * Renders the main navigation links for the application.
 * Only displays links when user is authenticated.
 * 
 * @returns {JSX.Element} The NavLinks UI
 */
const NavLinks: React.FC<NavLinksProps> = ({ isMobile, onClick }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    // Check authentication status when component mounts
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
    };
    
    checkAuth();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsAuthenticated(!!session);
      }
    );
    
    // Clean up subscription when component unmounts
    return () => subscription.unsubscribe();
  }, []);

  // Define main navigation links
  const mainLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/profile', label: 'Profile', icon: User },
    { path: '/games', label: 'Games', icon: Gamepad },
    { path: '/legacy-wall', label: 'Museum', icon: Trophy },
    { path: '/friends', label: 'Friends', icon: Users },
    { path: '/leaderboard', label: 'Leaderboard', icon: BarChart }
  ];

  // If not authenticated, don't show navigation links
  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      {mainLinks.map((link) => (
        <NavLink
          key={link.path}
          to={link.path}
          onClick={onClick}
          className={({ isActive }) =>
            `text-neutral-300 hover:text-white transition-colors duration-200 flex items-center gap-2 py-2 px-4 rounded-md
            ${isActive ? 'bg-neon-purple/20 text-white' : ''}`
          }
        >
          <link.icon className="h-4 w-4" />
          {link.label}
        </NavLink>
      ))}
    </>
  );
};

export default NavLinks;
