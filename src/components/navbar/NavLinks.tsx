
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { Trophy, Users, Award, Settings, Home, Gamepad, LayoutDashboard } from 'lucide-react';

type NavLink = {
  name: string;
  path: string;
  icon: React.ReactNode;
  requiresAuth: boolean;
};

/**
 * NavLinks component
 * 
 * Displays the primary navigation links in the navbar
 * Shows different links based on authentication status
 */
const NavLinks = () => {
  const location = useLocation();
  const isAuthenticated = useSelector((state: any) => !!state.user?.userData);
  
  // Navigation links configuration
  const links: NavLink[] = [
    {
      name: 'Home',
      path: '/',
      icon: <Home className="h-4 w-4" />,
      requiresAuth: false
    },
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <LayoutDashboard className="h-4 w-4" />,
      requiresAuth: true
    },
    {
      name: 'Profile',
      path: '/profile',
      icon: <Trophy className="h-4 w-4" />,
      requiresAuth: true
    },
    {
      name: 'Games',
      path: '/games',
      icon: <Gamepad className="h-4 w-4" />,
      requiresAuth: true
    },
    {
      name: 'Friends',
      path: '/friends',
      icon: <Users className="h-4 w-4" />,
      requiresAuth: true
    },
    {
      name: 'Leaderboard',
      path: '/leaderboard',
      icon: <Award className="h-4 w-4" />,
      requiresAuth: false
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: <Settings className="h-4 w-4" />,
      requiresAuth: true
    }
  ];
  
  // Filter links based on authentication status
  const visibleLinks = links.filter(link => 
    !link.requiresAuth || (link.requiresAuth && isAuthenticated)
  );
  
  return (
    <div className="hidden lg:flex lg:gap-x-6">
      {visibleLinks.map((link) => {
        const isActive = location.pathname === link.path || 
          (link.path !== '/' && location.pathname.startsWith(link.path));
        
        return (
          <Link
            key={link.name}
            to={link.path}
            className={`flex items-center text-sm font-semibold transition-colors px-3 py-2 rounded-md ${
              isActive
                ? 'text-white bg-neon-purple/20'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <span className="mr-1.5">{link.icon}</span>
            {link.name}
          </Link>
        );
      })}
    </div>
  );
};

export default NavLinks;
