
import { Link, useLocation } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';

type NavLinksProps = {
  session: Session | null;
  isMobile?: boolean;
  onClick?: () => void;
};

const NavLinks = ({ session, isMobile = false, onClick }: NavLinksProps) => {
  const location = useLocation();
  const { pathname } = location;

  const navLinks = session ? [
    { path: '/profile', label: 'Profile' },
    { path: '/friends', label: 'Friends' },
    { path: '/leaderboard', label: 'Leaderboard' },
    { path: '/link-accounts', label: 'Link Accounts' },
    { path: '/settings', label: 'Settings' }
  ] : [
    { path: '/auth', label: 'Sign In' },
    { path: '/leaderboard', label: 'Leaderboard' }
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
