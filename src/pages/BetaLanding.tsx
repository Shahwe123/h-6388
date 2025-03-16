
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Gamepad2 } from 'lucide-react';
import Footer from '@/components/Footer';

const BetaLanding = () => {
  const launchDate = new Date('2024-12-31T00:00:00Z');
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = launchDate.getTime() - new Date().getTime();
    let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen flex flex-col bg-primary">
      <main className="flex-grow pt-16 md:pt-20">
        <div className="container-padding mx-auto max-w-6xl">
          <div className="py-16 md:py-24 text-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <span className="inline-block bg-neon-purple/20 text-neon-purple px-4 py-2 rounded-full mb-4 font-medium">
                Coming Soon
              </span>
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                PlatinumPath Beta Access
              </h1>
              <p className="text-xl text-neutral-300 max-w-3xl mx-auto">
                Be among the first to experience the future of achievement tracking.
                Join our exclusive beta program and help shape the platform.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-16"
            >
              <div className="glass-card p-8 md:p-12 max-w-4xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold mb-8">Reserve Your Spot</h2>
                <form className="space-y-4 max-w-md mx-auto">
                  <div>
                    <input
                      type="text"
                      placeholder="Your Name"
                      className="w-full px-4 py-3 bg-black/50 border border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-neon-purple text-white"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Email Address"
                      className="w-full px-4 py-3 bg-black/50 border border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-neon-purple text-white"
                    />
                  </div>
                  <div>
                    <select className="w-full px-4 py-3 bg-black/50 border border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-neon-purple text-white">
                      <option value="">Preferred Platform</option>
                      <option value="playstation">PlayStation</option>
                      <option value="xbox">Xbox</option>
                      <option value="steam">Steam</option>
                      <option value="switch">Nintendo Switch</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="cyber-button w-full p-3 flex items-center justify-center gap-2"
                    >
                      <Gamepad2 className="h-5 w-5" />
                      <span>Join the Beta</span>
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>

            {/* Countdown Timer */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-16"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Beta Launch Countdown</h2>
              <div className="flex justify-center gap-4">
                <div className="w-20 md:w-24 p-3 glass-card text-center">
                  <div className="text-3xl md:text-4xl font-bold text-neon-purple">{timeLeft.days}</div>
                  <div className="text-xs uppercase tracking-wider text-neutral-400">Days</div>
                </div>
                <div className="w-20 md:w-24 p-3 glass-card text-center">
                  <div className="text-3xl md:text-4xl font-bold text-neon-purple">{timeLeft.hours}</div>
                  <div className="text-xs uppercase tracking-wider text-neutral-400">Hours</div>
                </div>
                <div className="w-20 md:w-24 p-3 glass-card text-center">
                  <div className="text-3xl md:text-4xl font-bold text-neon-purple">{timeLeft.minutes}</div>
                  <div className="text-xs uppercase tracking-wider text-neutral-400">Minutes</div>
                </div>
                <div className="w-20 md:w-24 p-3 glass-card text-center">
                  <div className="text-3xl md:text-4xl font-bold text-neon-purple">{timeLeft.seconds}</div>
                  <div className="text-xs uppercase tracking-wider text-neutral-400">Seconds</div>
                </div>
              </div>
            </motion.div>

            {/* Features */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mb-16"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-8">Beta Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6">
                  <div className="bg-neon-purple/20 w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <svg className="w-6 h-6 text-neon-purple" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-center">Early Access</h3>
                  <p className="text-neutral-300 text-center">
                    Get your hands on PlatinumPath before anyone else and explore all features.
                  </p>
                </div>
                <div className="glass-card p-6">
                  <div className="bg-neon-purple/20 w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <svg className="w-6 h-6 text-neon-purple" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-center">Direct Feedback</h3>
                  <p className="text-neutral-300 text-center">
                    Provide feedback directly to our development team and shape the future.
                  </p>
                </div>
                <div className="glass-card p-6">
                  <div className="bg-neon-purple/20 w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <svg className="w-6 h-6 text-neon-purple" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-center">Exclusive Rewards</h3>
                  <p className="text-neutral-300 text-center">
                    Get exclusive beta tester badges and rewards that will remain on your profile.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Final CTA */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mb-16"
            >
              <div className="bg-gradient-to-r from-violet-600 to-indigo-800 rounded-2xl p-8 md:p-12 max-w-4xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Join the Revolution?</h2>
                <p className="text-lg mb-6 text-white/90">
                  Space is limited. Reserve your spot now and be part of gaming history.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/" className="cyber-button px-6 py-3">
                    Learn More
                  </Link>
                  <button className="px-6 py-3 bg-white text-indigo-900 font-medium rounded hover:bg-white/90 transition-colors">
                    Join Beta Waitlist
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BetaLanding;
