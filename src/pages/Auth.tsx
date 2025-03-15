import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Mail, Lock, User, ArrowLeft, Key } from 'lucide-react';
import { useDispatch } from "react-redux";
import { loginStart, loginSuccess, loginFailure, registerStart, registerSuccess, registerFailure } from '../redux/slices/userSlice'

import { useSelector } from 'react-redux';
type AuthMode = 'login' | 'register' | 'forgotPassword' | null;

const Auth = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const dispatch = useDispatch();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    dispatch(loginStart())


    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        dispatch(loginFailure())
        throw error;
      }
      //TODO: app reaches here even though error
      console.log(data);
      dispatch(loginSuccess(data))
      // TODO: grab friends data

      toast({
        title: 'Signed in successfully',
      });
      navigate('/profile');
    } catch (error: any) {
      toast({
        title: 'Error signing in',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    dispatch(registerStart())
    try {

      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            username: username,
          },
        },
      });

      if (error) {
        dispatch(registerFailure())
        throw error;
      }

      dispatch(registerSuccess(data))

    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        title: 'Error signing up',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  //TODO: check if working
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }

      toast({
        title: 'Reset password email sent',
        description: 'Please check your email to reset your password',
      });
      setMode('login');
    } catch (error: any) {
      toast({
        title: 'Error sending reset password email',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-md p-8 rounded-lg">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">GameHub</h1>
          <p className="text-neutral-400">
            {mode === 'login'
              ? 'Sign in to your account'
              : mode === 'register'
              ? 'Create an account'
              : 'Reset your password'}
          </p>
        </div>

        {mode === 'login' || mode === 'register' ? (
          <form onSubmit={mode === 'login' ? handleSignIn : handleSignUp} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-neutral-300 mb-1">
                  Username
                </label>
                <div className="relative">
                  <User className="h-5 w-5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    id="username"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-black/70 border border-neutral-700 rounded-md pl-10 pr-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neon-purple"
                    required
                  />
                </div>
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="h-5 w-5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/70 border border-neutral-700 rounded-md pl-10 pr-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neon-purple"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="h-5 w-5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/70 border border-neutral-700 rounded-md pl-10 pr-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neon-purple"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="cyber-button w-full"
              disabled={loading}
            >
              {loading
                ? mode === 'login'
                  ? 'Signing in...'
                  : 'Signing up...'
                : mode === 'login'
                ? 'Sign In'
                : 'Sign Up'}
            </button>
          </form>
        ) : mode === 'forgotPassword' ? (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="h-5 w-5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/70 border border-neutral-700 rounded-md pl-10 pr-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neon-purple"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="cyber-button w-full"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Reset Password'}
            </button>
          </form>
        ) : (
          <div>
            <p className="text-neutral-300">
              An unexpected error occurred. Please try again.
            </p>
          </div>
        )}

        <div className="mt-6 text-sm">
          {mode === 'login' ? (
            <div className="flex items-center justify-between">
              <button
                className="text-neon-purple hover:underline"
                onClick={() => setMode('forgotPassword')}
              >
                Forgot password?
              </button>
              <button
                className="text-neon-purple hover:underline"
                onClick={() => setMode('register')}
              >
                Create an account
              </button>
            </div>
          ) : mode === 'register' || mode === 'forgotPassword' ? (
            <button
              className="text-neon-purple hover:underline flex items-center gap-1"
              onClick={() => setMode('login')}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Sign In
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Auth;
