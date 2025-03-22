
import { ArrowRight, LockKeyhole, CheckCircle, Shield, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  openNewsletterForm: () => void;
}

const HeroSection = ({ openNewsletterForm }: HeroSectionProps) => {
  return (
    <section className="pt-32 pb-16 container-padding bg-gradient-to-b from-black via-black to-primary text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-40 bg-hero-pattern bg-cover bg-center"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-primary"></div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="inline-block px-4 py-1 rounded-full bg-neon-purple/20 border border-neon-purple/40 mb-4">
          <p className="text-sm font-medium text-neon-purple animate-pulse">🔥 LIMITED BETA ACCESS NOW AVAILABLE! 🔥</p>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance leading-tight neon-text">The Ultimate Game Achievement Tracker – Join the Beta Before It's Too Late!</h1>
        <h2 className="text-lg md:text-xl text-neutral-300 mb-8 max-w-2xl mx-auto">PlatinumPath is your go-to solution for syncing trophies from PlayStation, Xbox, and Steam effortlessly using our game achievement tracker. This is the best gaming achievement app that brings gaming stats in one location. </h2>

        <div className="flex justify-center mb-6">
          <div className="bg-black/30 backdrop-blur-md rounded-lg p-3 flex gap-6 border border-neon-purple/20">
            <div className="flex items-center gap-2">
              <LockKeyhole className="w-4 h-4 text-neon-purple" />
              <span className="text-sm text-neutral-300">Secure & Private</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-neon-green" />
              <span className="text-sm text-neutral-300">100% Free Beta</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-neon-blue" />
              <span className="text-sm text-neutral-300">No Commitment</span>
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-8 max-w-lg mx-auto">
          <Button onClick={openNewsletterForm} variant="cta" size="xl" className="animate-pulse-slow shadow-[0_0_15px_rgba(217,70,239,0.5)] text-base md:text-xl uppercase tracking-wide w-full max-w-full text-center">
            <span className="text-center px-2">CLAIM YOUR BETA SPOT</span>
            <ArrowRight className="w-5 h-5 ml-2 flex-shrink-0" />
          </Button>
        </div>

        <div className="mt-8 relative">
          <div className="w-full h-64 md:h-80 bg-black/50 flex items-center justify-center rounded-lg border border-neon-purple/30 overflow-hidden">
            <div className="text-center">
              <Trophy className="w-16 h-16 text-neon-pink mb-4 mx-auto" />
              <p className="text-neutral-300">Dashboard Mockup Placeholder</p>
            </div>
          </div>
          <div className="absolute -bottom-3 left-0 right-0 h-12 bg-gradient-to-t from-primary to-transparent"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
