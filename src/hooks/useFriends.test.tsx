
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useFriends } from './useFriends';
import { supabase } from '@/integrations/supabase/client';

// Mock the Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    channel: vi.fn().mockReturnValue({
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn().mockReturnThis(),
    }),
    removeChannel: vi.fn(),
  },
}));

// Mock the toast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('useFriends', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return empty friends array when userId is null', async () => {
    const { result } = renderHook(() => useFriends(null));
    
    expect(result.current.friends).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  it('should fetch friends when userId is provided', async () => {
    // Mock Supabase responses
    const mockFriendsData = [
      { user_id: 'user1', friend_id: 'friend1', created_at: new Date().toISOString() },
      { user_id: 'user1', friend_id: 'friend2', created_at: new Date().toISOString() },
    ];
    
    const mockUserData = [
      { id: 'friend1', username: 'Friend One', avatar_url: 'avatar1.jpg' },
      { id: 'friend2', username: 'Friend Two', avatar_url: 'avatar2.jpg' },
    ];

    // Setup the mock chain
    supabase.from = vi.fn().mockImplementation((table) => {
      if (table === 'friends') {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ data: mockFriendsData, error: null }),
          }),
        };
      } else if (table === 'profiles') {
        return {
          select: vi.fn().mockReturnValue({
            in: vi.fn().mockResolvedValue({ data: mockUserData, error: null }),
          }),
        };
      }
      return { select: vi.fn().mockReturnThis() };
    });

    const { result } = renderHook(() => useFriends('user1'));

    // Wait for the async operation to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Check that friends were loaded correctly
    expect(result.current.friends.length).toBe(2);
    expect(result.current.friends[0].friend.username).toBe('Friend One');
    expect(result.current.friends[1].friend.username).toBe('Friend Two');
  });

  // Add more tests as needed
});
