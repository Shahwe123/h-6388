
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Props for the ForgotPasswordForm component
 * @property {Function} onSuccess - Callback function to run after successful password reset request
 */
interface ForgotPasswordFormProps {
  onSuccess: () => void;
}

/**
 * ForgotPasswordForm component
 * 
 * Provides a form for users to request a password reset.
 * Sends a reset password email via Supabase Auth.
 * 
 * @param {ForgotPasswordFormProps} props - Component props
 * @returns {JSX.Element} The password reset form UI
 */
const ForgotPasswordForm = ({ onSuccess }: ForgotPasswordFormProps) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  /**
   * Handle form submission for password reset
   * @param {React.FormEvent} e - Form event
   */
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Send password reset email via Supabase
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }

      // Show success toast
      toast({
        title: 'Reset password email sent',
        description: 'Please check your email to reset your password',
      });
      
      // Call onSuccess callback
      onSuccess();
    } catch (error: any) {
      // Show error toast
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
    <form onSubmit={handleForgotPassword} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-1">
          Email
        </label>
        <div className="relative">
          {/* Email input with icon */}
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
  );
};

export default ForgotPasswordForm;
