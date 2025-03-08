
import { XCircle, Check, AlertTriangle, Trophy, Target, Award, Users, Zap, Shield, Crosshair, Gamepad } from "lucide-react";
import { useState } from "react";
import NewsletterForm from "./NewsletterForm";

const Problems = () => {
  const [activeTab, setActiveTab] = useState("problems");
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  return (
    <section id="problem" className="py-16 container-padding bg-gradient-to-b from-black via-primary/90 to-primary">
      <div className="max-w-4xl mx-auto">
        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="glass-card rounded-full p-1 flex">
            <button
              onClick={() => setActiveTab("problems")}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                activeTab === "problems" ? "bg-neon-purple text-white" : "text-neutral-300 hover:text-white"
              }`}
            >
              THE PROBLEM
            </button>
            <button
              onClick={() => setActiveTab("solution")}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                activeTab === "solution" ? "bg-neon-purple text-white" : "text-neutral-300 hover:text-white"
              }`}
            >
              THE SOLUTION
            </button>
          </div>
        </div>

        {/* Problem Section */}
        {activeTab === "problems" && (
          <div className="animate-fade-in">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                <span className="text-red-500 mr-2">💀</span> YOU'RE LOSING ACHIEVEMENTS RIGHT NOW <span className="text-red-500 ml-2">💀</span>
              </h2>
              <p className="text-xl text-neutral-300 mb-10">
                🎮 How Many Games Have You Almost Completed… But Never Finished?
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {[
                {
                  title: "No Centralized Tracker?",
                  description: "Your achievements are scattered across platforms.",
                  icon: XCircle,
                },
                {
                  title: "Too Many Unfinished Games?",
                  description: "You're this close to 100% but lose momentum.",
                  icon: AlertTriangle,
                },
                {
                  title: "Lack of Motivation?",
                  description: "There's nothing pushing you to get that last trophy.",
                  icon: XCircle,
                },
                {
                  title: "No Real Competition?",
                  description: "You can't see where you rank among friends & global hunters.",
                  icon: XCircle,
                },
              ].map((problem, index) => (
                <div key={index} className="glass-card p-6 rounded-xl border border-red-500/30 flex items-start gap-4">
                  <div className="bg-red-500/20 p-3 rounded-lg shrink-0">
                    <problem.icon className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1 text-white">🚫 {problem.title}</h3>
                    <p className="text-neutral-300">{problem.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mb-10">
              <p className="text-xl font-bold text-red-400 mb-4">
                💥 This is why you haven't platinumed that one game sitting at 95%. 💥
              </p>
              <button 
                onClick={() => setActiveTab("solution")} 
                className="cyber-button mt-6 group flex items-center mx-auto"
              >
                See The Solution
                <Target className="w-5 h-5 ml-2 group-hover:animate-pulse" />
              </button>
            </div>
          </div>
        )}

        {/* Solution Section */}
        {activeTab === "solution" && (
          <div id="solution" className="animate-fade-in">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                <span className="text-neon-purple mr-2">🎯</span> THE SOLUTION: AI-POWERED ACHIEVEMENT TRACKER <span className="text-neon-purple ml-2">🎯</span>
              </h2>
              <p className="text-xl text-neutral-300 mb-6">
                🏆 ACHIEVEMENT MASTERY – TRACK, COMPETE & CONQUER 🏆
              </p>
              <p className="text-lg text-neutral-300 mb-10 max-w-2xl mx-auto">
                💡 We built the app that every trophy hunter and completionist has been waiting for.
              </p>
            </div>

            {/* AI Powered Section */}
            <div className="glass-card p-8 rounded-xl mb-10 border border-neon-purple/30">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-neon-purple/20 p-3 rounded-lg">
                  <Zap className="w-6 h-6 text-neon-purple" />
                </div>
                <h3 className="font-semibold text-2xl text-white">🔥 AI-POWERED GAME COMPLETION SYSTEM 🔥</h3>
              </div>
              <p className="text-lg text-neutral-300 mb-6">👾 No More Guessing. Just Winning.</p>
              
              <h4 className="font-semibold text-xl text-white mb-4">🎯 SMART AI CHALLENGES:</h4>
              <div className="space-y-4 mb-8">
                {[
                  "You're 2 trophies away from the Platinum in Elden Ring!",
                  "Only 5% of players have completed this. You can be next.",
                  "Earn 500 XP by finishing this one last quest!"
                ].map((challenge, index) => (
                  <div key={index} className="bg-black/30 p-4 rounded-lg border border-neon-purple/20">
                    <p className="text-white italic">"{challenge}"</p>
                  </div>
                ))}
              </div>
              
              <div className="text-center">
                <p className="text-neon-purple font-semibold mb-4">💡 This is the power of AI-driven completion tracking.</p>
                <p className="text-lg text-white mb-6">💾 Your Journey to 100% Just Became a Mission.</p>
                <button 
                  className="cyber-button mx-auto"
                  onClick={() => setIsFormOpen(true)}
                >
                  SIGN UP FOR BETA ACCESS →
                </button>
              </div>
            </div>

            {/* Competition Section */}
            <div className="glass-card p-8 rounded-xl mb-10 border border-neon-blue/30">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-neon-blue/20 p-3 rounded-lg">
                  <Trophy className="w-6 h-6 text-neon-blue" />
                </div>
                <h3 className="font-semibold text-2xl text-white">⚔️ TRUE COMPETITION – PROVE YOU'RE THE BEST COMPLETIONIST ⚔️</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-black/30 p-5 rounded-lg border border-neon-blue/20 flex flex-col items-center">
                  <Trophy className="w-8 h-8 text-neon-blue mb-3" />
                  <h4 className="font-bold text-lg mb-2 text-white">🏆 WHERE DO YOU RANK?</h4>
                  <p className="text-neutral-300 text-center">Global, friends-only, and game-specific leaderboards.</p>
                </div>
                <div className="bg-black/30 p-5 rounded-lg border border-neon-blue/20 flex flex-col items-center">
                  <Award className="w-8 h-8 text-neon-blue mb-3" />
                  <h4 className="font-bold text-lg mb-2 text-white">🎖️ EXCLUSIVE BADGES</h4>
                  <p className="text-neutral-300 text-center">Special trophies for elite hunters.</p>
                </div>
                <div className="bg-black/30 p-5 rounded-lg border border-neon-blue/20 flex flex-col items-center">
                  <Users className="w-8 h-8 text-neon-blue mb-3" />
                  <h4 className="font-bold text-lg mb-2 text-white">💬 LIVE ACTIVITY</h4>
                  <p className="text-neutral-300 text-center">Instant updates when your friends hit a milestone.</p>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-lg text-white mb-6">👑 Your trophy collection is your legacy. Let the world see it.</p>
                <button 
                  className="cyber-button mx-auto"
                  onClick={() => setIsFormOpen(true)}
                >
                  SIGN UP & UNLOCK YOUR GAMING STATUS →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Early Access Section - Moved outside the solution tab */}
        <div className="glass-card p-8 rounded-xl mb-10 border border-neon-pink/30">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-neon-pink/20 p-3 rounded-lg">
              <Shield className="w-6 h-6 text-neon-pink" />
            </div>
            <h3 className="font-semibold text-2xl text-white">🎁 EARLY ACCESS = EXCLUSIVE REWARDS 🎁</h3>
          </div>
          <p className="text-lg text-white mb-6">🔥 First 1,000 Sign-Ups Get:</p>
          
          <div className="space-y-4 mb-8">
            {[
              { title: "EARLY BETA ACCESS", desc: "Play before anyone else." },
              { title: "EXCLUSIVE FOUNDER'S BADGE", desc: "A permanent flex on your profile." },
              { title: "LAUNCH REWARDS", desc: "XP boosts, custom themes, and secret perks." }
            ].map((reward, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="bg-neon-pink/20 p-1 rounded shrink-0 mt-1">
                  <Check className="w-4 h-4 text-neon-pink" />
                </div>
                <div>
                  <h4 className="font-bold text-white">{reward.title}</h4>
                  <p className="text-neutral-300">{reward.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs Section - Moved outside the solution tab */}
        <div className="glass-card p-8 rounded-xl mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-neon-purple/20 p-3 rounded-lg">
              <Gamepad className="w-6 h-6 text-neon-purple" />
            </div>
            <h3 className="font-semibold text-2xl text-white">💡 FAQs – BECAUSE YOU HAVE QUESTIONS, WE HAVE ANSWERS 💡</h3>
          </div>
          
          <div className="space-y-6 mb-8">
            {[
              {
                q: "What exactly does this do?",
                a: [
                  "Tracks all achievements from PlayStation, Xbox, Steam, and more.",
                  "Uses AI to suggest challenges to help you platinum games faster.",
                  "Lets you compete globally with real leaderboards."
                ]
              },
              {
                q: "When does the beta launch?",
                a: ["Early adopters get first access!"]
              },
              {
                q: "Is this free?",
                a: ["YES! The core tracker is free forever. Optional premium perks for completionists."]
              },
              {
                q: "Will my data be safe?",
                a: ["100% secure. No selling data, no sketchy ads. Gamer-first, always."]
              }
            ].map((faq, index) => (
              <div key={index} className="bg-black/30 p-6 rounded-lg border border-neon-purple/20">
                <h4 className="font-bold text-lg mb-3 text-white">❓ {faq.q}</h4>
                <div className="space-y-2">
                  {faq.a.map((answer, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="bg-neon-purple/20 p-1 rounded shrink-0 mt-1">
                        <Check className="w-4 h-4 text-neon-purple" />
                      </div>
                      <p className="text-neutral-300">{answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Final Call Section */}
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4 text-white">
            🚀 FINAL CALL: MASTER YOUR GAMING LEGACY 🚀
          </h3>
          <p className="text-lg text-neutral-300 mb-6">
            🔥 Platinum More Games. Track Every Achievement. Compete with the Best.<br />
            📩 Join the Beta & Unlock Exclusive Perks
          </p>
          <button 
            className="cyber-button text-lg mx-auto"
            onClick={() => setIsFormOpen(true)}
          >
            SIGN UP NOW – BEFORE SPOTS ARE GONE →
          </button>
          <p className="text-xl font-bold text-white mt-8">
            🎮 Your Legacy Starts Here. 🎮
          </p>
        </div>

        {/* Newsletter Form Modal */}
        <NewsletterForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
      </div>
    </section>
  );
};

export default Problems;
