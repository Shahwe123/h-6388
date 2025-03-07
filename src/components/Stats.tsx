
import { Trophy, Users, Clock, Award } from "lucide-react";

const stats = [
  {
    value: "10M+",
    label: "Trophies Tracked",
    icon: Trophy,
  },
  {
    value: "50K+",
    label: "Active Hunters",
    icon: Users,
  },
  {
    value: "100K+",
    label: "Games Covered",
    icon: Gamepad,
  },
  {
    value: "24/7",
    label: "Live Updates",
    icon: Clock,
  },
];

const Stats = () => {
  return (
    <section className="py-16 container-padding bg-gradient-to-b from-primary to-black">
      <div className="max-w-4xl mx-auto glass-card rounded-xl p-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-4">
                <stat.icon className="w-8 h-8 text-neon-purple" />
              </div>
              <p className="text-3xl md:text-4xl font-bold mb-2 text-white">{stat.value}</p>
              <p className="text-neutral-300">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
