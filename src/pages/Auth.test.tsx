
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Auth from './Auth';
import { BrowserRouter } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

// Mock the toast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

// Mock react-router-dom's useNavigate hook
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe('Auth Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form by default', () => {
    render(
      <BrowserRouter>
        <Auth />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
  });

  it('switches to registration form when "Create an account" is clicked', async () => {
    render(
      <BrowserRouter>
        <Auth />
      </BrowserRouter>
    );
    
    fireEvent.click(screen.getByText('Create an account'));
    
    // Wait for the component to re-render with registration form
    await waitFor(() => {
      expect(screen.getByText('Create an account')).toBeInTheDocument();
      expect(screen.getByLabelText('Username')).toBeInTheDocument();
    });
  });

  it('switches to forgot password form when "Forgot password?" is clicked', async () => {
    render(
      <BrowserRouter>
        <Auth />
      </BrowserRouter>
    );
    
    fireEvent.click(screen.getByText('Forgot password?'));
    
    // Wait for the component to re-render with forgot password form
    await waitFor(() => {
      expect(screen.getByText('Reset your password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Reset Password/i })).toBeInTheDocument();
    });
  });

  it('handles sign in attempt', async () => {
    // Mock successful login
    supabase.auth.signInWithPassword = vi.fn().mockResolvedValue({ error: null });
    
    render(
      <BrowserRouter>
        <Auth />
      </BrowserRouter>
    );
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    
    // Submit the form
    fireEvent.submit(screen.getByRole('button', { name: /Sign In/i }));
    
    // Verify Supabase was called with correct data
    await waitFor(() => {
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('handles sign up attempt', async () => {
    // Mock successful registration
    supabase.auth.signUp = vi.fn().mockResolvedValue({ 
      data: { user: { id: 'new-user-id' } }, 
      error: null 
    });
    
    supabase.from = vi.fn().mockReturnValue({
      insert: vi.fn().mockReturnValue({
        error: null
      })
    });
    
    render(
      <BrowserRouter>
        <Auth />
      </BrowserRouter>
    );
    
    // Switch to register mode
    fireEvent.click(screen.getByText('Create an account'));
    
    await waitFor(() => {
      expect(screen.getByLabelText('Username')).toBeInTheDocument();
    });
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    
    // Submit the form
    fireEvent.submit(screen.getByRole('button', { name: /Sign Up/i }));
    
    // Verify Supabase was called with correct data
    await waitFor(() => {
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        options: {
          data: {
            username: 'testuser',
          },
        },
      });
    });
  });

  it('handles forgot password attempt', async () => {
    // Mock successful password reset
    supabase.auth.resetPasswordForEmail = vi.fn().mockResolvedValue({ error: null });
    
    render(
      <BrowserRouter>
        <Auth />
      </BrowserRouter>
    );
    
    // Switch to forgot password mode
    fireEvent.click(screen.getByText('Forgot password?'));
    
    await waitFor(() => {
      expect(screen.getByText('Reset your password')).toBeInTheDocument();
    });
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    
    // Submit the form
    fireEvent.submit(screen.getByRole('button', { name: /Reset Password/i }));
    
    // Verify Supabase was called with correct data
    await waitFor(() => {
      expect(supabase.auth.resetPasswordForEmail).toHaveBeenCalledWith(
        'test@example.com',
        expect.any(Object)
      );
    });
  });

  it('shows error messages on failed sign in', async () => {
    // Mock failed login
    supabase.auth.signInWithPassword = vi.fn().mockResolvedValue({ 
      error: { message: 'Invalid login credentials' } 
    });
    
    const mockToast = vi.fn();
    vi.mocked(useToast).mockReturnValue({
      toast: mockToast,
    });
    
    render(
      <BrowserRouter>
        <Auth />
      </BrowserRouter>
    );
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrong-password' } });
    
    // Submit the form
    fireEvent.submit(screen.getByRole('button', { name: /Sign In/i }));
    
    // Verify error toast was shown
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error signing in',
        description: 'Invalid login credentials',
        variant: 'destructive',
      });
    });
  });
});
