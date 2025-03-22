
import { useLocation } from 'react-router-dom';
import Navbar from "@/components/Navbar";

/**
 * NavbarWrapper component
 * 
 * This component conditionally renders the Navbar based on the current route.
 * The Navbar is not shown on the home page (/) as it has its own Header.
 * The Navbar is not shown on auth pages (/auth) as they have their own layout.
 * 
 * @returns {JSX.Element|null} Navbar component or null
 */
export const NavbarWrapper = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isAuthPage = location.pathname.includes('/auth');
  
  // Don't show navbar on home page or auth pages
  return (!isHomePage && !isAuthPage) ? <Navbar /> : null;
};
