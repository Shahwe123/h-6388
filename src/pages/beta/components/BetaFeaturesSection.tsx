
import { ArrowRight } from "lucide-react";
import FeaturesTabs from "./FeaturesTabs";

interface BetaFeaturesSectionProps {
  openNewsletterForm: () => void;
}

const BetaFeaturesSection = ({ openNewsletterForm }: BetaFeaturesSectionProps) => {
  return (
    <section id="beta-features" className="py-16 container-padding bg-gradient-to-b from-dark-blue via-black to-black">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-white">
          Inside PlatinumPath's <span className="text-neon-purple">Exclusive Beta</span>
        </h2>
        <p className="text-neutral-300 text-center mb-12 max-w-2xl mx-auto">
          Be Among the First to Test These Powerful Features!
        </p>

        <FeaturesTabs />

        <div className="text-center">
          <button onClick={openNewsletterForm} className="cyber-button flex items-center justify-center gap-2 mx-auto">
            Try All These Features – Join the Beta Now!
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default BetaFeaturesSection;
