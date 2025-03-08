
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Gamepad } from "lucide-react";

// Update the AuthMode type to include "forgotPassword"
type AuthMode = "login" | "register" | "forgotPassword";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mode, setMode] = useState<AuthMode>("login");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "register") {
        if (password !== confirmPassword) {
          toast({
            title: "Passwords do not match",
            description: "Please ensure both passwords match",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        const { error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        toast({
          title: "Registration successful!",
          description: "Please check your email for confirmation",
        });
      } else if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast({
          title: "Login successful!",
          description: "Welcome back!",
        });
        
        navigate("/profile");
      } else if (mode === "forgotPassword") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });

        if (error) throw error;

        toast({
          title: "Password reset email sent",
          description: "Please check your email for the reset link",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Gamepad className="w-10 h-10 text-neon-purple" />
            <h1 className="text-3xl font-bold neon-text">AchievR</h1>
          </div>
          <p className="text-neutral-300 max-w-md">
            Track your gaming achievements across all platforms in one place
          </p>
        </div>
        
        <div className="w-full max-w-md">
          <div className="glass-card rounded-xl p-8">
            <h2 className="text-2xl font-bold text-center mb-6">
              {mode === "login" ? "Sign In" : mode === "register" ? "Create an Account" : "Reset Password"}
            </h2>
            
            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/70 border border-neutral-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neon-purple"
                  required
                />
              </div>
              
              {mode !== "forgotPassword" && (
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-neutral-300 mb-1">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black/70 border border-neutral-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neon-purple"
                    required={mode !== "forgotPassword"}
                  />
                </div>
              )}
              
              {mode === "register" && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-300 mb-1">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-black/70 border border-neutral-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neon-purple"
                    required={mode === "register"}
                  />
                </div>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className="w-full cyber-button flex items-center justify-center"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                  </span>
                ) : (
                  <>
                    {mode === "login" ? "Sign In" : mode === "register" ? "Create Account" : "Send Reset Link"}
                  </>
                )}
              </button>
            </form>
            
            <div className="mt-6 text-center">
              {mode === "login" ? (
                <>
                  <p className="text-neutral-400 text-sm">
                    Don't have an account?{" "}
                    <button
                      onClick={() => setMode("register")}
                      className="text-neon-pink hover:underline"
                    >
                      Sign up
                    </button>
                  </p>
                  <p className="text-neutral-400 text-sm mt-2">
                    <button
                      onClick={() => setMode("forgotPassword")}
                      className="text-neon-blue hover:underline"
                    >
                      Forgot your password?
                    </button>
                  </p>
                </>
              ) : mode === "register" ? (
                <p className="text-neutral-400 text-sm">
                  Already have an account?{" "}
                  <button
                    onClick={() => setMode("login")}
                    className="text-neon-pink hover:underline"
                  >
                    Sign in
                  </button>
                </p>
              ) : (
                <p className="text-neutral-400 text-sm">
                  Remember your password?{" "}
                  <button
                    onClick={() => setMode("login")}
                    className="text-neon-pink hover:underline"
                  >
                    Sign in
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
