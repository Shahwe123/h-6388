
import { Trophy, BarChart, Gamepad, Zap, Target, Rocket, Shield, Crosshair } from "lucide-react";

/**
 * Features data array
 * Each object represents a feature with title, description and icon
 */
const features = [{
  title: "Unified Gaming Profile",
  description: "Play anywhere, track everywhere across all major gaming platforms.",
  icon: Gamepad
}, {
  title: "AI-Powered Challenges",
  description: "Smart recommendations for the easiest platinum wins.",
  icon: Zap
}, {
  title: "Global Leaderboards",
  description: "Compete against the world's best completionists.",
  icon: Trophy
}, {
  title: "Platinum Progress Tracker",
  description: "A personalized roadmap to 100% completion on every game.",
  icon: Target
}, {
  title: "Backlog Dungeon Mode",
  description: "Turn your unfinished games into a quest to conquer.",
  icon: Shield
}, {
  title: "Shareable Gamercards",
  description: "Show off your milestones and achievements everywhere.",
  icon: Rocket
}];

/**
 * Features component
 * 
 * Displays the key features of the platform in a grid layout.
 * Each feature shows an icon, title, and description.
 * 
 * @returns {JSX.Element} The features section UI
 */
const Features = () => {
  return <section id="features" className="py-16 container-padding bg-primary">
      <div className="max-w-4xl mx-auto">
        {/* Section heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-white">
          Why Use <span className="text-neon-purple">PlatinumPath</span>?
        </h2>
        <p className="text-neutral-300 text-center mb-12 max-w-2xl mx-auto">Are you a completionist who loves unlocking trophies and achievements? PlatinumPath lets you track all your gaming milestones across PlayStation, Xbox, and Steam – all in one place!</p>
        
        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => <div key={index} className="glass-card p-8 rounded-xl hover:border-neon-purple/50 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-neon-purple/10 p-3 rounded-lg">
                  <feature.icon className="w-6 h-6 text-neon-purple" />
                </div>
                <h3 className="font-semibold text-xl text-white">{feature.title}</h3>
              </div>
              <p className="text-neutral-300">{feature.description}</p>
            </div>)}
        </div>
      </div>
    </section>;
};

export default Features;
