
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import LinkAccounts from "./pages/LinkAccounts";
import Friends from "./pages/Friends";
import Leaderboard from "./pages/Leaderboard";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AuthRequired from "./components/AuthRequired";

const queryClient = new QueryClient();

// Component to handle redirecting authenticated users away from the auth page
const AuthRedirect = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
    };
    
    getSession();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );
    
    return () => subscription.unsubscribe();
  }, []);
  
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
          <NavbarWrapper />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthRedirect />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            
            {/* Protected routes */}
            <Route element={<AuthRequired />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/friends" element={<Friends />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/link-accounts" element={<LinkAccounts />} />
            </Route>
          </Routes>
          <Footer />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
