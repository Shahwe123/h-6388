import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, User, Gamepad, Users, BarChart, MessageSquare, Trophy } from 'lucide-react';

/**
 * Navigation links component
 * 
 * Renders the main navigation links for the application.
 * 
 * @returns {JSX.Element} The NavLinks UI
 */
const NavLinks = () => {
  const mainLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/profile', label: 'Profile', icon: User },
    { path: '/games', label: 'Games', icon: Gamepad },
    { path: '/legacy-wall', label: 'Trophy Museum', icon: Trophy },
    { path: '/friends', label: 'Friends', icon: Users },
    { path: '/leaderboard', label: 'Leaderboard', icon: BarChart },
    { path: '/forum', label: 'Forum', icon: MessageSquare }
  ];

  return (
    <>
      {mainLinks.map((link) => (
        <NavLink
          key={link.path}
          to={link.path}
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
