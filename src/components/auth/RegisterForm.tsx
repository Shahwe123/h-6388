
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Mail, Lock, User } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { registerStart, registerSuccess, registerFailure } from '../../redux/slices/userSlice';
import { supabase } from '@/integrations/supabase/client';

const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const dispatch = useDispatch();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    dispatch(registerStart());
    
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
        dispatch(registerFailure(error.message));
        throw error;
      }

      dispatch(registerSuccess(data));
      
      toast({
        title: 'Account created successfully',
        description: 'You have been registered and signed in.',
      });
      
      navigate('/profile');
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

  return (
    <form onSubmit={handleSignUp} className="space-y-4">
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
        {loading ? 'Signing up...' : 'Sign Up'}
      </button>
    </form>
  );
};

export default RegisterForm;
