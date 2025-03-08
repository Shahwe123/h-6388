import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Github, 
  Google, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from "@/components/ui/separator"
import { useSearchParams, useNavigate } from 'react-router-dom';

type AuthMode = "login" | "register" | "forgotPassword";

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const redirectTo = searchParams.get('redirectTo');
    if (redirectTo) {
      localStorage.setItem('redirectTo', redirectTo);
    }
  }, [searchParams]);

  const handleOAuthSignIn = async (provider: 'github' | 'google') => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/auth`,
        },
      });

      if (error) {
        throw error;
      }
      
      // Redirect the user to the authorization URL
      window.location.href = data.url;
    } catch (error: any) {
      toast({
        title: `Error signing in with ${provider}`,
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailPasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        throw error;
      }

      // Redirect user to the intended page after successful login
      const redirectTo = localStorage.getItem('redirectTo');
      if (redirectTo) {
        localStorage.removeItem('redirectTo');
        navigate(redirectTo);
      } else {
        navigate('/profile');
      }
      
      toast({
        title: 'Login successful',
        description: 'You have successfully logged in.',
      });
    } catch (error: any) {
      toast({
        title: 'Error signing in',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailPasswordSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (password !== confirmPassword) {
      toast({
        title: 'Error signing up',
        description: 'Passwords do not match.',
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }
    try {
      const { error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth`,
        },
      });

      if (error) {
        throw error;
      }
      
      toast({
        title: 'Signup successful',
        description: 'A confirmation email has been sent to your email address.',
      });
      setAuthMode('login'); // Switch back to login mode after successful signup
    } catch (error: any) {
      toast({
        title: 'Error signing up',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth`,
      });

      if (error) {
        throw error;
      }

      toast({
        title: 'Password reset email sent',
        description: 'Please check your email for further instructions.',
      });
      setAuthMode('login'); // Switch back to login mode after successful signup
    } catch (error: any) {
      toast({
        title: 'Error requesting password reset',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-primary flex items-center justify-center">
      <Card className="w-full max-w-md glass-card">
        <CardHeader className="space-y-1">
          {authMode === 'login' && (
            <CardTitle className="text-2xl text-center">Login</CardTitle>
          )}
          {authMode === 'register' && (
            <CardTitle className="text-2xl text-center">Register</CardTitle>
          )}
          {authMode === 'forgotPassword' && (
            <CardTitle className="text-2xl text-center">Forgot Password</CardTitle>
          )}
          <CardDescription className="text-center">
            {authMode === 'login' && 'Sign in to your account'}
            {authMode === 'register' && 'Create a new account'}
            {authMode === 'forgotPassword' && 'Enter your email to reset your password'}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {authMode !== 'forgotPassword' && (
            <Button variant="outline" onClick={() => handleOAuthSignIn('github')} disabled={loading}>
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 4V2m0 16v2m-5.196-3.004l-1.414 1.414M17.196 17.004l1.414 1.414M4 12H2m16 0h2M6.804 6.996L5.39 5.586M18.604 5.39l1.414 1.414"/>
                  </svg>
                  Signing in with GitHub...
                </>
              ) : (
                <>
                  <Github className="mr-2 h-4 w-4" />
                  Sign in with GitHub
                </>
              )}
            </Button>
          )}
          {authMode !== 'forgotPassword' && (
            <Button variant="outline" onClick={() => handleOAuthSignIn('google')} disabled={loading}>
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 4V2m0 16v2m-5.196-3.004l-1.414 1.414M17.196 17.004l1.414 1.414M4 12H2m16 0h2M6.804 6.996L5.39 5.586M18.604 5.39l1.414 1.414"/>
                  </svg>
                  Signing in with Google...
                </>
              ) : (
                <>
                  <Google className="mr-2 h-4 w-4" />
                  Sign in with Google
                </>
              )}
            </Button>
          )}
          {authMode !== 'forgotPassword' && (
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="mail@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
                type="button"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                <span className="sr-only">Show password</span>
              </Button>
            </div>
          </div>
          {authMode === 'register' && (
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  type="button"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  <span className="sr-only">Show password</span>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          {authMode === 'login' && (
            <Button className="w-full" onClick={handleEmailPasswordSignIn} disabled={loading}>
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 4V2m0 16v2m-5.196-3.004l-1.414 1.414M17.196 17.004l1.414 1.414M4 12H2m16 0h2M6.804 6.996L5.39 5.586M18.604 5.39l1.414 1.414"/>
                  </svg>
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          )}
          {authMode === 'register' && (
            <Button className="w-full" onClick={handleEmailPasswordSignUp} disabled={loading}>
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 4V2m0 16v2m-5.196-3.004l-1.414 1.414M17.196 17.004l1.414 1.414M4 12H2m16 0h2M6.804 6.996L5.39 5.586M18.604 5.39l1.414 1.414"/>
                  </svg>
                  Signing Up...
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
          )}
          {authMode === 'forgotPassword' && (
            <Button className="w-full" onClick={handleForgotPassword} disabled={loading}>
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 4V2m0 16v2m-5.196-3.004l-1.414 1.414M17.196 17.004l1.414 1.414M4 12H2m16 0h2M6.804 6.996L5.39 5.586M18.604 5.39l1.414 1.414"/>
                  </svg>
                  Sending Reset Email...
                </>
              ) : (
                'Send Reset Email'
              )}
            </Button>
          )}
        </CardFooter>
        <div className="px-6 py-4 text-center text-sm text-muted-foreground">
          {authMode === 'login' && (
            <>
              Don't have an account?{' '}
              <Button variant="link" onClick={() => setAuthMode('register')}>
                Sign up
              </Button>
              <Separator className="my-2" />
              <Button variant="link" onClick={() => setAuthMode('forgotPassword')}>
                Forgot Password?
              </Button>
            </>
          )}
          {authMode === 'register' && (
            <>
              Already have an account?{' '}
              <Button variant="link" onClick={() => setAuthMode('login')}>
                Log in
              </Button>
            </>
          )}
          {authMode === "forgotPassword" as "login" | "register" | "forgotPassword" ? (
            <>
              Remember your password?{' '}
              <Button variant="link" onClick={() => setAuthMode('login')}>
                Log in
              </Button>
            </>
          ) : null}
        </div>
      </Card>
    </div>
  );
};

export default Auth;
