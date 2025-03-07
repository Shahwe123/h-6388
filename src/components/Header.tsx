
import { Menu, X, Gamepad } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-b border-neon-purple/30">
      <nav className="container-padding mx-auto flex h-16 items-center justify-between">
        <a href="/" className="text-xl font-bold text-white flex items-center gap-2">
          <Gamepad className="w-6 h-6 text-neon-purple" />
          <span className="neon-text">AchievR</span>
        </a>
        
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-neutral-300 hover:text-neon-pink transition-colors">
            Features
          </a>
          <a href="#testimonials" className="text-neutral-300 hover:text-neon-pink transition-colors">
            Testimonials
          </a>
          <a href="#pricing" className="text-neutral-300 hover:text-neon-pink transition-colors">
            Pricing
          </a>
          <button className="cyber-button flex items-center gap-2">
            Get Started
          </button>
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
            <a href="#features" className="text-neutral-300 hover:text-neon-pink transition-colors">
              Features
            </a>
            <a href="#testimonials" className="text-neutral-300 hover:text-neon-pink transition-colors">
              Testimonials
            </a>
            <a href="#pricing" className="text-neutral-300 hover:text-neon-pink transition-colors">
              Pricing
            </a>
            <button className="cyber-button flex items-center justify-center gap-2">
              Get Started
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
