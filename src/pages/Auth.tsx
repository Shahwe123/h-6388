
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

// Import components
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';

type AuthMode = 'login' | 'register' | 'forgotPassword' | null;

const Auth = () => {
  const [mode, setMode] = useState<AuthMode>('login');

  return (
    <div className="w-full min-h-screen bg-primary flex items-center justify-center p-4">
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

        {mode === 'login' && <LoginForm />}
        {mode === 'register' && <RegisterForm />}
        {mode === 'forgotPassword' && <ForgotPasswordForm onSuccess={() => setMode('login')} />}

        {mode === null && (
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
