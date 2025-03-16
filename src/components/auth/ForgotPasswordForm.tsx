
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Props for the ForgotPasswordForm component
 */
interface ForgotPasswordFormProps {
  onSuccess: () => void;  // Function to call when reset email is sent successfully
}

/**
 * ForgotPasswordForm component
 * Form for requesting a password reset email
 * 
 * @param onSuccess - Function to call when reset email is sent successfully
 */
const ForgotPasswordForm = ({ onSuccess }: ForgotPasswordFormProps) => {
  // State for the email input field
  const [email, setEmail] = useState('');
  // State for tracking form submission
  const [loading, setLoading] = useState(false);
  // Toast notification hook
  const { toast } = useToast();

  /**
   * Handles the forgot password form submission
   * Sends a password reset email via Supabase
   */
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Send password reset email through Supabase
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }

      // Show success toast notification
      toast({
        title: 'Reset password email sent',
        description: 'Please check your email to reset your password',
      });
      
      // Call success callback
      onSuccess();
    } catch (error: any) {
      // Show error toast notification
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
