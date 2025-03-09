
import { Bell } from 'lucide-react';
import { useRef, useEffect } from 'react';
import NotificationsDropdown from './NotificationsDropdown';

type NotificationButtonProps = {
  hasUnreadNotifications: boolean;
  isOpen: boolean;
  onClick: () => void;
  onClose: () => void;
  notifications: any[];
  setNotifications: React.Dispatch<React.SetStateAction<any[]>>;
  userId?: string;
};

const NotificationButton = ({
  hasUnreadNotifications,
  isOpen,
  onClick,
  onClose,
  notifications,
  setNotifications,
  userId
}: NotificationButtonProps) => {
  const notificationsRef = useRef<HTMLDivElement>(null);

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
      <button 
        className={`p-2 rounded-full ${hasUnreadNotifications ? 'text-neon-pink' : 'text-neutral-400'} hover:text-white hover:bg-black/20`}
        onClick={onClick}
      >
        <Bell className="h-5 w-5" />
        {hasUnreadNotifications && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-neon-pink rounded-full"></span>
        )}
      </button>
      
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
