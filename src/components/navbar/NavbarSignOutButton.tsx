
import { LogOut } from 'lucide-react';

interface NavbarSignOutButtonProps {
  handleSignOut: () => void;
}

/**
 * NavbarSignOutButton component
 * 
 * Button that handles the sign out functionality
 * 
 * @param {NavbarSignOutButtonProps} props - Component props
 * @returns {JSX.Element} The sign out button
 */
const NavbarSignOutButton = ({ handleSignOut }: NavbarSignOutButtonProps) => {
  return (
    <button
      onClick={handleSignOut}
      className="text-sm font-medium text-neutral-400 hover:text-white transition-colors flex items-center"
    >
      <LogOut className="h-4 w-4 mr-1" />
      Sign Out
    </button>
  );
};

export default NavbarSignOutButton;
