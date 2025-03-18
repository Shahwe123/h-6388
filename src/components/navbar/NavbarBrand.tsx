
import { Link } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';
import { Gamepad } from 'lucide-react';
import { motion } from 'framer-motion';

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
      <motion.div
        className="flex items-center gap-2"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <Gamepad className="w-6 h-6 text-neon-purple" />
        <motion.span 
          className="font-bold text-xl text-white neon-text uppercase tracking-wider"
          animate={{ 
            textShadow: ['0 0 5px #D946EF, 0 0 10px #D946EF', '0 0 7px #D946EF, 0 0 15px #D946EF', '0 0 5px #D946EF, 0 0 10px #D946EF']
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          PlatinumPath
        </motion.span>
      </motion.div>
    </Link>
  );
};

export default NavbarBrand;
