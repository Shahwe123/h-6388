
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Menu, X, LogOut, Gamepad } from 'lucide-react';
import NavLinks from './navbar/NavLinks';
import NotificationButton from './navbar/NotificationButton';
import MobileMenu from './navbar/MobileMenu';
import { useDispatch, useSelector } from 'react-redux';
import {
  setNotifications,
  addNotification,
  fetchNotificationsStart,
  fetchNotificationsFailure,
  fetchNotificationsData
} from '@/redux/slices/notificationsSlice';
import {logout} from '../redux/slices/userSlice.js'

const Navbar = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const dispatch = useDispatch();
  const notifications = useSelector((state: any) => state.notifications.notifications);
  // const user = useSelector((state: any) => state.user);

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
      //TODO: logout doesnt delete persist storage
      dispatch(logout())
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

  return (
    <nav className="fixed w-full top-0 z-50 bg-black border-b border-neon-purple/10">
      <div className="max-w-full container-padding mx-auto flex items-center justify-between h-16">
        <Link to={session ? "/profile" : "/"} className="flex items-center gap-2">
          <Gamepad className="w-6 h-6 text-neon-purple" />
          <span className="font-bold text-xl text-white neon-text">PlatinumPath</span>
        </Link>

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

              <button
                onClick={handleSignOut}
                className="text-sm font-medium text-neutral-400 hover:text-white transition-colors flex items-center"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Sign Out
              </button>
            </>
          )}
        </div>

        <button
          className="md:hidden text-neutral-300 focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
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
