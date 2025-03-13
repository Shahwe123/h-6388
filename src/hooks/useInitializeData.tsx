
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { supabase } from '@/integrations/supabase/client';
import { fetchFriendsData } from '@/redux/slices/friendsSlice';
import { fetchNotificationsData } from '@/redux/slices/notificationsSlice';
import { useToast } from '@/hooks/use-toast';

export const useInitializeData = (userId: string | null) => {
  const dispatch = useDispatch();
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) return;

    // Fetch initial data
    const loadInitialData = async () => {
      try {
        // Load friends data
        dispatch(fetchFriendsData(userId));
        
        // Load notifications data
        dispatch(fetchNotificationsData(userId));
        
        // Set up real-time subscriptions
        setupRealtimeSubscriptions(userId);
      } catch (error: any) {
        toast({
          title: 'Error loading data',
          description: error.message,
          variant: 'destructive',
        });
      }
    };

    loadInitialData();

    // Cleanup function
    return () => {
      cleanupSubscriptions();
    };
  }, [userId, dispatch]);

  const setupRealtimeSubscriptions = (userId: string) => {
    // Friends subscription
    const friendsChannel = supabase
      .channel('public:friends')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'friends',
        filter: `user_id=eq.${userId}`
      }, () => {
        dispatch(fetchFriendsData(userId));
      })
      .on('postgres_changes', { 
        event: 'DELETE', 
        schema: 'public', 
        table: 'friends',
        filter: `user_id=eq.${userId}`
      }, () => {
        dispatch(fetchFriendsData(userId));
      })
      .subscribe();

    // Notifications subscription
    const notificationsChannel = supabase
      .channel('public:notifications')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'notifications',
        filter: `recipient_id=eq.${userId}`
      }, () => {
        dispatch(fetchNotificationsData(userId));
      })
      .on('postgres_changes', { 
        event: 'DELETE', 
        schema: 'public', 
        table: 'notifications',
        filter: `recipient_id=eq.${userId}`
      }, () => {
        dispatch(fetchNotificationsData(userId));
      })
      .subscribe();
  };

  const cleanupSubscriptions = () => {
    supabase.removeAllChannels();
  };
};
