
import { ArrowRight, Mail, Trophy } from "lucide-react";

interface HowItWorksSectionProps {
  openNewsletterForm: () => void;
}

const HowItWorksSection = ({ openNewsletterForm }: HowItWorksSectionProps) => {
  return (
    <section id="how-it-works" className="py-16 container-padding bg-gradient-to-b from-dark-blue via-[#101220] to-black">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-white">
          ⚡How It Works – Get Started in <span className="text-neon-purple">3 Simple Steps!</span>
        </h2>
        <p className="text-neutral-300 text-center mb-12 max-w-2xl mx-auto">
          Getting started is super simple – just follow these easy steps:
        </p>

        <div className="flex flex-col md:flex-row gap-6 mb-12">
          <div className="glass-card p-8 rounded-xl flex-1 relative">
            <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-neon-purple flex items-center justify-center text-black font-bold text-xl">1</div>
            <h3 className="font-bold text-lg mb-4 pt-2">Sign Up Today</h3>
            <p className="text-neutral-300">It takes just 10 seconds to enter your email and secure your spot.</p>
            <div className="mt-4 text-center">
              <Mail className="w-12 h-12 text-neon-pink mx-auto" />
            </div>
          </div>

          <div className="hidden md:block w-8 self-center">
            <ArrowRight className="w-8 h-8 text-neon-purple" />
          </div>

          <div className="glass-card p-8 rounded-xl flex-1 relative">
            <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-neon-purple flex items-center justify-center text-black font-bold text-xl">2</div>
            <h3 className="font-bold text-lg mb-4 pt-2">Get Your Invite</h3>
            <p className="text-neutral-300">We will email you before the beta launch when it's time to join.</p>
            <div className="mt-4 text-center">
              <Mail className="w-12 h-12 text-neon-blue mx-auto" />
            </div>
          </div>

          <div className="hidden md:block w-8 self-center">
            <ArrowRight className="w-8 h-8 text-neon-purple" />
          </div>

          <div className="glass-card p-8 rounded-xl flex-1 relative">
            <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-neon-purple flex items-center justify-center text-black font-bold text-xl">3</div>
            <h3 className="font-bold text-lg mb-4 pt-2">Start Tracking</h3>
            <p className="text-neutral-300">Sync your trophies &amp; start flexing your achievements!</p>
            <div className="mt-4 text-center">
              <Trophy className="w-12 h-12 text-neon-green mx-auto" />
            </div>
          </div>
        </div>

        <div className="text-center">
          <button onClick={openNewsletterForm} className="cyber-button flex items-center justify-center gap-2 mx-auto">
            Easy to Join – Get Started Now!
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
