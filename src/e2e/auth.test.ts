
import { describe, it, expect, vi, beforeAll, afterAll, beforeEach } from 'vitest';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { screen, waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Auth from '../pages/Auth';
import { useToast } from '@/hooks/use-toast';

// Mock implementation of window object for E2E testing
const mockWindow = {
  location: {
    href: 'http://localhost:8080/auth',
    origin: 'http://localhost:8080',
    pathname: '/auth',
    replace: vi.fn(),
  },
};

global.window = mockWindow as any;

// Mock toast for notifications
vi.mock('@/hooks/use-toast', () => ({
  useToast: vi.fn().mockReturnValue({
    toast: vi.fn(),
  }),
}));

// Setup MSW server to intercept API requests
const server = setupServer(
  // Mock Supabase auth endpoints
  rest.post('https://nvjjragekchczuxgdvvo.supabase.co/auth/v1/token', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        access_token: 'mock-access-token',
        token_type: 'bearer',
        expires_in: 3600,
        refresh_token: 'mock-refresh-token',
        user: {
          id: 'mock-user-id',
          email: 'test@example.com',
        },
      })
    );
  }),
  
  rest.post('https://nvjjragekchczuxgdvvo.supabase.co/auth/v1/signup', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: 'mock-user-id',
        email: 'test@example.com',
      })
    );
  }),
  
  rest.post('https://nvjjragekchczuxgdvvo.supabase.co/auth/v1/recover', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        message: 'Password recovery email sent',
      })
    );
  }),
  
  rest.post('https://nvjjragekchczuxgdvvo.supabase.co/rest/v1/profiles', (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        id: 'mock-user-id',
        username: 'testuser',
        email: 'test@example.com',
      })
    );
  }),
);

describe('Authentication E2E Flow', () => {
  beforeAll(() => server.listen());
  afterAll(() => server.close());
  beforeEach(() => {
    server.resetHandlers();
    vi.clearAllMocks();
  });
  
  it('should allow user to sign in successfully', async () => {
    const mockToast = vi.fn();
    (useToast as jest.Mock).mockReturnValue({
      toast: mockToast,
    });

    // Render the Auth component
    render(
      <BrowserRouter>
        <Auth />
      </BrowserRouter>
    );
    
    // Fill in login credentials
    await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'password123');
    
    // Click login button
    await userEvent.click(screen.getByRole('button', { name: /Sign In/i }));
    
    // Assert toast notification
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Signed in successfully',
      });
    });
    
    // Assert navigation to profile page
    expect(window.location.replace).toHaveBeenCalledWith('/profile');
  });
  
  it('should allow user to sign up successfully', async () => {
    const mockToast = vi.fn();
    (useToast as jest.Mock).mockReturnValue({
      toast: mockToast,
    });

    // Render the Auth component
    render(
      <BrowserRouter>
        <Auth />
      </BrowserRouter>
    );
    
    // Click on "Create an account" link
    await userEvent.click(screen.getByText('Create an account'));
    
    // Fill in registration form
    await waitFor(() => {
      expect(screen.getByLabelText('Username')).toBeInTheDocument();
    });
    
    await userEvent.type(screen.getByLabelText('Username'), 'testuser');
    await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'password123');
    
    // Click sign up button
    await userEvent.click(screen.getByRole('button', { name: /Sign Up/i }));
    
    // Assert toast notification
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Signed up successfully',
        description: 'Please check your email to verify your account',
      });
    });
    
    // Assert redirection to login page
    await waitFor(() => {
      expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
    });
  });
  
  it('should handle forgot password flow', async () => {
    const mockToast = vi.fn();
    (useToast as jest.Mock).mockReturnValue({
      toast: mockToast,
    });

    // Render the Auth component
    render(
      <BrowserRouter>
        <Auth />
      </BrowserRouter>
    );
    
    // Click on "Forgot password?" link
    await userEvent.click(screen.getByText('Forgot password?'));
    
    // Fill in email
    await waitFor(() => {
      expect(screen.getByText('Reset your password')).toBeInTheDocument();
    });
    
    await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
    
    // Click reset password button
    await userEvent.click(screen.getByRole('button', { name: /Reset Password/i }));
    
    // Assert toast notification
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Reset password email sent',
        description: 'Please check your email to reset your password',
      });
    });
    
    // Assert redirection to login page
    await waitFor(() => {
      expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
    });
  });
  
  it('should show error messages for invalid login', async () => {
    // Override the success handler with an error response
    server.use(
      rest.post('https://nvjjragekchczuxgdvvo.supabase.co/auth/v1/token', (req, res, ctx) => {
        return res(
          ctx.status(400),
          ctx.json({
            error: 'Invalid login credentials',
            message: 'Email or password is incorrect',
          })
        );
      })
    );
    
    const mockToast = vi.fn();
    (useToast as jest.Mock).mockReturnValue({
      toast: mockToast,
    });

    // Render the Auth component
    render(
      <BrowserRouter>
        <Auth />
      </BrowserRouter>
    );
    
    // Fill in login credentials
    await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'wrongpassword');
    
    // Click login button
    await userEvent.click(screen.getByRole('button', { name: /Sign In/i }));
    
    // Assert error toast notification
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error signing in',
        description: 'Email or password is incorrect',
        variant: 'destructive',
      });
    });
  });
});
