import { useNavbarState } from '@/hooks/useNavbarState';
import NavLinks from './navbar/NavLinks';
import NotificationButton from './navbar/NotificationButton';
import MobileMenu from './navbar/MobileMenu';
import NavbarBrand from './navbar/NavbarBrand';
import NavbarSignOutButton from './navbar/NavbarSignOutButton';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Navbar component
 * 
 * Main navigation bar for the application, includes mobile responsiveness
 * and notification functionality.
 * 
 * @returns {JSX.Element} The Navbar UI
 */
const Navbar = () => {
  const {
    session,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    isNotificationsOpen,
    setIsNotificationsOpen,
    hasUnreadNotifications,
    notifications,
    handleSignOut,
    handleNotificationClick,
    markNotificationsAsRead,
    isScrolled
  } = useNavbarState();

  return (
    <header className={`${isScrolled ? 'bg-background/80 backdrop-blur-md' : 'bg-transparent'} fixed top-0 w-full z-50 transition-all duration-300`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <NavbarBrand session={session} />

          <nav className="hidden md:flex space-x-8">
            <NavLinks />

            {session && (
              <>
                <NotificationButton
                  hasUnreadNotifications={hasUnreadNotifications}
                  isOpen={isNotificationsOpen}
                  onClick={handleNotificationClick}
                  onClose={() => setIsNotificationsOpen(false)}
                  notifications={notifications}
                  userId={session.user.id}
                />

                <NavbarSignOutButton handleSignOut={handleSignOut} />
              </>
            )}

            <Link 
              to="/forum" 
              className="text-sm font-medium text-neutral-200 hover:text-white transition-colors"
            >
              Forum
            </Link>
          </nav>

          <button
            className="md:hidden text-neutral-300 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onSignOut={handleSignOut}
        notifications={notifications}
        hasUnreadNotifications={hasUnreadNotifications}
        onNotificationsRead={markNotificationsAsRead}
        session={session}
      />
    </header>
  );
};

export default Navbar;
