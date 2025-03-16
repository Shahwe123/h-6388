
import { Link, useLocation } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';
import { useScrollToTop } from '@/hooks/useScrollToTop';

/**
 * Props for the NavLinks component
 * @property {Session|null} session - The current user session
 * @property {boolean} isMobile - Whether being rendered in mobile view
 * @property {Function} onClick - Optional click handler for mobile navigation
 */
type NavLinksProps = {
  session: Session | null;
  isMobile?: boolean;
  onClick?: () => void;
};

/**
 * NavLinks component
 * 
 * Renders navigation links based on authentication state.
 * Shows different links for authenticated and unauthenticated users.
 * Handles both desktop and mobile navigation styles.
 * 
 * @param {NavLinksProps} props - Component props
 * @returns {JSX.Element} Navigation links UI
 */
const NavLinks = ({ session, isMobile = false, onClick }: NavLinksProps) => {
  const location = useLocation();
  const { pathname } = location;
  
  // Initialize the scroll to top hook
  useScrollToTop();

  // Different navigation links for authenticated vs unauthenticated users
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
