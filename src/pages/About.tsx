
import React from 'react';
import { Trophy, Users, Shield, Gamepad } from 'lucide-react';
import SEO from "../components/SEO";

const About = () => {
  return (
    <div className="min-h-screen bg-primary pt-24 pb-16">
      <SEO 
        title="About PlatinumPath" 
        description="Learn about PlatinumPath, the ultimate game achievement tracker for PlayStation, Xbox, and Steam gamers."
      />
      <div className="max-w-4xl mx-auto container-padding">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">About PlatinumPath</h1>
        
        <div className="glass-card rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-neutral-300 mb-8">
            At PlatinumPath, we're dedicated to creating the ultimate achievement tracking platform for gamers across all major platforms. 
            Our mission is to unite the gaming community through shared accomplishments, making achievement hunting more social, 
            competitive, and rewarding.
          </p>
          
          <h2 className="text-2xl font-bold mb-4">Our Story</h2>
          <p className="text-neutral-300 mb-8">
            Founded in 2024 by a team of passionate gamers, PlatinumPath was born from a simple frustration: 
            the inability to track achievements across multiple gaming platforms in one place. We believe that 
            your gaming accomplishments should be celebrated, shared, and compared regardless of where you play.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-black/30 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-neon-purple/20 rounded-lg flex items-center justify-center mr-4">
                  <Trophy className="text-neon-purple" />
                </div>
                <h3 className="text-xl font-bold">Achievement Tracking</h3>
              </div>
              <p className="text-neutral-400">
                We automatically sync and display your achievements from Steam, PlayStation, and Xbox, 
                giving you a comprehensive view of your gaming accomplishments.
              </p>
            </div>
            
            <div className="bg-black/30 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-neon-blue/20 rounded-lg flex items-center justify-center mr-4">
                  <Users className="text-neon-blue" />
                </div>
                <h3 className="text-xl font-bold">Community</h3>
              </div>
              <p className="text-neutral-400">
                Connect with friends, compare achievements, and compete on leaderboards. 
                Gaming achievements are more fun when shared with others.
              </p>
            </div>
            
            <div className="bg-black/30 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-neon-green/20 rounded-lg flex items-center justify-center mr-4">
                  <Shield className="text-neon-green" />
                </div>
                <h3 className="text-xl font-bold">Privacy</h3>
              </div>
              <p className="text-neutral-400">
                We take your privacy seriously. You control what you share and who can see your gaming activity.
              </p>
            </div>
            
            <div className="bg-black/30 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mr-4">
                  <Gamepad className="text-purple-500" />
                </div>
                <h3 className="text-xl font-bold">Platform Agnostic</h3>
              </div>
              <p className="text-neutral-400">
                We believe in gaming without borders. Play where you want, and we'll track your achievements across all platforms.
              </p>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold mb-4">Our Team</h2>
          <p className="text-neutral-300 mb-4">
            We're a small but dedicated team of gamers, developers, and designers working to build the best achievement tracking platform.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-24 h-24 bg-neutral-800 rounded-full mx-auto mb-4 overflow-hidden">
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Team member" className="w-full h-full object-cover" />
              </div>
              <h3 className="font-bold">Alex Winters</h3>
              <p className="text-neutral-400 text-sm">Founder & CEO</p>
            </div>
            
            <div className="text-center">
              <div className="w-24 h-24 bg-neutral-800 rounded-full mx-auto mb-4 overflow-hidden">
                <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Team member" className="w-full h-full object-cover" />
              </div>
              <h3 className="font-bold">Sarah Chen</h3>
              <p className="text-neutral-400 text-sm">Lead Developer</p>
            </div>
            
            <div className="text-center">
              <div className="w-24 h-24 bg-neutral-800 rounded-full mx-auto mb-4 overflow-hidden">
                <img src="https://randomuser.me/api/portraits/men/68.jpg" alt="Team member" className="w-full h-full object-cover" />
              </div>
              <h3 className="font-bold">Marcus Johnson</h3>
              <p className="text-neutral-400 text-sm">UX Designer</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
