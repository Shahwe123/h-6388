
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import SEO from "../components/SEO";

const BetaLanding = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Thank you for your interest!",
        description: "We've added you to our beta waiting list. We'll notify you when you're granted access.",
      });
      setEmail('');
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-primary pt-16 pb-16 flex items-center">
      <SEO 
        title="Join PlatinumPath Beta" 
        description="Be among the first to try PlatinumPath! Sign up for early beta access and track your trophies effortlessly."
        url="/beta"
      />
      <div className="max-w-4xl mx-auto container-padding w-full text-center">
        <div className="glass-card rounded-xl p-8 md:p-12">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Join the PlatinumPath Beta</h1>
          <p className="text-xl text-neutral-300 mb-8 max-w-2xl mx-auto">
            Be among the first to experience the ultimate achievement tracking platform. Sign up now to get early access.
          </p>
          
          <div className="bg-black/30 p-6 rounded-lg mb-8 max-w-lg mx-auto">
            <h2 className="text-2xl font-bold mb-4">Beta Features</h2>
            <ul className="text-left space-y-3 mb-6">
              <li className="flex items-start">
                <svg className="w-6 h-6 text-neon-purple mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Multi-platform achievement tracking</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-neon-purple mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Friend leaderboards and comparisons</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-neon-purple mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Achievement progress tracking</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-neon-purple mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Early access to new features</span>
              </li>
            </ul>
            
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-black/30 border-neutral-700 flex-grow"
              />
              <Button 
                type="submit" 
                className="bg-gradient-game whitespace-nowrap"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div>
                    Joining...
                  </>
                ) : 'Join Beta'}
              </Button>
            </form>
          </div>
          
          <p className="text-sm text-neutral-400">
            Limited spots available. Beta access will be granted on a first-come, first-served basis.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BetaLanding;
