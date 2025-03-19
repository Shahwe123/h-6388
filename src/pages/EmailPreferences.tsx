
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import SEO from "@/components/SEO";

const EmailPreferences = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";
  const unsubscribe = searchParams.get("unsubscribe") === "true";
  
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [unsubscribeReason, setUnsubscribeReason] = useState("");
  const [preferences, setPreferences] = useState({
    productUpdates: true,
    newFeatures: true,
    communityEvents: false,
    tips: false
  });
  
  const { toast } = useToast();
  
  // Verify the token and email on page load
  useEffect(() => {
    const verifyToken = async () => {
      if (!email || !token) {
        setIsLoading(false);
        return;
      }
      
      try {
        // Check if the email and token are valid
        const { data, error } = await supabase
          .from("email_tokens")
          .select("*")
          .eq("email", email)
          .eq("token", token)
          .eq("used", false)
          .single();
          
        if (error || !data) {
          setIsVerified(false);
        } else {
          setIsVerified(true);
          
          // Get current preferences
          const { data: userData } = await supabase
            .from("waitlist")
            .select("email_preferences")
            .eq("email", email)
            .single();
            
          if (userData?.email_preferences) {
            setPreferences(userData.email_preferences);
          }
          
          // Mark token as used
          await supabase
            .from("email_tokens")
            .update({ used: true, used_at: new Date().toISOString() })
            .eq("token", token);
        }
      } catch (error) {
        console.error("Error verifying token:", error);
        setIsVerified(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    verifyToken();
  }, [email, token]);
  
  const handleUnsubscribe = async () => {
    if (!email || !isVerified) return;
    
    setIsSubmitting(true);
    
    try {
      // Store unsubscribe reason if provided
      if (unsubscribeReason) {
        await supabase
          .from("unsubscribe_feedback")
          .insert([{
            email,
            reason: unsubscribeReason,
            unsubscribed_at: new Date().toISOString()
          }]);
      }
      
      // Delete from waitlist
      const { error } = await supabase
        .from("waitlist")
        .delete()
        .eq("email", email);
        
      if (error) throw error;
      
      toast({
        title: "Unsubscribed successfully",
        description: "You've been removed from our mailing list.",
      });
    } catch (error) {
      console.error("Error unsubscribing:", error);
      toast({
        title: "Failed to unsubscribe",
        description: "There was an error processing your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handlePreferencesUpdate = async () => {
    if (!email || !isVerified) return;
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from("waitlist")
        .update({ email_preferences: preferences })
        .eq("email", email);
        
      if (error) throw error;
      
      toast({
        title: "Preferences updated",
        description: "Your email preferences have been saved.",
      });
    } catch (error) {
      console.error("Error updating preferences:", error);
      toast({
        title: "Failed to update preferences",
        description: "There was an error saving your preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Content to display based on the state
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-neon-purple border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-lg text-neutral-300">Verifying your request...</p>
        </div>
      );
    }
    
    if (!isVerified) {
      return (
        <div className="glass-card p-8 rounded-xl">
          <h2 className="text-2xl font-bold mb-4 text-white">Invalid or Expired Link</h2>
          <p className="text-neutral-300 mb-6">
            This link appears to be invalid or has expired. Please request a new email preferences link or contact support if you need assistance.
          </p>
          <a href="/" className="cyber-button inline-block">
            Return to Home
          </a>
        </div>
      );
    }
    
    if (unsubscribe) {
      return (
        <div className="glass-card p-8 rounded-xl">
          <h2 className="text-2xl font-bold mb-4 text-white">Unsubscribe from Emails</h2>
          <p className="text-neutral-300 mb-6">
            We're sorry to see you go. Please confirm that you want to unsubscribe <strong>{email}</strong> from all communications.
          </p>
          
          <div className="mb-6">
            <label htmlFor="reason" className="block text-sm font-medium text-neutral-300 mb-2">
              Would you mind telling us why you're leaving? (Optional)
            </label>
            <Textarea
              id="reason"
              placeholder="Your feedback helps us improve"
              value={unsubscribeReason}
              onChange={(e) => setUnsubscribeReason(e.target.value)}
              className="w-full bg-black/50 border border-neon-purple/30 rounded-md p-3 text-white resize-none"
              rows={4}
            />
          </div>
          
          <div className="flex space-x-4">
            <button 
              onClick={handleUnsubscribe}
              disabled={isSubmitting}
              className="cyber-button"
            >
              {isSubmitting ? "Processing..." : "Confirm Unsubscribe"}
            </button>
            <a href={`/email-preferences?email=${email}&token=${token}`} className="px-4 py-2 border border-neon-purple/30 rounded-md text-white hover:bg-black/20 flex items-center justify-center">
              Adjust Preferences Instead
            </a>
          </div>
        </div>
      );
    }
    
    return (
      <div className="glass-card p-8 rounded-xl">
        <h2 className="text-2xl font-bold mb-4 text-white">Email Preferences</h2>
        <p className="text-neutral-300 mb-6">
          Customize the types of emails you receive from us.
        </p>
        
        <div className="space-y-4 mb-6">
          <div className="flex items-start space-x-3">
            <Checkbox 
              id="productUpdates" 
              checked={preferences.productUpdates}
              onCheckedChange={(checked) => 
                setPreferences(prev => ({ ...prev, productUpdates: checked === true }))
              }
            />
            <div>
              <label htmlFor="productUpdates" className="text-white font-medium cursor-pointer">
                Product Updates
              </label>
              <p className="text-sm text-neutral-400">
                Important announcements and updates about the platform
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Checkbox 
              id="newFeatures" 
              checked={preferences.newFeatures}
              onCheckedChange={(checked) => 
                setPreferences(prev => ({ ...prev, newFeatures: checked === true }))
              }
            />
            <div>
              <label htmlFor="newFeatures" className="text-white font-medium cursor-pointer">
                New Features
              </label>
              <p className="text-sm text-neutral-400">
                Be the first to know about new features and beta releases
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Checkbox 
              id="communityEvents" 
              checked={preferences.communityEvents}
              onCheckedChange={(checked) => 
                setPreferences(prev => ({ ...prev, communityEvents: checked === true }))
              }
            />
            <div>
              <label htmlFor="communityEvents" className="text-white font-medium cursor-pointer">
                Community Events
              </label>
              <p className="text-sm text-neutral-400">
                Community competitions, special offers, and events
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Checkbox 
              id="tips" 
              checked={preferences.tips}
              onCheckedChange={(checked) => 
                setPreferences(prev => ({ ...prev, tips: checked === true }))
              }
            />
            <div>
              <label htmlFor="tips" className="text-white font-medium cursor-pointer">
                Tips & Guides
              </label>
              <p className="text-sm text-neutral-400">
                Achievement hunting tips, tricks, and best practices
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-4">
          <button 
            onClick={handlePreferencesUpdate}
            disabled={isSubmitting}
            className="cyber-button"
          >
            {isSubmitting ? "Saving..." : "Save Preferences"}
          </button>
          <a href={`/email-preferences?email=${email}&token=${token}&unsubscribe=true`} className="px-4 py-2 border border-neon-purple/30 rounded-md text-white hover:bg-black/20 flex items-center justify-center">
            Unsubscribe From All
          </a>
        </div>
      </div>
    );
  };
  
  return (
    <>
      <SEO 
        title="Email Preferences | AchievR" 
        description="Manage your email preferences and subscription settings for AchievR."
      />
      
      <div className="min-h-screen bg-primary py-20">
        <div className="container-padding max-w-2xl mx-auto">
          {renderContent()}
        </div>
      </div>
    </>
  );
};

export default EmailPreferences;
