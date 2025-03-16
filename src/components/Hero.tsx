
import { ArrowRight, Trophy, Zap, Target } from "lucide-react";

const Hero = () => {
  return (
    <section className="w-full pt-32 pb-16 bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-40 bg-hero-pattern bg-cover bg-center"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-primary"></div>
      
      <div className="container-padding max-w-4xl mx-auto text-center relative z-10">
        <div className="inline-block px-4 py-1 rounded-full bg-neon-purple/20 border border-neon-purple/40 mb-4">
          <p className="text-sm font-medium text-neon-purple animate-pulse">🔥 THE ULTIMATE GAMING ACHIEVEMENT TRACKER IS COMING! 🔥</p>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance leading-tight neon-text">
          Track. Compete. Conquer.
        </h1>
        <p className="text-lg md:text-xl text-neutral-300 mb-8 max-w-2xl mx-auto">PlatinumPath is the ultimate game achievement tracker for PlayStation, Xbox &amp; Steam. Sync, compare, and complete your gaming trophies in one dashboard. Get started now</p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button className="cyber-button flex items-center justify-center gap-2">
            Join Waitlist
            <ArrowRight className="w-4 h-4" />
          </button>
          <button className="bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-md hover:bg-white/20 transition-colors flex items-center justify-center gap-2">
            Watch Demo
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="glass-card p-6 rounded-xl flex flex-col items-center">
            <Trophy className="w-10 h-10 text-neon-pink mb-4" />
            <h3 className="font-bold text-lg mb-2">Every PlayStation Trophy</h3>
            <p className="text-neutral-300 text-sm">Track and showcase your rarest achievements</p>
          </div>
          
          <div className="glass-card p-6 rounded-xl flex flex-col items-center">
            <Zap className="w-10 h-10 text-neon-blue mb-4" />
            <h3 className="font-bold text-lg mb-2">AI-Powered Challenges</h3>
            <p className="text-neutral-300 text-sm">Smart recommendations for platinum wins</p>
          </div>
          
          <div className="glass-card p-6 rounded-xl flex flex-col items-center">
            <Target className="w-10 h-10 text-neon-purple mb-4" />
            <h3 className="font-bold text-lg mb-2">Global Leaderboards</h3>
            <p className="text-neutral-300 text-sm">Compete against the world's best completionists</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
