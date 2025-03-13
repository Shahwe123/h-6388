
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

import './App.css';
import './index.css';
const queryClient = new QueryClient();

// Component to handle redirecting authenticated users away from the auth page
const AuthRedirect = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        // Update Redux state on auth state change
        if (session) {
          dispatch(loginSuccess(session));
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [dispatch]);

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

// App level data initializer
const AppDataInitializer = () => {
  const [userId, setUserId] = useState<string | null>(null);
  
  useEffect(() => {
    const getUserId = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUserId(data.user.id);
      }
    };
    
    getUserId();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUserId(session?.user?.id || null);
      }
    );
    
    return () => subscription.unsubscribe();
  }, []);
  
  // Initialize data when user is logged in
  useInitializeData(userId);
  
  return null;
};

// Wrapper to conditionally render the Navbar
const NavbarWrapper = () => {
  const location = useLocation();
  // Don't show navbar on home page as it has its own Header
  return location.pathname !== '/' ? <Navbar /> : null;
};

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
          <NavbarWrapper />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/beta" element={<BetaLanding />} />
            <Route path="/auth" element={<AuthRedirect />} />
            <Route path="/leaderboard" element={<Leaderboard />} />

            {/* Protected routes */}
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
