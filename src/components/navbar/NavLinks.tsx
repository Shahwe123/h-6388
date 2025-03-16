
import { Link, useLocation } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';

/**
 * Props for the NavLinks component
 */
type NavLinksProps = {
  session: Session | null;          // The user's session, determines which links to show
  isMobile?: boolean;               // Whether the links are being rendered in mobile view
  onClick?: () => void;             // Optional callback function when a link is clicked
};

/**
 * NavLinks component
 * Renders navigation links based on authentication state
 * Shows different links for authenticated and unauthenticated users
 * 
 * @param session - The user's session
 * @param isMobile - Whether the links are being rendered in mobile view
 * @param onClick - Optional callback function when a link is clicked
 */
const NavLinks = ({ session, isMobile = false, onClick }: NavLinksProps) => {
  const location = useLocation();
  const { pathname } = location;

  // Define different sets of navigation links based on authentication state
  const navLinks = session ? [
    { path: '/profile', label: 'Profile' },
    { path: '/friends', label: 'Friends' },
    { path: '/leaderboard', label: 'Leaderboard' },
    { path: '/link-accounts', label: 'Link Accounts' },
    { path: '/settings', label: 'Settings' }
  ] : [
    { path: '/', label: 'Home' },
    { path: '/auth', label: 'Sign In' },
  ];

  return (
    <>
      {navLinks.map(link => (
        <Link
          key={link.path}
          to={link.path}
          className={`${isMobile ? 'block py-2 text-lg' : 'text-sm font-medium'} transition-colors hover:text-white ${
            pathname === link.path ? 'text-white' : 'text-neutral-400'
          }`}
          onClick={onClick}
        >
          {link.label}
        </Link>
      ))}
    </>
  );
};

export default NavLinks;
