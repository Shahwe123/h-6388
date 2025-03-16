
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  setNotifications,
  addNotification,
  fetchNotificationsData
} from '@/redux/slices/notificationsSlice';
import { logout } from '../redux/slices/userSlice.js';
import { Session } from '@supabase/supabase-js';
import { Menu, X } from 'lucide-react';

/**
 * Custom hook to manage navbar state and functionality
 * 
 * Handles mobile menu, notifications, sign out, and other navbar operations
 * 
 * @returns {Object} Navbar state and methods
 */
export const useNavbarState = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const dispatch = useDispatch();
  const notifications = useSelector((state: any) => state.notifications.notifications);

  useEffect(() => {
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        setSession(session);
        if (session?.user?.id) {
          dispatch(fetchNotificationsData(session.user.id));
        }
      });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user?.id) {
        dispatch(fetchNotificationsData(session.user.id));
      }
    });
  }, [dispatch]);

  useEffect(() => {
    if (session?.user?.id) {
      const channel = supabase
        .channel('public:notifications')
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `recipient_id=eq.${session.user.id}`
        }, payload => {
          console.log("New notification received:", payload.new);
          dispatch(addNotification(payload.new));
          setHasUnreadNotifications(true);
        })
        .on('postgres_changes', {
          event: 'DELETE',
          schema: 'public',
          table: 'notifications'
        }, () => {
          dispatch(fetchNotificationsData(session.user.id));
        })
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `recipient_id=eq.${session.user.id}`
        }, payload => {
          console.log("Notification updated:", payload.new);
          dispatch(setNotifications(
            notifications.map((notif: any) =>
              notif.id === payload.new.id ? payload.new : notif
            )
          ));
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [session?.user?.id, dispatch, notifications]);

  useEffect(() => {
    setHasUnreadNotifications(notifications?.some((notif: any) => !notif.read) || false);
  }, [notifications]);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: 'Error signing out',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      dispatch(logout());
      navigate('/auth');
      toast({
        title: 'Signed out successfully',
      });
    }
  };

  const handleNotificationClick = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    if (hasUnreadNotifications) {
      markNotificationsAsRead();
    }
  };

  const markNotificationsAsRead = async () => {
    if (!session?.user?.id || !hasUnreadNotifications) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('recipient_id', session.user.id)
        .eq('read', false);

      if (error) throw error;

      setHasUnreadNotifications(false);

      dispatch(setNotifications(
        notifications.map((notif: any) => ({ ...notif, read: true }))
      ));
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  return {
    session,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    isNotificationsOpen,
    setIsNotificationsOpen,
    hasUnreadNotifications,
    setHasUnreadNotifications,
    notifications,
    handleSignOut,
    handleNotificationClick,
    markNotificationsAsRead
  };
};
