
import { Menu, X, Gamepad } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-neon-purple/10">
      <nav className="container-padding mx-auto flex h-16 items-center justify-between">
        <Link to="/" className="text-xl font-bold text-white flex items-center gap-2">
          <Gamepad className="w-6 h-6 text-neon-purple" />
          <span className="neon-text">AchievR</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <a href="#problem" className="text-neutral-300 hover:text-neon-pink transition-colors">
            The Problem
          </a>
          <a href="#solution" className="text-neutral-300 hover:text-neon-pink transition-colors">
            The Solution
          </a>
          <a href="#features" className="text-neutral-300 hover:text-neon-pink transition-colors">
            Features
          </a>
          <Link to="/auth" className="cyber-button flex items-center gap-2">
            Get Started
          </Link>
        </div>

        <button 
          className="md:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="text-neon-purple" /> : <Menu className="text-neon-purple" />}
        </button>
      </nav>

      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-black border-b border-neon-purple/10">
          <div className="container-padding py-4 flex flex-col gap-4">
            <a href="#problem" className="text-neutral-300 hover:text-neon-pink transition-colors">
              The Problem
            </a>
            <a href="#solution" className="text-neutral-300 hover:text-neon-pink transition-colors">
              The Solution
            </a>
            <a href="#features" className="text-neutral-300 hover:text-neon-pink transition-colors">
              Features
            </a>
            <Link to="/auth" className="cyber-button flex items-center justify-center gap-2">
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
