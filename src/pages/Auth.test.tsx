
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      resetPasswordForEmail: vi.fn(),
    },
    from: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
  },
}));

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

  // Add more tests as needed
});
