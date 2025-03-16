
import { useNavbarState } from '@/hooks/useNavbarState';
import NavLinks from './navbar/NavLinks';
import NotificationButton from './navbar/NotificationButton';
import MobileMenu from './navbar/MobileMenu';
import NavbarBrand from './navbar/NavbarBrand';
import NavbarSignOutButton from './navbar/NavbarSignOutButton';
import { Menu, X } from 'lucide-react';

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
    markNotificationsAsRead
  } = useNavbarState();

  return (
    <nav className="fixed w-full top-0 z-50 bg-black border-b border-neon-purple/10">
      <div className="max-w-full container-padding mx-auto flex items-center justify-between h-16">
        <NavbarBrand session={session} />

        <div className="hidden md:flex items-center gap-6">
          <NavLinks session={session} />

          {session && (
            <>
              <NotificationButton
                hasUnreadNotifications={hasUnreadNotifications}
                isOpen={isNotificationsOpen}
                onClick={handleNotificationClick}
                onClose={() => setIsNotificationsOpen(false)}
                notifications={notifications}
                setNotifications={setNotifications}
                userId={session.user.id}
              />

              <NavbarSignOutButton handleSignOut={handleSignOut} />
            </>
          )}
        </div>

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

      <MobileMenu
        session={session}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onSignOut={handleSignOut}
        notifications={notifications}
        setNotifications={setNotifications}
        hasUnreadNotifications={hasUnreadNotifications}
        onNotificationsRead={markNotificationsAsRead}
      />
    </nav>
  );
};

export default Navbar;
