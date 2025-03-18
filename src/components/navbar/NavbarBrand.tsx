
import { Link } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';

interface NavbarBrandProps {
  session: Session | null;
}

/**
 * NavbarBrand component
 * 
 * Displays the app logo in the navbar
 * 
 * @param {NavbarBrandProps} props - Component props
 * @returns {JSX.Element} The brand logo
 */
const NavbarBrand = ({ session }: NavbarBrandProps) => {
  return (
    <Link to={session ? "/profile" : "/"} className="flex items-center">
      <img 
        src="/lovable-uploads/05d9d628-cf88-4d37-b05c-e517321e114c.png" 
        alt="PlatinumPath Logo" 
        className="h-10 w-auto"
      />
    </Link>
  );
};

export default NavbarBrand;
