
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';
import SEO from "@/components/SEO";

const NotFound = () => {
  return (
    <div className="min-h-screen pt-20 bg-primary flex items-center justify-center">
      <SEO 
        title="Page Not Found - Error 404" 
        description="The page you're looking for doesn't exist or has been moved."
      />
      <div className="container-padding text-center">
        <div className="glass-card rounded-xl p-8 max-w-lg mx-auto">
          <div className="mb-6">
            <h1 className="text-6xl font-bold text-neon-purple mb-2">404</h1>
            <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
            <p className="text-neutral-300 mb-8">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" className="flex items-center gap-2" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
            <Button className="cyber-button flex items-center gap-2" asChild>
              <Link to="/">
                <Home className="h-4 w-4" />
                Return Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
