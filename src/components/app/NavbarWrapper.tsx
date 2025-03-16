
import { useLocation } from 'react-router-dom';
import Navbar from "@/components/Navbar";

/**
 * NavbarWrapper component
 * 
 * This component conditionally renders the Navbar based on the current route.
 * The Navbar is not shown on the home page (/) as it has its own Header.
 * 
 * @returns {JSX.Element|null} Navbar component or null
 */
export const NavbarWrapper = () => {
  const location = useLocation();
  // Don't show navbar on home page as it has its own Header
  return location.pathname !== '/' ? <Navbar /> : null;
};
