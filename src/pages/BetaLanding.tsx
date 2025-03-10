
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, Trophy, BarChart, Users, Search, CalendarCheck, Sparkles, HelpCircle, Mail } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useToast } from "@/hooks/use-toast";
import NewsletterForm from "@/components/NewsletterForm";

const BetaLanding = () => {
  const [email, setEmail] = useState("");
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    setIsNewsletterOpen(true);
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-16 container-padding bg-black text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-40 bg-hero-pattern bg-cover bg-center"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-primary"></div>
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="inline-block px-4 py-1 rounded-full bg-neon-purple/20 border border-neon-purple/40 mb-4">
              <p className="text-sm font-medium text-neon-purple animate-pulse">🔥 LIMITED BETA ACCESS NOW AVAILABLE! 🔥</p>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance leading-tight neon-text">
              Be Among the First to Track Achievements Across PlayStation, Xbox & Steam!
            </h1>
            <h2 className="text-lg md:text-xl text-neutral-300 mb-8 max-w-2xl mx-auto">
              Join the PlatinumPath Beta – The Ultimate Game Achievement Tracker
              <br />
              <span className="text-neon-pink">Sign up now to test our exclusive early features before the full launch!</span>
            </h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 justify-center mb-12 max-w-lg mx-auto">
              <input 
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-3 rounded-md bg-black/50 backdrop-blur-sm border border-neon-purple/30 text-white flex-grow"
                required
              />
              <button type="submit" className="cyber-button flex items-center justify-center gap-2 whitespace-nowrap">
                Join the Beta Waitlist
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </section>

        {/* Why Join the Beta Section */}
        <section id="benefits" className="py-16 container-padding bg-primary">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-white">
              Get Exclusive <span className="text-neon-purple">Early Access</span> to the Ultimate Gaming Achievement Tracker
            </h2>
            <p className="text-neutral-300 text-center mb-12 max-w-2xl mx-auto">
              The PlatinumPath Beta is your chance to experience our cutting-edge game tracking platform before anyone else. 
              By joining, you'll help shape the future of cross-platform achievement tracking!
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="glass-card p-8 rounded-xl flex flex-col">
                <CheckCircle className="w-8 h-8 text-neon-pink mb-4" />
                <h3 className="font-bold text-lg mb-2">Be the First to Try It</h3>
                <p className="text-neutral-300">Get priority access before public launch.</p>
              </div>
              
              <div className="glass-card p-8 rounded-xl flex flex-col">
                <Sparkles className="w-8 h-8 text-neon-blue mb-4" />
                <h3 className="font-bold text-lg mb-2">Exclusive Features</h3>
                <p className="text-neutral-300">Unlock beta-only tools before the final version.</p>
              </div>
              
              <div className="glass-card p-8 rounded-xl flex flex-col">
                <Mail className="w-8 h-8 text-neon-purple mb-4" />
                <h3 className="font-bold text-lg mb-2">Shape the Product</h3>
                <p className="text-neutral-300">Your feedback directly influences development.</p>
              </div>
              
              <div className="glass-card p-8 rounded-xl flex flex-col">
                <Trophy className="w-8 h-8 text-neon-green mb-4" />
                <h3 className="font-bold text-lg mb-2">Special Rewards</h3>
                <p className="text-neutral-300">Beta users get early supporter perks after launch!</p>
              </div>
            </div>
            
            <div className="text-center">
              <button 
                onClick={() => setIsNewsletterOpen(true)}
                className="cyber-button flex items-center justify-center gap-2 mx-auto"
              >
                Secure Your Spot – Sign Up Now!
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* What's Included Section */}
        <section id="features" className="py-16 container-padding bg-black">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-white">
              What's Inside the <span className="text-neon-purple">PlatinumPath Beta</span>?
            </h2>
            <p className="text-neutral-300 text-center mb-12 max-w-2xl mx-auto">
              Get early access to these game-changing features that will revolutionize how you track your gaming achievements.
            </p>
            
            <div className="space-y-6 mb-12">
              <div className="glass-card p-6 rounded-xl flex items-start gap-4">
                <Trophy className="w-10 h-10 text-neon-pink mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-lg mb-1">Cross-Platform Achievement Syncing</h3>
                  <p className="text-neutral-300">Track trophies across PlayStation, Xbox, and Steam in one unified dashboard.</p>
                </div>
              </div>
              
              <div className="glass-card p-6 rounded-xl flex items-start gap-4">
                <BarChart className="w-10 h-10 text-neon-blue mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-lg mb-1">Game Completion Analytics</h3>
                  <p className="text-neutral-300">See how close you are to 100% game completion with detailed progress tracking.</p>
                </div>
              </div>
              
              <div className="glass-card p-6 rounded-xl flex items-start gap-4">
                <Users className="w-10 h-10 text-neon-purple mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-lg mb-1">Leaderboard Comparison</h3>
                  <p className="text-neutral-300">Compete with friends & global gamers to see who's the ultimate completionist.</p>
                </div>
              </div>
              
              <div className="glass-card p-6 rounded-xl flex items-start gap-4">
                <Search className="w-10 h-10 text-neon-green mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-lg mb-1">Track Hidden Achievements</h3>
                  <p className="text-neutral-300">Discover and unlock those elusive hidden achievements you never knew existed.</p>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <button 
                onClick={() => setIsNewsletterOpen(true)}
                className="cyber-button flex items-center justify-center gap-2 mx-auto"
              >
                Get Early Access – Join the Beta Today!
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-16 container-padding bg-primary">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-white">
              How to Join the <span className="text-neon-purple">PlatinumPath Beta</span>
            </h2>
            <p className="text-neutral-300 text-center mb-12 max-w-2xl mx-auto">
              Follow these simple steps to secure your spot in our exclusive beta program.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="glass-card p-8 rounded-xl flex flex-col items-center text-center">
                <div className="bg-neon-purple/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-neon-purple">1</span>
                </div>
                <h3 className="font-bold text-lg mb-2">Sign Up</h3>
                <p className="text-neutral-300">Enter your email to request beta access.</p>
              </div>
              
              <div className="glass-card p-8 rounded-xl flex flex-col items-center text-center">
                <div className="bg-neon-purple/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-neon-purple">2</span>
                </div>
                <h3 className="font-bold text-lg mb-2">Get Your Invite</h3>
                <p className="text-neutral-300">We'll email you when it's your turn.</p>
              </div>
              
              <div className="glass-card p-8 rounded-xl flex flex-col items-center text-center">
                <div className="bg-neon-purple/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-neon-purple">3</span>
                </div>
                <h3 className="font-bold text-lg mb-2">Start Tracking!</h3>
                <p className="text-neutral-300">Explore early features & share feedback.</p>
              </div>
            </div>
            
            <div className="text-center">
              <button 
                onClick={() => setIsNewsletterOpen(true)}
                className="cyber-button flex items-center justify-center gap-2 mx-auto"
              >
                Join the Beta – Secure Your Spot Now!
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* Social Proof Section */}
        <section id="testimonials" className="py-16 container-padding bg-black">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-white">
              Gamers Have Been <span className="text-neon-purple">Asking for This</span> – Now You Can Test It First!
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="glass-card p-8 rounded-xl">
                <p className="text-neutral-300 mb-4">
                  "I always wanted a way to track my PlayStation trophies and Xbox achievements together. This is a game-changer!"
                </p>
                <p className="text-neon-pink font-medium">– Gamer from Reddit</p>
              </div>
              
              <div className="glass-card p-8 rounded-xl">
                <p className="text-neutral-300 mb-4">
                  "Finally, a universal achievement tracker! I'm signing up as soon as it's available."
                </p>
                <p className="text-neon-pink font-medium">– Steam User</p>
              </div>
              
              <div className="glass-card p-8 rounded-xl md:col-span-2">
                <p className="text-neutral-300 mb-4">
                  "The beta is amazing! I can finally see my PlayStation and Steam achievements in one place."
                </p>
                <p className="text-neon-pink font-medium">– Early Beta User</p>
              </div>
            </div>
            
            <div className="text-center">
              <button 
                onClick={() => setIsNewsletterOpen(true)}
                className="cyber-button flex items-center justify-center gap-2 mx-auto"
              >
                Be Part of Gaming History – Join the Beta Now!
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* Roadmap Section */}
        <section id="roadmap" className="py-16 container-padding bg-primary">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-white">
              What's Next for <span className="text-neon-purple">PlatinumPath</span>?
            </h2>
            <p className="text-neutral-300 text-center mb-12 max-w-2xl mx-auto">
              Here's our development roadmap to full launch and beyond.
            </p>
            
            <div className="space-y-8 mb-12 relative">
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-neon-purple/30 -translate-x-1/2"></div>
              
              <div className="glass-card p-8 rounded-xl relative md:ml-8 md:pl-12">
                <div className="hidden md:flex absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-neon-green items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-black"></div>
                </div>
                <h3 className="font-bold text-xl mb-2 flex items-center gap-2">
                  <span className="inline-block md:hidden w-3 h-3 rounded-full bg-neon-green"></span>
                  Phase 1: Beta Testing
                </h3>
                <p className="text-neutral-300">Early access testers get to try core features.</p>
              </div>
              
              <div className="glass-card p-8 rounded-xl relative md:mr-8 md:ml-auto md:pl-12 md:max-w-[calc(50%-2rem)]">
                <div className="hidden md:flex absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-neon-blue items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-black"></div>
                </div>
                <h3 className="font-bold text-xl mb-2 flex items-center gap-2">
                  <span className="inline-block md:hidden w-3 h-3 rounded-full bg-neon-blue"></span>
                  Phase 2: Feature Expansion
                </h3>
                <p className="text-neutral-300">More games & platforms added.</p>
              </div>
              
              <div className="glass-card p-8 rounded-xl relative md:ml-8 md:pl-12">
                <div className="hidden md:flex absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-neon-pink items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-black"></div>
                </div>
                <h3 className="font-bold text-xl mb-2 flex items-center gap-2">
                  <span className="inline-block md:hidden w-3 h-3 rounded-full bg-neon-pink"></span>
                  Phase 3: Public Launch
                </h3>
                <p className="text-neutral-300">Official release to all gamers worldwide!</p>
              </div>
            </div>
            
            <div className="text-center">
              <button 
                onClick={() => setIsNewsletterOpen(true)}
                className="cyber-button flex items-center justify-center gap-2 mx-auto"
              >
                Join Now & Be Part of the Journey!
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-16 container-padding bg-black">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
              Frequently Asked <span className="text-neon-purple">Questions</span>
            </h2>
            
            <div className="space-y-6 mb-12">
              <div className="glass-card p-8 rounded-xl">
                <h3 className="font-bold text-xl mb-2 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-neon-purple" />
                  When does the Beta start?
                </h3>
                <p className="text-neutral-300">The beta is launching soon! Sign up now to secure early access.</p>
              </div>
              
              <div className="glass-card p-8 rounded-xl">
                <h3 className="font-bold text-xl mb-2 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-neon-purple" />
                  How do I sign up?
                </h3>
                <p className="text-neutral-300">Enter your email, and we'll notify you when your invite is ready.</p>
              </div>
              
              <div className="glass-card p-8 rounded-xl">
                <h3 className="font-bold text-xl mb-2 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-neon-purple" />
                  Is the beta free?
                </h3>
                <p className="text-neutral-300">Yes! The beta is 100% free for early testers.</p>
              </div>
            </div>
            
            <div className="text-center">
              <button 
                onClick={() => setIsNewsletterOpen(true)}
                className="cyber-button flex items-center justify-center gap-2 mx-auto"
              >
                Get Early Access – Join the Beta!
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-16 container-padding bg-gradient-to-b from-primary to-black">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white">
              Join the <span className="text-neon-purple">PlatinumPath Beta</span> & Track Achievements Like Never Before!
            </h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 justify-center mb-12 max-w-lg mx-auto">
              <input 
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-3 rounded-md bg-black/50 backdrop-blur-sm border border-neon-purple/30 text-white flex-grow"
                required
              />
              <button type="submit" className="cyber-button flex items-center justify-center gap-2">
                Join Beta Waitlist
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
            
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
      
      {isNewsletterOpen && (
        <NewsletterForm isOpen={isNewsletterOpen} onClose={() => setIsNewsletterOpen(false)} />
      )}
    </div>
  );
};

export default BetaLanding;
