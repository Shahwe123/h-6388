
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/redux/slices/userSlice";

import Index from "@/pages/Index";
import BetaLanding from "@/pages/BetaLanding";
import Auth from "@/pages/Auth";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import LinkAccounts from "@/pages/LinkAccounts";
import Friends from "@/pages/Friends";
import Leaderboard from "@/pages/Leaderboard";
import AuthRequired from "@/components/AuthRequired";

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
 * AppRoutes component
 * 
 * Contains all application routes and their components
 * 
 * @returns {JSX.Element} Routes configuration
 */
const AppRoutes = () => {
  return (
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
  );
};

export default AppRoutes;
