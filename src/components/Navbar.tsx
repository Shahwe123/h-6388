
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Menu, X, User, Settings, LogOut, Gamepad, Users, Bell, Trash2, Trophy } from 'lucide-react';

const Navbar = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [mobileNotificationsOpen, setMobileNotificationsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;
  const { toast } = useToast();
  const notificationsRef = useRef<HTMLDivElement>(null);

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
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
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

  const handleMobileNotificationClick = () => {
    setMobileNotificationsOpen(!mobileNotificationsOpen);
    setIsMobileMenuOpen(false);
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

  const handleFriendAction = async (notificationId: string, accept: boolean, friendId: string | null) => {
    if (!session?.user?.id || !friendId) return;
    
    try {
      if (accept) {
        const { error: friendError } = await supabase
          .from('friends')
          .insert([
            { user_id: session.user.id, friend_id: friendId },
            { user_id: friendId, friend_id: session.user.id }
          ]);
          
        if (friendError) throw friendError;
        
        const { error: notifError } = await supabase
          .from('notifications')
          .insert({
            recipient_id: friendId,
            sender_id: session.user.id,
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
      
      setNotifications(prev => 
        prev.filter(notif => notif.id !== notificationId)
      );
      
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
      
      setNotifications(prev => 
        prev.filter(notif => notif.id !== notificationId)
      );
      
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

  const navLinks = session ? [
    { path: '/profile', label: 'Profile' },
    { path: '/friends', label: 'Friends' },
    { path: '/leaderboard', label: 'Leaderboard' },
    { path: '/link-accounts', label: 'Link Accounts' },
    { path: '/settings', label: 'Settings' }
  ] : [
    { path: '/auth', label: 'Sign In' },
    { path: '/leaderboard', label: 'Leaderboard' }
  ];

  const renderNotificationsDropdown = () => (
    <div className="max-h-96 overflow-y-auto bg-primary border border-neon-purple/30 rounded-md shadow-lg shadow-neon-purple/20 backdrop-blur-md">
      <div className="px-4 py-2 border-b border-neutral-800 flex items-center justify-between">
        <h3 className="font-medium">Notifications</h3>
        <button 
          className="p-1 text-neutral-400 hover:text-white transition-colors"
          onClick={() => setIsNotificationsOpen(false)}
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

  return (
    <nav className="fixed w-full top-0 z-50 bg-black border-b border-neon-purple/10">
      <div className="container-padding mx-auto flex items-center justify-between h-16">
        <Link to={session ? "/profile" : "/"} className="flex items-center gap-2">
          <Gamepad className="w-6 h-6 text-neon-purple" />
          <span className="font-bold text-xl text-white neon-text">AchievR</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-white ${
                pathname === link.path ? 'text-white' : 'text-neutral-400'
              }`}
            >
              {link.label}
            </Link>
          ))}
          
          {session && (
            <>
              <div className="relative" ref={notificationsRef}>
                <button 
                  className={`p-2 rounded-full ${hasUnreadNotifications ? 'text-neon-pink' : 'text-neutral-400'} hover:text-white hover:bg-black/20`}
                  onClick={handleNotificationClick}
                >
                  <Bell className="h-5 w-5" />
                  {hasUnreadNotifications && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-neon-pink rounded-full"></span>
                  )}
                </button>
                
                {isNotificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 z-10">
                    {renderNotificationsDropdown()}
                  </div>
                )}
              </div>
              
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

      {isMobileMenuOpen && (
        <div className="md:hidden bg-black backdrop-blur-md">
          <div className="container-padding pt-4 pb-6 space-y-4 border-b border-neon-purple/10">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`block py-2 text-lg ${
                  pathname === link.path ? 'text-white font-medium' : 'text-neutral-400'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

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
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {mobileNotificationsOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex flex-col">
          <div className="bg-primary/95 border-b border-neutral-800 p-4 flex items-center justify-between">
            <h3 className="font-medium text-lg">Notifications</h3>
            <button 
              className="p-2 text-neutral-400 hover:text-white"
              onClick={() => setMobileNotificationsOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {renderNotificationsDropdown()}
          </div>
        </div>
      )}

      {session && isUserMenuOpen && (
        <div className="hidden md:block absolute right-6 top-16">
          <div className="absolute right-0 mt-2 w-48 bg-primary border border-neutral-800 rounded-md shadow-lg py-1 z-10">
            <Link 
              to="/profile" 
              className="flex items-center px-4 py-2 text-sm text-neutral-300 hover:bg-black/30"
              onClick={() => setIsUserMenuOpen(false)}
            >
              <User className="h-4 w-4 mr-2" />
              Profile
            </Link>
            <Link 
              to="/link-accounts" 
              className="flex items-center px-4 py-2 text-sm text-neutral-300 hover:bg-black/30"
              onClick={() => setIsUserMenuOpen(false)}
            >
              <Gamepad className="h-4 w-4 mr-2" />
              Link Accounts
            </Link>
            <Link 
              to="/settings" 
              className="flex items-center px-4 py-2 text-sm text-neutral-300 hover:bg-black/30"
              onClick={() => setIsUserMenuOpen(false)}
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Link>
            <div className="border-t border-neutral-800 my-1"></div>
            <button
              className="flex items-center px-4 py-2 text-sm text-neutral-300 hover:bg-black/30 w-full text-left"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
