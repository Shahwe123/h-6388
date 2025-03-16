import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, XCircle, Trophy, Zap, Users, Shield, Clock, HelpCircle, Mail, LockKeyhole, Gamepad, BarChart, Flame, MessageCircle } from "lucide-react";
import Header from "../components/Header";
import { useToast } from "@/hooks/use-toast";
import NewsletterForm from "@/components/NewsletterForm";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlayStationIcon, XboxIcon, SteamIcon } from "../components/platforms/PlatformIcons";
const BetaLanding = () => {
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 7,
    hours: 23,
    minutes: 59,
    seconds: 59
  });
  const {
    toast
  } = useToast();
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return {
            ...prev,
            seconds: prev.seconds - 1
          };
        } else if (prev.minutes > 0) {
          return {
            ...prev,
            minutes: prev.minutes - 1,
            seconds: 59
          };
        } else if (prev.hours > 0) {
          return {
            ...prev,
            hours: prev.hours - 1,
            minutes: 59,
            seconds: 59
          };
        } else if (prev.days > 0) {
          return {
            ...prev,
            days: prev.days - 1,
            hours: 23,
            minutes: 59,
            seconds: 59
          };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  const openNewsletterForm = () => {
    setIsNewsletterOpen(true);
  };
  return <div className="min-h-screen">
      <Header />
      <main>
        <section className="pt-32 pb-16 container-padding bg-gradient-to-b from-black via-black to-primary text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-40 bg-hero-pattern bg-cover bg-center"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-primary"></div>
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="inline-block px-4 py-1 rounded-full bg-neon-purple/20 border border-neon-purple/40 mb-4">
              <p className="text-sm font-medium text-neon-purple animate-pulse">🔥 LIMITED BETA ACCESS NOW AVAILABLE! 🔥</p>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance leading-tight neon-text">The Ultimate Achievement Tracker – Join the Beta Before It's Too Late!</h1>
            <h2 className="text-lg md:text-xl text-neutral-300 mb-8 max-w-2xl mx-auto">Tired of tracking achievements across multiple platforms? PlatinumPath syncs your trophies from PlayStation, Xbox, & Steam – all in one place. 🚀</h2>
            
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
              <Button onClick={openNewsletterForm} variant="cta" size="xl" className="animate-pulse-slow shadow-[0_0_15px_rgba(217,70,239,0.5)] text-base md:text-xl uppercase tracking-wide w-full max-w-full">
                <span className="text-center px-2">🔥 Claim Your Beta Spot – Only 500 Spots Available!</span>
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
                    <p className="text-neutral-300">No way to compare trophies across PlayStation, Xbox, and Steam?</p>
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
                    <p className="text-neutral-300">One dashboard for all achievements across all platforms</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-neon-green flex-shrink-0 mt-0.5" />
                    <p className="text-neutral-300">AI-powered tracking & personalized trophy suggestions</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-neon-green flex-shrink-0 mt-0.5" />
                    <p className="text-neutral-300">Compete & compare with friends across platforms</p>
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

        <section id="beta-features" className="py-16 container-padding bg-gradient-to-b from-dark-blue via-black to-black">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-white">
              What's <span className="text-neon-purple">Inside the Beta?</span>
            </h2>
            <p className="text-neutral-300 text-center mb-12 max-w-2xl mx-auto">
              Be Among the First to Test These Powerful Features!
            </p>
            
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
                      <h3 className="text-2xl font-bold text-neon-purple mb-4 flex items-center gap-2">
                        <Gamepad className="w-6 h-6" />
                        Multi-Platform Tracking
                      </h3>
                      <p className="text-neutral-300 mb-4">
                        Sync achievements from PlayStation, Xbox, and Steam instantly in one unified dashboard.
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-neon-green flex-shrink-0 mt-0.5" />
                          <span className="text-neutral-300">Real-time syncing across all platforms</span>
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
                      <p className="text-neutral-300 mb-4">
                        Get smart recommendations on what trophies to chase next based on your gaming habits.
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-neon-green flex-shrink-0 mt-0.5" />
                          <span className="text-neutral-300">Personalized trophy recommendations</span>
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
                      <h3 className="text-2xl font-bold text-neon-purple mb-4 flex items-center gap-2">
                        <BarChart className="w-6 h-6" />
                        Personal Achievement Dashboard
                      </h3>
                      <p className="text-neutral-300 mb-4">
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
                      <p className="text-neutral-300 mb-4">
                        Compare your trophies against friends & the community across all platforms.
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-neon-green flex-shrink-0 mt-0.5" />
                          <span className="text-neutral-300">Global and friend-only leaderboards</span>
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
                      <p className="text-neutral-300 mb-4">
                        We ONLY track public achievements—your data is 100% secure and protected.
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-neon-green flex-shrink-0 mt-0.5" />
                          <span className="text-neutral-300">No personal information collected</span>
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
                      <h3 className="text-2xl font-bold text-neon-purple mb-4 flex items-center gap-2">
                        <MessageCircle className="w-6 h-6" />
                        Exclusive Beta Feedback Channel
                      </h3>
                      <p className="text-neutral-300 mb-4">
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
              
              <div className="text-center">
                <button onClick={openNewsletterForm} className="cyber-button flex items-center justify-center gap-2 mx-auto">
                  Try All These Features – Join the Beta Now!
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </Tabs>
          </div>
        </section>

        <section id="beta-perks" className="py-16 container-padding bg-gradient-to-b from-black via-black to-dark-blue">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-white">
              Why Join the <span className="text-neon-purple">PlatinumPath Beta</span>?
            </h2>
            <p className="text-neutral-300 text-center mb-12 max-w-2xl mx-auto">
              Beta testers get exclusive perks that won't be available after full launch!
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="glass-card p-8 rounded-xl">
                <Trophy className="w-10 h-10 text-neon-pink mb-4" />
                <h3 className="font-bold text-lg mb-2">Early Access – Try it BEFORE the public release!</h3>
                <p className="text-neutral-300">Be the FIRST to try it before public release. Explore features months ahead of everyone else.</p>
              </div>
              
              <div className="glass-card p-8 rounded-xl">
                <Zap className="w-10 h-10 text-neon-blue mb-4" />
                <h3 className="font-bold text-lg mb-2">Influence the App – Your feedback SHAPES the final product</h3>
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
        
        {/* Countdown and Final CTA Section */}
        <section className="py-16 container-padding bg-gradient-to-b from-primary to-black">
          <div className="max-w-4xl mx-auto">
            <div className="glass-card p-8 rounded-xl text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">
                <span className="text-neon-purple">Limited Beta Access</span> Closes In:
              </h2>
              
              <div className="flex justify-center gap-4 mb-8">
                <div className="bg-black/50 p-4 rounded-lg w-20">
                  <div className="text-3xl font-mono font-bold text-neon-pink">{timeLeft.days}</div>
                  <div className="text-xs text-neutral-400">DAYS</div>
                </div>
                <div className="bg-black/50 p-4 rounded-lg w-20">
                  <div className="text-3xl font-mono font-bold text-neon-pink">{timeLeft.hours}</div>
                  <div className="text-xs text-neutral-400">HOURS</div>
                </div>
                <div className="bg-black/50 p-4 rounded-lg w-20">
                  <div className="text-3xl font-mono font-bold text-neon-pink">{timeLeft.minutes}</div>
                  <div className="text-xs text-neutral-400">MINUTES</div>
                </div>
                <div className="bg-black/50 p-4 rounded-lg w-20">
                  <div className="text-3xl font-mono font-bold text-neon-pink">{timeLeft.seconds}</div>
                  <div className="text-xs text-neutral-400">SECONDS</div>
                </div>
              </div>
              
              <p className="text-neutral-300 mb-6">
                We're only accepting <span className="text-neon-green font-bold">500 beta testers</span>. Don't miss your chance!
              </p>
              
              <Button onClick={openNewsletterForm} variant="cta" size="lg" className="w-full md:w-auto md:px-8">
                🔥 Secure Your Spot Now!
              </Button>
            </div>
            
            
          </div>
        </section>
        
      </main>
      
      {isNewsletterOpen && <NewsletterForm isOpen={isNewsletterOpen} onClose={() => setIsNewsletterOpen(false)} />}
    </div>;
};
export default BetaLanding;