
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Gamepad, Zap, BarChart, Flame, Shield, MessageCircle, CheckCircle 
} from "lucide-react";

const FeaturesTabs = () => {
  return (
    <Tabs defaultValue="tracking" className="w-full">
      <div className="flex justify-center mb-8">
        <TabsList className="bg-black/40 backdrop-blur-md border border-neon-purple/20 h-auto p-1 flex-wrap">
          <TabsTrigger value="tracking" className="data-[state=active]:bg-neon-purple/20 data-[state=active]:text-white">
            <Gamepad className="w-4 h-4 mr-2" />
            Multi-Platform
          </TabsTrigger>
          <TabsTrigger value="ai" className="data-[state=active]:bg-neon-purple/20 data-[state=active]:text-white">
            <Zap className="w-4 h-4 mr-2" />
            AI Insights
          </TabsTrigger>
          <TabsTrigger value="dashboard" className="data-[state=active]:bg-neon-purple/20 data-[state=active]:text-white">
            <BarChart className="w-4 h-4 mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="leaderboards" className="data-[state=active]:bg-neon-purple/20 data-[state=active]:text-white">
            <Flame className="w-4 h-4 mr-2" />
            Leaderboards
          </TabsTrigger>
          <TabsTrigger value="privacy" className="data-[state=active]:bg-neon-purple/20 data-[state=active]:text-white">
            <Shield className="w-4 h-4 mr-2" />
            Privacy
          </TabsTrigger>
          <TabsTrigger value="feedback" className="data-[state=active]:bg-neon-purple/20 data-[state=active]:text-white">
            <MessageCircle className="w-4 h-4 mr-2" />
            Feedback
          </TabsTrigger>
        </TabsList>
      </div>

      <div className="glass-card p-6 rounded-xl mb-8">
        <TabsContent value="tracking" className="animate-fade-in">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-neon-purple mb-4 flex items-center gap-2 text-left">
                <Gamepad className="w-6 h-6" />
                Multi-Platform Gaming Progress Tracker Capabilities
              </h3>
              <p className="text-neutral-300 mb-4 text-left">Sync achievements seamlessly using our playstation trophy tracker, xbox achievement tracker, and steam achievement tracker.</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-neon-green flex-shrink-0 mt-0.5" />
                  <span className="text-neutral-300 text-left">Real-time syncing across all platforms</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-neon-green flex-shrink-0 mt-0.5" />
                  <span className="text-neutral-300">Automatic trophy detection</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-neon-green flex-shrink-0 mt-0.5" />
                  <span className="text-neutral-300">Unified achievement history</span>
                </li>
              </ul>
            </div>
            <div className="w-full rounded-lg border border-neon-purple/30 overflow-hidden bg-black/50 h-64 flex items-center justify-center">
              <div className="text-center">
                <Gamepad className="w-16 h-16 text-neon-blue mb-4 mx-auto" />
                <p className="text-neutral-300">Platform Integration Preview</p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ai" className="animate-fade-in">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-neon-purple mb-4 flex items-center gap-2">
                <Zap className="w-6 h-6" />
                AI-Powered Insights
              </h3>
              <p className="text-neutral-300 mb-4 text-left">
                Get smart recommendations on what trophies to chase next based on your gaming habits.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-neon-green flex-shrink-0 mt-0.5" />
                  <span className="text-neutral-300 text-left">Personalized trophy recommendations</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-neon-green flex-shrink-0 mt-0.5" />
                  <span className="text-neutral-300">Difficulty estimation based on your skills</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-neon-green flex-shrink-0 mt-0.5" />
                  <span className="text-neutral-300">Time-to-complete predictions</span>
                </li>
              </ul>
            </div>
            <div className="w-full rounded-lg border border-neon-purple/30 overflow-hidden bg-black/50 h-64 flex items-center justify-center">
              <div className="text-center">
                <Zap className="w-16 h-16 text-neon-pink mb-4 mx-auto" />
                <p className="text-neutral-300">AI Recommendation Engine</p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="dashboard" className="animate-fade-in">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-neon-purple mb-4 flex items-center gap-2 text-left">
                <BarChart className="w-6 h-6" />
                Personal Achievement Dashboard
              </h3>
              <p className="text-neutral-300 mb-4 text-left">
                View all your stats & progress in one place with beautiful visualizations.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-neon-green flex-shrink-0 mt-0.5" />
                  <span className="text-neutral-300">Comprehensive trophy statistics</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-neon-green flex-shrink-0 mt-0.5" />
                  <span className="text-neutral-300">Game completion tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-neon-green flex-shrink-0 mt-0.5" />
                  <span className="text-neutral-300">Interactive progress charts</span>
                </li>
              </ul>
            </div>
            <div className="w-full rounded-lg border border-neon-purple/30 overflow-hidden bg-black/50 h-64 flex items-center justify-center">
              <div className="text-center">
                <BarChart className="w-16 h-16 text-neon-green mb-4 mx-auto" />
                <p className="text-neutral-300">Dashboard Visualization</p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="leaderboards" className="animate-fade-in">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-neon-purple mb-4 flex items-center gap-2">
                <Flame className="w-6 h-6" />
                Competitive Leaderboards
              </h3>
              <p className="text-neutral-300 mb-4 text-left">
                Compare your trophies against friends & the community across all platforms.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-neon-green flex-shrink-0 mt-0.5" />
                  <span className="text-neutral-300 text-left">Global and friend-only leaderboards</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-neon-green flex-shrink-0 mt-0.5" />
                  <span className="text-neutral-300">Game-specific trophy rankings</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-neon-green flex-shrink-0 mt-0.5" />
                  <span className="text-neutral-300">Weekly achievement challenges</span>
                </li>
              </ul>
            </div>
            <div className="w-full rounded-lg border border-neon-purple/30 overflow-hidden bg-black/50 h-64 flex items-center justify-center">
              <div className="text-center">
                <Flame className="w-16 h-16 text-neon-orange mb-4 mx-auto" />
                <p className="text-neutral-300">Community Leaderboards</p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="privacy" className="animate-fade-in">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-neon-purple mb-4 flex items-center gap-2">
                <Shield className="w-6 h-6" />
                Privacy First
              </h3>
              <p className="text-neutral-300 mb-4 text-left">
                We ONLY track public achievements—your data is 100% secure and protected.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-neon-green flex-shrink-0 mt-0.5" />
                  <span className="text-neutral-300 text-left">No personal information collected</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-neon-green flex-shrink-0 mt-0.5" />
                  <span className="text-neutral-300">Control what gets shared</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-neon-green flex-shrink-0 mt-0.5" />
                  <span className="text-neutral-300">Delete your data anytime</span>
                </li>
              </ul>
            </div>
            <div className="w-full rounded-lg border border-neon-purple/30 overflow-hidden bg-black/50 h-64 flex items-center justify-center">
              <div className="text-center">
                <Shield className="w-16 h-16 text-neon-blue mb-4 mx-auto" />
                <p className="text-neutral-300">Privacy & Security Controls</p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="feedback" className="animate-fade-in">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-neon-purple mb-4 flex items-center gap-2 text-left">
                <MessageCircle className="w-6 h-6" />
                Exclusive Beta Feedback Channel
              </h3>
              <p className="text-neutral-300 mb-4 text-left">
                Help shape the future of PlatinumPath with direct access to our development team.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-neon-green flex-shrink-0 mt-0.5" />
                  <span className="text-neutral-300">Direct developer communication</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-neon-green flex-shrink-0 mt-0.5" />
                  <span className="text-neutral-300">Vote on upcoming features</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-neon-green flex-shrink-0 mt-0.5" />
                  <span className="text-neutral-300">Early previews of new updates</span>
                </li>
              </ul>
            </div>
            <div className="w-full rounded-lg border border-neon-purple/30 overflow-hidden bg-black/50 h-64 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 text-neon-purple mb-4 mx-auto" />
                <p className="text-neutral-300">Beta Feedback Interface</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default FeaturesTabs;
