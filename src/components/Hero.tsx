
import { ChevronDown } from 'lucide-react';

interface HeroProps {
  onGetStarted: () => void;
  onSeeTheSolutions: () => void;
}

const Hero = ({ onGetStarted, onSeeTheSolutions }: HeroProps) => {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <div className="container mx-auto text-center px-4 relative z-10">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 neon-text text-balance leading-tight">
          Level Up Your Gaming Experience
        </h1>
        <p className="text-lg md:text-xl text-neutral-300 max-w-2xl mx-auto mb-10">
          Track your achievements, connect with friends, and discover new challenges
          across all your favorite games with AchievR.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-20">
          <button onClick={onGetStarted} className="cyber-button px-8 py-3">
            Get Started
          </button>
          <button onClick={onSeeTheSolutions} className="px-8 py-3 border border-neon-purple/50 rounded-md hover:bg-neon-purple/10 transition-colors">
            See the Solutions
          </button>
        </div>
        
        <div className="hidden md:block absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-8 w-8 text-neon-purple" />
        </div>
      </div>
      
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      
      <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-neon-purple/20 rounded-full filter blur-3xl"></div>
      <div className="absolute -top-48 -right-48 w-96 h-96 bg-neon-blue/20 rounded-full filter blur-3xl"></div>
    </section>
  );
};

export default Hero;
