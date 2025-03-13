
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NotificationsDropdown from './NotificationsDropdown';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('NotificationsDropdown', () => {
  const mockSetNotifications = vi.fn();
  const mockOnClose = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('renders empty state when no notifications', () => {
    render(
      <NotificationsDropdown 
        notifications={[]} 
        setNotifications={mockSetNotifications}
        onClose={mockOnClose}
        userId="user1"
      />
    );
    
    expect(screen.getByText('No notifications yet')).toBeInTheDocument();
  });
  
  it('renders friend request notifications with accept/decline buttons', () => {
    const notifications = [
      {
        id: 'notif1',
        recipient_id: 'user1',
        sender_id: 'user2',
        sender_username: 'TestUser2',
        type: 'friend_request',
        read: false,
        created_at: new Date().toISOString(),
      }
    ];
    
    render(
      <NotificationsDropdown 
        notifications={notifications} 
        setNotifications={mockSetNotifications}
        onClose={mockOnClose}
        userId="user1"
      />
    );
    
    expect(screen.getByText('Friend request')).toBeInTheDocument();
    expect(screen.getByText(/from TestUser2/)).toBeInTheDocument();
    expect(screen.getByText('Accept')).toBeInTheDocument();
    expect(screen.getByText('Decline')).toBeInTheDocument();
  });
  
  it('renders friend accepted notifications', () => {
    const notifications = [
      {
        id: 'notif1',
        recipient_id: 'user1',
        sender_id: 'user2',
        sender_username: 'TestUser2',
        type: 'friend_accepted',
        read: false,
        created_at: new Date().toISOString(),
      }
    ];
    
    render(
      <NotificationsDropdown 
        notifications={notifications} 
        setNotifications={mockSetNotifications}
        onClose={mockOnClose}
        userId="user1"
      />
    );
    
    expect(screen.getByText('Friend request accepted')).toBeInTheDocument();
    expect(screen.getByText(/by TestUser2/)).toBeInTheDocument();
  });
  
  it('handles accepting a friend request', async () => {
    // Mock Supabase operations
    supabase.from = vi.fn().mockReturnValue({
      insert: vi.fn().mockResolvedValue({ error: null }),
      delete: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null })
      })
    });
    
    const notifications = [
      {
        id: 'notif1',
        recipient_id: 'user1',
        sender_id: 'user2',
        sender_username: 'TestUser2',
        type: 'friend_request',
        read: false,
        created_at: new Date().toISOString(),
      }
    ];
    
    render(
      <NotificationsDropdown 
        notifications={notifications} 
        setNotifications={mockSetNotifications}
        onClose={mockOnClose}
        userId="user1"
      />
    );
    
    // Click accept button
    fireEvent.click(screen.getByText('Accept'));
    
    // Verify Supabase was called to insert friendship records
    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('friends');
      expect(supabase.from().insert).toHaveBeenCalledWith([
        { user_id: 'user1', friend_id: 'user2' },
        { user_id: 'user2', friend_id: 'user1' }
      ]);
    });
    
    // Verify notification was deleted
    expect(supabase.from).toHaveBeenCalledWith('notifications');
    expect(supabase.from().delete).toHaveBeenCalled();
    
    // Verify toast notification
    expect(toast).toHaveBeenCalledWith({
      title: 'Friend request accepted',
    });
    
    // Verify notifications state was updated
    expect(mockSetNotifications).toHaveBeenCalled();
  });
  
  it('handles declining a friend request', async () => {
    // Mock Supabase operations
    supabase.from = vi.fn().mockReturnValue({
      delete: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null })
      })
    });
    
    const notifications = [
      {
        id: 'notif1',
        recipient_id: 'user1',
        sender_id: 'user2',
        sender_username: 'TestUser2',
        type: 'friend_request',
        read: false,
        created_at: new Date().toISOString(),
      }
    ];
    
    render(
      <NotificationsDropdown 
        notifications={notifications} 
        setNotifications={mockSetNotifications}
        onClose={mockOnClose}
        userId="user1"
      />
    );
    
    // Click decline button
    fireEvent.click(screen.getByText('Decline'));
    
    // Verify notification was deleted
    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('notifications');
      expect(supabase.from().delete).toHaveBeenCalled();
    });
    
    // Verify toast notification
    expect(toast).toHaveBeenCalledWith({
      title: 'Friend request declined',
    });
    
    // Verify notifications state was updated
    expect(mockSetNotifications).toHaveBeenCalled();
  });
  
  it('allows deleting a notification', async () => {
    // Mock Supabase operations
    supabase.from = vi.fn().mockReturnValue({
      delete: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null })
      })
    });
    
    const notifications = [
      {
        id: 'notif1',
        recipient_id: 'user1',
        sender_id: 'user2',
        sender_username: 'TestUser2',
        type: 'friend_accepted',
        read: false,
        created_at: new Date().toISOString(),
      }
    ];
    
    render(
      <NotificationsDropdown 
        notifications={notifications} 
        setNotifications={mockSetNotifications}
        onClose={mockOnClose}
        userId="user1"
      />
    );
    
    // Click delete button (trash icon)
    fireEvent.click(screen.getByLabelText('Delete notification'));
    
    // Verify notification was deleted
    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('notifications');
      expect(supabase.from().delete).toHaveBeenCalled();
    });
    
    // Verify toast notification
    expect(toast).toHaveBeenCalledWith({
      title: 'Notification deleted',
    });
    
    // Verify notifications state was updated
    expect(mockSetNotifications).toHaveBeenCalled();
  });
  
  it('closes dropdown when close button is clicked', () => {
    render(
      <NotificationsDropdown 
        notifications={[]} 
        setNotifications={mockSetNotifications}
        onClose={mockOnClose}
        userId="user1"
      />
    );
    
    // Click close button
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    
    // Verify onClose was called
    expect(mockOnClose).toHaveBeenCalled();
  });
});
