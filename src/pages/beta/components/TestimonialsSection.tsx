
import { CheckCircle, LockKeyhole } from "lucide-react";
import { PlayStationIcon, XboxIcon, SteamIcon } from "@/components/platforms/PlatformIcons";

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-16 container-padding bg-gradient-to-b from-black via-black to-primary">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
          <span className="text-neon-purple">Gamers</span> Are Hyped for PlatinumPath!
        </h2>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="glass-card p-8 rounded-xl">
            <p className="text-neutral-300 mb-4 italic">
              "Finally, a way to flex my achievements across every platform! I've been waiting for something like this for years."
            </p>
            <p className="text-neon-pink font-medium">– Beta Tester #1</p>
          </div>

          <div className="glass-card p-8 rounded-xl">
            <p className="text-neutral-300 mb-4 italic">
              "This AI-powered tracking feature is genius. It found achievements I didn't even know existed!"
            </p>
            <p className="text-neon-pink font-medium">– Early Preview User</p>
          </div>
        </div>

        <div className="glass-card p-8 rounded-xl mb-12">
          <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
            <LockKeyhole className="w-6 h-6 text-neon-purple" />
            Privacy & Security Assurance
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-neon-green flex-shrink-0 mt-0.5" />
              <p className="text-neutral-300">We only read achievement data – no personal info collected.</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-neon-green flex-shrink-0 mt-0.5" />
              <p className="text-neutral-300">You can unlink your accounts anytime – you're in control.</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-8 mb-8">
          <div className="w-20 h-20 bg-black/50 flex items-center justify-center rounded-lg border border-neon-purple/30">
            <PlayStationIcon className="w-12 h-12 text-neon-blue" />
          </div>
          <div className="w-20 h-20 bg-black/50 flex items-center justify-center rounded-lg border border-neon-purple/30">
            <XboxIcon className="w-12 h-12 text-neon-green" />
          </div>
          <div className="w-20 h-20 bg-black/50 flex items-center justify-center rounded-lg border border-neon-purple/30">
            <SteamIcon className="w-12 h-12 text-white" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
