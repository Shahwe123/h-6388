
import { Bell } from 'lucide-react';
import { useRef, useEffect } from 'react';
import NotificationsDropdown from './NotificationsDropdown';

/**
 * Props for the NotificationButton component
 * @property {boolean} hasUnreadNotifications - Whether there are unread notifications
 * @property {boolean} isOpen - Whether the notifications dropdown is open
 * @property {Function} onClick - Click handler for the notification button
 * @property {Function} onClose - Handler for closing the notifications dropdown
 * @property {Array} notifications - Array of notification objects
 * @property {string} userId - Current user ID
 */
type NotificationButtonProps = {
  hasUnreadNotifications: boolean;
  isOpen: boolean;
  onClick: () => void;
  onClose: () => void;
  notifications: any[];
  userId?: string;
};

/**
 * NotificationButton component
 * 
 * A button that shows a notification indicator and opens a dropdown
 * of notifications when clicked. Handles displaying unread status and
 * manages the notifications dropdown.
 * 
 * @param {NotificationButtonProps} props - Component props
 * @returns {JSX.Element} The notification button UI
 */
const NotificationButton = ({
  hasUnreadNotifications,
  isOpen,
  onClick,
  onClose,
  notifications,
  userId
}: NotificationButtonProps) => {
  // Ref for detecting clicks outside the dropdown
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="relative" ref={notificationsRef}>
      {/* Notification Bell Button */}
      <button 
        className={`p-2 rounded-full ${hasUnreadNotifications ? 'text-neon-pink' : 'text-neutral-400'} hover:text-white hover:bg-black/20`}
        onClick={onClick}
      >
        <Bell className="h-5 w-5" />
        {hasUnreadNotifications && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-neon-pink rounded-full"></span>
        )}
      </button>
      
      {/* Notifications Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 z-10">
          <NotificationsDropdown 
            notifications={notifications}
            onClose={onClose}
            userId={userId}
          />
        </div>
      )}
    </div>
  );
};

export default NotificationButton;
