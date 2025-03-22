
import { ArrowRight, Trophy, Zap, Shield, Users } from "lucide-react";

interface BetaPerksSectionProps {
  openNewsletterForm: () => void;
}

const BetaPerksSection = ({ openNewsletterForm }: BetaPerksSectionProps) => {
  return (
    <section id="beta-perks" className="py-16 container-padding bg-gradient-to-b from-black via-black to-dark-blue">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-white">
          Why Choose <span className="text-neon-purple">PlatinumPath's Game Achievement Tracker</span>?
        </h2>
        <p className="text-neutral-300 text-center mb-12 max-w-2xl mx-auto">
          Beta testers get exclusive perks that won't be available after full launch!
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="glass-card p-8 rounded-xl">
            <Trophy className="w-10 h-10 text-neon-pink mb-4" />
            <h3 className="font-bold text-lg mb-2">Gain Early Access to Our Trophy & Achievement Manager</h3>
            <p className="text-neutral-300">Be the FIRST to try it before public release. Explore features months ahead of everyone else.</p>
          </div>

          <div className="glass-card p-8 rounded-xl">
            <Zap className="w-10 h-10 text-neon-blue mb-4" />
            <h3 className="font-bold text-lg mb-2">Influence Gaming with Our Progress Tracker Insights</h3>
            <p className="text-neutral-300">Your feedback shapes the final product. Tell us what you want, and we'll build it!</p>
          </div>

          <div className="glass-card p-8 rounded-xl">
            <Shield className="w-10 h-10 text-neon-purple mb-4" />
            <h3 className="font-bold text-lg mb-2">Exclusive Founder's Badge – ONLY available to beta testers!</h3>
            <p className="text-neutral-300">Get a permanent "PlatinumPath Founder" profile badge that shows you were here first.</p>
          </div>

          <div className="glass-card p-8 rounded-xl">
            <Users className="w-10 h-10 text-neon-green mb-4" />
            <h3 className="font-bold text-lg mb-2">Unlock VIP Rewards – Get premium perks when we launch.</h3>
            <p className="text-neutral-300">Beta testers get premium perks and benefits when we officially launch.</p>
          </div>
        </div>

        <div className="mb-12 flex justify-center">
          <div className="w-64 h-64 bg-black/50 flex items-center justify-center rounded-lg border border-neon-purple/30">
            <div className="text-center">
              <Trophy className="w-16 h-16 text-neon-green mb-4 mx-auto animate-pulse" />
              <p className="text-neutral-300">Trophy Unlocking Animation</p>
              <p className="text-xs text-neutral-400">(Placeholder for GIF)</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button onClick={openNewsletterForm} className="cyber-button flex items-center justify-center gap-2 mx-auto">
            Get Exclusive Perks – Join the Beta!
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default BetaPerksSection;
