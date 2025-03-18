
import { Menu, X, Gamepad } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-md border-b border-neon-purple/20">
      <nav className="max-w-full container-padding mx-auto flex h-16 items-center justify-between">
        <Link to="/" className="text-xl font-bold text-white flex items-center gap-2">
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Gamepad className="w-6 h-6 text-neon-purple" />
            <motion.span 
              className="font-bold text-xl text-white neon-text uppercase tracking-wider"
              animate={{ 
                textShadow: ['0 0 5px #D946EF, 0 0 10px #D946EF', '0 0 7px #D946EF, 0 0 15px #D946EF', '0 0 5px #D946EF, 0 0 10px #D946EF']
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              PlatinumPath
            </motion.span>
          </motion.div>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <motion.a 
            href="#problem-solution" 
            className="text-neutral-300 hover:text-neon-pink transition-colors"
            whileHover={{ y: -2 }}
          >
            The Problem
          </motion.a>
          <motion.a 
            href="#beta-features" 
            className="text-neutral-300 hover:text-neon-pink transition-colors"
            whileHover={{ y: -2 }}
          >
            Features
          </motion.a>
          <motion.a 
            href="#how-it-works" 
            className="text-neutral-300 hover:text-neon-pink transition-colors"
            whileHover={{ y: -2 }}
          >
            How It Works
          </motion.a>
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 500, damping: 10 }}
          >
            <Link to="/auth" className="cyber-button flex items-center gap-2 animate-pulse-slow">
              Get Started
            </Link>
          </motion.div>
        </div>

        <button 
          className="md:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="text-neon-purple" /> : <Menu className="text-neon-purple" />}
        </button>
      </nav>

      {isMenuOpen && (
        <motion.div 
          className="md:hidden absolute top-16 left-0 right-0 bg-black/90 backdrop-blur-md border-b border-neon-purple/20"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="container-padding py-4 flex flex-col gap-4">
            <a href="#problem-solution" className="text-neutral-300 hover:text-neon-pink transition-colors py-2">
              The Problem
            </a>
            <a href="#beta-features" className="text-neutral-300 hover:text-neon-pink transition-colors py-2">
              Features
            </a>
            <a href="#how-it-works" className="text-neutral-300 hover:text-neon-pink transition-colors py-2">
              How It Works
            </a>
            <Link to="/auth" className="cyber-button flex items-center justify-center gap-2 mt-2">
              Get Started
            </Link>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Header;
