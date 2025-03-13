
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import Friends from './Friends';
import { BrowserRouter } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

// Mock the hooks
vi.mock('@/hooks/useFriends', () => ({
  useFriends: () => ({
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
  }),
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({
        data: {
          session: {
            user: { id: 'user1' }
          }
        }
      }),
    },
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({
      data: { username: 'TestUser' },
      error: null
    }),
    channel: vi.fn().mockReturnValue({
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn(),
    }),
    removeChannel: vi.fn(),
  },
}));

// Mock the FriendActivity component since we're just testing Friends integration
vi.mock('@/components/friends/FriendActivity', () => ({
  default: () => <div data-testid="friend-activity">Friend Activity Mock</div>,
}));

describe('Friends Page Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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

  // Add more integration tests as needed
});
