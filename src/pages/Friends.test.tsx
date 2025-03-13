
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Friends from './Friends';
import { BrowserRouter } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useFriends } from '@/hooks/useFriends';

// Mock the hooks
vi.mock('@/hooks/useFriends', () => ({
  useFriends: vi.fn(),
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

// Mock react-router-dom's useNavigate hook
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock the FriendActivity component since we're just testing Friends integration
vi.mock('@/components/friends/FriendActivity', () => ({
  default: () => <div data-testid="friend-activity">Friend Activity Mock</div>,
}));

// Mock the UserSearch component
vi.mock('@/components/friends/UserSearch', () => ({
  default: (props) => (
    <div data-testid="user-search">
      User Search Mock
      <button data-testid="close-search" onClick={props.onClose}>Close</button>
    </div>
  ),
}));

describe('Friends Page Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useFriends).mockReturnValue({
      friends: [
        {
          id: 'user1-friend1',
          friend: {
            id: 'friend1',
            username: 'TestFriend1',
            avatar_url: null
          }
        },
        {
          id: 'user1-friend2',
          friend: {
            id: 'friend2',
            username: 'TestFriend2',
            avatar_url: 'avatar2.jpg'
          }
        }
      ],
      loading: false,
      setFriends: vi.fn(),
    });
  });

  it('renders friends page with friend list', async () => {
    render(
      <BrowserRouter>
        <Friends />
      </BrowserRouter>
    );
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Friends')).toBeInTheDocument();
    });
    
    // Verify friends are displayed
    expect(screen.getByText('TestFriend1')).toBeInTheDocument();
    expect(screen.getByText('TestFriend2')).toBeInTheDocument();
    
    // Verify friend activity component is rendered
    expect(screen.getByTestId('friend-activity')).toBeInTheDocument();
  });

  it('opens user search modal when "Add Friend" button is clicked', async () => {
    render(
      <BrowserRouter>
        <Friends />
      </BrowserRouter>
    );
    
    // Click the Add Friend button
    const addFriendButton = screen.getByText('Add Friend');
    fireEvent.click(addFriendButton);
    
    // Verify user search modal is displayed
    await waitFor(() => {
      expect(screen.getByTestId('user-search')).toBeInTheDocument();
    });
    
    // Close the modal
    fireEvent.click(screen.getByTestId('close-search'));
    
    // Verify modal is closed
    await waitFor(() => {
      expect(screen.queryByTestId('user-search')).not.toBeInTheDocument();
    });
  });

  it('navigates to friend profile when friend is clicked', async () => {
    render(
      <BrowserRouter>
        <Friends />
      </BrowserRouter>
    );
    
    // Wait for friends to load
    await waitFor(() => {
      expect(screen.getByText('TestFriend1')).toBeInTheDocument();
    });
    
    // Click on a friend
    fireEvent.click(screen.getByText('TestFriend1'));
    
    // Verify navigation to profile page
    expect(mockNavigate).toHaveBeenCalledWith('/profile?id=friend1');
  });

  it('removes a friend when remove button is clicked', async () => {
    // Mock supabase delete operation
    vi.mock('@/integrations/supabase/client', () => ({
      supabase: {
        from: vi.fn().mockReturnValue({
          delete: vi.fn().mockReturnValue({
            or: vi.fn().mockResolvedValue({ error: null })
          })
        })
      }
    }));
    
    const mockSetFriends = vi.fn();
    vi.mocked(useFriends).mockReturnValue({
      friends: [
        {
          id: 'user1-friend1',
          friend: {
            id: 'friend1',
            username: 'TestFriend1',
            avatar_url: null
          }
        }
      ],
      loading: false,
      setFriends: mockSetFriends,
    });
    
    render(
      <BrowserRouter>
        <Friends />
      </BrowserRouter>
    );
    
    // Wait for friends to load
    await waitFor(() => {
      expect(screen.getByText('TestFriend1')).toBeInTheDocument();
    });
    
    // Find and click the remove friend button (assuming it has a title attribute)
    const removeButtons = screen.getAllByTitle('Remove friend');
    fireEvent.click(removeButtons[0]);
    
    // Verify the friend was removed from the list
    expect(mockSetFriends).toHaveBeenCalled();
  });
});
