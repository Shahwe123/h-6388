import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Menu, X, LogOut, Gamepad } from 'lucide-react';
import NavLinks from './navbar/NavLinks';
import NotificationButton from './navbar/NotificationButton';
import MobileMenu from './navbar/MobileMenu';

const Navbar = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        setSession(session);
      });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    if (session?.user?.id) {
      fetchNotifications();
      
      const channel = supabase
        .channel('public:notifications')
        .on('postgres_changes', { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'notifications',
          filter: `recipient_id=eq.${session.user.id}`
        }, payload => {
          setNotifications(prev => [payload.new, ...prev]);
          setHasUnreadNotifications(true);
        })
        .on('postgres_changes', { 
          event: 'DELETE', 
          schema: 'public', 
          table: 'notifications'
        }, () => {
          fetchNotifications();
        })
        .on('postgres_changes', { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'notifications',
          filter: `recipient_id=eq.${session.user.id}`
        }, payload => {
          setNotifications(prev => 
            prev.map(notif => notif.id === payload.new.id ? payload.new : notif)
          );
        })
        .subscribe();
        
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [session?.user?.id]);

  const fetchNotifications = async () => {
    if (!session?.user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('recipient_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(10);
        
      if (error) throw error;
      
      setNotifications(data || []);
      setHasUnreadNotifications(data?.some(notif => !notif.read) || false);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: 'Error signing out',
        description: error.message,
        variant: 'destructive',
      });
    } else {
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
      
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, read: true }))
      );
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  return (
    <nav className="fixed w-full top-0 z-50 bg-black border-b border-neon-purple/10">
      <div className="container-padding mx-auto flex items-center justify-between h-16">
        <Link to={session ? "/profile" : "/"} className="flex items-center gap-2">
          <Gamepad className="w-6 h-6 text-neon-purple" />
          <span className="font-bold text-xl text-white neon-text">PlatinumPath</span>
        </Link>

        {/* Desktop Navigation */}
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

        {/* Mobile Menu Toggle */}
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

      {/* Mobile Menu */}
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
