
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/hooks/use-toast';
import { Session } from '@supabase/supabase-js';

export const useNavbarState = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const { toast } = useToast();

  // Check for session
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };
    
    checkSession();
    
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  
  // Check for scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mock notification data - in a real app, this would come from your backend
  useEffect(() => {
    if (session) {
      // This is just mock data for demonstration
      setNotifications([
        {
          id: '1',
          type: 'achievement',
          title: 'New Trophy Unlocked',
          message: 'You earned the "First Blood" trophy in Demon\'s Souls',
          read: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        },
        {
          id: '2',
          type: 'friend',
          title: 'Friend Request',
          message: 'EldenLord sent you a friend request',
          read: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        }
      ]);
      
      setHasUnreadNotifications(true);
    }
  }, [session]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out successfully",
      });
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error signing out",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  const handleNotificationClick = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
  };

  const markNotificationsAsRead = async () => {
    // In a real app, you would make an API call to mark notifications as read
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
    setHasUnreadNotifications(false);
  };

  return {
    session,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    isNotificationsOpen,
    setIsNotificationsOpen,
    hasUnreadNotifications,
    notifications,
    handleSignOut,
    handleNotificationClick,
    markNotificationsAsRead,
    isScrolled
  };
};
