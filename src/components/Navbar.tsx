import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Menu, X, User, Settings, LogOut, Gamepad } from 'lucide-react';

const Navbar = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        setSession(session);
      });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: 'Error signing out',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      navigate('/auth');
      toast({
        title: 'Signed out successfully',
      });
    }
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    ...(!session ? [
      { path: '/auth', label: 'Sign In' }
    ] : [
      { path: '/profile', label: 'Profile' },
      { path: '/link-accounts', label: 'Link Accounts' },
      { path: '/settings', label: 'Settings' }
    ])
  ];

  return (
    <nav className="fixed w-full top-0 z-50 bg-primary/90 backdrop-blur-md border-b border-neon-purple/10">
      <div className="container-padding mx-auto flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="font-bold text-xl">GameHub</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-white ${
                pathname === link.path ? 'text-white' : 'text-neutral-400'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile menu button */}
        <button 
          className="md:hidden text-neutral-300 focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-primary/95 backdrop-blur-md">
          <div className="container-padding pt-4 pb-6 space-y-4 border-b border-neon-purple/10">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`block py-2 text-lg ${
                  pathname === link.path ? 'text-white font-medium' : 'text-neutral-400'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {session && (
              <div className="pt-4 border-t border-neutral-800">
                <button
                  className="flex items-center text-neutral-400 hover:text-white w-full py-2"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* User Menu (Desktop) */}
      {session && (
        <div className="hidden md:block absolute right-6 top-16">
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-primary border border-neutral-800 rounded-md shadow-lg py-1 z-10">
              <Link 
                to="/profile" 
                className="flex items-center px-4 py-2 text-sm text-neutral-300 hover:bg-black/30"
                onClick={() => setIsUserMenuOpen(false)}
              >
                <User className="h-4 w-4 mr-2" />
                Profile
              </Link>
              <Link 
                to="/link-accounts" 
                className="flex items-center px-4 py-2 text-sm text-neutral-300 hover:bg-black/30"
                onClick={() => setIsUserMenuOpen(false)}
              >
                <Gamepad className="h-4 w-4 mr-2" />
                Link Accounts
              </Link>
              <Link 
                to="/settings" 
                className="flex items-center px-4 py-2 text-sm text-neutral-300 hover:bg-black/30"
                onClick={() => setIsUserMenuOpen(false)}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Link>
              <div className="border-t border-neutral-800 my-1"></div>
              <button
                className="flex items-center px-4 py-2 text-sm text-neutral-300 hover:bg-black/30 w-full text-left"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
