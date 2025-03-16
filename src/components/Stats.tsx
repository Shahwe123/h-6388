
import { Trophy, Users, Clock, Gamepad } from "lucide-react";

const stats = [
  {
    value: "10M+",
    label: "Trophies Tracked",
    icon: Trophy
  }, 
  {
    value: "50K+",
    label: "Active Hunters",
    icon: Users
  }, 
  {
    value: "100K+",
    label: "Games Covered",
    icon: Gamepad
  }, 
  {
    value: "24/7",
    label: "Live Updates",
    icon: Clock
  }
];

const Stats = () => {
  return (
    <section className="py-16 container-padding bg-gradient-to-b from-primary to-black">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="glass-card p-6 rounded-xl text-center">
              <div className="bg-neon-purple/20 p-3 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-7 h-7 text-neon-purple" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
              <p className="text-neutral-300 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
