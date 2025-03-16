
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { useDispatch } from "react-redux";
import { loginSuccess } from "./redux/slices/userSlice";
import { useInitializeData } from "./hooks/useInitializeData";
import Index from "./pages/Index";
import BetaLanding from "./pages/BetaLanding";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import LinkAccounts from "./pages/LinkAccounts";
import Friends from "./pages/Friends";
import Leaderboard from "./pages/Leaderboard";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AuthRequired from "./components/AuthRequired";
import { useScrollToTop } from "./hooks/useScrollToTop";

import './App.css';
import './index.css';

// Initialize React Query client
const queryClient = new QueryClient();

/**
 * ScrollToTop component
 * 
 * This component scrolls the window to the top on route changes.
 * 
 * @returns {null} This component doesn't render anything
 */
const ScrollToTop = () => {
  useScrollToTop();
  return null;
};

/**
 * AuthRedirect component
 * 
 * This component handles redirecting authenticated users away from the auth page.
 * If a user is already logged in (has an active session), they will be redirected to the profile page.
 * Otherwise, the Auth component will be rendered.
 * 
 * @returns {JSX.Element} Auth component or redirect
 */
const AuthRedirect = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    // Get current session on component mount
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      
      // Dispatch loginSuccess if session exists
      if (data.session) {
        dispatch(loginSuccess(data.session));
      }
      
      setLoading(false);
    };

    getSession();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        // Update Redux state on auth state change
        if (session) {
          dispatch(loginSuccess(session));
        }
      }
    );

    // Clean up subscription when component unmounts
    return () => subscription.unsubscribe();
  }, [dispatch]);

  // Show loading state while checking session
  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-neon-purple border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-neutral-300">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is logged in, redirect to profile page, else show the Auth component
  if (session) {
    return <Navigate to="/profile" replace />;
  }

  return <Auth />;
};

/**
 * AppDataInitializer component
 * 
 * This component initializes app-wide data when the user is logged in.
 * It listens for auth state changes and triggers data loading when a user logs in.
 * 
 * @returns {null} This component doesn't render anything
 */
const AppDataInitializer = () => {
  const [userId, setUserId] = useState<string | null>(null);
  
  useEffect(() => {
    // Get current user ID on component mount
    const getUserId = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUserId(data.user.id);
      }
    };
    
    getUserId();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUserId(session?.user?.id || null);
      }
    );
    
    // Clean up subscription when component unmounts
    return () => subscription.unsubscribe();
  }, []);
  
  // Initialize data when user is logged in
  useInitializeData(userId);
  
  return null;
};

/**
 * NavbarWrapper component
 * 
 * This component conditionally renders the Navbar based on the current route.
 * The Navbar is not shown on the home page (/) as it has its own Header.
 * 
 * @returns {JSX.Element|null} Navbar component or null
 */
const NavbarWrapper = () => {
  const location = useLocation();
  // Don't show navbar on home page as it has its own Header
  return location.pathname !== '/' ? <Navbar /> : null;
};

/**
 * Main App component
 * 
 * This is the root component of the application.
 * It sets up providers, routing, and global components.
 * 
 * @returns {JSX.Element} The application UI
 */
const App = () => {
  // Create avatars bucket when the app starts
  useEffect(() => {
    const createAvatarsBucket = async () => {
      try {
        await supabase.functions.invoke('create-avatars-bucket');
      } catch (error) {
        console.error('Error creating avatars bucket:', error);
      }
    };

    createAvatarsBucket();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppDataInitializer />
          <ScrollToTop />
          <NavbarWrapper />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/beta" element={<BetaLanding />} />
            <Route path="/auth" element={<AuthRedirect />} />
            <Route path="/leaderboard" element={<Leaderboard />} />

            {/* Protected routes - require authentication */}
            <Route path="/profile" element={
              <AuthRequired>
                <Profile />
              </AuthRequired>
            } />
            <Route path="/friends" element={
              <AuthRequired>
                <Friends />
              </AuthRequired>
            } />
            <Route path="/settings" element={
              <AuthRequired>
                <Settings />
              </AuthRequired>
            } />
            <Route path="/link-accounts" element={
              <AuthRequired>
                <LinkAccounts />
              </AuthRequired>
            } />
          </Routes>
          <Footer />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
