import { useState } from "react";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";

interface NewsletterFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewsletterForm = ({ isOpen, onClose }: NewsletterFormProps) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const { toast } = useToast();

  // Email preferences
  const [preferences, setPreferences] = useState({
    productUpdates: true,
    newFeatures: true,
    communityEvents: false,
    tips: false
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    if (!consent) {
      toast({
        title: "Consent required",
        description: "Please check the consent box to join our newsletter.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create a timestamp for subscription date (compliance requirement)
      const subscriptionDate = new Date().toISOString();
      
      // Insert the email into the waitlist table with consent information
      const { error } = await supabase
        .from("waitlist")
        .insert([{ 
          email, 
          name: name || null,
          consent_given: consent,
          consent_timestamp: subscriptionDate,
          email_preferences: preferences,
          subscription_source: "beta_waitlist_form"
        }]);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "You've been added to our waitlist. Stay tuned for updates!",
      });
      
      setEmail("");
      setName("");
      setConsent(false);
      onClose();
    } catch (error) {
      console.error("Error adding to waitlist:", error);
      
      // Check if error is due to duplicate email
      if (error.message && error.message.includes("duplicate")) {
        toast({
          title: "Already subscribed",
          description: "This email is already on our waitlist. Thank you for your interest!",
          variant: "default",
        });
      } else {
        toast({
          title: "Something went wrong",
          description: "Failed to add you to the waitlist. Please try again later.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreferencesToggle = () => {
    setShowPreferences(!showPreferences);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-sm p-4">
      <div className="glass-card p-6 rounded-xl max-w-md w-full relative animate-fade-in">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white"
          aria-label="Close subscription form"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold mb-2 neon-text">Join the AchievR Beta Waitlist</h3>
          <p className="text-neutral-300">Be the first to know when we launch and get exclusive perks!</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-neutral-300 mb-1">
              Name (Optional)
            </label>
            <Input
              type="text"
              id="name"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-black/50 border border-neon-purple/30 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-neon-purple"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-1">
              Email Address <span className="text-red-400">*</span>
            </label>
            <Input
              type="email"
              id="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/50 border border-neon-purple/30 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-neon-purple"
              required
            />
          </div>
          
          <div className="pt-2">
            <button 
              type="button"
              onClick={handlePreferencesToggle}
              className="text-sm text-neon-purple hover:text-neon-pink underline"
            >
              {showPreferences ? "Hide email preferences" : "Set email preferences"} 
            </button>
            
            {showPreferences && (
              <div className="mt-3 space-y-3 p-3 bg-black/30 rounded-md">
                <h4 className="text-sm font-medium text-white">I would like to receive:</h4>
                
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="productUpdates" 
                    checked={preferences.productUpdates}
                    onCheckedChange={(checked) => 
                      setPreferences(prev => ({ ...prev, productUpdates: checked === true }))
                    }
                  />
                  <label htmlFor="productUpdates" className="text-sm text-neutral-300 leading-tight cursor-pointer">
                    Product updates and announcements
                  </label>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="newFeatures" 
                    checked={preferences.newFeatures}
                    onCheckedChange={(checked) => 
                      setPreferences(prev => ({ ...prev, newFeatures: checked === true }))
                    }
                  />
                  <label htmlFor="newFeatures" className="text-sm text-neutral-300 leading-tight cursor-pointer">
                    New feature releases and beta invitations
                  </label>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="communityEvents" 
                    checked={preferences.communityEvents}
                    onCheckedChange={(checked) => 
                      setPreferences(prev => ({ ...prev, communityEvents: checked === true }))
                    }
                  />
                  <label htmlFor="communityEvents" className="text-sm text-neutral-300 leading-tight cursor-pointer">
                    Community events and special offers
                  </label>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="tips" 
                    checked={preferences.tips}
                    onCheckedChange={(checked) => 
                      setPreferences(prev => ({ ...prev, tips: checked === true }))
                    }
                  />
                  <label htmlFor="tips" className="text-sm text-neutral-300 leading-tight cursor-pointer">
                    Achievement hunting tips and best practices
                  </label>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-start space-x-2 pt-2">
            <Checkbox 
              id="consent" 
              checked={consent}
              onCheckedChange={(checked) => setConsent(checked === true)}
              required
            />
            <label htmlFor="consent" className="text-sm text-neutral-300 leading-tight">
              I consent to receive emails about AchievR, including product updates and announcements. 
              I understand I can unsubscribe at any time with a single click.
            </label>
          </div>
          
          <button 
            type="submit" 
            className="cyber-button w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Joining..." : "Join Waitlist"}
          </button>
          
          <p className="text-xs text-neutral-400 text-center">
            We respect your privacy and will never share your information with third parties.
            By subscribing, you agree to our <a href="/privacy" className="text-neon-purple hover:text-neon-pink">Privacy Policy</a>.
          </p>
        </form>
      </div>
    </div>
  );
};

export const UnsubscribeDialog = ({ 
  isOpen, 
  onClose, 
  email, 
  onUnsubscribe 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  email: string;
  onUnsubscribe: (reason?: string) => void;
}) => {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleUnsubscribe = async () => {
    setIsSubmitting(true);
    await onUnsubscribe(reason);
    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Unsubscribe from our mailing list</DialogTitle>
          <DialogDescription>
            We're sorry to see you go. Would you mind telling us why you're unsubscribing?
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            Email: <span className="font-medium">{email}</span>
          </p>
          
          <div className="space-y-2">
            <label htmlFor="reason" className="text-sm font-medium">
              Reason (optional)
            </label>
            <Textarea
              id="reason"
              placeholder="Please tell us why you're unsubscribing..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full resize-none"
              rows={4}
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-4">
          <button 
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-neon-purple/30 rounded-md text-sm hover:bg-black/20"
          >
            Cancel
          </button>
          <button 
            type="button"
            onClick={handleUnsubscribe}
            className="px-4 py-2 bg-neon-purple text-white rounded-md text-sm hover:bg-neon-pink"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Confirm Unsubscribe"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewsletterForm;
