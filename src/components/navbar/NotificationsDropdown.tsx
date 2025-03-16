
import { Bell, Trash2, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useDispatch } from 'react-redux';
import { removeNotification } from '@/redux/slices/notificationsSlice';

type Notification = {
  id: string;
  recipient_id: string;
  sender_id: string;
  sender_username?: string;
  type: 'friend_request' | 'friend_accepted' | 'friend_rejected';
  read: boolean;
  created_at: string;
};

type NotificationsDropdownProps = {
  notifications: Notification[];
  onClose: () => void;
  userId?: string;
  isMobile?: boolean;
};

const NotificationsDropdown = ({ 
  notifications, 
  onClose, 
  userId,
  isMobile = false
}: NotificationsDropdownProps) => {
  const { toast } = useToast();
  const dispatch = useDispatch();

  const handleFriendAction = async (notificationId: string, accept: boolean, friendId: string | null) => {
    if (!userId || !friendId) return;
    
    try {
      if (accept) {
        const { error: friendError } = await supabase
          .from('friends')
          .insert([
            { user_id: userId, friend_id: friendId },
            { user_id: friendId, friend_id: userId }
          ]);
          
        if (friendError) throw friendError;
        
        const { error: notifError } = await supabase
          .from('notifications')
          .insert({
            recipient_id: friendId,
            sender_id: userId,
            type: 'friend_accepted',
            read: false
          });
          
        if (notifError) throw notifError;
      }
      
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);
        
      if (error) throw error;
      
      dispatch(removeNotification(notificationId));
      
      toast({
        title: accept ? 'Friend request accepted' : 'Friend request declined',
      });
    } catch (error: any) {
      toast({
        title: 'Error processing friend request',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDeleteNotification = async (notificationId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);
        
      if (error) throw error;
      
      dispatch(removeNotification(notificationId));
      
      toast({
        title: 'Notification deleted',
      });
    } catch (error: any) {
      toast({
        title: 'Error deleting notification',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className={`bg-primary border border-neon-purple/30 rounded-md shadow-lg shadow-neon-purple/20 backdrop-blur-md ${isMobile ? 'w-full' : 'max-h-96 overflow-y-auto'}`}>
      <div className="px-4 py-2 border-b border-neutral-800 flex items-center justify-between">
        <h3 className="font-medium">Notifications</h3>
        <button 
          className="p-1 text-neutral-400 hover:text-white transition-colors"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      {notifications.length === 0 ? (
        <div className="px-4 py-6 text-center text-neutral-400">
          <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p>No notifications yet</p>
        </div>
      ) : (
        notifications.map(notification => (
          <div 
            key={notification.id} 
            className={`px-4 py-3 border-b border-neutral-800 last:border-0 ${!notification.read ? 'bg-black/30' : ''} relative`}
          >
            <button
              className="absolute top-3 right-3 p-1 text-neutral-400 hover:text-red-500 transition-colors"
              onClick={(e) => handleDeleteNotification(notification.id, e)}
              aria-label="Delete notification"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            
            {notification.type === 'friend_request' && (
              <div>
                <p className="mb-2 text-sm pr-6">
                  <span className="font-medium text-neon-blue">Friend request</span> from {notification.sender_username || 'a user'}
                </p>
                <div className="flex gap-2">
                  <button 
                    className="bg-neon-purple/20 hover:bg-neon-purple/30 text-white px-3 py-1 rounded text-xs"
                    onClick={() => handleFriendAction(notification.id, true, notification.sender_id)}
                  >
                    Accept
                  </button>
                  <button 
                    className="bg-black/30 hover:bg-black/50 text-neutral-300 px-3 py-1 rounded text-xs"
                    onClick={() => handleFriendAction(notification.id, false, notification.sender_id)}
                  >
                    Decline
                  </button>
                </div>
              </div>
            )}
            
            {notification.type === 'friend_accepted' && (
              <div>
                <p className="text-sm pr-6">
                  <span className="font-medium text-green-500">Friend request accepted</span> by {notification.sender_username || 'a user'}
                </p>
              </div>
            )}
            
            {notification.type === 'friend_rejected' && (
              <div>
                <p className="text-sm pr-6">
                  <span className="font-medium text-neutral-400">Friend request declined</span> by {notification.sender_username || 'a user'}
                </p>
              </div>
            )}
            
            <p className="text-xs text-neutral-500 mt-1">
              {new Date(notification.created_at).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default NotificationsDropdown;
