
import { Gamepad } from "lucide-react";
import { Link } from "react-router-dom";

const BetaFooter = () => {
  return (
    <footer className="py-12 container-padding bg-black border-t border-neon-purple/20 text-white">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-neon-purple font-semibold mb-4">Platform</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-neutral-300 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/leaderboard" className="text-neutral-300 hover:text-white transition-colors">Leaderboard</Link></li>
              <li><a href="#beta-features" className="text-neutral-300 hover:text-white transition-colors">Features</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-neon-purple font-semibold mb-4">Help</h3>
            <ul className="space-y-2">
              <li><Link to="/support" className="text-neutral-300 hover:text-white transition-colors">Support</Link></li>
              <li><Link to="/documentation" className="text-neutral-300 hover:text-white transition-colors">Documentation</Link></li>
              <li><Link to="/contact" className="text-neutral-300 hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-neon-purple font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-neutral-300 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/blog" className="text-neutral-300 hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="/privacy" className="text-neutral-300 hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-neon-purple font-semibold mb-4">Connect</h3>
            <ul className="space-y-2">
              <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-neutral-300 hover:text-white transition-colors">Twitter</a></li>
              <li><a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="text-neutral-300 hover:text-white transition-colors">Discord</a></li>
              <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-neutral-300 hover:text-white transition-colors">GitHub</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t border-neutral-800">
          <div className="flex items-center gap-2">
            <Gamepad className="w-5 h-5 text-neon-purple" />
            <span className="font-bold text-white">PlatinumPath</span>
          </div>

          <p className="text-neutral-400 text-sm text-center">
            &copy; {new Date().getFullYear()} PlatinumPath. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <Link to="/terms" className="text-neutral-400 text-sm hover:text-white transition-colors">Terms</Link>
            <Link to="/privacy" className="text-neutral-400 text-sm hover:text-white transition-colors">Privacy</Link>
            <Link to="/cookies" className="text-neutral-400 text-sm hover:text-white transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default BetaFooter;
