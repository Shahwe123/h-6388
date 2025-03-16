
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { AppDataInitializer } from "./components/app/AppDataInitializer";
import { ScrollToTop } from "./components/app/ScrollToTop";
import { NavbarWrapper } from "./components/app/NavbarWrapper";
import Footer from "./components/Footer";

import './App.css';
import './index.css';

// Initialize React Query client
const queryClient = new QueryClient();

/**
 * Main App component
 * 
 * This is the root component of the application.
 * It sets up providers, routing, and global components.
 * 
 * @returns {JSX.Element} The application UI
 */
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppDataInitializer />
          <ScrollToTop />
          <NavbarWrapper />
          <AppRoutes />
          <Footer />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
