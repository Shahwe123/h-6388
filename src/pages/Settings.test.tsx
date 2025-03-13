
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Settings from './Settings';
import { supabase } from '@/integrations/supabase/client';

// Mock the toast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('Settings Page', () => {
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
              email: 'test@example.com',
              avatar_url: 'avatar.jpg',
              cover_url: 'cover.jpg',
              bio: 'Test bio',
              is_private: false
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

  it('renders settings page with user profile data', async () => {
    render(<Settings />);
    
    // Wait for profile data to load
    await waitFor(() => {
      expect(screen.queryByText('Loading settings...')).not.toBeInTheDocument();
    });
    
    // Verify form fields are populated with user data
    expect(screen.getByDisplayValue('testuser')).toBeInTheDocument();
    expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test bio')).toBeInTheDocument();
  });

  it('updates profile when form is submitted', async () => {
    render(<Settings />);
    
    // Wait for profile data to load
    await waitFor(() => {
      expect(screen.queryByText('Loading settings...')).not.toBeInTheDocument();
    });
    
    // Update form fields
    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'updateduser' } });
    fireEvent.change(screen.getByLabelText('Bio'), { target: { value: 'Updated bio' } });
    
    // Submit form
    fireEvent.submit(screen.getByText('Save Changes'));
    
    // Verify Supabase was called with correct data
    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('profiles');
      expect(supabase.from().update).toHaveBeenCalledWith({
        username: 'updateduser',
        bio: 'Updated bio'
      });
    });
    
    // Verify toast notification
    expect(toast).toHaveBeenCalledWith({
      title: 'Profile updated',
      description: 'Your profile has been successfully updated',
    });
  });

  it('changes profile privacy settings', async () => {
    render(<Settings />);
    
    // Wait for profile data to load
    await waitFor(() => {
      expect(screen.queryByText('Loading settings...')).not.toBeInTheDocument();
    });
    
    // Default is public, click on Private button
    fireEvent.click(screen.getByText('Private'));
    
    // Submit form
    fireEvent.submit(screen.getByText('Save Changes'));
    
    // Verify Supabase was called with is_private: true
    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('profiles');
      expect(supabase.from().update).toHaveBeenCalledWith(
        expect.objectContaining({ is_private: true })
      );
    });
  });

  it('updates password when new password is provided', async () => {
    // Mock auth update
    supabase.auth.updateUser = vi.fn().mockResolvedValue({ error: null });
    
    render(<Settings />);
    
    // Wait for profile data to load
    await waitFor(() => {
      expect(screen.queryByText('Loading settings...')).not.toBeInTheDocument();
    });
    
    // Enter new password and confirm password
    fireEvent.change(screen.getByLabelText('New Password'), { target: { value: 'newpassword123' } });
    fireEvent.change(screen.getByLabelText('Confirm New Password'), { target: { value: 'newpassword123' } });
    
    // Submit form
    fireEvent.submit(screen.getByText('Save Changes'));
    
    // Verify Supabase auth was called to update password
    await waitFor(() => {
      expect(supabase.auth.updateUser).toHaveBeenCalledWith({
        password: 'newpassword123'
      });
    });
    
    // Verify toast notification
    expect(toast).toHaveBeenCalledWith({
      title: 'Password updated',
      description: 'Your password has been successfully changed',
    });
  });

  it('uploads avatar when avatar input changes', async () => {
    // Mock file upload
    const mockFile = new File(['(⌐□_□)'], 'avatar.png', { type: 'image/png' });
    
    supabase.storage.from = vi.fn().mockReturnValue({
      upload: vi.fn().mockResolvedValue({ error: null }),
      getPublicUrl: vi.fn().mockReturnValue({
        data: { publicUrl: 'https://test-storage-url.com/new-avatar.jpg' }
      })
    });
    
    render(<Settings />);
    
    // Wait for profile data to load
    await waitFor(() => {
      expect(screen.queryByText('Loading settings...')).not.toBeInTheDocument();
    });
    
    // Get file input and simulate change
    const fileInput = screen.getByLabelText(/Change Avatar/i);
    
    // Simulate file upload
    userEvent.upload(fileInput, mockFile);
    
    // Verify Supabase storage was called to upload file
    await waitFor(() => {
      expect(supabase.storage.from).toHaveBeenCalledWith('avatars');
      expect(supabase.storage.from().upload).toHaveBeenCalled();
    });
    
    // Verify profile was updated with new avatar URL
    expect(supabase.from).toHaveBeenCalledWith('profiles');
    expect(supabase.from().update).toHaveBeenCalledWith(
      expect.objectContaining({ avatar_url: expect.any(String) })
    );
    
    // Verify toast notification
    expect(toast).toHaveBeenCalledWith({
      title: 'Avatar updated',
      description: 'Your profile picture has been updated',
    });
  });
});
