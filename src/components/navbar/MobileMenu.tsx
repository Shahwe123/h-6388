
import React from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { Session } from '@supabase/supabase-js';

interface MobileMenuProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
  onSignOut?: () => Promise<void>;
  session?: Session | null;
  notifications?: any[];
  hasUnreadNotifications?: boolean;
  onNotificationsRead?: () => Promise<void>;
  isOpen?: boolean;
  onClose?: () => void;
}

const MobileMenu = ({ 
  isMenuOpen, 
  toggleMenu,
  onSignOut,
  session,
  isOpen,
  onClose
}: MobileMenuProps) => {
  const closeMenu = () => {
    toggleMenu();
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className={`${isMenuOpen || isOpen ? 'translate-x-0' : 'translate-x-full'} fixed top-0 right-0 h-full w-full bg-background z-50 transition-transform duration-300 ease-in-out transform md:hidden`}>
      <div className="absolute top-4 left-4">
        <button onClick={closeMenu}>
          <X className="h-6 w-6 text-neutral-200" />
        </button>
      </div>
      
      <div className="px-4 pt-8 pb-32 h-full overflow-y-auto">
        <ul className="space-y-6">
          <li>
            <Link 
              to="/" 
              className="text-xl font-semibold hover:text-neon-blue transition-colors"
              onClick={closeMenu}
            >
              Home
            </Link>
          </li>
          
          <li>
            <Link 
              to="/about" 
              className="text-xl font-semibold hover:text-neon-blue transition-colors"
              onClick={closeMenu}
            >
              About
            </Link>
          </li>
          
          <li>
            <Link 
              to="/pricing" 
              className="text-xl font-semibold hover:text-neon-blue transition-colors"
              onClick={closeMenu}
            >
              Pricing
            </Link>
          </li>
          
          <li>
            <Link 
              to="/contact" 
              className="text-xl font-semibold hover:text-neon-blue transition-colors"
              onClick={closeMenu}
            >
              Contact
            </Link>
          </li>

          {session && (
            <>
              <li>
                <Link 
                  to="/profile" 
                  className="text-xl font-semibold hover:text-neon-blue transition-colors"
                  onClick={closeMenu}
                >
                  Profile
                </Link>
              </li>
              
              <li>
                <Link 
                  to="/forum" 
                  className="text-xl font-semibold hover:text-neon-blue transition-colors"
                  onClick={closeMenu}
                >
                  Forum
                </Link>
              </li>
              
              <li>
                <button
                  onClick={() => {
                    if (onSignOut) {
                      onSignOut();
                    }
                    closeMenu();
                  }}
                  className="text-xl font-semibold hover:text-neon-blue transition-colors"
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default MobileMenu;
