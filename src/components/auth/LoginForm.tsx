
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Mail, Lock, Key } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../../redux/slices/userSlice';
import { supabase } from '@/integrations/supabase/client';

// This code should be kept secret and only shared with people you want to allow login
const DEVELOPER_REGISTRATION_CODE = 'GameHub2024';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registrationCode, setRegistrationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [codeError, setCodeError] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const dispatch = useDispatch();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verify the registration code
    if (registrationCode !== DEVELOPER_REGISTRATION_CODE) {
      setCodeError(true);
      toast({
        title: 'Invalid developer code',
        description: 'The developer code you entered is incorrect.',
        variant: 'destructive',
      });
      return;
    }
    
    setCodeError(false);
    setLoading(true);
    dispatch(loginStart());

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        dispatch(loginFailure(error.message));
        throw error;
      }

      console.log(data);
      dispatch(loginSuccess(data));

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

  return (
    <form onSubmit={handleSignIn} className="space-y-4">
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
      <div>
        <label htmlFor="registrationCode" className="block text-sm font-medium text-neutral-300 mb-1">
          Developer Code
        </label>
        <div className="relative">
          <Key className="h-5 w-5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            id="registrationCode"
            placeholder="Enter developer code"
            value={registrationCode}
            onChange={(e) => {
              setRegistrationCode(e.target.value);
              setCodeError(false);
            }}
            className={`w-full bg-black/70 border ${
              codeError ? 'border-red-500' : 'border-neutral-700'
            } rounded-md pl-10 pr-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neon-purple`}
            required
          />
        </div>
        {codeError && (
          <p className="text-red-500 text-xs mt-1">Invalid developer code</p>
        )}
      </div>
      <button
        type="submit"
        className="cyber-button w-full"
        disabled={loading}
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
};

export default LoginForm;
