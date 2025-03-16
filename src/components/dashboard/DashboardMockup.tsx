
import React from "react";
import { Trophy, Gamepad, BarChart, Users, Star } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { PlayStationIcon, XboxIcon, SteamIcon } from "../platforms/PlatformIcons";

/**
 * Dashboard mockup component for displaying a visual representation
 * of what the actual dashboard will look like in the beta
 */
const DashboardMockup = () => {
  return (
    <div className="w-full h-full bg-black/80 rounded-lg border border-neon-purple/30 overflow-hidden p-4 text-white">
      {/* Header with user info */}
      <div className="flex justify-between items-center mb-4 pb-3 border-b border-neon-purple/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-neon-purple flex items-center justify-center">
            <span className="text-black font-bold">TP</span>
          </div>
          <div>
            <h3 className="text-neon-purple font-bold">TrophyPro99</h3>
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <span>Level 42</span>
              <span>•</span>
              <span>Trophy Hunter</span>
            </div>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <PlayStationIcon className="h-5 w-5 text-neon-blue" />
          <XboxIcon className="h-5 w-5 text-neon-green" />
          <SteamIcon className="h-5 w-5 text-white" />
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left column - Stats */}
        <div className="space-y-4">
          <div className="bg-black/60 rounded-lg p-3 border border-neon-purple/20">
            <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
              <Trophy className="h-4 w-4 text-neon-pink" />
              <span>Trophy Progress</span>
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-neutral-400">Platinum</span>
                <span className="text-neon-pink">24/100</span>
              </div>
              <Progress value={24} className="h-2 bg-neutral-800" indicatorClassName="bg-neon-pink" />
              
              <div className="flex justify-between text-xs mb-1">
                <span className="text-neutral-400">Gold</span>
                <span className="text-neon-orange">156/312</span>
              </div>
              <Progress value={50} className="h-2 bg-neutral-800" indicatorClassName="bg-neon-orange" />
              
              <div className="flex justify-between text-xs mb-1">
                <span className="text-neutral-400">Silver</span>
                <span className="text-neutral-300">342/502</span>
              </div>
              <Progress value={68} className="h-2 bg-neutral-800" indicatorClassName="bg-neutral-300" />
            </div>
          </div>
          
          <div className="bg-black/60 rounded-lg p-3 border border-neon-purple/20">
            <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
              <Users className="h-4 w-4 text-neon-blue" />
              <span>Friends Activity</span>
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-neon-blue/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs">JD</span>
                </div>
                <div className="text-xs">
                  <p className="text-neutral-300">JDGamer unlocked <span className="text-neon-blue">3 trophies</span></p>
                  <p className="text-neutral-500">2 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-neon-green/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs">AM</span>
                </div>
                <div className="text-xs">
                  <p className="text-neutral-300">AchieveMaster earned <span className="text-neon-green">Platinum</span></p>
                  <p className="text-neutral-500">Yesterday</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Middle column - Recent games */}
        <div className="bg-black/60 rounded-lg p-3 border border-neon-purple/20">
          <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
            <Gamepad className="h-4 w-4 text-neon-green" />
            <span>Recent Games</span>
          </h4>
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="w-12 h-12 bg-neon-purple/20 rounded flex items-center justify-center flex-shrink-0">
                <Gamepad className="h-6 w-6 text-neon-purple" />
              </div>
              <div>
                <h5 className="text-sm font-medium">Elden Ring</h5>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-neutral-400">42/45 Trophies</span>
                  <PlayStationIcon className="h-3 w-3 text-neon-blue" />
                </div>
                <Progress value={93} className="h-1.5 mt-1 bg-neutral-800" indicatorClassName="bg-neon-purple" />
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="w-12 h-12 bg-neon-blue/20 rounded flex items-center justify-center flex-shrink-0">
                <Gamepad className="h-6 w-6 text-neon-blue" />
              </div>
              <div>
                <h5 className="text-sm font-medium">Cyberpunk 2077</h5>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-neutral-400">28/45 Trophies</span>
                  <SteamIcon className="h-3 w-3 text-white" />
                </div>
                <Progress value={62} className="h-1.5 mt-1 bg-neutral-800" indicatorClassName="bg-neon-blue" />
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="w-12 h-12 bg-neon-green/20 rounded flex items-center justify-center flex-shrink-0">
                <Gamepad className="h-6 w-6 text-neon-green" />
              </div>
              <div>
                <h5 className="text-sm font-medium">Halo Infinite</h5>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-neutral-400">34/50 Trophies</span>
                  <XboxIcon className="h-3 w-3 text-neon-green" />
                </div>
                <Progress value={68} className="h-1.5 mt-1 bg-neutral-800" indicatorClassName="bg-neon-green" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Right column - Achievements */}
        <div className="space-y-4">
          <div className="bg-black/60 rounded-lg p-3 border border-neon-purple/20">
            <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
              <Star className="h-4 w-4 text-neon-orange" />
              <span>Rare Achievements</span>
            </h4>
            <div className="space-y-3">
              <div className="bg-black/40 p-2 rounded border border-neon-orange/20 flex items-center gap-2">
                <Trophy className="h-6 w-6 text-neon-orange" />
                <div>
                  <p className="text-xs font-medium">Legendary Completion</p>
                  <p className="text-xs text-neutral-500">Only 2.3% of players earned this</p>
                </div>
              </div>
              
              <div className="bg-black/40 p-2 rounded border border-neon-pink/20 flex items-center gap-2">
                <Trophy className="h-6 w-6 text-neon-pink" />
                <div>
                  <p className="text-xs font-medium">100% Collectibles</p>
                  <p className="text-xs text-neutral-500">Only 1.8% of players earned this</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-black/60 rounded-lg p-3 border border-neon-purple/20">
            <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
              <BarChart className="h-4 w-4 text-neon-purple" />
              <span>Stats Overview</span>
            </h4>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-black/40 p-2 rounded">
                <p className="text-xl font-bold text-neon-purple">862</p>
                <p className="text-xs text-neutral-400">Total Trophies</p>
              </div>
              <div className="bg-black/40 p-2 rounded">
                <p className="text-xl font-bold text-neon-pink">24</p>
                <p className="text-xs text-neutral-400">Platinums</p>
              </div>
              <div className="bg-black/40 p-2 rounded">
                <p className="text-xl font-bold text-neon-green">98</p>
                <p className="text-xs text-neutral-400">Games Played</p>
              </div>
              <div className="bg-black/40 p-2 rounded">
                <p className="text-xl font-bold text-neon-blue">42</p>
                <p className="text-xs text-neutral-400">Player Level</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardMockup;
