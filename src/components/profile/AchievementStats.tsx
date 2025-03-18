
import React from 'react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Profile } from '@/types/profile';
import { Gamepad, Gamepad2, Stamp } from 'lucide-react';

interface AchievementStatsProps {
  profile: Profile;
}

const AchievementStats: React.FC<AchievementStatsProps> = ({ profile }) => {
  // Mock data for platform achievements
  const platformData = [
    {
      name: 'PlayStation',
      value: 187,
      fill: '#8B5CF6',
      icon: <Gamepad2 className="h-6 w-6 text-white" />
    },
    {
      name: 'PlayStation 5',
      value: 92,
      fill: '#A78BFA',
      icon: <Gamepad2 className="h-6 w-6 text-white" />
    },
    {
      name: 'Xbox',
      value: 143,
      fill: '#10B981',
      icon: <Gamepad className="h-6 w-6 text-white" />
    },
    {
      name: 'Steam',
      value: 214,
      fill: '#0EA5E9',
      icon: <Stamp className="h-6 w-6 text-white" />
    }
  ];

  // Filtering out platforms that the user doesn't have linked
  const filteredData = platformData.filter(platform => {
    if (platform.name.includes('PlayStation') && !profile.playstation_username) return false;
    if (platform.name.includes('Xbox') && !profile.xbox_gamertag) return false;
    if (platform.name.includes('Steam') && !profile.steam_id) return false;
    return true;
  });

  // If no platforms are linked, show all platforms with zero achievements
  const dataToDisplay = filteredData.length > 0 ? filteredData : platformData.map(p => ({ ...p, value: 0 }));

  return (
    <div className="h-64 w-full">
      <ChartContainer
        config={{
          PlayStation: {
            theme: { light: '#8B5CF6', dark: '#8B5CF6' },
          },
          'PlayStation 5': {
            theme: { light: '#A78BFA', dark: '#A78BFA' },
          },
          Xbox: {
            theme: { light: '#10B981', dark: '#10B981' },
          },
          Steam: {
            theme: { light: '#0EA5E9', dark: '#0EA5E9' },
          },
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={dataToDisplay}
            margin={{ top: 5, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-neon-purple/20" />
            <XAxis
              dataKey="name"
              tick={{ fill: '#A78BFA' }}
              axisLine={{ stroke: '#A78BFA' }}
              tickLine={{ stroke: '#A78BFA' }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis
              tick={{ fill: '#A78BFA' }}
              axisLine={{ stroke: '#A78BFA' }}
              tickLine={{ stroke: '#A78BFA' }}
            />
            <ChartTooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                return (
                  <ChartTooltipContent
                    className="bg-black/80 border-neon-purple"
                    payload={payload}
                  />
                );
              }}
            />
            <Bar
              dataKey="value"
              radius={[4, 4, 0, 0]}
              fill="#8B5CF6"
              animationDuration={1500}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export default AchievementStats;
