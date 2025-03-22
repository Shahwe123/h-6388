
import { Button } from "@/components/ui/button";
import BetaCountdown from "./BetaCountdown";

interface CountdownSectionProps {
  openNewsletterForm: () => void;
}

const CountdownSection = ({ openNewsletterForm }: CountdownSectionProps) => {
  return (
    <section className="py-16 container-padding bg-gradient-to-b from-primary to-black">
      <div className="max-w-4xl mx-auto">
        <div className="glass-card p-8 rounded-xl text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            <span className="text-neon-purple">Limited Beta Access</span> Closes In:
          </h2>

          <BetaCountdown />

          <p className="text-neutral-300 mb-6">
            We're only accepting <span className="text-neon-green font-bold">500 beta testers</span>. Don't miss your chance!
          </p>

          <Button onClick={openNewsletterForm} variant="cta" size="lg" className="w-full md:w-auto md:px-8">
            🔥 Secure Your Spot Now!
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CountdownSection;
