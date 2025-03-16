
import { Gamepad, Trophy, Github, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-black text-white">
      <div className="container-padding py-16">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-4 text-neon-purple">Platform</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-neutral-300 hover:text-white transition-colors">Features</Link></li>
              <li><Link to="/pricing" className="text-neutral-300 hover:text-white transition-colors">Pricing</Link></li>
              <li><Link to="/beta" className="text-neutral-300 hover:text-white transition-colors">Beta Access</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-neon-purple">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-neutral-300 hover:text-white transition-colors">About</Link></li>
              <li><Link to="/blog" className="text-neutral-300 hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="/contact" className="text-neutral-300 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-neon-purple">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/guides" className="text-neutral-300 hover:text-white transition-colors">Guides</Link></li>
              <li><Link to="/documentation" className="text-neutral-300 hover:text-white transition-colors">Documentation</Link></li>
              <li><Link to="/support" className="text-neutral-300 hover:text-white transition-colors">Support</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-neon-purple">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-neutral-300 hover:text-white transition-colors">Privacy</Link></li>
              <li><Link to="/terms" className="text-neutral-300 hover:text-white transition-colors">Terms</Link></li>
              <li><Link to="/cookies" className="text-neutral-300 hover:text-white transition-colors">Cookies</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto mt-12 pt-8 border-t border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Gamepad className="w-5 h-5 text-neon-purple" />
            <p className="text-white font-bold">PlatinumPath</p>
          </div>
          
          <p className="text-neutral-400 text-center text-sm">
            © 2024 PlatinumPath. All rights reserved.
          </p>
          
          <div className="flex items-center gap-4">
            <a href="#" className="text-neutral-400 hover:text-neon-purple transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-neutral-400 hover:text-neon-purple transition-colors">
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
