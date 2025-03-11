import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, XCircle, Trophy, Zap, Users, Shield, Clock, HelpCircle, Mail, LockKeyhole } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useToast } from "@/hooks/use-toast";
import NewsletterForm from "@/components/NewsletterForm";
import { Button } from "@/components/ui/button";
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
        <section className="pt-32 pb-16 container-padding bg-black text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-40 bg-hero-pattern bg-cover bg-center"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-primary"></div>
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="inline-block px-4 py-1 rounded-full bg-neon-purple/20 border border-neon-purple/40 mb-4">
              <p className="text-sm font-medium text-neon-purple animate-pulse">🔥 LIMITED BETA ACCESS NOW AVAILABLE! 🔥</p>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance leading-tight neon-text">The Ultimate Achievement Tracker – Join the Beta Before It’s Too Late!</h1>
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
              <Button onClick={openNewsletterForm} variant="cta" size="xl" className="animate-pulse-slow shadow-[0_0_15px_rgba(217,70,239,0.5)] text-base md:text-xl uppercase tracking-wide ">
                🔥 Claim Your Beta Spot – Only 500 Spots Available!
                <ArrowRight className="w-5 h-5 ml-2" />
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

        <section id="problem-solution" className="py-16 container-padding bg-primary">
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

        <section id="beta-perks" className="py-16 container-padding bg-black">
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
                <h3 className="font-bold text-lg mb-2">Early Access – Try it BEFORE the public release!</h3>
                <p className="text-neutral-300">Be the FIRST to try it before public release. Explore features months ahead of everyone else.</p>
              </div>
              
              <div className="glass-card p-8 rounded-xl">
                <Zap className="w-10 h-10 text-neon-blue mb-4" />
                <h3 className="font-bold text-lg mb-2">Influence the App – Your feedback SHAPES the final product</h3>
                <p className="text-neutral-300">Your feedback shapes the final product. Tell us what you want, and we'll build it!</p>
              </div>
              
              <div className="glass-card p-8 rounded-xl">
                <Shield className="w-10 h-10 text-neon-purple mb-4" />
                <h3 className="font-bold text-lg mb-2">Exclusive Founder’s Badge – ONLY available to beta testers!</h3>
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

        <section id="how-it-works" className="py-16 container-padding bg-primary">
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
                <p className="text-neutral-300">Sync your trophies &amp; start flexing your achievements!

              </p>
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

        <section id="testimonials" className="py-16 container-padding bg-black">
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
                <p className="text-xs text-neutral-400">PlayStation Logo</p>
              </div>
              <div className="w-20 h-20 bg-black/50 flex items-center justify-center rounded-lg border border-neon-purple/30">
                <p className="text-xs text-neutral-400">Xbox Logo</p>
              </div>
              <div className="w-20 h-20 bg-black/50 flex items-center justify-center rounded-lg border border-neon-purple/30">
                <p className="text-xs text-neutral-400">Steam Logo</p>
              </div>
            </div>
            
            <div className="text-center">
              <button onClick={openNewsletterForm} className="cyber-button flex items-center justify-center gap-2 mx-auto">
                Join Other Gamers – Get Beta Access!
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        <section id="urgency" className="py-16 container-padding bg-primary">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              <span className="text-neon-pink">Limited Beta Spots – Join Now Before It's Too Late!</span>
            </h2>
            <p className="text-xl text-neutral-300 mb-8">Only 500 Beta Spots – Once They're Gone, They're Gone!</p>
            
            <div className="glass-card p-8 rounded-xl mb-12">
              <h3 className="font-bold text-xl mb-6">Beta Signup Closes In:</h3>
              <div className="flex justify-center gap-4">
                <div className="bg-black p-4 rounded-lg w-20">
                  <div className="text-3xl font-bold text-neon-purple">{timeLeft.days}</div>
                  <div className="text-xs text-neutral-400">DAYS</div>
                </div>
                <div className="bg-black p-4 rounded-lg w-20">
                  <div className="text-3xl font-bold text-neon-purple">{timeLeft.hours}</div>
                  <div className="text-xs text-neutral-400">HOURS</div>
                </div>
                <div className="bg-black p-4 rounded-lg w-20">
                  <div className="text-3xl font-bold text-neon-purple">{timeLeft.minutes}</div>
                  <div className="text-xs text-neutral-400">MINUTES</div>
                </div>
                <div className="bg-black p-4 rounded-lg w-20">
                  <div className="text-3xl font-bold text-neon-purple">{timeLeft.seconds}</div>
                  <div className="text-xs text-neutral-400">SECONDS</div>
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <div className="px-4 py-2 rounded-lg bg-neon-pink/10 inline-block mb-4">
                <p className="text-neon-pink font-bold">🔥 First 50 Signups Get an Exclusive Profile Badge 
and Free Premium for 2 months! 🔥</p>
              </div>
            </div>
            
            <div className="relative inline-block">
              <button onClick={openNewsletterForm} className="cyber-button flex items-center justify-center gap-2 mx-auto text-lg px-8 py-4">
                Join the Beta – Limited Spots!
                <ArrowRight className="w-5 h-5" />
              </button>
              
            </div>
          </div>
        </section>

        <section className="py-16 container-padding bg-gradient-to-b from-primary to-black">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white">
              Join the <span className="text-neon-purple">PlatinumPath Beta</span> Today!
            </h2>
            
            <div className="flex justify-center space-x-8 mb-8 text-sm">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-neon-pink" />
                <span className="text-neutral-300">Exclusive Early Access</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-neon-blue" />
                <span className="text-neutral-300">Founder Badge</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-neon-green" />
                <span className="text-neutral-300">VIP Beta Perks</span>
              </div>
            </div>
            
            <div className="flex justify-center mb-12">
              <button onClick={openNewsletterForm} className="cyber-button flex items-center justify-center gap-2 whitespace-nowrap relative">
                🔥 Join the Waitlist – Limited Early Access!
                <ArrowRight className="w-4 h-4" />
                
              </button>
            </div>
            
            <div className="flex justify-center space-x-6 mb-8">
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">Twitter</a>
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">Discord</a>
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">Reddit</a>
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">YouTube</a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      
      {isNewsletterOpen && <NewsletterForm isOpen={isNewsletterOpen} onClose={() => setIsNewsletterOpen(false)} />}
    </div>;
};
export default BetaLanding;