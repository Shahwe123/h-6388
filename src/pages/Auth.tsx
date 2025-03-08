
import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { signIn, signUp, resetPassword } from '@/store/slices/authSlice';
import { useToast } from '@/hooks/use-toast';

type AuthView = 'login' | 'register' | 'forgotPassword';

const Auth = () => {
  const [view, setView] = useState<AuthView>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const dispatch = useAppDispatch();
  const { isLoading, error, user } = useAppSelector(state => state.auth);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/" />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await dispatch(signIn({ email, password })).unwrap();
      navigate('/');
    } catch (error) {
      toast({
        title: 'Login failed',
        description: error as string,
        variant: 'destructive',
      });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: 'Passwords do not match',
        description: 'Please ensure your passwords match.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      await dispatch(signUp({ email, password })).unwrap();
      toast({
        title: 'Registration successful',
        description: 'Your account has been created! You can now log in.',
      });
      setView('login');
    } catch (error) {
      toast({
        title: 'Registration failed',
        description: error as string,
        variant: 'destructive',
      });
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: 'Email required',
        description: 'Please enter your email address.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      await dispatch(resetPassword(email)).unwrap();
      toast({
        title: 'Password reset email sent',
        description: 'Check your email for a link to reset your password.',
      });
      setView('login');
    } catch (error) {
      toast({
        title: 'Reset request failed',
        description: error as string,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card p-8 rounded-xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold neon-text mb-2">AchievR</h1>
          
          {view === 'login' && <h2 className="text-xl font-bold">Sign In</h2>}
          {view === 'register' && <h2 className="text-xl font-bold">Create Account</h2>}
          {view === 'forgotPassword' && <h2 className="text-xl font-bold">Reset Password</h2>}
        </div>

        {view === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-black/50 border border-neon-purple/30 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-neon-purple"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-300 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-black/50 border border-neon-purple/30 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-neon-purple"
              />
            </div>
            
            <button 
              type="submit" 
              className="cyber-button w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
            
            <div className="text-center mt-4 space-y-2">
              <p className="text-sm text-neutral-400">
                Don't have an account?{' '}
                <button 
                  type="button"
                  onClick={() => setView('register')}
                  className="text-neon-purple hover:underline"
                >
                  Create one
                </button>
              </p>
              
              <p className="text-sm text-neutral-400">
                <button 
                  type="button"
                  onClick={() => setView('forgotPassword')}
                  className="text-neon-purple hover:underline"
                >
                  Forgot your password?
                </button>
              </p>
            </div>
          </form>
        )}

        {view === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-black/50 border border-neon-purple/30 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-neon-purple"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-300 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-black/50 border border-neon-purple/30 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-neon-purple"
              />
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-300 mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full bg-black/50 border border-neon-purple/30 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-neon-purple"
              />
            </div>
            
            <button 
              type="submit" 
              className="cyber-button w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
            
            <div className="text-center mt-4">
              <p className="text-sm text-neutral-400">
                Already have an account?{' '}
                <button 
                  type="button"
                  onClick={() => setView('login')}
                  className="text-neon-purple hover:underline"
                >
                  Sign in
                </button>
              </p>
            </div>
          </form>
        )}

        {view === 'forgotPassword' && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-black/50 border border-neon-purple/30 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-neon-purple"
              />
            </div>
            
            <button 
              type="submit" 
              className="cyber-button w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Sending reset link...' : 'Send Reset Link'}
            </button>
            
            <div className="text-center mt-4">
              <p className="text-sm text-neutral-400">
                <button 
                  type="button"
                  onClick={() => setView('login')}
                  className="text-neon-purple hover:underline"
                >
                  Back to sign in
                </button>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Auth;
