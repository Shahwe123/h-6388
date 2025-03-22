
import { ArrowRight, XCircle, CheckCircle } from "lucide-react";

interface ProblemSolutionSectionProps {
  openNewsletterForm: () => void;
}

const ProblemSolutionSection = ({ openNewsletterForm }: ProblemSolutionSectionProps) => {
  return (
    <section id="problem-solution" className="py-16 container-padding bg-gradient-to-b from-primary via-primary to-dark-blue">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
          The <span className="text-neon-purple">Problem</span> & Our <span className="text-neon-purple">Solution</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="glass-card p-8 rounded-xl">
            <h3 className="font-bold text-xl mb-6 text-white flex items-center gap-2">
              <span className="text-neon-pink">Problems Gamers Face</span>
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <XCircle className="w-6 h-6 text-neon-pink flex-shrink-0 mt-0.5" />
                <p className="text-neutral-300">Tired of tracking achievements across multiple platforms?</p>
              </div>
              <div className="flex items-start gap-3">
                <XCircle className="w-6 h-6 text-neon-pink flex-shrink-0 mt-0.5" />
                <p className="text-neutral-300">Looking for a gaming progress tracker that compares trophies seamlessly?</p>
              </div>
              <div className="flex items-start gap-3">
                <XCircle className="w-6 h-6 text-neon-pink flex-shrink-0 mt-0.5" />
                <p className="text-neutral-300">Manual tracking is annoying & time-consuming?</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-8 rounded-xl">
            <h3 className="font-bold text-xl mb-6 text-white flex items-center gap-2">
              <span className="text-neon-purple">PlatinumPath Solution</span>
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-neon-green flex-shrink-0 mt-0.5" />
                <p className="text-neutral-300">One comprehensive dashboard for cross-platform game tracking</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-neon-green flex-shrink-0 mt-0.5" />
                <p className="text-neutral-300">AI-powered tracking for personalized trophy suggestions using our trophy & achievement manager</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-neon-green flex-shrink-0 mt-0.5" />
                <p className="text-neutral-300">Track & compare game achievements with friends across multiple platforms using the best gaming achievement app!</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button onClick={openNewsletterForm} className="cyber-button flex items-center justify-center gap-2 mx-auto">
            Solve This Problem Now – Join the Beta!
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolutionSection;
