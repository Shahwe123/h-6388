
import { supabase } from "@/integrations/supabase/client";

/**
 * Generates a secure random token for email-related operations
 * @returns {string} A random token
 */
export const generateSecureToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Creates an email preferences URL with a secure token
 * @param {string} email The recipient's email address
 * @param {boolean} unsubscribe Whether this is an unsubscribe link
 * @returns {Promise<string>} The full URL for email preferences
 */
export const createEmailPreferencesUrl = async (
  email: string, 
  unsubscribe: boolean = false
): Promise<string> => {
  // Generate a secure token
  const token = generateSecureToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30); // Token expires in 30 days
  
  try {
    // Store the token in the database
    await supabase
      .from("email_tokens")
      .insert([{
        email,
        token,
        type: unsubscribe ? 'unsubscribe' : 'preferences',
        expires_at: expiresAt.toISOString(),
        used: false
      }]);
    
    // Generate the full URL
    const baseUrl = window.location.origin;
    const params = new URLSearchParams({
      email,
      token,
      ...(unsubscribe && { unsubscribe: 'true' })
    });
    
    return `${baseUrl}/email-preferences?${params.toString()}`;
  } catch (error) {
    console.error("Error creating email preferences URL:", error);
    throw error;
  }
};

/**
 * Validates if a token is valid and not expired
 * @param {string} email The email address
 * @param {string} token The token to validate
 * @returns {Promise<boolean>} Whether the token is valid
 */
export const validateEmailToken = async (
  email: string,
  token: string
): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from("email_tokens")
      .select("*")
      .eq("email", email)
      .eq("token", token)
      .eq("used", false)
      .single();
    
    if (error || !data) {
      return false;
    }
    
    // Check if token is expired
    const expiresAt = new Date(data.expires_at);
    const now = new Date();
    
    if (expiresAt < now) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error validating email token:", error);
    return false;
  }
};

/**
 * Process an unsubscribe request
 * @param {string} email The email to unsubscribe
 * @param {string} reason Optional reason for unsubscribing
 * @returns {Promise<boolean>} Whether the operation was successful
 */
export const processUnsubscribe = async (
  email: string,
  reason?: string
): Promise<boolean> => {
  try {
    // Store unsubscribe reason if provided
    if (reason) {
      await supabase
        .from("unsubscribe_feedback")
        .insert([{
          email,
          reason,
          unsubscribed_at: new Date().toISOString()
        }]);
    }
    
    // Remove from waitlist
    const { error } = await supabase
      .from("waitlist")
      .delete()
      .eq("email", email);
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Error processing unsubscribe:", error);
    return false;
  }
};
