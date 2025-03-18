
import { Link } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';
import { Gamepad } from 'lucide-react';

interface NavbarBrandProps {
  session: Session | null;
}

/**
 * NavbarBrand component
 * 
 * Displays the app logo and name in the navbar
 * 
 * @param {NavbarBrandProps} props - Component props
 * @returns {JSX.Element} The brand logo and name
 */
const NavbarBrand = ({ session }: NavbarBrandProps) => {
  return (
    <Link to={session ? "/profile" : "/"} className="flex items-center gap-2">
      <Gamepad className="w-6 h-6 text-neon-purple" />
      <span className="font-bold text-xl text-white neon-text">PlatinumPath</span>
    </Link>
  );
};

export default NavbarBrand;
