
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Mail, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { siteConfig } from '@/config/site';

const WaitlistForm = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Send email to Mailchimp
      const response = await fetch('/api/join-waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to join waitlist');
      }

      toast({
        title: 'Success!',
        description: 'You have successfully joined the waitlist.',
      });

      setEmail('');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-grow">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 h-5 w-5" />
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10 bg-black/70 border-neutral-700 text-white h-12"
            required
          />
        </div>
        <Button 
          type="submit" 
          disabled={loading} 
          className="cyber-button h-12 whitespace-nowrap"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Joining...
            </>
          ) : (
            'Join Waitlist'
          )}
        </Button>
      </div>
      <p className="text-neutral-400 text-sm mt-2">
        We'll notify you when {siteConfig.name} launches. No spam, we promise.
      </p>
    </form>
  );
};

export default WaitlistForm;
