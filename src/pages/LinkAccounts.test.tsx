
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LinkAccounts from './LinkAccounts';
import { supabase } from '@/integrations/supabase/client';

// Mock the toast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('LinkAccounts Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock profile data
    supabase.from = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: {
              id: 'test-user-id',
              username: 'testuser',
              steam_id: null,
              xbox_gamertag: null,
              playstation_username: null
            },
            error: null
          })
        })
      }),
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null })
      })
    });
  });

  it('renders LinkAccounts page with platform linking options', async () => {
    render(<LinkAccounts />);
    
    // Wait for profile data to load
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    
    // Verify platform options are displayed
    expect(screen.getByText('Connect Your Gaming Accounts')).toBeInTheDocument();
    expect(screen.getByText('Steam')).toBeInTheDocument();
    expect(screen.getByText('Xbox')).toBeInTheDocument();
    expect(screen.getByText('PlayStation')).toBeInTheDocument();
  });

  it('links Steam account when form is submitted', async () => {
    render(<LinkAccounts />);
    
    // Wait for profile data to load
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    
    // Find Steam section and click Link button
    const steamSection = screen.getByText('Steam').closest('div');
    const linkButton = within(steamSection).getByText('Link Account');
    fireEvent.click(linkButton);
    
    // Fill in Steam ID
    const steamIdInput = screen.getByPlaceholderText('Enter your Steam ID');
    fireEvent.change(steamIdInput, { target: { value: '76561198123456789' } });
    
    // Submit the form
    const submitButton = screen.getByText('Connect Steam Account');
    fireEvent.click(submitButton);
    
    // Verify Supabase was called to update profile
    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('profiles');
      expect(supabase.from().update).toHaveBeenCalledWith({
        steam_id: '76561198123456789'
      });
    });
    
    // Verify toast notification
    expect(toast).toHaveBeenCalledWith({
      title: 'Steam account linked',
      description: expect.any(String),
    });
  });

  it('links Xbox account when form is submitted', async () => {
    render(<LinkAccounts />);
    
    // Wait for profile data to load
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    
    // Find Xbox section and click Link button
    const xboxSection = screen.getByText('Xbox').closest('div');
    const linkButton = within(xboxSection).getByText('Link Account');
    fireEvent.click(linkButton);
    
    // Fill in Xbox Gamertag
    const gamertag = screen.getByPlaceholderText('Enter your Xbox Gamertag');
    fireEvent.change(gamertag, { target: { value: 'TestGamerTag' } });
    
    // Submit the form
    const submitButton = screen.getByText('Connect Xbox Account');
    fireEvent.click(submitButton);
    
    // Verify Supabase was called to update profile
    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('profiles');
      expect(supabase.from().update).toHaveBeenCalledWith({
        xbox_gamertag: 'TestGamerTag'
      });
    });
    
    // Verify toast notification
    expect(toast).toHaveBeenCalledWith({
      title: 'Xbox account linked',
      description: expect.any(String),
    });
  });

  it('links PlayStation account when form is submitted', async () => {
    render(<LinkAccounts />);
    
    // Wait for profile data to load
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    
    // Find PlayStation section and click Link button
    const psSection = screen.getByText('PlayStation').closest('div');
    const linkButton = within(psSection).getByText('Link Account');
    fireEvent.click(linkButton);
    
    // Fill in PlayStation Username
    const psUsername = screen.getByPlaceholderText('Enter your PlayStation Username');
    fireEvent.change(psUsername, { target: { value: 'TestPSUser' } });
    
    // Submit the form
    const submitButton = screen.getByText('Connect PlayStation Account');
    fireEvent.click(submitButton);
    
    // Verify Supabase was called to update profile
    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('profiles');
      expect(supabase.from().update).toHaveBeenCalledWith({
        playstation_username: 'TestPSUser'
      });
    });
    
    // Verify toast notification
    expect(toast).toHaveBeenCalledWith({
      title: 'PlayStation account linked',
      description: expect.any(String),
    });
  });
  
  it('shows error message when linking fails', async () => {
    // Mock update error
    supabase.from = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: {
              id: 'test-user-id',
              username: 'testuser',
              steam_id: null
            },
            error: null
          })
        })
      }),
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: { message: 'Error updating profile' } })
      })
    });
    
    render(<LinkAccounts />);
    
    // Wait for profile data to load
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    
    // Find Steam section and click Link button
    const steamSection = screen.getByText('Steam').closest('div');
    const linkButton = within(steamSection).getByText('Link Account');
    fireEvent.click(linkButton);
    
    // Fill in Steam ID
    const steamIdInput = screen.getByPlaceholderText('Enter your Steam ID');
    fireEvent.change(steamIdInput, { target: { value: '76561198123456789' } });
    
    // Submit the form
    const submitButton = screen.getByText('Connect Steam Account');
    fireEvent.click(submitButton);
    
    // Verify error toast notification
    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({
        title: 'Error linking Steam account',
        description: 'Error updating profile',
        variant: 'destructive',
      });
    });
  });
});
