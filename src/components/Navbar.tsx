
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Gamepad, User, Settings, LogOut, ChevronDown, Link2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-b border-neon-purple/30">
      <nav className="container-padding mx-auto flex h-16 items-center justify-between">
        <Link to="/" className="text-xl font-bold text-white flex items-center gap-2">
          <Gamepad className="w-6 h-6 text-neon-purple" />
          <span className="neon-text">AchievR</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          {session ? (
            <>
              <div className="relative">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="text-neutral-300 hover:text-neon-pink transition-colors flex items-center gap-1"
                >
                  <User className="w-4 h-4" />
                  Profile
                  <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-black/90 backdrop-blur-lg border border-neon-purple/30 rounded-md shadow-lg py-1 z-10">
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 text-sm text-neutral-300 hover:bg-neon-purple/10 hover:text-neon-pink transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <User className="w-4 h-4 inline mr-2" />
                      View Profile
                    </Link>
                    <Link 
                      to="/link-accounts" 
                      className="block px-4 py-2 text-sm text-neutral-300 hover:bg-neon-purple/10 hover:text-neon-pink transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <Link2 className="w-4 h-4 inline mr-2" />
                      Link Accounts
                    </Link>
                    <Link 
                      to="/settings" 
                      className="block px-4 py-2 text-sm text-neutral-300 hover:bg-neon-purple/10 hover:text-neon-pink transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <Settings className="w-4 h-4 inline mr-2" />
                      Settings
                    </Link>
                    <button 
                      onClick={() => {
                        handleSignOut();
                        setIsDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-neutral-300 hover:bg-neon-purple/10 hover:text-neon-pink transition-colors"
                    >
                      <LogOut className="w-4 h-4 inline mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link to="/auth" className="cyber-button flex items-center gap-2">
              Sign In
            </Link>
          )}
        </div>

        <button 
          className="md:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="text-neon-purple" /> : <Menu className="text-neon-purple" />}
        </button>
      </nav>

      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-black/80 backdrop-blur-lg border-b border-neon-purple/30">
          <div className="container-padding py-4 flex flex-col gap-4">
            {session ? (
              <>
                <Link 
                  to="/profile" 
                  className="text-neutral-300 hover:text-neon-pink transition-colors flex items-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="w-4 h-4" />
                  Profile
                </Link>
                <Link 
                  to="/link-accounts" 
                  className="text-neutral-300 hover:text-neon-pink transition-colors flex items-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Link2 className="w-4 h-4" />
                  Link Accounts
                </Link>
                <Link 
                  to="/settings" 
                  className="text-neutral-300 hover:text-neon-pink transition-colors flex items-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </Link>
                <button 
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}
                  className="text-neutral-300 hover:text-neon-pink transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <Link 
                to="/auth" 
                className="cyber-button flex items-center justify-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
