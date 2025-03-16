
import { Bell } from 'lucide-react';
import { useRef, useEffect } from 'react';
import NotificationsDropdown from './NotificationsDropdown';

/**
 * Props for the NotificationButton component
 */
type NotificationButtonProps = {
  hasUnreadNotifications: boolean;  // Whether there are unread notifications
  isOpen: boolean;                  // Whether the notifications dropdown is open
  onClick: () => void;              // Function to call when the button is clicked
  onClose: () => void;              // Function to call when the dropdown is closed
  notifications: any[];             // Array of notifications to display
  setNotifications: React.Dispatch<React.SetStateAction<any[]>>; // State setter for notifications
  userId?: string;                  // Optional user ID for notification management
};

/**
 * NotificationButton component
 * Button that shows notification status and displays a dropdown of notifications when clicked
 * 
 * @param hasUnreadNotifications - Whether there are unread notifications
 * @param isOpen - Whether the notifications dropdown is open
 * @param onClick - Function to call when the button is clicked
 * @param onClose - Function to call when the dropdown is closed
 * @param notifications - Array of notifications to display
 * @param setNotifications - State setter for notifications
 * @param userId - Optional user ID for notification management
 */
const NotificationButton = ({
  hasUnreadNotifications,
  isOpen,
  onClick,
  onClose,
  notifications,
  setNotifications,
  userId
}: NotificationButtonProps) => {
  // Reference to the notifications container for click outside detection
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Add click outside handler to close dropdown when clicking elsewhere
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
      {/* Notification bell button */}
      <button 
        className={`p-2 rounded-full ${hasUnreadNotifications ? 'text-neon-pink' : 'text-neutral-400'} hover:text-white hover:bg-black/20`}
        onClick={onClick}
      >
        <Bell className="h-5 w-5" />
        {hasUnreadNotifications && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-neon-pink rounded-full"></span>
        )}
      </button>
      
      {/* Notifications dropdown (only shown when isOpen is true) */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 z-10">
          <NotificationsDropdown 
            notifications={notifications}
            setNotifications={setNotifications}
            onClose={onClose}
            userId={userId}
          />
        </div>
      )}
    </div>
  );
};

export default NotificationButton;
