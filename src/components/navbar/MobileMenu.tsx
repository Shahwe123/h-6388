
import { Bell, LogOut } from 'lucide-react';
import { useState } from 'react';
import NavLinks from './NavLinks';
import NotificationsDropdown from './NotificationsDropdown';
import { Session } from '@supabase/supabase-js';

type MobileMenuProps = {
  session: Session | null;
  isOpen: boolean;
  onClose: () => void;
  onSignOut: () => void;
  notifications: any[];
  setNotifications: React.Dispatch<React.SetStateAction<any[]>>;
  hasUnreadNotifications: boolean;
  onNotificationsRead: () => void;
};

const MobileMenu = ({ 
  session, 
  isOpen, 
  onClose, 
  onSignOut,
  notifications,
  setNotifications,
  hasUnreadNotifications,
  onNotificationsRead
}: MobileMenuProps) => {
  const [mobileNotificationsOpen, setMobileNotificationsOpen] = useState(false);

  const handleMobileNotificationClick = () => {
    setMobileNotificationsOpen(!mobileNotificationsOpen);
    onClose();
    if (hasUnreadNotifications) {
      onNotificationsRead();
    }
  };

  if (!isOpen && !mobileNotificationsOpen) return null;

  if (mobileNotificationsOpen) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 flex flex-col">
        <NotificationsDropdown 
          notifications={notifications}
          setNotifications={setNotifications}
          onClose={() => setMobileNotificationsOpen(false)}
          userId={session?.user?.id}
          isMobile={true}
        />
      </div>
    );
  }

  return (
    <div className="md:hidden bg-black backdrop-blur-md">
      <div className="container-padding pt-4 pb-6 space-y-4 border-b border-neon-purple/10">
        <NavLinks 
          session={session} 
          isMobile={true}
          onClick={onClose}
        />

        {session && (
          <>
            <button
              className={`flex items-center w-full py-2 text-lg ${hasUnreadNotifications ? 'text-neon-pink' : 'text-neutral-400'}`}
              onClick={handleMobileNotificationClick}
            >
              <Bell className="h-5 w-5 mr-2" />
              <span>Notifications</span>
              {hasUnreadNotifications && (
                <span className="ml-2 w-2 h-2 bg-neon-pink rounded-full"></span>
              )}
            </button>
            
            <div className="pt-4 border-t border-neutral-800">
              <button
                className="flex items-center text-neutral-400 hover:text-white w-full py-2"
                onClick={onSignOut}
              >
                <LogOut className="h-5 w-5 mr-2" />
                <span>Sign Out</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
